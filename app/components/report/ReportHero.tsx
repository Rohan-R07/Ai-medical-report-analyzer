"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, AlertTriangle } from "lucide-react";

interface ReportHeroProps {
  score: number;
  condition: string;
  severity: string;
  summary: string;
  onBack: () => void;
}

export default function ReportHero({ score, condition, severity, summary, onBack }: ReportHeroProps) {
  const radius = 64;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 90) return "stroke-health-optimal text-health-optimal";
    if (val >= 70) return "stroke-health-warning text-health-warning";
    return "stroke-health-danger text-health-danger";
  };

  const getScoreLabel = (val: number) => {
    if (val >= 90) return "Optimal";
    if (val >= 70) return "Needs Monitoring";
    return "Needs Attention";
  };

  const isSevere = severity.toLowerCase() === "severe" || score < 60;

  return (
    <div className="min-h-[85vh] flex flex-col justify-between py-8 px-4 md:px-8 relative bg-white">
      {/* Back button */}
      <header className="flex justify-between items-center w-full max-w-4xl mx-auto mb-8">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Upload Another Report</span>
        </button>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
          Active Analysis Summary
        </span>
      </header>

      {/* Critical Alert Warning Bar */}
      {isSevere && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto w-full mb-6 p-4.5 bg-rose-50 border border-rose-100 rounded-2xl flex items-start space-x-3 text-rose-800 text-xs"
        >
          <AlertTriangle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <div className="space-y-1">
            <span className="font-bold">Urgent Medical Review Advisable</span>
            <p className="text-slate-600 leading-normal">
              Multiple out-of-range parameters have been flagged in your report. We advise showing these results to a licensed physician or general practitioner.
            </p>
          </div>
        </motion.div>
      )}

      {/* Main Hero block */}
      <div className="max-w-2xl w-full mx-auto flex-1 flex flex-col items-center justify-center text-center space-y-8 my-auto">
        {/* Animated Radial Score Dial */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="72"
              cy="72"
              r={radius}
              className="stroke-slate-100"
              strokeWidth="10"
              fill="transparent"
            />
            <motion.circle
              cx="72"
              cy="72"
              r={radius}
              className={getScoreColor(score).split(" ")[0]}
              strokeWidth="10"
              fill="transparent"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          
          <div className="absolute text-center flex flex-col items-center">
            <span className="text-4xl font-extrabold font-heading text-slate-800">
              {score}
            </span>
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
              Health Score
            </span>
          </div>
        </div>

        {/* Condition Title and Severity Pill */}
        <div className="space-y-4">
          <div className="flex flex-col items-center space-y-2">
            <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-slate-800 tracking-tight leading-tight max-w-lg">
              {condition}
            </h1>
            
            <div className="flex items-center space-x-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase border tracking-wider ${
                isSevere
                  ? "bg-rose-50 text-rose-600 border-rose-100"
                  : severity.toLowerCase() === "normal"
                  ? "bg-emerald-50 text-emerald-600 border-emerald-100"
                  : "bg-amber-50 text-amber-600 border-amber-100"
              }`}>
                {severity} Severity
              </span>
              <span className="text-slate-300">•</span>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                {getScoreLabel(score)} Status
              </span>
            </div>
          </div>

          <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            {summary}
          </p>
        </div>
      </div>

      {/* Downward indicator */}
      <footer className="text-center pt-8">
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="inline-flex flex-col items-center space-y-1 text-slate-400 hover:text-slate-600 cursor-pointer"
        >
          <span className="text-[9px] font-bold uppercase tracking-widest">Scroll to explore details</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </footer>
    </div>
  );
}
