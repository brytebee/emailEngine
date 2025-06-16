// components/v1/email-send/EmailPreview.tsx

import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Sun,
  Moon,
  LogOut,
  Eye,
  Edit,
  Send,
  FileText,
  UserCheck,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Button,
  Label,
  Badge,
} from "./UiComponents";
import FeedbackMessage from "./FeedbackMessage";

interface FormData {
  sender: string;
  receiver: string;
  subject: string;
  body: string;
  firstName: string;
  support?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  username: string;
}

interface FeedbackState {
  show: boolean;
  type: "success" | "error" | "info";
  message: string;
  details?: string;
}

interface EmailPreviewProps {
  formData: FormData;
  logoUrl: string;
  onBack: () => void;
  onSend: () => void;
  isLoading: boolean;
  theme: string;
  setTheme: (theme: string) => void;
  auth: AuthState;
  handleLogout: () => void;
  feedback: FeedbackState;
}

// Email Preview Component
const EmailPreview = ({
  formData,
  logoUrl,
}: {
  formData: FormData;
  logoUrl: string;
}) => (
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

// Feedback Message Component
// const FeedbackMessage = ({ feedback }: { feedback: FeedbackState }) => {
//   if (!feedback.show) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: -50 }}
//       animate={{ opacity: 1, y: 0 }}
//       exit={{ opacity: 0, y: -50 }}
//       className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
//         feedback.type === "success"
//           ? "bg-green-50 border border-green-200 text-green-800"
//           : feedback.type === "error"
//           ? "bg-red-50 border border-red-200 text-red-800"
//           : "bg-blue-50 border border-blue-200 text-blue-800"
//       }`}
//     >
//       <div className="flex items-start gap-3">
//         <div className="flex-1">
//           <p className="font-medium">{feedback.message}</p>
//           {feedback.details && (
//             <p className="text-sm mt-1 opacity-80">{feedback.details}</p>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

export default function EmailPreviewComponent({
  formData,
  logoUrl,
  onBack,
  onSend,
  isLoading,
  theme,
  setTheme,
  auth,
  handleLogout,
  feedback,
}: EmailPreviewProps) {
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
                <EmailPreview formData={formData} logoUrl={logoUrl} />
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-center">
              <Button variant="outline" onClick={onBack} className="gap-2">
                <Edit size={16} />
                Edit Email
              </Button>
              <Button
                onClick={onSend}
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
