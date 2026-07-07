# reference_ranges.py

REFERENCE_RANGES = {
    "WBC": {
        "min": 4.0,
        "max": 11.0,
        "critical_low": 2.0,
        "critical_high": 20.0,
        "unit": "x10^3/uL",
        "name": "WBC",
        "full_name": "White Blood Cell Count",
        "deduction": 5,
    },
    "RBC": {
        "min": 4.0,
        "max": 6.0,
        "critical_low": 3.0,
        "critical_high": 7.0,
        "unit": "x10^6/uL",
        "name": "RBC",
        "full_name": "Red Blood Cell Count",
        "deduction": 5,
    },
    "HGB": {
        "min": 13.5,
        "max": 17.5,
        "critical_low": 8.0,
        "critical_high": 20.0,
        "unit": "g/dL",
        "name": "Hemoglobin",
        "full_name": "Hemoglobin",
        "deduction": 8,
    },
    "HCT": {
        "min": 36.0,
        "max": 50.0,
        "critical_low": 25.0,
        "critical_high": 60.0,
        "unit": "%",
        "name": "PCV",
        "full_name": "Packed Cell Volume (PCV)",
        "deduction": 5,
    },
    "MCV": {
        "min": 80.0,
        "max": 100.0,
        "critical_low": 65.0,
        "critical_high": 120.0,
        "unit": "fL",
        "name": "MCV",
        "full_name": "Mean Corpuscular Volume",
        "deduction": 5,
    },
    "MCH": {
        "min": 27.0,
        "max": 33.0,
        "critical_low": 20.0,
        "critical_high": 40.0,
        "unit": "pg",
        "name": "MCH",
        "full_name": "Mean Corpuscular Hemoglobin",
        "deduction": 4,
    },
    "MCHC": {
        "min": 32.0,
        "max": 36.0,
        "critical_low": 28.0,
        "critical_high": 40.0,
        "unit": "g/dL",
        "name": "MCHC",
        "full_name": "Mean Corpuscular Hemoglobin Concentration",
        "deduction": 4,
    },
    "PLT": {
        "min": 155.0,  # 150 falls under Borderline
        "max": 450.0,
        "borderline_min": 140.0,
        "borderline_max": 154.9,
        "critical_low": 50.0,
        "critical_high": 1000.0,
        "unit": "x10^3/uL",
        "name": "Platelets",
        "full_name": "Platelet Count",
        "deduction_borderline": 3,
        "deduction_abnormal": 8,
        "deduction_critical": 15,
    },
}


def get_health_status(score):
    """
    Consistently maps a physiological score to a health status rating.
    95-100 = Excellent
    85-94 = Good
    70-84 = Needs Monitoring
    50-69 = Needs Attention
    0-49 = High Risk
    """
    if score >= 95:
        return "Excellent"
    elif score >= 85:
        return "Good"
    elif score >= 70:
        return "Needs Monitoring"
    elif score >= 50:
        return "Needs Attention"
    else:
        return "High Risk"
