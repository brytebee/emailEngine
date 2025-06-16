// components/v1/email-send/EmailSendV1

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Sun,
  Moon,
  LogOut,
  UserCheck,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import LoginScreen from "./LoginScreen";
import EmailForm from "./EmailForm";
import EmailPreview from "./EmailPreview";
import SuccessScreen from "./SuccessScreen";
import FeedbackMessage from "./FeedbackMessage";
import { Badge, Button } from "./UiComponents";
import { useInactivityTimer } from "@/hooks/useInactivityTimer";
import { useEmailLimit } from "@/hooks/useEmailLimit";

interface FeedbackState {
  show: boolean;
  type: "success" | "error" | "info";
  message: string;
  details?: string;
}

// Environment variables simulation
const ALLOWED_USERS = JSON.parse(process.env.NEXT_PUBLIC_AUTH_USERS || "{}");

const ALLOWED_SENDERS = [
  "info@cacpenaltyassessment.com",
  "support@cacpenaltyassessment.com",
];

export default function EmailSendV1() {
  const [theme, setTheme] = useState("light");
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    username: "",
  });
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [feedback, setFeedback] = useState<FeedbackState>({
    show: false,
    type: "success",
    message: "",
    details: "",
  });
  const [formData, setFormData] = useState({
    sender: "",
    receiver: "",
    subject: "",
    body: "",
    firstName: "",
    support: "helpdesk@cac.gov.ng",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [logoUrl, setLogoUrl] = useState("");

  // Email limit hook
  const {
    dailyLimit,
    emailsSent,
    remainingEmails,
    canSendEmail,
    showWarning,
    resetTime,
    isLoading: emailLimitLoading,
    error: emailLimitError,
    refreshEmailCount,
    setEmailsSentForTest,
    resetForTest,
  } = useEmailLimit(auth.username, 20);

  // Inactivity timer - logout after 5 minutes of inactivity
  useInactivityTimer(5 * 60 * 1000, () => {
    if (auth.isAuthenticated) {
      handleLogout();
      showFeedback("Session expired due to inactivity", "error");
    }
  });

  const getLogoUrl = () => {
    return "https://res.cloudinary.com/dprkvmhld/image/upload/v1749902812/cacpenalty-logo_ltxd34.jpg";
  };

  useEffect(() => {
    if (formData.sender) {
      setLogoUrl(getLogoUrl());
    }
  }, [formData.sender]);

  const showFeedback = (message: any, type = "success", details = "") => {
    setFeedback({
      show: true,
      // @ts-ignore
      type,
      message,
      details,
    });
    setTimeout(() => setFeedback({ ...feedback, show: false }), 3000);
  };

  const handleLogin = () => {
    const { username, password } = loginForm;

    if (!username || !password) {
      setErrors({
        ...errors,
        login: "Please enter both username and password",
      });
      return;
    }

    // @ts-ignore
    if (
      ALLOWED_USERS[username] &&
      ALLOWED_USERS[username].password === password
    ) {
      setAuth({ isAuthenticated: true, username });
      setErrors({ ...errors, login: undefined });
      showFeedback("Login successful!", "success", `Welcome, ${username}`);
    } else {
      setErrors({ ...errors, login: "Invalid username or password" });
    }
  };

  const handleLogout = () => {
    setAuth({ isAuthenticated: false, username: "" });
    setLoginForm({ username: "", password: "" });
    setFormData({
      sender: "",
      receiver: "",
      subject: "",
      body: "",
      firstName: "",
      support: "helpdesk@cac.gov.ng",
    });
    setShowPreview(false);
    setIsSuccess(false);
    setErrors({});
  };

  const handleSubmit = async () => {
    // Check email limit before sending
    if (!canSendEmail) {
      showFeedback(
        "Daily email limit reached",
        "error",
        `You have reached your daily limit of ${dailyLimit} emails. Please try again tomorrow.`
      );
      return;
    }

    setIsLoading(true);

    try {
      const emailData = {
        from: formData.sender,
        to: formData.receiver,
        subject: formData.subject,
        firstName: formData.firstName,
        product: "CORPORATE AFFAIRS COMMISSION",
        logoUrl: logoUrl,
        customBody: formData.body,
        support: "helpdesk@cac.gov.ng",
        username: auth.username, // Add username for server-side tracking
      };

      const response = await fetch("/v1/do-not-reply", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(emailData),
      });

      const result = await response.json();

      if (response.ok && result.message === "success") {
        // Refresh email count from server response
        if (result.emailTracking) {
          // The API has already incremented the count, so we just refresh
          await refreshEmailCount();
        }

        setIsSuccess(true);
        setShowPreview(false);

        const tracking = result.emailTracking;
        const remainingAfterSend = tracking?.remainingEmails || 0;

        showFeedback(
          "Email sent successfully!",
          "success",
          `Email sent to ${formData.receiver} from ${formData.sender}. ${remainingAfterSend} emails remaining today.`
        );

        // Reset form after success
        setTimeout(() => {
          setFormData({
            sender: "",
            receiver: "",
            subject: "",
            body: "",
            firstName: "",
            support: "helpdesk@cac.gov.ng",
          });
          setIsSuccess(false);
        }, 5000);
      } else if (response.status === 429) {
        // Handle rate limit error
        showFeedback(
          "Daily email limit exceeded",
          "error",
          result.error ||
            "You have reached your daily email limit. Please try again tomorrow."
        );
        // Refresh count to sync with server
        await refreshEmailCount();
      } else {
        throw new Error(result.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      showFeedback(
        "Failed to send email",
        "error",
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Email limit warning component
  const EmailLimitWarning = () => {
    if (!auth.isAuthenticated) return null;

    // Show loading state for email limit
    if (emailLimitLoading) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
        >
          <div className="flex items-center gap-2 text-blue-800 dark:text-blue-200">
            <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="font-medium">Loading email count...</span>
          </div>
        </motion.div>
      );
    }

    // Show error state
    if (emailLimitError) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <XCircle size={20} />
            <span className="font-medium">Error loading email count</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-300 mt-1">
            {emailLimitError}
          </p>
          <button
            onClick={refreshEmailCount}
            className="text-sm text-red-600 dark:text-red-300 underline mt-2"
          >
            Retry
          </button>
        </motion.div>
      );
    }

    if (!canSendEmail) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg"
        >
          <div className="flex items-center gap-2 text-red-800 dark:text-red-200">
            <XCircle size={20} />
            <span className="font-medium">Daily Email Limit Reached</span>
          </div>
          <p className="text-sm text-red-600 dark:text-red-300 mt-1">
            You have sent {emailsSent} of {dailyLimit} emails today. Please try
            again tomorrow.
          </p>
        </motion.div>
      );
    }

    if (showWarning) {
      return (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg"
        >
          <div className="flex items-center gap-2 text-amber-800 dark:text-amber-200">
            <AlertTriangle size={20} />
            <span className="font-medium">Email Limit Warning</span>
          </div>
          <p className="text-sm text-amber-600 dark:text-amber-300 mt-1">
            You have {remainingEmails} emails remaining today out of{" "}
            {dailyLimit}.
          </p>
        </motion.div>
      );
    }

    return null;
  };

  // Test controls (only in development)
  const TestControls = () => {
    if (process.env.NODE_ENV !== "development" || !auth.isAuthenticated)
      return null;

    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
      >
        <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-3">
          Test Controls (Development Only)
        </h3>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEmailsSentForTest(15)}
          >
            Set to 15 sent
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEmailsSentForTest(19)}
          >
            Set to 19 sent (warning)
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEmailsSentForTest(20)}
          >
            Set to limit (20)
          </Button>
          <Button variant="outline" size="sm" onClick={resetForTest}>
            Reset count
          </Button>
        </div>
      </motion.div>
    );
  };

  // Render appropriate screen based on state
  if (!auth.isAuthenticated) {
    return (
      <LoginScreen
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        errors={errors}
        feedback={feedback}
      />
    );
  }

  if (isSuccess) {
    return <SuccessScreen formData={formData} feedback={feedback} />;
  }

  if (showPreview) {
    return (
      <EmailPreview
        formData={formData}
        logoUrl={logoUrl}
        onBack={() => setShowPreview(false)}
        onSend={handleSubmit}
        isLoading={isLoading}
        theme={theme}
        setTheme={setTheme}
        auth={auth}
        handleLogout={handleLogout}
        feedback={feedback}
      />
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "dark bg-slate-950"
          : "bg-gradient-to-br from-slate-50 to-white"
      }`}
    >
      <FeedbackMessage feedback={feedback} />

      <header className="sticky top-0 z-30 w-full backdrop-blur-xl bg-white/90 dark:bg-black/90 border-b border-slate-200/50 dark:border-slate-800/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white">
              <Mail size={20} />
            </div>
            <span className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              EmailTemplates
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="gap-1">
              <UserCheck size={12} />
              {auth.username}
            </Badge>

            {/* Email count badge */}
            <Badge
              variant={
                !canSendEmail
                  ? "destructive"
                  : showWarning
                  ? "secondary"
                  : "default"
              }
              className="gap-1"
            >
              <Mail size={12} />
              {emailsSent}/{dailyLimit}
            </Badge>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleLogout}
              className="gap-2"
            >
              <LogOut size={16} />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Send Professional Email
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Create and send branded emails with ease
            </p>
          </motion.div>

          <TestControls />
          <EmailLimitWarning />

          <EmailForm
            formData={formData}
            setFormData={setFormData}
            errors={errors}
            setErrors={setErrors}
            allowedSenders={ALLOWED_SENDERS}
            onPreview={() => setShowPreview(true)}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            disabled={!canSendEmail}
          />
        </div>
      </main>
    </div>
  );
}
