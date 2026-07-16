"use client";

import React from "react";
import PartnerPreviewCard, { PartnerClinic } from "./PartnerPreviewCard";

const MOCK_PARTNERS: PartnerClinic[] = [
  {
    name: "Vitalis CBC Hematology Clinic",
    distance: "1.2 miles",
    rating: 4.9,
    specialization: "Hematology & Blood Disorders",
    type: "Clinic",
    status: "Coming Soon",
  },
  {
    name: "Vitalis CBC Health Partner",
    distance: "2.4 miles",
    rating: 4.8,
    specialization: "General Internal Medicine",
    type: "Hospital",
    status: "Coming Soon",
  },
  {
    name: "Vitalis CBC Diagnostic Center",
    distance: "3.1 miles",
    rating: 4.7,
    specialization: "Advanced Lab Screenings",
    type: "Diagnostic Center",
    status: "Coming Soon",
  },
  {
    name: "Vitalis CBC Wellness Center",
    distance: "Virtual",
    rating: 4.9,
    specialization: "Nutrition & Lifestyle Coaching",
    type: "Telemedicine",
    status: "Coming Soon",
  },
];

export default function PartnerPreviewList() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-0.5">
        <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
          Nearby Healthcare Partners
        </h4>
        <span className="text-[9px] text-slate-400 font-semibold uppercase tracking-wider">
          4 Partners Preview
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {MOCK_PARTNERS.map((partner, idx) => (
          <PartnerPreviewCard key={idx} partner={partner} />
        ))}
      </div>
    </div>
  );
}
