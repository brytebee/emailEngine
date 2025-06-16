import React from "react";
import { motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

// Feedback Component
const FeedbackMessage = ({ feedback }: any) => {
  if (!feedback.show) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
        feedback.type === "success"
          ? "bg-green-50 border border-green-200 text-green-800"
          : "bg-red-50 border border-red-200 text-red-800"
      }`}
    >
      <div className="flex items-start gap-3">
        {feedback.type === "success" ? (
          <CheckCircle2 size={20} className="text-green-600 mt-0.5" />
        ) : (
          <XCircle size={20} className="text-red-600 mt-0.5" />
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
};

export default FeedbackMessage;
