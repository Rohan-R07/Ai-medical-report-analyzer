"use client";

import React from "react";
import { motion } from "framer-motion";
import { DailyRoutineItem } from "../types";
import { Clock } from "lucide-react";

interface DailyRoutineCardProps {
  routine: DailyRoutineItem[];
}

export default function DailyRoutineCard({ routine }: DailyRoutineCardProps) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemAnim = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="glass-panel rounded-3xl p-8 h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none bg-sky-500/5" />

      <div className="flex items-center space-x-2.5 mb-8">
        <Clock className="w-5 h-5 text-sky-400" />
        <h3 className="text-lg font-bold font-heading text-slate-100">
          Daily Wellness Schedule
        </h3>
      </div>

      {routine && routine.length > 0 ? (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative pl-6 space-y-8 border-l border-slate-800/80"
        >
          {routine.map((item, idx) => {
            const timeColor = (t: string) => {
              const str = t.toLowerCase();
              if (str.includes("morning") || str.includes("am")) return "bg-sky-400/20 border-sky-400 text-sky-400";
              if (str.includes("afternoon") || str.includes("pm")) return "bg-amber-400/20 border-amber-400 text-amber-400";
              if (str.includes("evening")) return "bg-violet-400/20 border-violet-400 text-violet-400";
              return "bg-indigo-400/20 border-indigo-400 text-indigo-400";
            };

            const styles = timeColor(item.time);

            return (
              <motion.div
                key={idx}
                variants={itemAnim}
                className="relative group"
              >
                {/* Timeline node circle */}
                <div className={`absolute -left-[31px] top-1.5 w-3 h-3 rounded-full border-2 bg-[#040814] ${styles.split(" ")[1]} group-hover:scale-125 transition-transform duration-200`} />

                <div className="space-y-1">
                  <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${styles}`}>
                    {item.time}
                  </span>
                  <p className="text-sm font-semibold text-slate-200 mt-1">
                    {item.activity}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
          <p className="text-xs text-slate-500 italic">No daily routine timeline provided.</p>
        </div>
      )}
    </motion.div>
  );
}
