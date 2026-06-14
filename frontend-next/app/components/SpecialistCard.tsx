"use client";

import React from "react";
import { motion } from "framer-motion";
import { Specialist } from "../types";
import { Stethoscope, Calendar, Heart } from "lucide-react";

interface SpecialistCardProps {
  specialist: Specialist;
}

export default function SpecialistCard({ specialist }: SpecialistCardProps) {
  const doctorName = specialist.name || specialist.doctor_type || "General Practitioner";
  const consultReason = specialist.reason || "For regular consultation and monitoring.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="glass-panel glass-panel-hover rounded-3xl p-8 flex flex-col justify-between h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none bg-sky-500/5" />

      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl border border-sky-500/15">
            <Stethoscope className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Recommended Referral
            </span>
            <h3 className="text-base font-bold font-heading text-slate-100">
              {doctorName}
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wide">
            Consultation Intent
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {consultReason}
          </p>
        </div>
      </div>

      <div className="mt-8 pt-5 border-t border-slate-800/60 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="flex items-center space-x-1.5 text-xs text-slate-500">
          <Heart className="w-3.5 h-3.5 text-rose-500" />
          <span>Priority Consultation</span>
        </div>
        <button
          onClick={() => alert("Appointment scheduler is a mockup feature.")}
          className="flex items-center justify-center space-x-2 px-4 py-2 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 hover:text-sky-300 text-xs font-bold rounded-xl border border-sky-500/25 transition-all duration-200"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Book Consultation</span>
        </button>
      </div>
    </motion.div>
  );
}
