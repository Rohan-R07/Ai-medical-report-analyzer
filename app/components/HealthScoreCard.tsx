"use client";

import React, { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { ShieldCheck, HeartPulse } from "lucide-react";

interface HealthScoreCardProps {
  severity: string;
  abnormalCount: number;
  score?: number;
}

export default function HealthScoreCard({ severity, abnormalCount, score: propsScore }: HealthScoreCardProps) {
  const [score, setScore] = useState(100);
  const controls = useAnimation();

  useEffect(() => {
    if (propsScore !== undefined) {
      setScore(propsScore);
      return;
    }

    // Logic to calculate score fallback
    let calculatedScore = 95;
    
    const sev = severity.toLowerCase();
    if (sev.includes("severe") || sev.includes("high") || sev.includes("danger")) {
      calculatedScore = Math.max(45, 60 - abnormalCount * 5);
    } else if (sev.includes("moderate") || sev.includes("warning") || sev.includes("anemia")) {
      calculatedScore = Math.max(65, 80 - abnormalCount * 4);
    } else {
      calculatedScore = Math.max(88, 98 - abnormalCount * 3);
    }

    setScore(calculatedScore);
  }, [severity, abnormalCount, propsScore]);

  // Ring properties
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getScoreColor = (val: number) => {
    if (val >= 90) return "stroke-emerald-500 text-emerald-400";
    if (val >= 70) return "stroke-amber-500 text-amber-400";
    return "stroke-rose-500 text-rose-400";
  };

  const getScoreLabel = (val: number) => {
    if (val >= 90) return { title: "Optimal", text: "Report indicates excellent physiological metrics." };
    if (val >= 70) return { title: "Mild-Moderate Risk", text: "Certain indicators warrant attention and modification." };
    return { title: "High Alert", text: "Multiple abnormal findings. Consult a medical professional immediately." };
  };

  const status = getScoreLabel(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="glass-panel glass-panel-hover rounded-3xl p-8 flex flex-col items-center justify-between h-full relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-32 h-32 rounded-full blur-3xl pointer-events-none bg-sky-500/5" />
      
      <div className="w-full flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
          Physiological Score
        </h3>
        <ShieldCheck className="w-5 h-5 text-slate-500" />
      </div>

      <div className="relative flex items-center justify-center my-4">
        {/* Animated Radial Ring */}
        <svg className="w-44 h-44 transform -rotate-90">
          {/* Background circle */}
          <circle
            cx="88"
            cy="88"
            r={radius}
            className="stroke-slate-800/80"
            strokeWidth="12"
            fill="transparent"
          />
          {/* Active progress circle */}
          <motion.circle
            cx="88"
            cy="88"
            r={radius}
            className={getScoreColor(score).split(" ")[0]}
            strokeWidth="12"
            fill="transparent"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
          />
        </svg>

        {/* Central text indicator */}
        <div className="absolute flex flex-col items-center justify-center">
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className={`text-4xl font-extrabold font-heading ${getScoreColor(score).split(" ")[1]}`}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-slate-500 uppercase font-semibold mt-0.5 tracking-wider">
            of 100
          </span>
        </div>
      </div>

      <div className="w-full text-center mt-4 space-y-1">
        <h4 className="text-md font-bold text-slate-200">{status.title}</h4>
        <p className="text-xs text-slate-400 leading-relaxed max-w-[250px] mx-auto">
          {status.text}
        </p>
      </div>
    </motion.div>
  );
}
