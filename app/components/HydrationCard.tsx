"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { HydrationInfo } from "../types";
import { Droplet, Info } from "lucide-react";

interface HydrationCardProps {
  hydration: HydrationInfo;
}

export default function HydrationCard({ hydration }: HydrationCardProps) {
  const [glassesDrunk, setGlassesDrunk] = useState(0);
  const target = hydration.target || "8-10 glasses (2.5L)";
  const tip = hydration.tip || "Drink water before meals to optimize iron absorption.";

  // Extract total glasses roughly
  const totalGlasses = 8;
  const percentage = Math.min(100, Math.round((glassesDrunk / totalGlasses) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
      className="glass-panel rounded-3xl p-8 h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none bg-sky-500/5" />

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-sky-500/10 text-sky-400 rounded-2xl border border-sky-500/15">
            <Droplet className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Fluid Intake
            </span>
            <h3 className="text-base font-bold font-heading text-slate-100">
              Hydration
            </h3>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-6">
        {/* Apple-style circular progress indicator or interactive glass stack */}
        <div className="relative flex items-center justify-center">
          <div className="w-24 h-24 rounded-full border-4 border-sky-500/10 flex flex-col items-center justify-center relative overflow-hidden">
            {/* Animated fluid fill wave */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-sky-500/25 z-0"
              initial={{ height: "0%" }}
              animate={{ height: `${percentage}%` }}
              transition={{ duration: 0.8 }}
            />
            <div className="z-10 flex flex-col items-center justify-center">
              <span className="text-xl font-black text-white">{glassesDrunk}</span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
                of {totalGlasses} glasses
              </span>
            </div>
          </div>
        </div>

        {/* Dynamic target and drink button */}
        <div className="flex-1 space-y-4 text-center sm:text-left">
          <div>
            <span className="text-[10px] font-bold text-slate-400 block uppercase">
              Daily Target
            </span>
            <span className="text-sm font-bold text-slate-200">{target}</span>
          </div>
          <button
            onClick={() => setGlassesDrunk((g) => Math.min(totalGlasses, g + 1))}
            disabled={glassesDrunk >= totalGlasses}
            className="w-full sm:w-auto px-4 py-2 bg-sky-500 hover:bg-sky-400 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-sky-500/10 transition-all duration-200"
          >
            {glassesDrunk >= totalGlasses ? "Goal Reached!" : "+ Add Glass"}
          </button>
        </div>
      </div>

      {tip && (
        <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800/40 flex items-start space-x-2 text-[11px] text-slate-400">
          <Info className="w-3.5 h-3.5 text-sky-400 flex-shrink-0 mt-0.5" />
          <p className="leading-relaxed">{tip}</p>
        </div>
      )}
    </motion.div>
  );
}
