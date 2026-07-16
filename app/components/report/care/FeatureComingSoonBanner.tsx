"use client";

import React from "react";
import { Sparkles, MapPin, CheckCircle } from "lucide-react";

export default function FeatureComingSoonBanner() {
  const criteria = [
    "Your blood condition",
    "AI recommended specialist",
    "Your current location & distance",
    "Hospital specialty departments",
    "Doctor availability & schedules",
    "Consultation type (In-person / Online)"
  ];

  return (
    <div className="bg-[#f0f5f2] border border-slate-200/40 p-6 rounded-2xl space-y-6 shadow-sm">
      
      {/* Title Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/10 px-3.5 py-1.5 rounded-full text-[9px] font-bold text-primary uppercase tracking-wider">
          <Sparkles className="w-3 h-3 text-primary animate-pulse" />
          <span>Feature Under Development</span>
        </div>
        
        <h3 className="text-base font-semibold text-slate-900 tracking-tight">
          Personalized Care Connection
        </h3>
        
        <p className="text-xs text-slate-600 leading-relaxed font-normal">
          Based on your blood analysis, we will soon help you connect with the most appropriate healthcare professionals near your location.
        </p>
      </div>

      {/* Criteria Details */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Recommendation Engine Criteria
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 font-normal">
          {criteria.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2.5">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Geolocation Disclaimer Banner */}
      <div className="p-4 bg-white border border-slate-200/60 rounded-xl flex items-start space-x-3 text-[11px] text-slate-500 shadow-sm leading-relaxed font-normal">
        <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-semibold text-slate-800">Secure Location Awareness</span>
          <p>
            In a future version, this application will securely request your location to recommend nearby healthcare providers based on your medical report. No location permission is requested in this MVP.
          </p>
        </div>
      </div>

    </div>
  );
}
