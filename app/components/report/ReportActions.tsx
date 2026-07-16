"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Printer, Download, Share2, Clipboard, History, Trash2, Check, Sparkles 
} from "lucide-react";
import { MedicalReportData } from "../../types";

interface ReportActionsProps {
  reportData: MedicalReportData;
  onRestoreReport: (data: MedicalReportData) => void;
}

interface HistoryItem {
  id: string;
  date: string;
  condition: string;
  score: number;
  data: MedicalReportData;
}

export default function ReportActions({ reportData, onRestoreReport }: ReportActionsProps) {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Format date nicely
  const getFormattedDate = () => {
    return new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // On mount, load report history
  useEffect(() => {
    const rawHistory = localStorage.getItem("medicalReportHistory");
    let parsedHistory: HistoryItem[] = [];
    if (rawHistory) {
      try {
        parsedHistory = JSON.parse(rawHistory);
      } catch (e) {
        console.error("Failed to load report history", e);
      }
    }

    // Check if current report is already in history to avoid duplicates
    const isNew = parsedHistory.every(item => {
      // Compare by condition and physiological score as unique check
      return !(item.score === (reportData.overview?.physiological_score || 100) && 
               item.condition === (reportData.primary_analysis?.title || "Normal"));
    });

    if (isNew && reportData.primary_analysis?.title) {
      const newItem: HistoryItem = {
        id: Math.random().toString(36).substring(2, 9),
        date: getFormattedDate(),
        condition: reportData.primary_analysis.title,
        score: reportData.overview?.physiological_score !== undefined ? reportData.overview.physiological_score : 100,
        data: reportData
      };
      const updatedHistory = [newItem, ...parsedHistory].slice(0, 5); // Keep last 5 reports
      localStorage.setItem("medicalReportHistory", JSON.stringify(updatedHistory));
      setHistory(updatedHistory);
    } else {
      setHistory(parsedHistory);
    }
  }, [reportData]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopy = () => {
    const condition = reportData.primary_analysis?.title || "Unknown";
    const score = reportData.overview?.physiological_score || 100;
    const summary = reportData.primary_analysis?.summary || "";
    const text = `AI Blood Test Summary:\nCondition: ${condition}\nHealth Score: ${score}/100\nSummary: ${summary}\nGenerated via AI Medical Report Analyzer.`;
    
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "My Blood Test Report Insights",
        text: `My health score is ${reportData.overview?.physiological_score || 100}/100. Analysis: ${reportData.primary_analysis?.title}.`,
        url: window.location.origin
      }).then(() => {
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }).catch(err => {
        console.log("Error sharing", err);
      });
    } else {
      handleCopy();
    }
  };

  const clearHistory = () => {
    localStorage.removeItem("medicalReportHistory");
    setHistory([]);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 no-print">
      {/* Action Buttons Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Print / Download Button */}
        <button
          onClick={handlePrint}
          className="flex items-center justify-center space-x-2.5 bg-slate-900 hover:bg-slate-800 text-white py-3 px-4 rounded-2xl shadow-sm text-xs font-bold transition-all hover:y-[-1px] active:scale-98"
        >
          <Printer className="w-4 h-4" />
          <span>Print / Download PDF</span>
        </button>

        {/* Copy text button */}
        <button
          onClick={handleCopy}
          className="flex items-center justify-center space-x-2.5 bg-white hover:bg-slate-50 text-slate-700 py-3 px-4 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold transition-all hover:y-[-1px] active:scale-98"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Clipboard className="w-4 h-4" />}
          <span>{copied ? "Copied to Clipboard!" : "Copy Report Text"}</span>
        </button>

        {/* Share Button */}
        <button
          onClick={handleShare}
          className="flex items-center justify-center space-x-2.5 bg-white hover:bg-slate-50 text-slate-700 py-3 px-4 rounded-2xl border border-slate-200 shadow-sm text-xs font-bold transition-all hover:y-[-1px] active:scale-98"
        >
          {shared ? <Check className="w-4 h-4 text-emerald-500" /> : <Share2 className="w-4 h-4" />}
          <span>{shared ? "Shared!" : "Share Analysis"}</span>
        </button>
      </div>

      {/* History List */}
      {history.length > 1 && (
        <div className="space-y-4 pt-6 border-t border-slate-100">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
              <History className="w-4 h-4 text-slate-400" />
              <span>Analysis History</span>
            </h3>
            
            <button
              onClick={clearHistory}
              className="flex items-center space-x-1 text-[10px] font-bold text-rose-600 hover:text-rose-800 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear History</span>
            </button>
          </div>

          <div className="space-y-2.5">
            {history.map((item) => (
              <div
                key={item.id}
                onClick={() => onRestoreReport(item.data)}
                className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-200 cursor-pointer shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="space-y-0.5">
                  <span className="text-[9px] text-slate-400 font-bold block">
                    {item.date}
                  </span>
                  <span className="text-xs font-bold text-slate-800 font-heading">
                    {item.condition}
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-xs text-slate-400 font-medium">Health Score:</span>
                  <span className={`text-xs font-extrabold px-2 py-0.5 rounded-md ${
                    item.score >= 90
                      ? "bg-emerald-50 text-emerald-600"
                      : item.score >= 70
                      ? "bg-amber-50 text-amber-600"
                      : "bg-rose-50 text-rose-600"
                  }`}>
                    {item.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
