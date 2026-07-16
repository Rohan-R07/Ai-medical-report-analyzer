"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, Salad, CalendarDays, GlassWater, Trophy, Dumbbell, 
  Moon, CheckCircle2, ShieldAlert, Sparkles, Plus, Minus
} from "lucide-react";
import { DietPlan, DailyRoutineItem, HydrationInfo, ExerciseInfo } from "../../types";

interface LifestyleTrackerProps {
  diet: DietPlan;
  foodsToPrefer?: string[];
  foodsToLimit?: string[];
  routine: DailyRoutineItem[];
  hydration: HydrationInfo;
  exercise: ExerciseInfo;
  preventionTips: string[];
}

export default function LifestyleTracker({
  diet,
  foodsToPrefer = [],
  foodsToLimit = [],
  routine = [],
  hydration,
  exercise,
  preventionTips = [],
}: LifestyleTrackerProps) {
  const [activeTab, setActiveTab] = useState<"nutrition" | "routine" | "hydration" | "prevention">("nutrition");

  // State for interactive features
  const [waterCount, setWaterCount] = useState(0);
  const targetGlasses = parseInt(hydration.target) || 8;

  const [checkedRoutine, setCheckedRoutine] = useState<Record<number, boolean>>({});
  const [checkedDiet, setCheckedDiet] = useState<Record<string, boolean>>({});

  const toggleRoutine = (idx: number) => {
    setCheckedRoutine(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const toggleDietItem = (key: string) => {
    setCheckedDiet(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const incrementWater = () => {
    if (waterCount < 16) setWaterCount(waterCount + 1);
  };

  const decrementWater = () => {
    if (waterCount > 0) setWaterCount(waterCount - 1);
  };

  const completedRoutineCount = Object.values(checkedRoutine).filter(Boolean).length;
  const totalRoutineCount = routine.length || 4;

  const tabs = [
    { id: "nutrition", label: "Nutrition", icon: <Salad className="w-4 h-4" /> },
    { id: "routine", label: "Daily Routine", icon: <CalendarDays className="w-4 h-4" /> },
    { id: "hydration", label: "Hydration & Fitness", icon: <GlassWater className="w-4 h-4" /> },
    { id: "prevention", label: "Prevention", icon: <Heart className="w-4 h-4" /> },
  ] as const;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      {/* Title Header */}
      <div className="space-y-1">
        <h2 className="text-xl font-bold font-heading text-slate-800 flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-teal-600" />
          <span>Interactive Wellness Plan</span>
        </h2>
        <p className="text-xs text-slate-500">
          Tailored daily actions to restore and maintain optimal blood levels
        </p>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-slate-100 space-x-1.5 overflow-x-auto pb-px">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 px-4 py-2 text-xs font-semibold rounded-t-xl transition-all relative ${
              activeTab === tab.id
                ? "text-teal-600 border-b-2 border-teal-500 font-bold"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="min-h-[300px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25 }}
            className="space-y-6"
          >
            {/* Tab 1: Nutrition & Meals */}
            {activeTab === "nutrition" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Diet Checklist */}
                <div className="space-y-4 bg-white border border-slate-100 p-5 rounded-2xl shadow-sm">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Recommended Meal Plan
                  </h3>
                  
                  <div className="space-y-4">
                    {Object.entries(diet).map(([meal, items]) => {
                      if (!Array.isArray(items) || items.length === 0) return null;
                      return (
                        <div key={meal} className="space-y-1.5">
                          <span className="text-[10px] font-bold text-teal-600 capitalize block tracking-wide">
                            {meal}
                          </span>
                          <div className="space-y-1">
                            {items.slice(0, 3).map((item, idx) => {
                              const uniqueKey = `${meal}-${idx}`;
                              const isChecked = checkedDiet[uniqueKey];
                              return (
                                <label
                                  key={idx}
                                  onClick={() => toggleDietItem(uniqueKey)}
                                  className="flex items-start space-x-2.5 text-xs text-slate-600 hover:text-slate-800 cursor-pointer select-none py-0.5"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked || false}
                                    readOnly
                                    className="mt-0.5 h-3.5 w-3.5 rounded border-slate-200 text-teal-600 focus:ring-teal-500/20"
                                  />
                                  <span className={isChecked ? "line-through text-slate-400" : ""}>
                                    {item}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Foods guidelines */}
                <div className="space-y-5 flex flex-col justify-between">
                  {/* Foods to prefer */}
                  {foodsToPrefer.length > 0 && (
                    <div className="bg-emerald-50/50 border border-emerald-100/60 p-5 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-emerald-800 flex items-center space-x-1.5 uppercase tracking-wide">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Foods to Prefer</span>
                      </h4>
                      <ul className="text-xs text-emerald-700 space-y-1.5 list-disc pl-4 font-normal leading-relaxed">
                        {foodsToPrefer.slice(0, 4).map((food, idx) => (
                          <li key={idx}>{food}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Foods to limit */}
                  {foodsToLimit.length > 0 && (
                    <div className="bg-rose-50/50 border border-rose-100/60 p-5 rounded-2xl space-y-3">
                      <h4 className="text-xs font-bold text-rose-800 flex items-center space-x-1.5 uppercase tracking-wide">
                        <ShieldAlert className="w-4 h-4 text-rose-500" />
                        <span>Foods to Avoid / Limit</span>
                      </h4>
                      <ul className="text-xs text-rose-700 space-y-1.5 list-disc pl-4 font-normal leading-relaxed">
                        {foodsToLimit.slice(0, 4).map((food, idx) => (
                          <li key={idx}>{food}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Tab 2: Daily Routine Timeline */}
            {activeTab === "routine" && (
              <div className="bg-white border border-slate-100 p-6 rounded-2xl shadow-sm space-y-6">
                {/* Routine Progress indicator */}
                <div className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-100">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                      Routine Checklist
                    </span>
                    <span className="text-sm font-bold text-slate-800">
                      {completedRoutineCount} of {totalRoutineCount} Tasks Completed
                    </span>
                  </div>
                  <div className="h-2.5 w-32 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="bg-teal-500 h-full rounded-full transition-all duration-300"
                      style={{ width: `${(completedRoutineCount / totalRoutineCount) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Vertical routine list */}
                <div className="relative border-l border-slate-100 ml-3 pl-6 space-y-5 py-1">
                  {routine.map((item, idx) => {
                    const isChecked = checkedRoutine[idx] || false;
                    return (
                      <div 
                        key={idx}
                        onClick={() => toggleRoutine(idx)}
                        className="relative group cursor-pointer flex items-start space-x-3 select-none"
                      >
                        {/* Status Check Circle */}
                        <div className="absolute -left-[35px] top-0.5 w-5 h-5 rounded-full bg-white border border-slate-200 flex items-center justify-center transition-colors group-hover:border-teal-500">
                          {isChecked && <CheckCircle2 className="w-4 h-4 text-teal-500" />}
                        </div>

                        <div className={`flex-1 space-y-0.5 transition-opacity ${isChecked ? "opacity-50" : "opacity-100"}`}>
                          <span className="text-[9px] font-bold text-teal-600 uppercase tracking-widest block">
                            {item.time}
                          </span>
                          <p className={`text-xs text-slate-700 font-normal leading-relaxed ${isChecked ? "line-through" : ""}`}>
                            {item.activity}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Tab 3: Hydration & Fitness */}
            {activeTab === "hydration" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Hydration Tracker */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex flex-col justify-between items-center text-center space-y-4">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Daily Hydration Counter
                    </h3>
                    <p className="text-[10px] text-slate-500 italic max-w-xs leading-normal">
                      {hydration.tip}
                    </p>
                  </div>

                  {/* Cup graphic/filling representation */}
                  <div className="relative w-28 h-28 flex items-center justify-center bg-teal-50/40 rounded-full border border-teal-100/40">
                    <GlassWater className="w-10 h-10 text-teal-500 z-10" />
                    {/* Water Level overlay */}
                    <div 
                      className="absolute bottom-0 left-0 right-0 bg-teal-200/40 rounded-b-full transition-all duration-500 ease-in-out"
                      style={{ 
                        height: `${Math.min(100, (waterCount / targetGlasses) * 100)}%`,
                        borderTopLeftRadius: waterCount >= targetGlasses ? "9999px" : "0px",
                        borderTopRightRadius: waterCount >= targetGlasses ? "9999px" : "0px",
                      }}
                    />
                  </div>

                  <div className="space-y-3 w-full">
                    <div className="flex justify-center items-baseline space-x-1">
                      <span className="text-2xl font-extrabold text-slate-800">{waterCount}</span>
                      <span className="text-xs text-slate-400">/ {targetGlasses} glasses</span>
                    </div>

                    <div className="flex justify-center space-x-3 w-full max-w-[150px] mx-auto">
                      <button
                        onClick={decrementWater}
                        className="flex-1 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center border border-slate-200 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={incrementWater}
                        className="flex-1 py-1.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg flex items-center justify-center shadow-sm transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Exercise guidelines */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <div className="flex items-center space-x-2 text-slate-700">
                      <Dumbbell className="w-4 h-4 text-teal-600" />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Target Fitness Goals
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-normal">
                      Light aerobic activities aid cell oxygenation and blood circulation without stressing depleted hemoglobin.
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-bold text-slate-700">Target Duration:</span>
                      <span className="font-extrabold text-teal-600">{exercise.duration}</span>
                    </div>
                    <div className="border-t border-slate-200/50 pt-2">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">
                        Recommended Activities
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {exercise.activities.map((act, idx) => (
                          <span 
                            key={idx}
                            className="bg-white border border-slate-200 text-[10px] text-slate-600 px-2 py-0.5 rounded-md font-medium"
                          >
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Prevention */}
            {activeTab === "prevention" && (
              <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm space-y-4">
                <div className="flex items-center space-x-2 text-slate-700 pb-2 border-b border-slate-100">
                  <Heart className="w-4.5 h-4.5 text-teal-600" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    Long-term Prevention Guidelines
                  </span>
                </div>

                <div className="space-y-3">
                  {preventionTips.map((tip, idx) => (
                    <div key={idx} className="flex items-start space-x-3 text-xs text-slate-600 leading-relaxed font-normal">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 flex-shrink-0 mt-1.5" />
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>

                {/* Sleep reminder card */}
                <div className="mt-4 p-4.5 bg-slate-50 border border-slate-100 rounded-xl flex items-start space-x-3">
                  <Moon className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-800 uppercase tracking-wide block">
                      Prioritize Sleep Recovery
                    </span>
                    <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                      Aim for 7 to 9 hours of uninterrupted restful sleep. Blood cells recover and regenerate primarily during deep sleep cycles.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
