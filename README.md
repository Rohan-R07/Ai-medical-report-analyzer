# Vitals: AI-Powered CBC Medical Report Analyzer

<p align="center">
  <img src="public/readme_banner.svg" alt="Vitals Brand Banner" width="100%" />
</p>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#problem-statement">Problem Statement</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#features">Features</a> •
  <a href="#technology-justification">Technology Stack</a> •
  <a href="#installation-and-setup">Setup Guide</a> •
  <a href="#healthcare-partners-roadmap">Healthcare Roadmap</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## Overview

**Vitals** is a premium, open-source, AI-powered healthcare intelligence platform designed to help everyday people read and understand their Complete Blood Count (CBC) reports without requiring clinical medical training.

Instead of presenting patients with complex, isolated numerical laboratory parameters, Vitals parses blood panels, processes them through trained Machine Learning models, and uses Generative AI (OpenRouter Gemma-4 with reasoning) to synthesize clear, structured, and reassuring lifestyle, dietary, and specialist referral guidelines. 

---

## Problem Statement

Complete Blood Count (CBC) panels are the most common diagnostic tests in the world, yet they remain nearly impossible for normal patients to interpret safely:
1. **Isolated Metrics:** Laboratory reports print a list of abbreviation parameters (WBC, RBC, HGB, MCV, MCH, PLT) next to numeric ranges. They do not explain how these parameters interact (e.g., how low hemoglobin and low MCV combine to indicate microcytic anemia).
2. **Alert Panic:** Seeing a flagged parameter outside reference ranges causes immediate patient anxiety, leading to premature, misleading searches on generic search engines.
3. **Clinical Burden:** General practitioners spend countless hours explaining normal or minor CBC variations to patients.

**Vitals solves this** by translating raw numeric lab values into a coordinated, patient-centric Physiological Health Score, visual parameter range tracks, conversational clinical insights, and action-oriented next steps, bridging the communication gap between diagnostics and care.

---

## Architecture

Vitals employs a feed-forward clinical pipeline consisting of deterministic parsing, machine learning classification, and generative reasoning.

### Data Flow Diagram
```mermaid
graph TD
    A[Patient Uploads PDF] --> B[PyPDF Text Extraction]
    B -->|Text Confidence &lt; 70%| C[OCR Fallback: PyMuPDF & EasyOCR]
    B -->|Text Confidence &gt;= 70%| D[Deterministic Regex Parser]
    C --> D
    D --> E[Value Normalization Engine]
    E --> F[Random Forest Anemia Classifier]
    E --> G[Reference Ranges Calculations Engine]
    
    F -->|Anemia Class Prediction| H[Diagnostic Compiler]
    G -->|Physiological Score| H
    G -->|Abnormal/Normal Findings| H
    G -->|Clinical Severity & Risk| H
    
    H --> I[OpenRouter Gemma-4 Reasoning Pipeline]
    I -->|Structured Lifestyle JSON| J[FastAPI REST Endpoint]
    J --> K[Next.js Patient Dashboard]
    
    style A fill:#00685f,stroke:#00524b,stroke-width:2px,color:#fff
    style F fill:#4c1d95,stroke:#7c3aed,stroke-width:2px,color:#fff
    style I fill:#006d3e,stroke:#0f5132,stroke-width:2px,color:#fff
    style K fill:#ba1a1a,stroke:#a61515,stroke-width:2px,color:#fff
```

### System Sequence Sequence
```mermaid
sequenceDiagram
    autonumber
    actor Patient
    participant FE as Next.js Dashboard
    participant BE as FastAPI Backend
    participant ML as Random Forest Model
    participant AI as OpenRouter Gemma-4
    
    Patient->>FE: Upload CBC PDF
    FE->>BE: POST /api/analyze (FormData File)
    Note over BE: Runs OCR / Regex Parser
    Note over BE: Computes Threshold Violations
    BE->>ML: Forward Normalized HGB, RBC, MCV, MCH
    ML-->>BE: Return Predicted Anemia Classification
    BE->>AI: Send Parameter States + System Instructions
    Note over AI: Activates Gemma Reasoning Block
    AI-->>BE: Return Structured Lifestyle Guidance JSON
    BE-->>FE: Return Normalized Report JSON Payload
    FE->>Patient: Render Radial Score, Gauges, & Lifestyle Tracker
```

---

## Features

### 1. Deterministic PDF Extraction & Normalization
* **Superscript Indexing Filter:** Employs footnote-priority regex parsing to skip superscript footnotes and headers that append noise to numerical outputs (e.g. converting `Hematocrit\xa001 27.3` safely into `27.3` instead of extracting `01` or `1.0`).
* **Unit Standardization:** Automatically normalizes non-standard laboratory unit variations for White Blood Cell (WBC) and Platelet (PLT) panels, ensuring values are scaled correctly relative to threshold bounds.

### 2. Automated OCR Fallback
* Ingests low-resolution scanned image PDFs using a dual-stage fallback (extracting text layers via `PyMuPDF` and routing to `EasyOCR` if character density falls below a 70% threshold).

### 3. Machine Learning Anemia Classifier
* Integrates a trained scikit-learn `RandomForestClassifier` trained on clinical hematology datasets. The model evaluates relative balances of Hemoglobin, RBC, MCV, and MCH to predict specific anemia classes:
  * `Normal`
  * `Hemoglobin Anemia`
  * `Iron Deficiency Anemia`
  * `Folate Deficiency Anemia`
  * `Vitamin B12 Deficiency Anemia`

### 4. Threshold Calculations Engine
* Maps individual parameters against clinical reference boundaries to calculate a compiled **Physiological Health Score** (out of 100) and severity index.
* Filters parameters into `Abnormal Findings` and `Normal Findings` programmatically.

### 5. OpenRouter Gemma-4 AI Pipeline
* Streams normalized clinical summaries into `google/gemma-4-26b-a4b-it` with reasoning parameters enabled (`{"reasoning": {"enabled": true}}`).
* Restricts outputs to a schema-conforming JSON structure, eliminating LLM hallucinations.

### 6. Premium Editorial User Interface
* **Biomarker Gauges:** Displays visual indicator tracks showing the patient's value mapped directly relative to low, normal, and high clinical boundaries.
* **Stateful Lifestyle Tracker:** Built-in interactive segment views including checkbox meal plans, vertical timeline routines, and a click-to-increment daily hydration glass counter.
* **Document Ingestion Modals:** Keeps dashboard results clean by loading file uploads and loading timelines inside a backdrop-blurred modal container.

---

## Technology Justification

| Technology | Role | Selection Justification |
| :--- | :--- | :--- |
| **Next.js 16** | Frontend Framework | Selected for its fast Turbopack compilation speeds, robust App Router, and static asset pre-rendering performance. |
| **FastAPI** | Backend Web API | High-performance Python async framework that integrates seamlessly with numerical calculations and ML models. |
| **Random Forest** | Anemia Classifier | An ensemble classifier chosen for its high accuracy on structured diagnostic datasets and deterministic predictability. |
| **OpenRouter Gemma-4** | Generative Specialist | Harnesses state-of-the-art open-weights reasoning blocks to compile structured medical logic without safety filter blocks. |
| **Tailwind CSS** | Styling System | Enables strict 8-point layouts, fluid hover animations, and custom clinical color tokens. |
| **TypeScript** | Type Safety | Enforces strict API contract interfaces between FastAPI responses and dashboard React props. |

---

## Folder Structure

```
Vitals/
├── api/                        # FastAPI Backend Application
│   ├── ai_provider.py          # OpenRouter completion clients & backoff retries
│   ├── classifier.py           # ML Model loading & feature matching
│   ├── parser.py               # PDF Regex extractors & OCR fallback
│   ├── index.py                # FastAPI endpoints & diagnostics
│   └── trained_model.joblib    # Trained Random Forest classifier weights
├── app/                        # Next.js App Router Frontend
│   ├── components/             # Reusable UI Components
│   │   ├── report/             # Biomarker cards & Lifestyle modules
│   │   │   └── care/           # "Continue Your Care" registry preview elements
│   │   └── shared/             # Loading timelines & Upload modals
│   ├── dashboard/              # Report results layout orchestrator
│   ├── lib/                    # API connection handlers
│   ├── types/                  # TypeScript interface contracts
│   └── globals.css             # Colors, shapes, & animations stylesheet
├── public/                     # Static SVGs, logos, & banners
├── render.yaml                 # Infrastructure configurations for Render
├── package.json                # Frontend package dependencies & scripts
├── requirements.txt            # Python backend dependencies
└── README.md                   # Repository documentation
```

---

## Installation and Setup

### Prerequisites
* Python 3.10+
* Node.js 18+
* An OpenRouter API Key (with reasoning enabled models support)

### 1. Clone the Repository
```bash
git clone https://github.com/Rohan-R07/Ai-medical-report-analyzer.git
cd Ai-medical-report-analyzer
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# OpenRouter API Credentials
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=google/gemma-4-26b-a4b-it

# Next.js Public Endpoints
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000
```

### 3. Backend Setup
Set up a Python virtual environment and install dependencies:
```bash
# Create venv
python -m venv venv
# Activate venv (Windows)
.\venv\Scripts\activate
# Activate venv (macOS/Linux)
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Launch the FastAPI backend server:
```bash
python api/index.py
```
The backend will boot on `http://127.0.0.1:8000`.

### 4. Frontend Setup
Open a new terminal window, navigate to the root directory, and install npm packages:
```bash
npm install
```

Start the Next.js development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your web browser.

---

## Healthcare Partners Roadmap

Vitals is designed to bridge the gap between patient information and professional care. We are building a secure registry that helps patients find trusted, verified local providers matching their specific AI-analyzed blood profile.

```
[Patient CBC Report] ──> [AI Specialist Identification] ──> [Match Verified Partner Registry] ──> [Secure Referral]
```

### Verified Partner Registry
* **Manual Verification:** Every partner clinic, hospital, and laboratory is manually verified by our team before listing. No scraping, no random clinics.
* **Referrals Pipeline:** Future updates will enable clinics to receive structured medical files directly, allowing patients to schedule appointments with the recommended specialists.

---

## Contributing

We welcome open-source contributions to enhance Vitals! To contribute:
1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/amazing-feature`.
3. Commit your changes: `git commit -m "feat: add amazing feature"`.
4. Push to the branch: `git push origin feature/amazing-feature`.
5. Open a Pull Request.

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgements
* Scikit-Learn developers for the robust classification libraries.
* PyMuPDF and EasyOCR teams for text layer extraction fallbacks.
* The Google DeepMind and OpenRouter teams for power-efficient LLM reasoning APIs.