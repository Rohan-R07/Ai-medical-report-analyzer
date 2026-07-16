"use client";

import React from "react";
import { Compass } from "lucide-react";
import { Specialist } from "../../../types";
import RecommendedSpecialistCard from "./RecommendedSpecialistCard";
import PartnerPreviewList from "./PartnerPreviewList";
import FeatureComingSoonBanner from "./FeatureComingSoonBanner";
import PartnerRegistryOnboarding from "./PartnerRegistryOnboarding";
import EmergencyBanner from "./EmergencyBanner";

interface ContinueCareSectionProps {
  specialist: Specialist;
  severity: string;
  score: number;
}

export default function ContinueCareSection({
  specialist,
  severity,
  score,
}: ContinueCareSectionProps) {
  const sevLower = severity.toLowerCase();
  const isSevere = sevLower.includes("severe") || sevLower.includes("high") || score < 60;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 no-print">
      {/* Title */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-slate-900 flex items-center space-x-2.5">
          <Compass className="w-5 h-5 text-primary" />
          <span>Continue Your Care</span>
        </h2>
        <p className="text-xs text-slate-500 font-normal leading-relaxed">
          Based on your analysis, speaking with a healthcare professional can help you better understand your results and discuss the appropriate next steps.
        </p>
      </div>

      {/* 1. Emergency Notice (if severe) */}
      {isSevere && <EmergencyBanner />}

      {/* 2. Recommended Specialist */}
      <RecommendedSpecialistCard
        specialist={specialist}
        severity={severity}
        score={score}
      />

      {/* 3. Healthcare Partner Preview */}
      <PartnerPreviewList />

      {/* 4. Future Vision Banner */}
      <FeatureComingSoonBanner />

      {/* 4.5. Onboarding Partner Registry Roadmap */}
      <PartnerRegistryOnboarding />

      {/* 5. Natural Conclusion Notice */}
      <div className="pt-6 border-t border-slate-200/80 text-center max-w-md mx-auto space-y-1">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
          Registry Roadmap
        </p>
        <p className="text-xs text-slate-600 font-normal leading-relaxed">
          You now understand your blood report. Soon, you&apos;ll also be able to connect with the right healthcare professionals near you—all from within the same experience.
        </p>
      </div>

    </div>
  );
}
