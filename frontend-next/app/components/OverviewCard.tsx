"use client";

import React from "react";
import { motion } from "framer-motion";
import { Heart, Activity, ShieldAlert } from "lucide-react";

interface OverviewCardProps {
  condition: string;
  severity: string;
  summary: string;
}

export default function OverviewCard({ condition, severity, summary }: OverviewCardProps) {
  // Determine color theme based on severity
  const getSeverityStyle = (sev: string) => {
    const s = sev.toLowerCase();
    if (s.includes("severe") || s.includes("high") || s.includes("danger")) {
      return {
        badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
        bg: "shadow-rose-950/20 border-rose-500/10",
        glow: "bg-rose-500/10",
        icon: <ShieldAlert className="w-5 h-5 text-rose-400" />,
      };
    }
    if (s.includes("moderate") || s.includes("warning") || s.includes("medium") || s.includes("anemia")) {
      return {
        badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
        bg: "shadow-amber-950/20 border-amber-500/10",
        glow: "bg-amber-500/10",
        icon: <Activity className="w-5 h-5 text-amber-400" />,
      };
    }
    return {
      badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      bg: "shadow-emerald-950/20 border-emerald-500/10",
      glow: "bg-emerald-500/10",
      icon: <Heart className="w-5 h-5 text-emerald-400" />,
    };
  };

  const theme = getSeverityStyle(severity);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`glass-panel glass-panel-hover rounded-3xl p-8 flex flex-col justify-between h-full relative overflow-hidden ${theme.bg}`}
    >
      {/* Background glow overlay */}
      <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none ${theme.glow}`} />

      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold">
              Primary Analysis
            </span>
            <h2 className="text-2xl font-bold font-heading text-white">{condition}</h2>
          </div>
          <span className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${theme.badge}`}>
            {theme.icon}
            <span>{severity}</span>
          </span>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-300">Analysis Summary</h4>
          <p className="text-slate-400 text-sm leading-relaxed">{summary}</p>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-slate-800/60 flex items-center justify-between text-xs text-slate-500">
        <span>Report Type: Complete Blood Count (CBC)</span>
        <span>Confidence: High</span>
      </div>
    </motion.div>
  );
}
