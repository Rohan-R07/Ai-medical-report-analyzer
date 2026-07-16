"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SlidersHorizontal, CheckCircle2, ChevronDown, Sparkles } from "lucide-react";
import { AbnormalFinding } from "../../types";
import BiomarkerCard from "./BiomarkerCard";

interface BiomarkerListProps {
  abnormalFindings: AbnormalFinding[];
  normalFindings: AbnormalFinding[];
}

export default function BiomarkerList({
  abnormalFindings,
  normalFindings,
}: BiomarkerListProps) {
  const [showNormal, setShowNormal] = useState(false);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 },
  };

  const isHealthy = abnormalFindings.length === 0;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Title block */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-bold font-heading text-slate-800 flex items-center space-x-2">
            <SlidersHorizontal className="w-5 h-5 text-teal-600" />
            <span>Blood Panel Markers</span>
          </h2>
          <p className="text-xs text-slate-500">
            Interactive breakdown of individual CBC parameter levels
          </p>
        </div>
        
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider bg-slate-50 border border-slate-100 px-3 py-1 rounded-full">
          {abnormalFindings.length + normalFindings.length} Total Parameters
        </span>
      </div>

      {/* Flagged Parameters Section */}
      <div className="space-y-4">
        {isHealthy ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-emerald-50 border border-emerald-100 rounded-3xl text-center space-y-3"
          >
            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mx-auto border border-emerald-200">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-800">All Metrics Optimal</h4>
              <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
                Excellent! Every complete blood count metric extracted from your laboratory report falls entirely within standard healthy physiological thresholds.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5 px-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
              <span>Flagged Out-of-Range ({abnormalFindings.length})</span>
            </h3>
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-50px" }}
              className="space-y-3"
            >
              {abnormalFindings.map((finding, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <BiomarkerCard finding={finding} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        )}
      </div>

      {/* Collapsible Normal Parameters Section */}
      {normalFindings.length > 0 && (
        <div className="border-t border-slate-100 pt-6">
          <button
            onClick={() => setShowNormal(!showNormal)}
            className="flex items-center justify-between w-full py-2 px-1 text-slate-500 hover:text-slate-800 transition-colors"
          >
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold uppercase tracking-wider">
                Optimal Normal Parameters ({normalFindings.length})
              </span>
            </div>
            <motion.div
              animate={{ rotate: showNormal ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4" />
            </motion.div>
          </button>

          {showNormal && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="space-y-3 mt-4"
            >
              {normalFindings.map((finding, idx) => (
                <motion.div key={idx} variants={itemVariants}>
                  <BiomarkerCard finding={finding} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      )}
    </div>
  );
}
