"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Brain, Salad, Activity, Stethoscope, Sparkles, ShieldAlert } from "lucide-react";
import UploadCard from "./components/UploadCard";
import LoadingTimeline from "./components/shared/LoadingTimeline";
import { analyzeReport } from "./lib/api";

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);

  // Periodic health check on backend connection
  useEffect(() => {
    const API_BASE_URL = 
      typeof window !== "undefined" && window.location.hostname !== "localhost"
        ? ""
        : (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");
    
    const checkConnection = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/health?t=${Date.now()}`, {
          cache: "no-store",
          headers: {
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
          },
        });
        if (res.ok) {
          setIsBackendConnected(true);
        } else {
          setIsBackendConnected(false);
        }
      } catch (e) {
        setIsBackendConnected(false);
      }
    };

    checkConnection();
    const interval = setInterval(checkConnection, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let progressTimer: NodeJS.Timeout;

    if (isLoading) {
      // Simulate progress bar increments through stages
      progressTimer = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 98) return prev;
          const increment = Math.random() * 6 + 1.5;
          return Math.min(98, prev + increment);
        });
      }, 350);
    } else {
      setLoadingProgress(0);
    }

    return () => {
      clearInterval(progressTimer);
    };
  }, [isLoading]);

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setApiError(null);
    setLoadingProgress(5);

    try {
      const result = await analyzeReport(file);
      setLoadingProgress(100);
      // Wait briefly for progress bar to hit 100%
      setTimeout(() => {
        localStorage.setItem("medicalReportData", JSON.stringify(result));
        router.push("/dashboard");
      }, 600);
    } catch (err: any) {
      console.error(err);
      setApiError(err.message || "An unexpected error occurred during report analysis.");
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <FileText className="w-5 h-5 text-teal-600" />,
      title: "PDF Report Extraction",
      desc: "Reads standard pathological blood panel PDFs automatically using rule-based parsers and OCR.",
    },
    {
      icon: <Brain className="w-5 h-5 text-teal-600" />,
      title: "ML Risk Predictions",
      desc: "Classifies hematological markers against Random Forest models to identify anemia sub-types.",
    },
    {
      icon: <Salad className="w-5 h-5 text-teal-600" />,
      title: "Personalized Wellness",
      desc: "Explains diagnostics using Google Gemini to construct dietary suggestions and lifestyle routines.",
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between px-6 py-12 md:py-20 relative overflow-hidden bg-[#f8fafc]">
      {/* Background blobs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Navigation Header */}
      <header className="max-w-4xl w-full mx-auto flex justify-between items-center z-10 mb-12">
        <div className="flex items-center space-x-2.5">
          <div className="w-7 h-7 rounded-lg bg-teal-600 flex items-center justify-center shadow-sm">
            <Activity className="w-4 h-4 text-white" />
          </div>
          <span className="font-heading font-bold text-base tracking-tight text-slate-800">
            AI Medical Report <span className="text-teal-600">Analyzer</span>
          </span>
        </div>
        {isBackendConnected === true ? (
          <div className="flex items-center space-x-1.5 text-[9px] bg-emerald-50 text-emerald-600 px-3 py-1.5 rounded-full border border-emerald-100 font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            API Connected
          </div>
        ) : isBackendConnected === false ? (
          <div className="flex items-center space-x-1.5 text-[9px] bg-rose-50 text-rose-600 px-3 py-1.5 rounded-full border border-rose-100 font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-rose-500 rounded-full animate-pulse" />
            Backend Offline
          </div>
        ) : (
          <div className="flex items-center space-x-1.5 text-[9px] bg-slate-50 text-slate-500 px-3 py-1.5 rounded-full border border-slate-100 font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-pulse" />
            Checking Api
          </div>
        )}
      </header>

      {/* Main Core Section */}
      <main className="max-w-3xl w-full mx-auto flex-1 flex flex-col items-center justify-center text-center space-y-10 z-10">
        <AnimatePresence mode="wait">
          {!isLoading ? (
            <motion.div
              key="hero-state"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-10 w-full"
            >
              {/* Hero Header */}
              <div className="space-y-4 max-w-xl mx-auto">
                <div className="inline-flex items-center space-x-1.5 bg-teal-50 border border-teal-100/50 px-3.5 py-1 rounded-full text-[10px] font-bold text-teal-600 uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Clinical Intelligence Evaluation</span>
                </div>

                <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-slate-800 tracking-tight leading-tight">
                  Understand your blood health, <br />
                  <span className="text-teal-600">clearly and calmly.</span>
                </h1>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md mx-auto">
                  Upload your laboratory CBC blood report PDF for immediate parameter visualizations, ML classifications, and AI-powered lifestyle suggestions.
                </p>
              </div>

              {/* Offline Warning Banner */}
              {isBackendConnected === false && (
                <div className="max-w-xl mx-auto p-4 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-800 flex items-center justify-center space-x-2">
                  <ShieldAlert className="w-4 h-4 text-rose-600 flex-shrink-0 animate-pulse" />
                  <span>The backend API server is offline. Please launch the server (<code>python ui.py</code>) to run the parser.</span>
                </div>
              )}

              {/* File Upload Zone */}
              <UploadCard 
                onUpload={handleUpload} 
                isLoading={isLoading} 
                isBackendConnected={isBackendConnected} 
              />

              {/* Features Showcase */}
              <div className="pt-10 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left max-w-2xl mx-auto">
                  {features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-100 p-5 rounded-2xl space-y-3 hover:border-slate-200 transition-all duration-200"
                    >
                      <div className="p-2.5 bg-slate-50 rounded-xl w-fit border border-slate-100">
                        {feature.icon}
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-xs font-bold text-slate-800 font-heading">{feature.title}</h4>
                        <p className="text-[11px] text-slate-500 leading-normal">{feature.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="loading-state"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <LoadingTimeline progress={loadingProgress} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Branding */}
      <footer className="max-w-4xl w-full mx-auto text-center z-10 pt-10 border-t border-slate-100 flex flex-col items-center justify-center text-[10px] text-slate-400 font-medium space-y-2">
        <p className="max-w-md leading-normal">
          Disclaimer: This system is an AI companion for educational and informational purposes. It is NOT a substitute for professional medical advice, diagnostic evaluations, or treatment.
        </p>
      </footer>

      {/* Error Modal */}
      <AnimatePresence>
        {apiError && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setApiError(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />

            {/* Modal Content Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white w-full max-w-md p-6 rounded-3xl relative overflow-hidden border border-rose-100 shadow-xl z-10 space-y-5"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-10 h-10 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                  <ShieldAlert className="w-5 h-5 animate-pulse" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-lg font-bold text-slate-800 font-heading">
                    Analysis Incomplete
                  </h3>
                  <p className="text-slate-500 text-xs leading-relaxed max-w-xs mx-auto">
                    {apiError}
                  </p>
                </div>
              </div>

              {/* Expected checklist */}
              <div className="bg-slate-50 border border-slate-100 p-4 rounded-xl space-y-2.5">
                <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Expected Blood Panel Parameters
                </h4>
                <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500 font-semibold">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>WBC Count</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>RBC Count</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>Hemoglobin (Hb)</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>PCV / Hematocrit</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>MCV, MCH, MCHC</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    <span>Platelet Count (PLT)</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setApiError(null)}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm hover:shadow active:scale-98 transition-all duration-200"
              >
                Try Another File
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
