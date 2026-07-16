"use client";

import React from "react";
import { Building2, Sparkles, CheckCircle2, Lock, ArrowRight, ShieldCheck, ArrowDown } from "lucide-react";

export default function HealthcarePartnersLanding() {
  const benefits = [
    {
      title: "Targeted Patient Reach",
      desc: "Connect directly with patients whose AI blood analysis flags a need for your medical specialty."
    },
    {
      title: "Local Discoverability",
      desc: "Increase your facility's visibility in your local geographic area for patients searching near you."
    },
    {
      title: "AI-Powered Referral Flow",
      desc: "Receive qualified, context-rich referrals based on parsed CBC blood panel deviations."
    },
    {
      title: "Verified Partner Badge",
      desc: "Display a verification checkmark certifying your license credentials and facility quality standards."
    },
    {
      title: "Appointment Integrations",
      desc: "Allow patients to schedule consultations directly from their analysis report in future updates."
    },
    {
      title: "Trusted Care Network",
      desc: "Collaborate within a curated, high-standards network of verified laboratory and clinical partners."
    }
  ];

  const steps = [
    "Submit Registration",
    "Credentials Verification",
    "Clinical Board Approval",
    "Verified Partner Listing",
    "Receive AI Patient Referrals"
  ];

  const tooltipContent = "Healthcare partner onboarding will be available in a future release.";

  return (
    <section className="w-full max-w-4xl mx-auto pt-16 mt-16 border-t border-slate-200/60 space-y-12">
      
      {/* Section Header */}
      <div className="text-center space-y-3.5 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/10 px-3.5 py-1.5 rounded-full text-[9px] font-bold text-primary uppercase tracking-wider">
          <Building2 className="w-3 h-3 text-primary" />
          <span>Partner Network</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-semibold text-slate-900 tracking-tight">
          Healthcare Partners
        </h2>
        <p className="text-slate-500 text-xs md:text-sm font-normal leading-relaxed">
          Join our verified healthcare partner network and help patients connect with trusted medical professionals through AI-powered healthcare recommendations.
        </p>
      </div>

      {/* Benefits Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {benefits.map((benefit, idx) => (
          <div 
            key={idx} 
            className="bg-white border border-slate-200/60 p-6 rounded-2xl space-y-3 shadow-sm hover:shadow-md transition-all duration-300"
          >
            <div className="p-2.5 bg-primary/5 rounded-xl w-fit border border-primary/10">
              <CheckCircle2 className="w-4.5 h-4.5 text-primary" />
            </div>
            <div className="space-y-1">
              <h4 className="text-xs font-bold text-slate-900">{benefit.title}</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">{benefit.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Onboarding Timeline & Approval Section */}
      <div className="bg-white border border-slate-200/60 p-8 rounded-2xl shadow-sm space-y-8">
        
        {/* Onboarding Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="space-y-1 text-left">
            <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block">
              Quality Assurance pipeline
            </span>
            <h4 className="text-sm font-semibold text-slate-900">
              Partner Approval Process
            </h4>
            <p className="text-[11px] text-slate-500 font-normal leading-relaxed">
              Every healthcare provider is manually reviewed before becoming visible to patients to reinforce network trust and safety.
            </p>
          </div>

          <div className="inline-flex items-center space-x-1.5 bg-amber-50 text-amber-700 border border-amber-100 px-3.5 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-wider h-fit w-fit select-none">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            <span>Approval Required</span>
          </div>
        </div>

        {/* Process Steps Timeline (Vertical on mobile, horizontal on desktop) */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 py-2">
          {steps.map((step, idx) => (
            <React.Fragment key={idx}>
              <div className="flex items-center space-x-2.5 bg-slate-50 border border-slate-200/40 px-4 py-3 rounded-xl shadow-sm text-xs font-semibold text-slate-700 w-full md:w-auto md:flex-1 text-center justify-center">
                <span className="w-5 h-5 bg-primary/10 border border-primary/10 rounded-full flex items-center justify-center text-[10px] text-primary font-bold">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </div>
              {idx < steps.length - 1 && (
                <>
                  <ArrowRight className="w-4 h-4 text-slate-300 hidden md:block" />
                  <ArrowDown className="w-4 h-4 text-slate-300 md:hidden" />
                </>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Registration CTA Trigger */}
        <div className="pt-4 flex flex-col items-center text-center space-y-2">
          <div className="relative group/tooltip w-full max-w-xs">
            <button
              disabled
              className="w-full py-2.5 bg-slate-100 text-slate-400 rounded-xl border border-slate-200/60 text-xs font-bold flex items-center justify-center space-x-2 cursor-default select-none opacity-60"
            >
              <Lock className="w-3.5 h-3.5 text-slate-400" />
              <span>Register Your Healthcare Center</span>
            </button>
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 shadow-lg whitespace-nowrap z-20 font-medium">
              {tooltipContent}
            </div>
          </div>
        </div>

      </div>

      {/* Roadmap Info Card */}
      <div className="bg-[#f0f5f2] border border-slate-200/40 p-6 rounded-2xl flex items-start space-x-4 shadow-sm">
        <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5 animate-pulse" />
        <div className="space-y-1.5 text-left">
          <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
            Coming Soon
          </span>
          <h4 className="text-xs font-semibold text-slate-900 leading-snug">
            Healthcare provider onboarding is currently under development.
          </h4>
          <p className="text-[11px] text-slate-600 leading-relaxed font-normal">
            In future releases, hospitals and clinics will be able to register, complete credentials verification, and become part of our AI-powered healthcare recommendation network.
          </p>
        </div>
      </div>

    </section>
  );
}
