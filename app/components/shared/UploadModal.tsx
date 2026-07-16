"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import UploadCard from "../UploadCard";
import LoadingTimeline from "./LoadingTimeline";

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => void;
  isLoading: boolean;
  isBackendConnected: boolean | null;
  loadingProgress: number;
}

export default function UploadModal({
  isOpen,
  onClose,
  onUpload,
  isLoading,
  isBackendConnected,
  loadingProgress,
}: UploadModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={isLoading ? undefined : onClose}
          className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm"
        />

        {/* Modal content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 15 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-slate-50 w-full max-w-xl p-8 rounded-2xl relative border border-slate-200/60 shadow-xl z-10 space-y-6"
        >
          {/* Close button */}
          {!isLoading && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-200/50 transition-colors focus-visible:outline-none cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="pt-2">
            {!isLoading ? (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold text-slate-900 tracking-tight">
                    Analyze New Report
                  </h3>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto font-normal">
                    Select another Complete Blood Count PDF to parse and visualize.
                  </p>
                </div>
                <UploadCard
                  onUpload={onUpload}
                  isLoading={isLoading}
                  isBackendConnected={isBackendConnected}
                />
              </div>
            ) : (
              <div className="py-4">
                <LoadingTimeline progress={loadingProgress} />
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
