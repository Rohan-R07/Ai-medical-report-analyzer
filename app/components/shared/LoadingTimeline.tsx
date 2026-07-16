"use client";

import React from "react";
import { motion } from "framer-motion";
import { Check, Loader2, CircleDot } from "lucide-react";

interface LoadingTimelineProps {
  progress: number;
}

export default function LoadingTimeline({ progress }: LoadingTimelineProps) {
  const steps = [
    { label: "Uploading laboratory report PDF", minProgress: 0 },
    { label: "Parsing text and running OCR extractors", minProgress: 12 },
    { label: "Validating detected CBC parameters", minProgress: 25 },
    { label: "Checking against clinical reference ranges", minProgress: 38 },
    { label: "Running Random Forest anemia classifier", minProgress: 52 },
    { label: "Generating clinical explanations via Google Gemini", minProgress: 68 },
    { label: "Formulating custom lifestyle and nutrition maps", minProgress: 82 },
    { label: "Preparing clinical summary dashboard", minProgress: 94 },
  ];

  return (
    <div className="w-full max-w-md mx-auto bg-white border border-slate-100 p-8 rounded-3xl shadow-sm z-10 space-y-8">
      {/* Visual Ring and Progress Number */}
      <div className="flex flex-col items-center justify-center space-y-3">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="40"
              cy="40"
              r="34"
              className="stroke-slate-100"
              strokeWidth="6"
              fill="transparent"
            />
            <motion.circle
              cx="40"
              cy="40"
              r="34"
              className="stroke-teal-500"
              strokeWidth="6"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 34}
              initial={{ strokeDashoffset: 2 * Math.PI * 34 }}
              animate={{ strokeDashoffset: 2 * Math.PI * 34 - (progress / 100) * (2 * Math.PI * 34) }}
              transition={{ ease: "easeInOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center flex flex-col items-center">
            <span className="text-xl font-bold font-heading text-slate-800">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-base font-bold text-slate-800 font-heading">Analyzing Report</h3>
          <p className="text-xs text-slate-400">Please do not close this window</p>
        </div>
      </div>

      {/* Timeline Steps Checklist */}
      <div className="space-y-4">
        {steps.map((step, idx) => {
          const isCompleted = progress > steps[idx + 1]?.minProgress || progress >= 100;
          const isActive = progress >= step.minProgress && !isCompleted;
          
          return (
            <div
              key={idx}
              className={`flex items-start space-x-3 transition-opacity duration-300 ${
                isActive ? "opacity-100" : isCompleted ? "opacity-75" : "opacity-35"
              }`}
            >
              <div className="mt-0.5 flex-shrink-0">
                {isCompleted ? (
                  <div className="w-5 h-5 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 border border-teal-100">
                    <Check className="w-3 h-3 stroke-[3]" />
                  </div>
                ) : isActive ? (
                  <div className="w-5 h-5 flex items-center justify-center text-teal-600">
                    <Loader2 className="w-4 h-4 animate-spin" />
                  </div>
                ) : (
                  <div className="w-5 h-5 flex items-center justify-center text-slate-300">
                    <CircleDot className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
              <span
                className={`text-xs font-medium leading-tight ${
                  isActive ? "text-slate-800 font-semibold" : "text-slate-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
