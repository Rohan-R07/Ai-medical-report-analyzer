import pandas
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
from dotenv import load_dotenv
import joblib
from pypdf import PdfReader
import os
import regex as re
from openai import OpenAI

load_dotenv()


class Backend:
    def __init__(self):
        self.csvData = None
        self.model = None
        self.accuracy = None

    def setDataset(self, file):
        self.csvData = pandas.read_excel(file)

    def trainModel(self):

        X = self.csvData[["WBC", "RBC", "HGB", "HCT", "MCV", "MCH", "MCHC"]]

        y = self.csvData["All_Class"]
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )

        self.model = RandomForestClassifier(n_estimators=100, random_state=42)

        self.model.fit(X_train, y_train)

        predictions = self.model.predict(X_test)

        self.accuracy = accuracy_score(y_test, predictions)

        joblib.dump(self.model, "anemia_model.pkl")

    def loadModel(self):
        self.model = joblib.load("anemia_model.pkl")

    def predict(self, patient_dict):

        patient_df = pandas.DataFrame([patient_dict])

        prediction = self.model.predict(patient_df)

        return prediction[0]

    def getPredictionName(self, prediction):
        class_mapping = {
            0: "Normal",
            1: "Hemoglobin Anemia",
            2: "Iron Deficiency Anemia",
            3: "Folate Deficiency Anemia",
            4: "Vitamin B12 Deficiency Anemia",
        }
        return class_mapping[prediction]

    def extractPdfValues(self, pdf_file):

        pdf = PdfReader(pdf_file)

        all_text = ""

        for page in pdf.pages:
            all_text += page.extract_text()

        patient_data = {}

        features = {
            "WBC": [
                r"Total WBC count\s+(\d+\.?\d*)",
                r"WBC\s+\d+\s+(\d+\.?\d*)",
                r"WBC\s+(\d+\.?\d*)",
            ],
            "RBC": [
                r"Total RBC count\s+(\d+\.?\d*)",
                r"RBC\s+\d+\s+(\d+\.?\d*)",
                r"RBC\s+(\d+\.?\d*)",
            ],
            "HGB": [
                r"Hemoglobin\s*\(Hb\)\s+(\d+\.?\d*)",
                r"Hemoglobin\s+\d+\s+(\d+\.?\d*)",
                r"Hemoglobin\s+(\d+\.?\d*)",
            ],
            "HCT": [
                r"Hematocrit\s*\(HCT\)\s+(\d+\.?\d*)",
                r"Hematocrit\s+(\d+\.?\d*)",
                r"HCT\s+\d+\s+(\d+\.?\d*)",
                r"HCT\s+(\d+\.?\d*)",
                r"Packed Cell Volume\s*\(PCV\)\s+(\d+\.?\d*)",
                r"PCV\s+(\d+\.?\d*)",
            ],
            "MCV": [
                r"MCV\)?\s+(\d+\.?\d*)",
                r"Mean Corpuscular Volume\s*\(MCV\)\s+(\d+\.?\d*)",
            ],
            "MCH": [r"MCH\s+(\d+\.?\d*)", r"MCH\s+\d+\s+(\d+\.?\d*)"],
            "MCHC": [r"MCHC\s+(\d+\.?\d*)", r"MCHC\s+\d+\s+(\d+\.?\d*)"],
        }

        for model_name, patterns in features.items():
            for pattern in patterns:
                match = re.search(pattern, all_text, re.IGNORECASE)
                if match:
                    # If the match has multiple capture groups or matches inside brackets, grab the correct one
                    patient_data[model_name] = float(match.group(1))
                    print(f"{model_name} = {patient_data[model_name]}")
                    break

        return patient_data

    def calculate_abnormal_findings(self, values):
        """
        Calculates out-of-range metrics programmatically.
        """
        ranges = {
            "WBC": {"min": 4.0, "max": 11.0, "name": "WBC"},
            "RBC": {"min": 4.0, "max": 6.0, "name": "RBC"},
            "HGB": {"min": 12.0, "max": 17.5, "name": "HGB"},
            "HCT": {"min": 36.0, "max": 50.0, "name": "HCT"},
            "MCV": {"min": 80.0, "max": 100.0, "name": "MCV"},
            "MCH": {"min": 27.0, "max": 33.0, "name": "MCH"},
            "MCHC": {"min": 32.0, "max": 36.0, "name": "MCHC"},
        }

        findings = []
        for key, ref in ranges.items():
            if key in values:
                val = values[key]
                if val < ref["min"]:
                    findings.append(
                        {
                            "parameter": ref["name"],
                            "value": val,
                            "status": "Low",
                            "explanation": f"{ref['name']} ({val}) is below the normal range ({ref['min']} - {ref['max']}).",
                        }
                    )
                elif val > ref["max"]:
                    findings.append(
                        {
                            "parameter": ref["name"],
                            "value": val,
                            "status": "High",
                            "explanation": f"{ref['name']} ({val}) is above the normal range ({ref['min']} - {ref['max']}).",
                        }
                    )
        return findings

    def calculate_physiological_score(self, values):
        """
        Subtracts points from 100 for deviations and returns a score and status category.
        """
        score = 100
        deductions = {
            "WBC": {"min": 4.0, "max": 11.0, "deduct_low": 5, "deduct_high": 5},
            "RBC": {"min": 4.0, "max": 6.0, "deduct_low": 6, "deduct_high": 6},
            "HGB": {"min": 12.0, "max": 17.5, "deduct_low": 8, "deduct_high": 8},
            "HCT": {"min": 36.0, "max": 50.0, "deduct_low": 5, "deduct_high": 5},
            "MCV": {"min": 80.0, "max": 100.0, "deduct_low": 5, "deduct_high": 5},
            "MCH": {"min": 27.0, "max": 33.0, "deduct_low": 4, "deduct_high": 4},
            "MCHC": {"min": 32.0, "max": 36.0, "deduct_low": 4, "deduct_high": 4},
        }

        for key, ref in deductions.items():
            if key in values:
                val = values[key]
                if val < ref["min"]:
                    score -= ref["deduct_low"]
                elif val > ref["max"]:
                    score -= ref["deduct_high"]

        score = max(0, score)

        if score >= 95:
            category = "Excellent"
        elif score >= 85:
            category = "Good"
        elif score >= 70:
            category = "Fair"
        elif score >= 50:
            category = "Needs Attention"
        else:
            category = "High Risk"

        return {"score": score, "category": category}

    def calculate_severity(self, values):
        """
        Determines severity from abnormalities count and threshold ranges.
        """
        ranges = {
            "WBC": {"normal": (4.0, 11.0), "critical_low": 2.0, "critical_high": 20.0},
            "RBC": {"normal": (4.0, 6.0), "critical_low": 3.0, "critical_high": 7.0},
            "HGB": {"normal": (12.0, 17.5), "critical_low": 8.0, "critical_high": 20.0},
            "HCT": {
                "normal": (36.0, 50.0),
                "critical_low": 25.0,
                "critical_high": 60.0,
            },
            "MCV": {
                "normal": (80.0, 100.0),
                "critical_low": 65.0,
                "critical_high": 120.0,
            },
            "MCH": {
                "normal": (27.0, 33.0),
                "critical_low": 20.0,
                "critical_high": 40.0,
            },
            "MCHC": {
                "normal": (32.0, 36.0),
                "critical_low": 28.0,
                "critical_high": 40.0,
            },
        }

        mild_count = 0
        major_count = 0
        critical_count = 0

        for key, ref in ranges.items():
            if key in values:
                val = values[key]
                norm_min, norm_max = ref["normal"]
                if val < norm_min or val > norm_max:
                    if val <= ref["critical_low"] or val >= ref["critical_high"]:
                        critical_count += 1
                    else:
                        deviation_pct = (
                            (norm_min - val) / norm_min
                            if val < norm_min
                            else (val - norm_max) / norm_max
                        )
                        if deviation_pct > 0.15:
                            major_count += 1
                        else:
                            mild_count += 1

        if critical_count > 0:
            return "Severe"
        if major_count > 0:
            return "Significant"
        if mild_count > 1:
            return "Moderate"
        if mild_count == 1:
            return "Mild"
        return "Normal"

    def calculate_health_status(self, score):
        """
        Maps a physiological score to a health status rating.
        """
        if score >= 95:
            return "Excellent"
        elif score >= 85:
            return "Good"
        elif score >= 70:
            return "Fair"
        elif score >= 50:
            return "Needs Monitoring"
        else:
            return "High Risk"

    def calculate_risk_level(self, severity):
        """
        Maps clinical severity to general risk levels.
        """
        if severity in ["Severe"]:
            return "High"
        elif severity in ["Significant", "Moderate"]:
            return "Moderate"
        else:
            return "Low"

    def generateExplaination(
        self, prediction_name, values, severity, score, abnormal_findings
    ):
        hf_token = os.getenv("HF_TOKEN")

        prompt = f"""
            You are a medical report analysis API.

            Input:
            Condition: {prediction_name}
            Severity: {severity}
            Physiological Score: {score}
            Abnormal Findings: {abnormal_findings}
            Blood Values: {values}

            You MUST explain these pre-calculated physiological values. 
            Do NOT calculate any scores, severity levels, or status ratings yourself. Only explain them.

            Return ONLY valid JSON matching this exact structure:
            {{
              "specialist": {{
                "name": "",
                "reason": ""
              }},
              "diet_plan": {{
                "breakfast": [],
                "lunch": [],
                "dinner": [],
                "snacks": []
              }},
              "daily_routine": [
                {{
                  "time": "Morning",
                  "activity": ""
                }},
                {{
                  "time": "Afternoon",
                  "activity": ""
                }},
                {{
                  "time": "Evening",
                  "activity": ""
                }},
                {{
                  "time": "Night",
                  "activity": ""
                }}
              ],
              "exercise_plan": {{
                "duration": "",
                "activities": []
              }},
              "hydration": {{
                "target": "",
                "tip": ""
              }},
              "prevention_tips": [],
              "follow_up_tests": [],
              "final_summary": []
            }}

            Return ONLY valid JSON.
            Do not return markdown.
            Do not return explanations outside JSON.
            Do not wrap JSON in code blocks.

            Rules:

            * Use concise responses.
            * Use simple language.
            * No diagnosis claims.
            * No medication suggestions.
            * No legal or medical disclaimers.
            * Focus only on explaining provided values.
            * Diet must use common foods.
            * Daily routine must be realistic.
            * Maximum 3 items per list unless necessary.
            * Keep total response compact.
        """

        client = OpenAI(
            base_url="https://router.huggingface.co/v1",
            api_key=hf_token,
        )

        completion = client.chat.completions.create(
            model="meta-llama/Llama-3.1-8B-Instruct:novita",
            messages=[{"role": "user", "content": prompt}],
        )

        return completion.choices[0].message.content


# if __name__ == "__main__":
#     # --------TESTING----------

#     # Initializing the backend
#     initBackend = Backend()

#     # setting up the dataset
#     initBackend.setDataset("medical_dataset.xlsx")

#     # training a model
#     initBackend.trainModel()

#     # loading the .pkl file which was created after training a model
#     initBackend.loadModel()

#     # storing extracted pdf content in a variable valu
#     valu = initBackend.extractPdfValues("sampleReport.pdf")

#     # storing predicted values inside a variable prediction
#     prediction = initBackend.predict(valu)

#     # mapping the predicted value with a specific disease
#     prediction_name = initBackend.getPredictionName(prediction)

#     # finally using hugging face tokens to generate a output
#     print(initBackend.generateExplaination(prediction_name, valu))
