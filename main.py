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

        X = self.csvData[
            [
                "WBC",
                "RBC",
                "HGB",
                "HCT",
                "MCV",
                "MCH",
                "MCHC"
            ]
        ]

        y = self.csvData["All_Class"]
        X_train, X_test, y_train, y_test = train_test_split(
            X,
            y,
            test_size=0.2,
            random_state=42
        )

        self.model = RandomForestClassifier(
            n_estimators=100,
            random_state=42
        )

        self.model.fit(X_train, y_train)

        predictions = self.model.predict(X_test)

        self.accuracy = accuracy_score(
            y_test,
            predictions
        )


        joblib.dump(
            self.model,
            "anemia_model.pkl"
        )
        
    def loadModel(self):
        self.model = joblib.load(
            "anemia_model.pkl"
        )
    def predict(self, patient_dict):
    
        patient_df = pandas.DataFrame(
            [patient_dict]
        )

        prediction = self.model.predict(
            patient_df
        )

        return prediction[0]
    
    def getPredictionName(self, prediction):
        class_mapping = {
            0: "Normal",
            1: "Hemoglobin Anemia",
            2: "Iron Deficiency Anemia",
            3: "Folate Deficiency Anemia",
            4: "Vitamin B12 Deficiency Anemia"
        }
        return class_mapping[prediction]
    
    def extractPdfValues(self, pdf_file):

        pdf = PdfReader(pdf_file)
    
        all_text = ""
    
        for page in pdf.pages:
            all_text += page.extract_text()
    
        patient_data = {}
    
        features = {
            "WBC": "WBC",
            "RBC": "RBC",
            "HGB": "Hemoglobin",
            "HCT": "Hematocrit",
            "MCV": "MCV",
            "MCH": "MCH",
            "MCHC": "MCHC"
        }
    
        for model_name, report_name in features.items():
        
            pattern = rf"{report_name}\s+\d+\s+(\d+\.?\d*)"
    
            match = re.search(
                pattern,
                all_text,
                re.IGNORECASE
            )
    
            if match:
            
                patient_data[model_name] = float(
                    match.group(1)
                )
    
                print(
                    f"{model_name} = {patient_data[model_name]}"
                )
    
        return patient_data
    
    def generateExplaination(self,prediction_name,values):
        hf_token = os.getenv("HF_TOKEN")

        prompt = f"""
            You are a medical report explanation assistant.

            Predicted Condition:
            {prediction_name}

            Extracted Blood Values:
            {values}

            Tasks:

            1. Explain the abnormal findings.
            2. Explain what these values may indicate.
            3. Recommend the type of specialist that may be consulted.
            4. Suggest general next steps.
            5. Suggest lifestyle and preventive measures.

            Rules:
            - Use simple language.
            - Do not prescribe medicines.
            - Do not provide a definitive diagnosis.
            - Focus only on the provided values.

            Output format:

            ## Abnormal Findings

            ## What These Findings Mean

            ## Recommended Specialist

            ## Suggested Next Steps

            ## Prevention Tips

            ## Summary
            """
        client = OpenAI(
            base_url="https://router.huggingface.co/v1",
            api_key=hf_token,
        )

        completion = client.chat.completions.create(
            model="meta-llama/Llama-3.1-8B-Instruct:novita",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )

        return completion.choices[0].message.content
        
    
# --------TESTING----------

# Initializing the backend    
# initBackend = Backend()

# #setting up the dataset
# initBackend.setDataset("medical_dataset.xlsx")

# #training a model
# initBackend.trainModel()

# #loading the .pkl file which was created after training a model
# initBackend.loadModel()

# #storing extracted pdf content in a variable valu
# valu = initBackend.extractPdfValues("sampleReport.pdf")

# #storing predicted values inside a variable prediction
# prediction = initBackend.predict(valu)

# #mapping the predicted value with a specific disease
# prediction_name = initBackend.getPredictionName(
#     prediction
# )

# #finally using hugging face tokens to generate a output 
# print(
#     initBackend.generateExplaination(prediction_name,valu)
# )