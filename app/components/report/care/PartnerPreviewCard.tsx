"use client";

import React from "react";
import { Star, MapPin, Eye, Calendar, CornerUpRight, ShieldCheck } from "lucide-react";

export interface PartnerClinic {
  name: string;
  distance: string;
  rating: number;
  specialization: string;
  type: "Hospital" | "Clinic" | "Diagnostic Center" | "Telemedicine";
  status: string;
}

interface PartnerPreviewCardProps {
  partner: PartnerClinic;
}

export default function PartnerPreviewCard({ partner }: PartnerPreviewCardProps) {
  const tooltipContent = "This feature will become available in a future release.";

  return (
    <div className="bg-white border border-slate-200/60 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 relative overflow-hidden flex flex-col h-full justify-between min-h-[260px] group">
      
      {/* Background Coming Soon Badge */}
      <div className="absolute top-0 right-0 bg-primary/10 text-primary text-[8px] font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-bl-xl border-l border-b border-primary/10 z-10 select-none">
        Coming Soon
      </div>

      <div className="space-y-4">
        {/* Header Block */}
        <div className="flex justify-between items-start gap-4">
          <div className="space-y-1">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
              {partner.type} • Registry Preview
            </span>
            <h4 className="text-sm font-semibold text-slate-900 tracking-tight leading-snug">
              {partner.name}
            </h4>
          </div>

          <div className="flex items-center space-x-1 text-xs text-amber-600 bg-amber-50 border border-amber-100/50 px-2 py-0.5 rounded-md font-semibold flex-shrink-0">
            <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" />
            <span>{partner.rating.toFixed(1)}</span>
          </div>
        </div>

        {/* Detailed Stats Block */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200/40 text-[11px] text-slate-600">
          <div className="flex items-center space-x-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span>{partner.distance} away</span>
          </div>
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-3.5 h-3.5 text-primary" />
            <span className="truncate">{partner.specialization}</span>
          </div>
        </div>
      </div>

      {/* Button controls pinned to the bottom */}
      <div className="grid grid-cols-3 gap-2 pt-4 mt-auto">
        {/* Button 1: Details */}
        <div className="relative group/tooltip">
          <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl border border-slate-200/60 text-[10px] font-bold flex items-center justify-center space-x-1 transition-colors cursor-default focus:outline-none">
            <Eye className="w-3 h-3 text-slate-400" />
            <span>Details</span>
          </button>
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 shadow-lg whitespace-nowrap z-20 font-medium">
            {tooltipContent}
          </div>
        </div>

        {/* Button 2: Directions */}
        <div className="relative group/tooltip">
          <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl border border-slate-200/60 text-[10px] font-bold flex items-center justify-center space-x-1 transition-colors cursor-default focus:outline-none">
            <CornerUpRight className="w-3 h-3 text-slate-400" />
            <span>Directions</span>
          </button>
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 shadow-lg whitespace-nowrap z-20 font-medium">
            {tooltipContent}
          </div>
        </div>

        {/* Button 3: Book */}
        <div className="relative group/tooltip">
          <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-xl border border-slate-200/60 text-[10px] font-bold flex items-center justify-center space-x-1 transition-colors cursor-default focus:outline-none">
            <Calendar className="w-3 h-3 text-slate-400" />
            <span>Book</span>
          </button>
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-3 py-1.5 rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-200 shadow-lg whitespace-nowrap z-20 font-medium">
            {tooltipContent}
          </div>
        </div>
      </div>

    </div>
  );
}
