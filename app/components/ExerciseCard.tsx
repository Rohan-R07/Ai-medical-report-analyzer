"use client";

import React from "react";
import { motion } from "framer-motion";
import { ExerciseInfo } from "../types";
import { Dumbbell, Timer, Target } from "lucide-react";

interface ExerciseCardProps {
  exercise: ExerciseInfo;
}

export default function ExerciseCard({ exercise }: ExerciseCardProps) {
  const activities = exercise.activities || [];
  const duration = exercise.duration || "30 minutes";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="glass-panel rounded-3xl p-8 h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none bg-sky-500/5" />

      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-2xl border border-emerald-500/15">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              Physical Activity
            </span>
            <h3 className="text-base font-bold font-heading text-slate-100">
              Exercise Plan
            </h3>
          </div>
        </div>
        <div className="flex items-center space-x-1 px-2.5 py-1 bg-slate-900/60 rounded-full border border-slate-800/40 text-xs text-slate-300">
          <Timer className="w-3.5 h-3.5 text-sky-400" />
          <span>{duration}</span>
        </div>
      </div>

      <div className="space-y-4">
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity, idx) => (
              <div
                key={idx}
                className="flex items-start space-x-3 p-3 bg-slate-900/30 rounded-xl border border-slate-800/40 hover:border-slate-700/60 transition-colors"
              >
                <div className="mt-1 flex-shrink-0">
                  <Target className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <span className="text-xs font-semibold text-slate-200">
                    {activity}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No specific exercise guidelines generated.</p>
        )}
      </div>
    </motion.div>
  );
}
