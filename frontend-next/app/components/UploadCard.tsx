"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, FileText, AlertCircle, Sparkles } from "lucide-react";

interface UploadCardProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
  isBackendConnected?: boolean | null;
}

export default function UploadCard({
  onUpload,
  isLoading,
  isBackendConnected = null,
}: UploadCardProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isBackendConnected === false) {
      setIsDragActive(false);
      return;
    }
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const validateAndProcessFile = (file: File | null) => {
    if (!file) return;
    
    if (isBackendConnected === false) {
      setError("Cannot upload report: The backend API server is offline. Please run the server using 'python ui.py'.");
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Please upload a valid PDF medical report.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File is too large. Max size is 10MB.");
      return;
    }

    setError(null);
    onUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (isBackendConnected === false) {
      setError("Cannot upload report: The backend API server is offline. Please run the server using 'python ui.py'.");
      return;
    }

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (isBackendConnected === false) {
      setError("Cannot upload report: The backend API server is offline. Please run the server using 'python ui.py'.");
      return;
    }
    if (e.target.files && e.target.files[0]) {
      validateAndProcessFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    if (isBackendConnected === false) {
      setError("Cannot upload report: The backend API server is offline. Please run the server using 'python ui.py'.");
      return;
    }
    inputRef.current?.click();
  };

  return (
    <div className="w-full max-w-2xl mx-auto z-10">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf"
        onChange={handleChange}
        disabled={isLoading || isBackendConnected === false}
      />

      <motion.div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`glass-panel rounded-3xl p-10 flex flex-col items-center justify-center border-dashed border-2 relative overflow-hidden transition-all duration-300 ${
          isBackendConnected === false
            ? "border-rose-950/40 bg-rose-950/5 cursor-not-allowed opacity-60"
            : isDragActive
            ? "border-sky-400 bg-sky-500/10 shadow-[0_0_30px_rgba(14,165,233,0.2)] cursor-pointer"
            : "border-slate-700/60 bg-slate-900/30 hover:border-sky-500/40 hover:bg-slate-900/50 hover:shadow-[0_0_20px_rgba(14,165,233,0.1)] cursor-pointer"
        }`}
        whileHover={isBackendConnected === false ? {} : { scale: 1.01 }}
        whileTap={isBackendConnected === false ? {} : { scale: 0.99 }}
      >
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col items-center text-center space-y-6">
          <motion.div
            className={`p-5 rounded-2xl ${
              isDragActive ? "bg-sky-500/20 text-sky-400" : "bg-slate-800/80 text-slate-400"
            }`}
            animate={{
              y: isDragActive ? -10 : 0,
              scale: isDragActive ? 1.1 : 1,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Upload className="w-10 h-10" />
          </motion.div>

          <div className="space-y-2">
            <h3 className="text-xl font-semibold text-slate-100 font-heading">
              {isDragActive ? "Drop your report here" : "Upload your medical report"}
            </h3>
            <p className="text-sm text-slate-400 max-w-sm">
              Drag and drop your blood test report PDF here, or{" "}
              <span className="text-sky-400 font-medium hover:underline">browse files</span>.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-800/40 px-3 py-1.5 rounded-full border border-slate-700/40">
            <FileText className="w-3.5 h-3.5" />
            <span>PDF files up to 10MB</span>
          </div>
        </div>

        {/* Upload Border Glow effect */}
        {isDragActive && (
          <motion.div
            layoutId="upload-glow"
            className="absolute inset-0 border border-sky-400/50 rounded-3xl pointer-events-none"
            initial={false}
            transition={{ duration: 0.2 }}
          />
        )}
      </motion.div>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-start space-x-3 text-rose-300 text-sm"
          >
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 flex justify-between items-center">
              <span>{error}</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setError(null);
                }}
                className="text-rose-400 hover:text-rose-200 transition-colors text-xs font-semibold ml-4"
              >
                Dismiss
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
