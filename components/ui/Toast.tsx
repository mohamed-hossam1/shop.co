"use client";

import { motion, AnimatePresence } from "motion/react";
import { CheckCircle2, AlertCircle, X } from "lucide-react";
import { useEffect } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  message: string;
  type?: ToastType;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  type = "success",
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -20, x: 20 }}
          animate={{ opacity: 1, y: 0, x: 0 }}
          exit={{ opacity: 0, y: -20, x: 20 }}
          className="fixed top-6 right-6 z-[9999] flex items-center gap-3 bg-black text-white px-6 py-4 border border-white/10 shadow-2xl min-w-[300px]"
        >
          {type === "success" && (
            <CheckCircle2 className="w-5 h-5 text-white" />
          )}
          {type === "error" && (
            <AlertCircle className="w-5 h-5 text-red-500" />
          )}
          
          <div className="flex-1">
            <p className="text-sm font-medium font-satoshi tracking-wide">{message}</p>
          </div>

          <button 
            onClick={onClose}
            className="p-1 hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4 text-white/50" />
          </button>

          {/* Progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-[2px] bg-white origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
