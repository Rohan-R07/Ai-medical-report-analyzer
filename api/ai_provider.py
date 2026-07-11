import os
import time
import random
import json
import logging
import regex as re
from google import genai
from google.genai import types
from google.genai.errors import APIError

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
        Initializes the Gemini Client once during application startup.
        """
        # Load API Key securely
        self.api_key = api_key or os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            logger.error("GEMINI_API_KEY environment variable is missing or empty!")
            raise ValueError("Invalid API key configuration. GEMINI_API_KEY must be provided.")
        
        logger.info("Initializing Google Gemini API Client...")
        # Create client instance once
        self.client = genai.Client(api_key=self.api_key)
        self.model_name = "gemini-2.5-flash-lite"

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
        Generates clinical lifestyle recommendations using Google Gemini API.
        Includes exponential backoff retries and JSON verification/repair.
        """
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

        # Model settings configuration
        config = types.GenerateContentConfig(
            temperature=0.2,
            top_p=0.8,
            top_k=20,
            response_mime_type="application/json",
        )

        def make_api_call():
            logger.info(f"Calling Gemini API ({self.model_name}) with temperature=0.2...")
            response = self.client.models.generate_content(
                model=self.model_name,
                contents=prompt,
                config=config,
            )
            
            if not response or not response.text:
                raise ValueError("Empty response received from Gemini API.")
            
            return response.text.strip()

        # Phase 1: Call API with Exponential Backoff for transient errors
        raw_output = None
        max_retries = 3
        initial_delay = 2.0
        backoff_factor = 2.0
        delay = initial_delay

        for attempt in range(max_retries + 1):
            try:
                raw_output = make_api_call()
                break
            except APIError as api_err:
                status_code = api_err.code
                err_msg = str(api_err).lower()
                
                # Check for non-transient status codes
                if status_code == 401:
                    logger.error("Authentication failed: Invalid GEMINI_API_KEY.")
                    raise ValueError("Invalid Gemini API key. Please check your GEMINI_API_KEY environment variable.")
                
                # Identify if error is transient
                is_transient = status_code in [429, 500, 503] or any(
                    term in err_msg for term in ["rate limit", "quota", "timeout", "unavailable", "server error"]
                )
                
                if attempt == max_retries or not is_transient:
                    logger.error(f"Gemini API call failed permanently after {attempt} attempts: {api_err}")
                    raise api_err
                
                # Backoff delay
                sleep_time = delay + random.uniform(0, 1.0)
                logger.warning(f"Gemini API transient error {status_code} encountered. Retrying in {sleep_time:.2f}s (Attempt {attempt+1}/{max_retries})...")
                time.sleep(sleep_time)
                delay *= backoff_factor
                
            except Exception as e:
                err_msg = str(e).lower()
                is_transient = any(
                    term in err_msg for term in ["timeout", "connection", "rate", "429", "500", "503"]
                )
                
                if attempt == max_retries or not is_transient:
                    logger.error(f"Gemini API call encountered fatal exception: {e}")
                    raise e
                
                sleep_time = delay + random.uniform(0, 1.0)
                logger.warning(f"Gemini API connection error encountered. Retrying in {sleep_time:.2f}s (Attempt {attempt+1}/{max_retries})...")
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
        logger.warning("First-pass Gemini output failed JSON schema validation. Retrying request once...")
        try:
            raw_output = make_api_call()
            validated_json = self._validate_and_repair_json(raw_output)
            if validated_json:
                return validated_json
        except Exception as retry_err:
            logger.error(f"Gemini retry request failed: {retry_err}")

        # If still invalid, perform safe structural repair and fill with default sections
        logger.error("Gemini output remains invalid after retry. Proceeding with safe JSON structural repair...")
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
