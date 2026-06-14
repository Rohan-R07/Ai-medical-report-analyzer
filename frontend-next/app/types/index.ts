export interface AbnormalFinding {
  parameter: string;
  status: string;
  explanation?: string;
  impact?: string;
}

export interface Specialist {
  name?: string;
  doctor_type?: string;
  reason: string;
}

export interface DietPlan {
  breakfast: string[];
  lunch: string[];
  dinner: string[];
  snacks: string[];
}

export interface DailyRoutineItem {
  time: string;
  activity: string;
}

export interface HydrationInfo {
  target: string;
  tip: string;
}

export interface ExerciseInfo {
  duration: string;
  activities: string[];
}

export interface MonitoringItem {
  task: string;
  frequency: string;
}

export interface MedicalReportData {
  // Standard format required by specification
  condition_summary?: string;
  severity?: string;
  abnormal_findings?: AbnormalFinding[];
  health_impact?: string[];
  recommended_specialist?: Specialist;
  next_steps?: string[];
  diet_plan?: DietPlan;
  daily_routine?: DailyRoutineItem[];
  prevention_tips?: string[];
  warning_signs?: string[];
  follow_up_tests?: string[];
  final_summary?: string[];

  // Support for actual Python backend LLM schema
  overview?: {
    condition?: string;
    severity?: string;
    summary?: string;
    physiological_score?: number;
    health_status?: string;
    risk_level?: string;
  };
  health_effects?: string[];
  foods_to_prefer?: string[];
  foods_to_limit?: string[];
  daily_plan?: DailyRoutineItem[];
  hydration?: HydrationInfo;
  exercise?: ExerciseInfo;
  monitoring?: MonitoringItem[];
  quick_summary?: string[];
}

// Function to normalize both schemas into a single consistent structure
export function normalizeReportData(data: MedicalReportData): Required<MedicalReportData> {
  const overview = data.overview || {};
  const specialist = data.recommended_specialist || { reason: "" };

  const condition_summary =
    data.condition_summary || overview.summary || overview.condition || "No specific condition summary available.";
  const severity = data.severity || overview.severity || "Normal";
  
  const abnormal_findings = data.abnormal_findings || [];
  
  const health_impact = data.health_impact || data.health_effects || data.quick_summary || [];
  
  const normalizedSpecialist: Specialist = {
    name: specialist.name || specialist.doctor_type || "General Practitioner",
    doctor_type: specialist.doctor_type || specialist.name || "General Practitioner",
    reason: specialist.reason || "Regular consultation recommended to monitor findings."
  };

  const next_steps = data.next_steps || data.follow_up_tests || (data.monitoring ? data.monitoring.map(m => `${m.task} (${m.frequency})`) : []);
  
  const diet_plan: DietPlan = data.diet_plan || {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: []
  };

  // Convert daily_routine from daily_plan or object if necessary
  let daily_routine: DailyRoutineItem[] = [];
  if (Array.isArray(data.daily_routine)) {
    daily_routine = data.daily_routine;
  } else if (Array.isArray(data.daily_plan)) {
    daily_routine = data.daily_plan;
  }

  const prevention_tips = data.prevention_tips || [];
  const warning_signs = data.warning_signs || [];
  const follow_up_tests = data.follow_up_tests || data.next_steps || [];
  const final_summary = data.final_summary || data.quick_summary || (overview.summary ? [overview.summary] : []);

  // Extra features
  const foods_to_prefer = data.foods_to_prefer || [];
  const foods_to_limit = data.foods_to_limit || [];
  const hydration = data.hydration || { target: "8-10 glasses", tip: "Keep a bottle nearby." };
  const exercise = data.exercise || { duration: "30 mins", activities: ["Brisk walking"] };
  const monitoring = data.monitoring || [];
  const quick_summary = data.quick_summary || [];

  return {
    condition_summary,
    severity,
    abnormal_findings,
    health_impact,
    recommended_specialist: normalizedSpecialist,
    next_steps,
    diet_plan,
    daily_routine,
    prevention_tips,
    warning_signs,
    follow_up_tests,
    final_summary,
    overview: {
      condition: overview.condition || condition_summary,
      severity: overview.severity || severity,
      summary: overview.summary || condition_summary,
      physiological_score: overview.physiological_score !== undefined ? overview.physiological_score : 100,
      health_status: overview.health_status || "Excellent",
      risk_level: overview.risk_level || "Low"
    },
    health_effects: health_impact,
    foods_to_prefer,
    foods_to_limit,
    daily_plan: daily_routine,
    hydration,
    exercise,
    monitoring,
    quick_summary
  };
}
