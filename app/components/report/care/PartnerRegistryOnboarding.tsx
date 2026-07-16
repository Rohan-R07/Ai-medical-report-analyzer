"use client";

import React from "react";
import { Building2, CheckCircle, ArrowDown, Lock, ShieldAlert } from "lucide-react";

export default function PartnerRegistryOnboarding() {
  const benefits = [
    "Reach patients who need your specialty",
    "Increase visibility in your local community",
    "Receive AI-powered referrals",
    "Verified healthcare profile",
    "Future appointment integration"
  ];

  const steps = [
    "Submit your healthcare center",
    "Verification by our team",
    "Approval",
    "Listed on the platform",
    "Receive patient referrals"
  ];

  const tooltipContent = "The healthcare partner onboarding portal will be available in a future release.";

  return (
    <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm space-y-6 hover:shadow-md transition-all duration-300">
      
      {/* Title block */}
      <div className="flex items-start space-x-3">
        <div className="p-2.5 bg-primary/5 border border-primary/10 rounded-xl text-primary mt-0.5">
          <Building2 className="w-5 h-5 text-primary" />
        </div>
        <div className="space-y-1">
          <h4 className="text-base font-semibold text-slate-900 tracking-tight">
            Healthcare Partners Network
          </h4>
          <p className="text-xs text-slate-500 font-normal leading-relaxed">
            Helping patients connect with trusted and verified healthcare providers. Join our healthcare partner network and become discoverable by patients based on AI-powered condition matching and location-aware recommendations.
          </p>
        </div>
      </div>

      {/* Benefits checklist */}
      <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/40 space-y-3">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">
          Network Benefits
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-600 font-normal">
          {benefits.map((benefit, idx) => (
            <div key={idx} className="flex items-center space-x-2.5">
              <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
              <span>{benefit}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Onboarding process steps timeline */}
      <div className="space-y-3">
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Partner Registration Process
        </span>
        
        <div className="flex flex-col items-center space-y-2 py-2 max-w-sm mx-auto">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center space-x-3 w-full bg-slate-50 border border-slate-200/60 p-3 rounded-xl shadow-sm text-xs font-semibold text-slate-700">
                <span className="w-5 h-5 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center text-[10px] text-primary font-bold">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
              {idx < steps.length - 1 && (
                <ArrowDown className="w-4 h-4 text-slate-300 animate-pulse" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Register CTA Trigger */}
      <div className="pt-2 border-t border-slate-100 flex flex-col items-center text-center space-y-2">
        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
          🚧 Coming Soon
        </span>
        <div className="relative group/tooltip w-full max-w-xs">
          <button className="w-full py-2.5 bg-slate-100 text-slate-400 rounded-xl border border-slate-200/60 text-xs font-bold transition-colors cursor-default focus:outline-none select-none">
            Register Healthcare Center
          </button>
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 shadow-lg whitespace-nowrap z-20 font-medium">
            {tooltipContent}
          </div>
        </div>
      </div>

      {/* Status Warning Badge footer */}
      <div className="p-4 bg-[#f0f5f2] border border-slate-200/40 rounded-xl flex items-start space-x-3 text-[11px] text-slate-500 leading-relaxed font-normal">
        <Lock className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-semibold text-slate-800">Registration Portal Locked</span>
          <p>
            The healthcare partner onboarding portal is under development and will be available in a future release.
          </p>
        </div>
      </div>

    </div>
  );
}
