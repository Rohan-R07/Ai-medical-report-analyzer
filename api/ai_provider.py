import os
import time
import random
import json
import logging
import regex as re
from openai import OpenAI, APIStatusError, APITimeoutError, APIConnectionError

logger = logging.getLogger("medical_report_analyzer.ai_provider")

DEFAULT_RESPONSE = {
    "specialist": {
        "name": "General Practitioner",
        "reason": "Regular consultation recommended to monitor findings."
    },
    "diet_plan": {
        "breakfast": ["Whole grain toast", "Boiled eggs", "Fresh fruit"],
        "lunch": ["Grilled chicken or tofu salad", "Brown rice", "Steamed vegetables"],
        "dinner": ["Baked fish or lentil soup", "Quinoa", "Mixed greens"],
        "snacks": ["Handful of almonds", "Low-fat yogurt"]
    },
    "daily_routine": [
        {"time": "Morning", "activity": "Light stretching and hydration"},
        {"time": "Afternoon", "activity": "Balanced lunch and brief walk"},
        {"time": "Evening", "activity": "Relaxation and hydration check"},
        {"time": "Night", "activity": "Consistent sleep schedule"}
    ],
    "exercise_plan": {
        "duration": "30 minutes",
        "activities": ["Brisk walking", "Light stretching"]
    },
    "hydration": {
        "target": "8-10 glasses",
        "tip": "Keep a water bottle nearby and drink at regular intervals."
    },
    "prevention_tips": [
        "Maintain a balanced diet rich in leafy greens and lean proteins.",
        "Engage in regular physical activity as tolerated.",
        "Schedule regular wellness checkups with your doctor."
    ],
    "follow_up_tests": [
        "Repeat Complete Blood Count (CBC) in 3-6 months or as advised by your doctor."
    ],
    "final_summary": [
        "The blood parameters have been successfully reviewed.",
        "Please discuss these lifestyle suggestions with a licensed healthcare provider."
    ]
}

class AIProvider:
    def __init__(self, api_key: str = None):
        """
        Initializes the OpenRouter Client. Supports both OPENROUTER_API_KEY and GEMINI_API_KEY fallbacks.
        """
        # Force reload environment variables from .env to capture changes made while server is running
        from dotenv import load_dotenv
        current_dir = os.path.dirname(os.path.abspath(__file__))
        dotenv_path = os.path.join(os.path.dirname(current_dir), ".env")
        load_dotenv(dotenv_path, override=True)
        
        # Load API Key securely
        self.api_key = api_key or os.getenv("OPENROUTER_API_KEY") or os.getenv("GEMINI_API_KEY") or ""
        if not self.api_key:
            logger.warning("API key (OPENROUTER_API_KEY or GEMINI_API_KEY) is missing or empty! Fallback responses will be used if needed.")
        else:
            masked_key = self.api_key[:10] + "..."
            logger.info(f"Loaded API Key starting with: {masked_key}")
        
        # Load Model name, defaulting to google/gemma-4-26b-a4b-it
        self.model_name = os.getenv("OPENROUTER_MODEL") or os.getenv("GEMINI_MODEL")
        if not self.model_name or self.model_name == "gemini-flash-latest":
            self.model_name = "google/gemma-4-26b-a4b-it"
            
        logger.info(f"Initializing OpenRouter client with model: {self.model_name}...")

    def generate_explanation(
        self,
        prediction_name: str,
        values: dict,
        severity: str,
        score: int,
        abnormal_findings: list,
        normal_findings: list,
    ) -> str:
        """
        Generates clinical lifestyle recommendations using Gemma model on OpenRouter.
        Includes exponential backoff retries and JSON verification/repair.
        """
        if not self.api_key:
            logger.warning("No API key configured. Returning default clinical recommendations.")
            return json.dumps(DEFAULT_RESPONSE)

        prompt = f"""
        You are a medical report analysis assistant.

        Input Context:
        Condition: {prediction_name}
        Severity: {severity}
        Physiological Score: {score}
        Abnormal Findings: {abnormal_findings}
        Normal Findings: {normal_findings}
        Blood Values: {values}

        Your task is to explain these pre-calculated physiological values. 
        Do NOT calculate any scores, severity levels, or status ratings yourself. Only explain them.

        You MUST return ONLY a valid JSON object matching this exact structure:
        {{
          "specialist": {{
            "name": "Doctor Specialty Name",
            "reason": "Clear explanation of why this specialist is recommended based on the blood work"
          }},
          "diet_plan": {{
            "breakfast": ["Item 1", "Item 2"],
            "lunch": ["Item 1", "Item 2"],
            "dinner": ["Item 1", "Item 2"],
            "snacks": ["Item 1", "Item 2"]
          }},
          "daily_routine": [
            {{
              "time": "Morning",
              "activity": "Activity description"
            }},
            {{
              "time": "Afternoon",
              "activity": "Activity description"
            }},
            {{
              "time": "Evening",
              "activity": "Activity description"
            }},
            {{
              "time": "Night",
              "activity": "Activity description"
            }}
          ],
          "exercise_plan": {{
            "duration": "Duration in minutes/hours",
            "activities": ["Activity 1", "Activity 2"]
          }},
          "hydration": {{
            "target": "Recommended daily volume",
            "tip": "Practical hydration advice"
          }},
          "prevention_tips": ["Tip 1", "Tip 2"],
          "follow_up_tests": ["Test 1", "Test 2"],
          "final_summary": ["Key takeaway 1", "Key takeaway 2"]
        }}

        Rules:
        * Return ONLY valid JSON. Do not wrap in markdown or backticks (e.g. ```json).
        * Use concise responses and simple language.
        * No diagnosis claims or medication suggestions.
        * No legal or medical disclaimers.
        * Focus only on explaining provided values.
        * Diet must use common, easily accessible foods.
        * Maximum 3 items per list unless necessary.
        """

        def make_api_call(attempt=0):
            logger.info(f"Initiating OpenRouter request | Model: {self.model_name} | Attempt: {attempt+1}/4")
            
            # Setup OpenAI-compatible client for OpenRouter
            client = OpenAI(
                base_url="https://openrouter.ai/api/v1",
                api_key=self.api_key,
                default_headers={
                    "HTTP-Referer": "http://localhost:8080",
                    "X-Title": "AI Medical Report Analyzer"
                }
            )
            
            start_time = time.time()
            try:
                # Call chat completions using the official client
                response = client.chat.completions.create(
                    model=self.model_name,
                    messages=[
                        {
                            "role": "user",
                            "content": prompt
                        }
                    ],
                    response_format={"type": "json_object"},
                    # Disable streaming explicitly
                    stream=False,
                    # Pass reasoning options using extra_body for OpenRouter extension
                    extra_body={
                        "reasoning": {"enabled": True}
                    },
                    timeout=120.0, # 120 seconds timeout for thinking/reasoning models
                    max_tokens=6000,
                    temperature=0.2
                )
                
                duration = time.time() - start_time
                logger.info(f"OpenRouter request successful | Duration: {duration:.2f}s | Model: {self.model_name}")
                
                # Dump raw response for debugging
                try:
                    debug_dir = r"C:\Users\Rohan R\.gemini\antigravity-ide\brain\b13aa2d6-a2d6-45c5-a0e4-0845942b6bf0\scratch"
                    os.makedirs(debug_dir, exist_ok=True)
                    with open(os.path.join(debug_dir, "raw_response.json"), "w") as rf:
                        rf.write(response.model_dump_json(indent=2))
                except Exception as e:
                    logger.debug(f"Failed to write raw response to debug file: {e}")

                content = response.choices[0].message.content
                if not content:
                    raise ValueError("Empty response content received from OpenRouter API.")
                    
                # Optional reasoning log
                try:
                    # Access reasoning details via response message dict if present
                    message_dict = response.choices[0].message.model_dump()
                    reasoning = message_dict.get("reasoning_details")
                    if reasoning:
                        logger.info("Successfully extracted model reasoning details.")
                except Exception as e:
                    logger.debug(f"Failed to extract reasoning details for log: {e}")
                    
                return content.strip()
                
            except Exception as err:
                duration = time.time() - start_time
                # Reraise to be handled by retry loop
                raise err

        # Phase 1: Call API with Exponential Backoff for transient errors
        raw_output = None
        max_retries = 3
        initial_delay = 2.0
        backoff_factor = 2.0
        delay = initial_delay

        for attempt in range(max_retries + 1):
            start_time = time.time()
            try:
                raw_output = make_api_call(attempt)
                break
            except Exception as err:
                duration = time.time() - start_time
                status_code = None
                err_msg = str(err).lower()
                exception_type = type(err).__name__
                
                if isinstance(err, APIStatusError):
                    status_code = err.status_code
                
                # Identify if error is transient
                # Requirements include: Response ended prematurely, Connection reset, Read timeout, HTTP 429, HTTP 500, HTTP 502, HTTP 503, HTTP 504
                is_transient = (
                    isinstance(err, APITimeoutError) or
                    isinstance(err, APIConnectionError) or
                    status_code in [429, 500, 502, 503, 504] or
                    any(term in err_msg for term in [
                        "prematurely", "connection reset", "read timeout", "timeout", 
                        "connection broken", "eof", "reset by peer", "rate limit", 
                        "temporary", "500", "502", "503", "504"
                    ])
                )
                
                # Log detailed failure context without exposing API key
                logger.error(
                    f"OpenRouter request failed | "
                    f"Attempt: {attempt+1}/{max_retries+1} | "
                    f"Duration: {duration:.2f}s | "
                    f"Exception: {exception_type} | "
                    f"HTTP Status: {status_code or 'N/A'} | "
                    f"Transient: {is_transient} | "
                    f"Error Details: {err_msg}"
                )
                
                # Handle non-transient authentication or credit errors immediately
                if status_code == 401:
                    logger.error("Authentication failed: Invalid OpenRouter/Gemini API key. Returning default clinical recommendations.")
                    return json.dumps(DEFAULT_RESPONSE)
                
                if status_code == 402:
                    logger.error("Credits error: OpenRouter key has insufficient credits. Returning default clinical recommendations.")
                    return json.dumps(DEFAULT_RESPONSE)
                
                if attempt == max_retries or not is_transient:
                    logger.error(f"OpenRouter API call failed permanently after {attempt+1} attempts: {err}. Returning default clinical recommendations.")
                    return json.dumps(DEFAULT_RESPONSE)
                
                # Backoff delay with jitter
                sleep_time = delay + random.uniform(0.1, 1.0)
                logger.warning(
                    f"Retrying OpenRouter request in {sleep_time:.2f}s (Attempt {attempt+1}/{max_retries})..."
                )
                time.sleep(sleep_time)
                delay *= backoff_factor

        # Phase 2: JSON Validation and Safe Repair
        if not raw_output:
            logger.warning("No output generated. Returning default clinical suggestions structure.")
            return json.dumps(DEFAULT_RESPONSE)

        # Attempt to parse and validate
        validated_json = self._validate_and_repair_json(raw_output)
        if validated_json:
            return validated_json

        # If invalid, retry generation request ONCE
        logger.warning("First-pass OpenRouter output failed JSON schema validation. Retrying request once...")
        try:
            raw_output = make_api_call(0)
            validated_json = self._validate_and_repair_json(raw_output)
            if validated_json:
                return validated_json
        except Exception as retry_err:
            logger.error(f"OpenRouter retry request failed: {retry_err}")

        # If still invalid, perform safe structural repair and fill with default sections
        logger.error("OpenRouter output remains invalid after retry. Proceeding with safe JSON structural repair...")
        repaired_data = self._force_repair_structure(raw_output)
        return json.dumps(repaired_data)

    def _validate_and_repair_json(self, raw_text: str) -> str:
        """
        Validates the JSON structure and ensures all required keys are present.
        """
        try:
            # Clean up any potential markdown prefix/suffix
            clean_text = raw_text.strip()
            if clean_text.startswith("```json"):
                clean_text = clean_text[7:]
            if clean_text.endswith("```"):
                clean_text = clean_text[:-3]
            clean_text = clean_text.strip()

            # Ensure starting and ending bounds
            json_match = re.search(r"\{.*\}", clean_text, re.DOTALL)
            if json_match:
                clean_text = json_match.group(0)

            data = json.loads(clean_text)
            
            # Check required keys
            required_keys = [
                "specialist", "diet_plan", "daily_routine", "exercise_plan",
                "hydration", "prevention_tips", "follow_up_tests", "final_summary"
            ]
            
            # If any required key is missing, merge/fill from defaults
            modified = False
            for key in required_keys:
                if key not in data:
                    logger.warning(f"Schema Validation Alert: Missing required key '{key}'. Filling from defaults.")
                    data[key] = DEFAULT_RESPONSE[key]
                    modified = True
            
            return json.dumps(data)
        except Exception as e:
            logger.debug(f"JSON validation failed: {e}")
            return None

    def _force_repair_structure(self, raw_text: str) -> dict:
        """
        Extracts any valid JSON parts or falls back safely to default JSON.
        """
        repaired = DEFAULT_RESPONSE.copy()
        try:
            # Try to grab anything that looks like a JSON block
            json_match = re.search(r"\{.*\}", raw_text, re.DOTALL)
            if json_match:
                candidate = json_match.group(0)
                # Try a partial decode
                parsed = json.loads(candidate)
                if isinstance(parsed, dict):
                    for k, v in parsed.items():
                        if k in repaired:
                            repaired[k] = v
        except Exception as e:
            logger.error(f"Failsafe parser failed: {e}. Reverting to standard defaults.")
        
        return repaired
