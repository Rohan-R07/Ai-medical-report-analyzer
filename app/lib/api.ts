import { MedicalReportData } from "../types";

export function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  if (typeof window !== "undefined" && (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")) {
    return "http://127.0.0.1:8000";
  }
  return "https://ai-medical-report-analyzer-backend.onrender.com";
}

/**
 * Uploads a PDF report file to the FastAPI backend for analysis
 * @param file The PDF report file
 */
export async function uploadReport(file: File): Promise<MedicalReportData> {
  const formData = new FormData();
  formData.append("file", file);

  const baseUrl = getApiBaseUrl();
  const response = await fetch(`${baseUrl}/api/analyze`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || `Server error (Status ${response.status})`);
  }

  return response.json();
}

/**
 * Alias for uploadReport, as specified in design requirements
 * @param file The PDF report file
 */
export async function analyzeReport(file: File): Promise<MedicalReportData> {
  return uploadReport(file);
}
