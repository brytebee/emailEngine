// components/SuccessScreen.tsx
import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import FeedbackMessage from "./FeedbackMessage";

interface FormData {
  sender: string;
  receiver: string;
  subject: string;
  body: string;
  firstName: string;
  support?: string;
}

interface FeedbackState {
  show: boolean;
  type: "success" | "error" | "info";
  message: string;
  details?: string;
}

interface SuccessProps {
  formData: FormData;
  feedback: FeedbackState;
}

export default function SuccessScreen({ formData, feedback }: SuccessProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 flex items-center justify-center">
      <FeedbackMessage feedback={feedback} />
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white mx-auto mb-6">
          <CheckCircle size={48} />
        </div>
        <h1 className="text-4xl font-bold text-green-800 dark:text-green-200 mb-4">
          Email Sent Successfully!
        </h1>
        <p className="text-lg text-green-600 dark:text-green-300 mb-8">
          Your email has been delivered to {formData.receiver}
        </p>
        <div className="space-y-2 text-sm text-green-700 dark:text-green-300">
          <p>From: {formData.sender}</p>
          <p>Subject: {formData.subject}</p>
        </div>
      </motion.div>
    </div>
  );
}
