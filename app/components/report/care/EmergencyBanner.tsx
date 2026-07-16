"use client";

import React from "react";
import { AlertOctagon, Eye } from "lucide-react";

export default function EmergencyBanner() {
  const tooltipContent = "This feature will become available in a future release.";

  return (
    <div className="bg-health-danger/5 border border-health-danger/20 p-6 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
      <div className="flex items-start space-x-3.5 text-health-danger">
        <AlertOctagon className="w-6 h-6 flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-900 block text-sm">
            Prompt Medical Attention Advisable
          </span>
          <p className="text-xs text-slate-600 leading-relaxed font-normal">
            Your report indicates findings that may require prompt medical attention. Please seek professional medical care as soon as possible.
          </p>
        </div>
      </div>

      {/* Emphasized Button with Tooltip */}
      <div className="relative group/tooltip flex-shrink-0">
        <button className="w-full md:w-auto py-2.5 px-5 bg-health-danger hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 transition-colors cursor-default focus:outline-none">
          <Eye className="w-3.5 h-3.5" />
          <span>Find Emergency Care</span>
        </button>
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 shadow-lg whitespace-nowrap z-20 font-medium">
          {tooltipContent}
        </div>
      </div>
    </div>
  );
}
