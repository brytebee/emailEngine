// components/FeedbackMessage.tsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface FeedbackState {
  show: boolean;
  type: "success" | "error" | "info";
  message: string;
  details?: string;
}

interface FeedbackProps {
  feedback: FeedbackState;
}

export default function FeedbackMessage({ feedback }: FeedbackProps) {
  if (!feedback.show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        feedback.type === "success"
          ? "bg-green-50 border border-green-200 text-green-800"
          : feedback.type === "error"
          ? "bg-red-50 border border-red-200 text-red-800"
          : "bg-blue-50 border border-blue-200 text-blue-800"
      }`}
    >
      <div className="flex items-start gap-3">
        {feedback.type === "success" ? (
          <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
        ) : feedback.type === "error" ? (
          <XCircle size={20} className="text-red-600 mt-0.5" />
        ) : (
          <AlertCircle size={20} className="text-blue-600 mt-0.5" />
        )}
        <div className="flex-1">
          <p className="font-medium">{feedback.message}</p>
          {feedback.details && (
            <p className="text-sm mt-1 opacity-80">{feedback.details}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}
