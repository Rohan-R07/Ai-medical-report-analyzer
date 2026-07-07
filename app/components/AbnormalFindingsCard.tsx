"use client";

import React from "react";
import { motion } from "framer-motion";
import { AbnormalFinding } from "../types";
import { AlertCircle, CheckCircle } from "lucide-react";

interface AbnormalFindingsCardProps {
  findings: AbnormalFinding[];
}

export default function AbnormalFindingsCard({ findings }: AbnormalFindingsCardProps) {
  const isHealthy = findings.length === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-panel rounded-3xl p-8 h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none bg-sky-500/5" />

      <div className="flex items-center justify-between mb-6">
        <div className="space-y-1">
          <h3 className="text-lg font-bold font-heading text-slate-100 flex items-center space-x-2">
            <span>Abnormal Metrics</span>
          </h3>
          <p className="text-xs text-slate-400">
            Out-of-range blood panel markers requiring attention
          </p>
        </div>
        {!isHealthy ? (
          <span className="flex items-center space-x-1 px-2.5 py-1 bg-amber-500/10 text-amber-400 rounded-full text-xs font-semibold border border-amber-500/20">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{findings.length} Flagged</span>
          </span>
        ) : (
          <span className="flex items-center space-x-1 px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-xs font-semibold border border-emerald-500/20">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Optimal Range</span>
          </span>
        )}
      </div>

      {isHealthy ? (
        <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
          <CheckCircle className="w-12 h-12 text-emerald-400 bg-emerald-500/10 p-2.5 rounded-full" />
          <h4 className="text-sm font-bold text-slate-200">No abnormal findings</h4>
          <p className="text-xs text-slate-400 max-w-sm">
            All blood metrics extracted from your report fall within standard, healthy physiological ranges.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <div className="inline-block min-w-full align-middle">
            <table className="min-w-full divide-y divide-slate-800/80">
              <thead>
                <tr className="text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  <th scope="col" className="pb-3 pr-4">Marker</th>
                  <th scope="col" className="pb-3 px-4">Status</th>
                  <th scope="col" className="pb-3 pl-4">Meaning / Impact</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40 text-xs">
                {findings.map((finding, index) => {
                  const isLow = finding.status.toLowerCase() === "low";
                  return (
                    <tr key={index} className="group hover:bg-slate-900/20 transition-colors">
                      <td className="py-3.5 pr-4 font-bold text-slate-200">
                        {finding.parameter}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                          isLow
                            ? "bg-rose-500/10 text-rose-400 border-rose-500/10"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/10"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                            isLow ? "bg-rose-400" : "bg-amber-400"
                          }`} />
                          {finding.status}
                        </span>
                      </td>
                      <td className="py-3.5 pl-4 text-slate-300 leading-relaxed max-w-[200px] sm:max-w-md break-words">
                        {finding.explanation || finding.impact || "Out of optimal range threshold."}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
