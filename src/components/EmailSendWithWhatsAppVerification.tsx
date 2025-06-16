// components/EmailSend.tsx

"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Send,
  ArrowLeft,
  Sun,
  Moon,
  User,
  AtSign,
  FileText,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  Eye,
  ArrowRight,
  Edit,
  Lock,
  Shield,
  Phone,
  LogOut,
  UserCheck,
  MessageCircle,
  Clock,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { sendWhatsAppMessage } from "@/utils/wa-messages";

// Mock UI components - replace with your actual UI components
const Card = ({ children, className = "" }: any) => (
  <div
    className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: any) => (
  <div className={`p-6 pb-4 ${className}`}>{children}</div>
);

const CardContent = ({ children, className = "" }: any) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = "" }: any) => (
  <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>
);

const CardDescription = ({ children, className = "" }: any) => (
  <p className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);

const Button = ({
  children,
  onClick,
  disabled = false,
  variant = "default",
  size = "default",
  className = "",
}: any) => {
  const baseClasses =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
    outline:
      "border border-gray-300 bg-transparent hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-800",
    ghost: "hover:bg-gray-100 dark:hover:bg-gray-800",
    destructive: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    icon: "p-2",
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      // @ts-ignore
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {children}
    </button>
  );
};

const Input = ({
  value,
  onChange,
  placeholder,
  type = "text",
  className = "",
  id,
  disabled = false,
}: any) => (
  <input
    id={id}
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    disabled={disabled}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white ${className}`}
  />
);

const Textarea = ({
  value,
  onChange,
  placeholder,
  rows = 4,
  className = "",
  id,
}: any) => (
  <textarea
    id={id}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white resize-none ${className}`}
  />
);

const Select = ({ children, value, onValueChange }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md text-left bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {value || "Select an option"}
      </button>
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-lg">
          {React.Children.map(children, (child) =>
            React.cloneElement(child, {
              onClick: () => {
                onValueChange(child.props.value);
                setIsOpen(false);
              },
            })
          )}
        </div>
      )}
    </div>
  );
};

const SelectItem = ({ children, value, onClick }: any) => (
  <div
    onClick={onClick}
    className="px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
  >
    {children}
  </div>
);

const Label = ({ children, htmlFor, className = "" }: any) => (
  <label
    htmlFor={htmlFor}
    className={`block text-sm font-medium text-gray-700 dark:text-gray-300 ${className}`}
  >
    {children}
  </label>
);

const Badge = ({ children, variant = "default", className = "" }: any) => {
  const variants = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
    secondary: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  };

  return (
    <span
      // @ts-ignore
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

// Environment variables simulation (replace with actual env vars)
const ALLOWED_USERS = {
  admin: "admin123",
  user1: "password1",
  manager: "manager456",
};

const WHATSAPP_NUMBERS = ["+2347066324306", "+2348068855515"];

const ALLOWED_SENDERS = [
  "info@cacpenaltyassessment.com",
  "support@cacpenaltyassessment.com",
];

interface FormData {
  sender: string;
  receiver: string;
  subject: string;
  body: string;
  firstName: string;
  support?: string;
}

interface FormErrors {
  sender?: string;
  receiver?: string;
  subject?: string;
  body?: string;
  firstName?: string;
  general?: string;
  login?: string;
  verification?: string;
  support?: string;
  phoneNumber?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  username: string;
}

interface VerificationState {
  isRequired: boolean;
  code: string;
  sentCode: string | null;
  attempts: number;
  maxAttempts: number;
  phoneNumber: string;
}

interface FeedbackState {
  show: boolean;
  type: "success" | "error" | "info";
  message: string;
  details?: string;
}

export default function EmailSend() {
  const [theme, setTheme] = useState("light");
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    username: "",
  });
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [verification, setVerification] = useState<VerificationState>({
    isRequired: false,
    code: "",
    sentCode: "",
    attempts: 0,
    maxAttempts: 3,
    phoneNumber: "",
  });
  const [feedback, setFeedback] = useState<FeedbackState>({
    show: false,
    type: "success",
    message: "",
    details: "",
  });

  const [formData, setFormData] = useState<FormData>({
    sender: "",
    receiver: "",
    subject: "",
    body: "",
    firstName: "",
    support: "helpdesk@cac.gov.ng",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [logoUrl, setLogoUrl] = useState<string>("");

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getLogoUrl = () => {
    return "https://res.cloudinary.com/dprkvmhld/image/upload/v1749902812/cacpenalty-logo_ltxd34.jpg";
  };

  useEffect(() => {
    if (formData.sender) {
      setLogoUrl(getLogoUrl());
    }
  }, [formData.sender]);

  // Authentication functions
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
    if (ALLOWED_USERS[username] && ALLOWED_USERS[username] === password) {
      setAuth({ isAuthenticated: true, username });
      setErrors({ ...errors, login: undefined });
      setFeedback({
        show: true,
        type: "success",
        message: "Login successful!",
        details: `Welcome, ${username}`,
      });
      setTimeout(() => setFeedback({ ...feedback, show: false }), 3000);
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
    });
    setShowPreview(false);
    setVerification({
      isRequired: false,
      code: "",
      sentCode: "",
      attempts: 0,
      maxAttempts: 3,
      phoneNumber: "",
    });
  };

  const verifyCode = () => {
    if (verification.code === verification.sentCode) {
      setVerification((prev) => ({ ...prev, isRequired: false }));
      handleActualSubmit();
    } else {
      const newAttempts = verification.attempts + 1;
      if (newAttempts >= verification.maxAttempts) {
        setErrors({
          ...errors,
          verification:
            "Maximum verification attempts exceeded. Please try again later.",
        });
        setVerification((prev) => ({ ...prev, attempts: newAttempts }));
      } else {
        setErrors({
          ...errors,
          verification: `Invalid code. ${
            verification.maxAttempts - newAttempts
          } attempts remaining.`,
        });
        setVerification((prev) => ({ ...prev, attempts: newAttempts }));
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.sender) {
      newErrors.sender = "Sender is required";
    } else if (!ALLOWED_SENDERS.includes(formData.sender)) {
      newErrors.sender = "Please select a valid sender email";
    }

    if (!formData.receiver) {
      newErrors.receiver = "Receiver email is required";
    } else if (!emailRegex.test(formData.receiver)) {
      newErrors.receiver = "Please enter a valid email address";
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required";
    }

    if (!formData.body.trim()) {
      newErrors.body = "Email body is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isFormValid = (): boolean => {
    return (
      ALLOWED_SENDERS.includes(formData.sender) &&
      emailRegex.test(formData.receiver) &&
      formData.firstName.trim() !== "" &&
      formData.subject.trim() !== "" &&
      formData.body.trim() !== ""
    );
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    // Start verification process
    setVerification((prev) => ({
      ...prev,
      isRequired: false,
      code: "",
      attempts: 0,
    }));
    await sendVerificationCode();
  };

  const handleActualSubmit = async () => {
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
        setIsSuccess(true);
        setShowPreview(false);

        setFeedback({
          show: true,
          type: "success",
          message: "Email sent successfully!",
          details: `Email sent to ${formData.receiver} from ${formData.sender}`,
        });

        // Reset form after success
        setTimeout(() => {
          setFormData({
            sender: "",
            receiver: "",
            subject: "",
            body: "",
            firstName: "",
          });
          setIsSuccess(false);
          setFeedback({ ...feedback, show: false });
        }, 5000);
      } else {
        throw new Error(result.error || "Failed to send email");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      setFeedback({
        show: true,
        type: "error",
        message: "Failed to send email",
        details:
          error instanceof Error ? error.message : "Unknown error occurred",
      });
      setTimeout(() => setFeedback({ ...feedback, show: false }), 5000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const FeedbackMessage = () => {
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

  // Login Screen
  if (!auth.isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-black flex items-center justify-center">
        <FeedbackMessage />
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center text-white mx-auto mb-4">
                  <Shield size={24} />
                </div>
                <CardTitle className="text-2xl">Secure Access</CardTitle>
                <CardDescription>
                  Please login to access the email system
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username" className="flex items-center gap-2">
                    <User size={16} />
                    Username
                  </Label>
                  <Input
                    id="username"
                    value={loginForm.username}
                    onChange={(e: any) =>
                      setLoginForm({ ...loginForm, username: e.target.value })
                    }
                    placeholder="Enter your username"
                    className={errors.login ? "border-red-500" : ""}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="flex items-center gap-2">
                    <Lock size={16} />
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e: any) =>
                      setLoginForm({ ...loginForm, password: e.target.value })
                    }
                    placeholder="Enter your password"
                    className={errors.login ? "border-red-500" : ""}
                  />
                </div>
                {errors.login && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle size={14} />
                    {errors.login}
                  </p>
                )}
                <Button onClick={handleLogin} className="w-full gap-2">
                  <UserCheck size={16} />
                  Login
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const isNumberAuthorized = (phoneNumber: string): boolean => {
    const normalizedInput = phoneNumber.replace(/[\s\-]/g, "");
    return WHATSAPP_NUMBERS.some((authorizedNumber) => {
      const normalizedAuthorized = authorizedNumber.replace(/[\s\-]/g, "");
      return normalizedInput === normalizedAuthorized;
    });
  };

  const sendVerificationCode = async () => {
    // Clear previous errors
    setErrors({ ...errors, phoneNumber: "", verification: "" });

    // Validate phone number first
    if (!verification.phoneNumber) {
      setErrors({ ...errors, phoneNumber: "Please enter your phone number" });
      return;
    }

    if (!isNumberAuthorized(verification.phoneNumber)) {
      setFeedback({
        show: true,
        type: "error",
        message: "Unauthorized Number",
        details:
          "This phone number is not authorized to receive verification codes",
      });
      setTimeout(() => setFeedback({ ...feedback, show: false }), 5000);
      return;
    }

    const code = generateVerificationCode();
    setVerification((prev) => ({ ...prev, sentCode: code }));

    // Show loading state
    setFeedback({
      show: true,
      type: "info",
      message: "Sending verification code...",
      details: "Please wait while we send your code",
    });

    try {
      const message = `Your email verification code is: ${code}`;
      const result = await sendWhatsAppMessage(
        verification.phoneNumber,
        message
      );

      if (result.success) {
        setFeedback({
          show: true,
          type: "success",
          message: "Verification code sent!",
          details: `Code sent to ${verification.phoneNumber}`,
        });
      } else {
        throw new Error(result.error || "Failed to send message");
      }
    } catch (error) {
      console.error("WhatsApp automation error:", error);

      // Reset sent code on error
      setVerification((prev) => ({ ...prev, sentCode: null }));

      let errorMessage = "Failed to send verification code";
      let errorDetails = "Please try again later";

      if (error instanceof Error) {
        if (error.message.includes("initialization failed")) {
          errorMessage = "WhatsApp Service Unavailable";
          errorDetails =
            "Please contact support to initialize WhatsApp service";
        } else if (error.message.includes("Unauthorized")) {
          errorMessage = "Unauthorized Number";
          errorDetails = "This phone number is not authorized";
        } else {
          errorDetails = error.message;
        }
      }

      setFeedback({
        show: true,
        type: "error",
        message: errorMessage,
        details: errorDetails,
      });
    }

    setTimeout(() => setFeedback({ ...feedback, show: false }), 5000);
  };

  // Updated Verification Screen Component
  if (verification.isRequired) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-black flex items-center justify-center">
        <FeedbackMessage />
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
              <CardHeader className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 flex items-center justify-center text-white mx-auto mb-4">
                  <MessageCircle size={24} />
                </div>
                <CardTitle className="text-2xl">Verify Your Identity</CardTitle>
                <CardDescription>
                  Enter your authorized WhatsApp number to receive the
                  verification code
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Phone Number Input */}
                <div className="space-y-2">
                  <Label
                    htmlFor="phoneNumber"
                    className="flex items-center gap-2"
                  >
                    <Phone size={16} />
                    WhatsApp Number
                  </Label>
                  <Input
                    id="phoneNumber"
                    value={verification.phoneNumber || ""}
                    onChange={(e: any) => {
                      setVerification({
                        ...verification,
                        phoneNumber: e.target.value,
                      });
                      // Clear error when user starts typing
                      if (errors.phoneNumber) {
                        setErrors({ ...errors, phoneNumber: "" });
                      }
                    }}
                    placeholder="+1234567890"
                    className={errors.phoneNumber ? "border-red-500" : ""}
                    disabled={!!verification.sentCode} // Lock input after sending code
                  />
                  {errors.phoneNumber && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.phoneNumber}
                    </p>
                  )}
                </div>

                {/* Send Code Button */}
                {!verification.sentCode && (
                  <Button
                    onClick={sendVerificationCode}
                    disabled={!verification.phoneNumber}
                    className="w-full gap-2"
                  >
                    <MessageCircle size={16} />
                    Send Verification Code
                  </Button>
                )}

                {/* Verification Code Input (only show after code is sent) */}
                {verification.sentCode && (
                  <div className="space-y-2">
                    <Label
                      htmlFor="verificationCode"
                      className="flex items-center gap-2"
                    >
                      <Shield size={16} />
                      Verification Code
                    </Label>
                    <Input
                      id="verificationCode"
                      value={verification.code}
                      onChange={(e: any) => {
                        setVerification({
                          ...verification,
                          code: e.target.value,
                        });
                        // Clear error when user starts typing
                        if (errors.verification) {
                          setErrors({ ...errors, verification: "" });
                        }
                      }}
                      placeholder="Enter 6-digit code"
                      maxLength={6}
                      className={errors.verification ? "border-red-500" : ""}
                      autoFocus
                    />
                    {errors.verification && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.verification}
                      </p>
                    )}
                  </div>
                )}

                {/* Action Buttons (only show after code is sent) */}
                {verification.sentCode && (
                  <div className="flex gap-2">
                    <Button
                      onClick={verifyCode}
                      disabled={
                        verification.code.length !== 6 ||
                        verification.attempts >= verification.maxAttempts
                      }
                      className="flex-1 gap-2"
                    >
                      <CheckCircle size={16} />
                      Verify & Send
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        // Reset and resend
                        setVerification({
                          ...verification,
                          sentCode: null,
                          code: "",
                        });
                        sendVerificationCode();
                      }}
                      className="gap-2"
                    >
                      <Clock size={16} />
                      Resend
                    </Button>
                  </div>
                )}

                {/* Attempts Counter */}
                {verification.sentCode && verification.attempts > 0 && (
                  <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    Attempts: {verification.attempts}/{verification.maxAttempts}
                    {verification.attempts >= verification.maxAttempts && (
                      <p className="text-red-500 mt-1">
                        Maximum attempts reached
                      </p>
                    )}
                  </div>
                )}

                {/* Help Text */}
                {verification.sentCode && (
                  <div className="text-xs text-gray-500 text-center">
                    Check your WhatsApp for the 6-digit verification code
                  </div>
                )}

                {/* Back Button */}
                <Button
                  variant="ghost"
                  onClick={() =>
                    setVerification({
                      ...verification,
                      isRequired: false,
                      phoneNumber: "",
                      sentCode: null,
                      code: "",
                      attempts: 0,
                    })
                  }
                  className="w-full gap-2"
                >
                  <ArrowLeft size={16} />
                  Back to Email
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // Email Preview Component
  const EmailPreview = () => (
    <div className="bg-gray-50 rounded-lg p-4 max-w-md mx-auto">
      {/* Header with gradient background matching CustomEmail */}
      <div
        className="rounded-t-2xl p-8 text-center mb-4 relative"
        style={{
          background: "linear-gradient(135deg, #1e7c3e 0%, #166534 100%)",
        }}
      >
        {/* Logo container with enhanced styling */}
        <div className="mb-6 inline-block relative">
          {logoUrl && (
            <div
              className="inline-block relative"
              style={{
                filter: "drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))",
              }}
            >
              <img
                src={logoUrl}
                alt="Company Logo"
                className="w-20 h-20 mx-auto rounded-3xl object-cover"
                style={{
                  border: "4px solid white",
                  boxShadow: `
                  0 16px 40px rgba(0, 0, 0, 0.2),
                  0 8px 16px rgba(0, 0, 0, 0.1),
                  inset 0 1px 0 rgba(255, 255, 255, 0.2)
                `,
                }}
              />
            </div>
          )}
        </div>

        {/* Brand name with enhanced typography */}
        <h2
          className="text-white font-bold uppercase tracking-widest text-base leading-tight"
          style={{
            textShadow: `
            0 2px 4px rgba(0, 0, 0, 0.3),
            0 4px 8px rgba(0, 0, 0, 0.2),
            0 8px 16px rgba(0, 0, 0, 0.1)
          `,
            WebkitTextStroke: "0.5px rgba(255, 255, 255, 0.1)",
          }}
        >
          CORPORATE AFFAIRS COMMISSION
        </h2>
      </div>

      {/* Main content container with white background and shadow */}
      <div
        className="bg-white rounded-2xl relative z-10 p-6 space-y-6"
        style={{
          marginTop: "-20px",
          boxShadow: `
          0 20px 25px -5px rgba(0, 0, 0, 0.1),
          0 10px 10px -5px rgba(0, 0, 0, 0.04)
        `,
        }}
      >
        {/* Greeting section */}
        <div className="text-center">
          <p className="text-gray-900 text-xl font-bold tracking-tight">
            Hello, {formData.firstName}! 👋
          </p>
        </div>

        {/* Subject section with badge */}
        {formData.subject && (
          <div className="text-center space-y-3">
            <div className="inline-block">
              <span
                className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider"
                style={{
                  backgroundColor: "#dcfce7",
                  color: "#1e7c3e",
                  border: "1px solid #22c55e",
                }}
              >
                OFFICIAL COMMUNICATION
              </span>
            </div>
            <h3 className="text-gray-900 text-2xl font-extrabold tracking-tight leading-tight">
              {formData.subject}
            </h3>
          </div>
        )}

        {/* Content section with green accent */}
        <div
          className="rounded-xl p-6 relative"
          style={{
            backgroundColor: "#f0fdf4",
            borderLeft: "4px solid #1e7c3e",
          }}
        >
          <p className="text-gray-900 text-sm leading-relaxed whitespace-pre-wrap">
            {formData.body}
          </p>
        </div>

        {/* Support section if support email exists */}
        {formData.support && (
          <div
            className="rounded-xl p-6 text-center"
            style={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
            }}
          >
            <p className="text-gray-900 text-base font-semibold mb-2">
              Need Help?
            </p>
            <p className="text-gray-600 text-sm">
              Our support team is here to assist you. Contact us at{" "}
              <span className="text-green-700 font-semibold">
                {formData.support}
              </span>
            </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center pt-2">
          <div
            className="inline-block px-8 py-4 rounded-lg cursor-pointer transition-all duration-200"
            style={{
              backgroundColor: "#1e7c3e",
              boxShadow: "0 4px 14px 0 rgba(30, 124, 62, 0.39)",
            }}
          >
            <span className="text-white text-base font-semibold">
              Access CAC Portal
            </span>
          </div>
        </div>
      </div>

      {/* Footer section */}
      <div
        className="rounded-b-2xl p-8 text-center mt-4"
        style={{ backgroundColor: "#1e7c3e" }}
      >
        <p className="text-white text-sm font-semibold uppercase tracking-wide mb-2">
          Securely powered by CORPORATE AFFAIRS COMMISSION
        </p>
        <p className="text-gray-200 text-xs">
          Federal Republic of Nigeria • Unity and Faith, Peace and Progress
        </p>
      </div>
    </div>
  );

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-black">
        <FeedbackMessage />
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
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Welcome, {auth.username}
              </span>
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
                Email Preview
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                Review your email before sending
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="space-y-6"
            >
              <Card className="shadow-lg border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText size={20} className="text-blue-600" />
                    Email Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        From
                      </Label>
                      <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {formData.sender}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        To
                      </Label>
                      <p className="text-sm font-mono bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {formData.receiver}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        First Name
                      </Label>
                      <p className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {formData.firstName}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        Subject
                      </Label>
                      <p className="text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
                        {formData.subject}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye size={20} className="text-blue-600" />
                    Email Preview
                  </CardTitle>
                  <CardDescription>
                    This is how your email will appear to the recipient
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EmailPreview />
                </CardContent>
              </Card>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(false)}
                  className="gap-2"
                >
                  <Edit size={16} />
                  Edit Email
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="gap-2 min-w-[120px]"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Email
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </main>
      </div>
    );
  }

  // Success Screen
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 flex items-center justify-center">
        <FeedbackMessage />
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

  // Main Email Form
  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "dark bg-slate-950"
          : "bg-gradient-to-br from-slate-50 to-white"
      }`}
    >
      <FeedbackMessage />

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

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="shadow-lg border-0 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare size={20} className="text-blue-600" />
                  Email Composition
                </CardTitle>
                <CardDescription>
                  All fields are required. Your email will be sent securely.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="sender" className="flex items-center gap-2">
                      <AtSign size={16} />
                      Sender Email *
                    </Label>
                    <Select
                      value={formData.sender}
                      onValueChange={(value: any) =>
                        handleInputChange("sender", value)
                      }
                    >
                      {ALLOWED_SENDERS.map((email) => (
                        <SelectItem key={email} value={email}>
                          {email}
                        </SelectItem>
                      ))}
                    </Select>
                    {errors.sender && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.sender}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="receiver"
                      className="flex items-center gap-2"
                    >
                      <Mail size={16} />
                      Recipient Email *
                    </Label>
                    <Input
                      id="receiver"
                      type="email"
                      value={formData.receiver}
                      onChange={(e: any) =>
                        handleInputChange("receiver", e.target.value)
                      }
                      placeholder="recipient@example.com"
                      className={errors.receiver ? "border-red-500" : ""}
                    />
                    {errors.receiver && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {errors.receiver}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="flex items-center gap-2"
                  >
                    <User size={16} />
                    Recipient First Name *
                  </Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e: any) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    placeholder="Enter recipient's first name"
                    className={errors.firstName ? "border-red-500" : ""}
                  />
                  {errors.firstName && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject" className="flex items-center gap-2">
                    <FileText size={16} />
                    Email Subject *
                  </Label>
                  <Input
                    id="subject"
                    value={formData.subject}
                    onChange={(e: any) =>
                      handleInputChange("subject", e.target.value)
                    }
                    placeholder="Enter email subject"
                    className={errors.subject ? "border-red-500" : ""}
                  />
                  {errors.subject && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.subject}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="body" className="flex items-center gap-2">
                    <MessageSquare size={16} />
                    Email Content *
                  </Label>
                  <Textarea
                    id="body"
                    value={formData.body}
                    onChange={(e: any) =>
                      handleInputChange("body", e.target.value)
                    }
                    placeholder="Enter your email message here..."
                    rows={6}
                    className={errors.body ? "border-red-500" : ""}
                  />
                  {errors.body && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle size={14} />
                      {errors.body}
                    </p>
                  )}
                </div>

                {errors.general && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                      <AlertCircle size={16} />
                      {errors.general}
                    </p>
                  </div>
                )}

                <div className="flex gap-4 pt-6">
                  <Button
                    variant="outline"
                    onClick={() => setShowPreview(true)}
                    disabled={!isFormValid()}
                    className="flex-1 gap-2"
                  >
                    <Eye size={16} />
                    Preview Email
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={!isFormValid() || isLoading}
                    className="flex-1 gap-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send size={16} />
                        Send Email
                        <ArrowRight size={16} />
                      </>
                    )}
                  </Button>
                </div>

                <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    🔒 All emails are sent securely and require verification
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
