"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DietPlan } from "../types";
import { Coffee, Sun, Sunset, Apple, ThumbsUp, ThumbsDown } from "lucide-react";

interface DietPlannerCardProps {
  diet: DietPlan;
  foodsToPrefer?: string[];
  foodsToLimit?: string[];
}

export default function DietPlannerCard({ diet, foodsToPrefer = [], foodsToLimit = [] }: DietPlannerCardProps) {
  const [activeTab, setActiveTab] = useState<"breakfast" | "lunch" | "dinner" | "snacks">("breakfast");

  const meals = [
    { id: "breakfast", label: "Breakfast", icon: <Coffee className="w-4 h-4" />, items: diet.breakfast },
    { id: "lunch", label: "Lunch", icon: <Sun className="w-4 h-4" />, items: diet.lunch },
    { id: "dinner", label: "Dinner", icon: <Sunset className="w-4 h-4" />, items: diet.dinner },
    { id: "snacks", label: "Snacks", icon: <Apple className="w-4 h-4" />, items: diet.snacks },
  ] as const;

  const activeMeal = meals.find((m) => m.id === activeTab) || meals[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="glass-panel rounded-3xl p-8 h-full relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none bg-sky-500/5" />

      <h3 className="text-lg font-bold font-heading text-slate-100 mb-6">
        Personalized Nutrition Plan
      </h3>

      {/* Tabs */}
      <div className="flex space-x-1.5 p-1 bg-slate-900/60 rounded-xl border border-slate-800/40 mb-6">
        {meals.map((meal) => (
          <button
            key={meal.id}
            onClick={() => setActiveTab(meal.id)}
            className={`flex-1 flex items-center justify-center space-x-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === meal.id
                ? "bg-sky-500 text-white shadow-md shadow-sky-500/20"
                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
            }`}
          >
            {meal.icon}
            <span className="hidden sm:inline">{meal.label}</span>
          </button>
        ))}
      </div>

      {/* Meals Panel */}
      <div className="min-h-[140px] mb-8 bg-slate-900/20 p-5 rounded-2xl border border-slate-800/20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-400 uppercase tracking-wide">
              {activeMeal.icon}
              <span>{activeMeal.label} Suggestions</span>
            </div>
            {activeMeal.items && activeMeal.items.length > 0 ? (
              <ul className="space-y-2.5">
                {activeMeal.items.map((item, idx) => (
                  <li key={idx} className="flex items-start text-sm text-slate-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2 mr-2.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-slate-500 italic">No specific meal recommendations for this period.</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Foods to Prefer / Limit Lists */}
      {(foodsToPrefer.length > 0 || foodsToLimit.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-6 border-t border-slate-800/60">
          {foodsToPrefer.length > 0 && (
            <div className="space-y-3">
              <span className="flex items-center space-x-1.5 text-xs font-bold text-emerald-400 uppercase tracking-wide">
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>Recommended Foods</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {foodsToPrefer.map((food, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold bg-emerald-500/10 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-500/10"
                  >
                    {food}
                  </span>
                ))}
              </div>
            </div>
          )}

          {foodsToLimit.length > 0 && (
            <div className="space-y-3">
              <span className="flex items-center space-x-1.5 text-xs font-bold text-rose-400 uppercase tracking-wide">
                <ThumbsDown className="w-3.5 h-3.5" />
                <span>Foods to Limit</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {foodsToLimit.map((food, i) => (
                  <span
                    key={i}
                    className="text-[11px] font-semibold bg-rose-500/10 text-rose-300 px-2.5 py-1 rounded-full border border-rose-500/10"
                  >
                    {food}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
