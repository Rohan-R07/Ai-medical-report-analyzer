"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { ShieldAlert, Activity, ClipboardList, CheckSquare, Printer, Check } from "lucide-react";

interface SummaryCardProps {
  preventionTips: string[];
  warningSigns: string[];
  followUpTests: string[];
  finalSummary: string[];
}

export default function SummaryCard({
  preventionTips = [],
  warningSigns = [],
  followUpTests = [],
  finalSummary = [],
}: SummaryCardProps) {
  const [checkedTests, setCheckedTests] = useState<Record<number, boolean>>({});

  const toggleTest = (idx: number) => {
    setCheckedTests((prev) => ({
      ...prev,
      [idx]: !prev[idx],
    }));
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
      className="glass-panel rounded-3xl p-8 space-y-8 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none bg-sky-500/5" />

      {/* Prevention & Warning Signs Split Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Prevention Tips */}
        {preventionTips.length > 0 && (
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wide flex items-center space-x-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>Prevention Tips</span>
            </h4>
            <ul className="space-y-3">
              {preventionTips.map((tip, idx) => (
                <li key={idx} className="flex items-start text-xs text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2 mr-2.5 flex-shrink-0" />
                  <span className="leading-relaxed">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Warning Signs */}
        {warningSigns.length > 0 && (
          <div className="space-y-4 p-5 bg-rose-950/15 border border-rose-500/10 rounded-2xl">
            <h4 className="text-sm font-bold text-rose-300 uppercase tracking-wide flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Warning Signs</span>
            </h4>
            <ul className="space-y-3">
              {warningSigns.map((sign, idx) => (
                <li key={idx} className="flex items-start text-xs text-rose-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-2 mr-2.5 flex-shrink-0 animate-pulse" />
                  <span className="leading-relaxed font-medium">{sign}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Follow-up Checklist */}
      {followUpTests.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800/60">
          <h4 className="text-sm font-bold text-slate-300 uppercase tracking-wide flex items-center space-x-2">
            <ClipboardList className="w-4 h-4 text-sky-400" />
            <span>Recommended Follow-up Tests</span>
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {followUpTests.map((test, idx) => {
              const isChecked = !!checkedTests[idx];
              return (
                <div
                  key={idx}
                  onClick={() => toggleTest(idx)}
                  className={`flex items-center space-x-3 p-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                    isChecked
                      ? "bg-sky-500/10 border-sky-500/30 text-sky-300"
                      : "bg-slate-900/30 border-slate-800/40 hover:border-slate-700/60 text-slate-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      isChecked
                        ? "bg-sky-500 border-sky-500 text-white"
                        : "border-slate-700"
                    }`}
                  >
                    {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                  <span className={`text-xs font-semibold select-none ${isChecked ? "line-through text-slate-500" : ""}`}>
                    {test}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Final Summary & Actions */}
      <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex-1 space-y-1.5">
          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Physiological Evaluation Summary
          </h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            {finalSummary.length > 0
              ? finalSummary.join(" ")
              : "Ensure to monitor physical diagnostics periodically and review changes with qualified professionals."}
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center justify-center space-x-2.5 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-slate-800 hover:border-slate-700 transition-all duration-200 flex-shrink-0"
        >
          <Printer className="w-4 h-4 text-sky-400" />
          <span>Export & Print Analysis</span>
        </button>
      </div>
    </motion.div>
  );
}
