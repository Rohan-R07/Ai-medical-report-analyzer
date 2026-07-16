"use client";

import React from "react";
import { Stethoscope } from "lucide-react";
import { Specialist } from "../../../types";

interface RecommendedSpecialistCardProps {
  specialist: Specialist;
  severity: string;
  score: number;
}

export default function RecommendedSpecialistCard({
  specialist,
  severity,
  score,
}: RecommendedSpecialistCardProps) {
  const sevLower = severity.toLowerCase();
  const isImmediate = sevLower.includes("severe") || score < 60;
  const isSoon = sevLower.includes("moderate") || sevLower.includes("warning") || sevLower.includes("anemia");

  const getUrgencyBadge = () => {
    if (isImmediate) {
      return {
        label: "Immediate",
        color: "bg-health-danger/10 text-health-danger border-health-danger/20",
      };
    }
    if (isSoon) {
      return {
        label: "Soon",
        color: "bg-health-warning/10 text-health-warning border-health-warning/20",
      };
    }
    return {
      label: "Routine",
      color: "bg-primary/10 text-primary border-primary/20",
    };
  };

  const urgency = getUrgencyBadge();
  const docType = specialist.doctor_type || specialist.name || "General Practitioner";
  const reason = specialist.reason || "A general check-up is recommended to verify these values and track your ongoing blood count levels.";

  return (
    <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm space-y-4 hover:shadow-md transition-all duration-300">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
            Recommended Specialist
          </span>
          <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
            <Stethoscope className="w-5 h-5 text-primary" />
            <span>{docType}</span>
          </h3>
        </div>

        <div className="flex flex-col items-end space-y-1">
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
            Urgency Priority
          </span>
          <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wider ${urgency.color}`}>
            {urgency.label}
          </span>
        </div>
      </div>

      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 space-y-1">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">
          Justification
        </span>
        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          {reason}
        </p>
      </div>
    </div>
  );
}
