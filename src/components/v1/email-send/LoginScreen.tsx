import React from "react";
import { motion } from "framer-motion";
import { Shield, User, Lock, UserCheck, AlertCircle } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Button,
  Input,
  Label,
} from "./UiComponents";
import FeedbackMessage from "./FeedbackMessage";

interface FeedbackState {
  show: boolean;
  type: "success" | "error" | "info";
  message: string;
  details?: string;
}

export default function LoginScreen({
  loginForm,
  setLoginForm,
  handleLogin,
  errors,
  feedback,
}: any) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-black flex items-center justify-center">
      <FeedbackMessage feedback={feedback} />
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
                  onKeyPress={(e: any) => {
                    if (e.key === "Enter") {
                      handleLogin();
                    }
                  }}
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
