"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import {
  Mail,
  CheckCircle2,
  ArrowRight,
  Loader2,
  Lock,
  Zap,
  CreditCard,
  ShieldCheck,
  Building,
  User,
  ChevronRight,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function OnboardingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get("plan") || "silver";

  const { data: session, status } = useSession();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Start as true to check session
  const [error, setError] = useState<string | null>(null);

  // Step 1: Info
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [orgName, setOrgName] = useState("");
  const [token, setToken] = useState("");

  // Step 2: Plan
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);

  const [plans, setPlans] = useState<Record<string, { price: number; emails: string; setup: number }>>({
    silver: { price: 15000, emails: "5,000", setup: 10000 },
    gold: { price: 45000, emails: "25,000", setup: 10000 },
    premium: { price: 95000, emails: "Unlimited", setup: 10000 },
  });

  useEffect(() => {
    // Fetch dynamic pricing regardless of session state
    fetch("/api/plans")
      .then(res => res.json())
      .then(data => { if (!data.error) setPlans(data); })
      .catch(() => {});

    // Don't act while NextAuth is still resolving
    if (status === "loading") return;

    if (status === "authenticated") {
      const resumeOnboarding = async () => {
        try {
          const res = await fetch("/api/dashboard/profile", { headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' } });
          if (res.ok) {
            const userData = await res.json();

            // Already fully set up — send them straight to the dashboard
            if (userData.setupPaid) {
              router.replace("/dashboard");
              return;
            }

            // Pre-fill from existing record and skip registration step
            setEmail(userData.email || "");
            setFullName(userData.fullName || "");
            setOrgName(userData.orgName || "");
            setStep(2);
          }
        } catch (e) {
          console.error("Resume onboarding failed", e);
        } finally {
          setIsLoading(false);
        }
      };
      resumeOnboarding();
    } else if (status === "unauthenticated") {
      // New visitor — show the registration form
      setIsLoading(false);
    }
  }, [status, router]);

  // Block ALL rendering until we know who this user is
  if (status === "loading" || isLoading) {
    return (
      <div className="fixed inset-0 bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-5">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-indigo-100 dark:border-indigo-900/30 rounded-full" />
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600 absolute top-3 left-3" />
        </div>
        <p className="text-xs font-black tracking-[0.3em] text-slate-400 uppercase animate-pulse">
          Initializing
        </p>
      </div>
    );
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName, orgName }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Registration failed");

      setToken(data.token);
      localStorage.setItem("auth_token", data.token);

      // ⏳ Wait 500ms for Google Sheets to propagate the new user row
      // before NextAuth's authorize() tries to find them via getUsers()
      await new Promise((r) => setTimeout(r, 500));

      // Silently sign in — don't throw if it fails; the Bearer token fallback handles billing
      try {
        await signIn("credentials", { redirect: false, email, password });
      } catch (_) {
        // signIn failure is non-fatal here — the Bearer token covers payment initiation
        console.warn("Silent signIn after registration failed (non-fatal)");
      }

      // Clear any old tour data to ensure a fresh experience for the new account
      localStorage.removeItem("tour_completed");
      sessionStorage.removeItem("tour_ran");

      setStep(2);
      setIsLoading(false);
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const handleInitializePayment = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/dashboard/billing/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include token for new users who registered but haven't signed in yet via NextAuth
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          planId: selectedPlan,
          isInitialSetup: true,
        }),
      });

      const data = await res.json();
      if (!res.ok)
        throw new Error(data.error || "Payment initialization failed");

      // Redirect to Paystack
      window.location.href = data.authorization_url;
    } catch (err: any) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 lg:p-12 transition-all duration-700 font-sans">
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-40 -left-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-blue-500/10 rounded-full blur-[80px]" />
      </div>

      <div className="w-full max-w-4xl grid lg:grid-cols-5 gap-12 items-start shrink-0">
        {/* Left: Progress Sidebar (Desktop Only) */}
        <div className="lg:col-span-2 space-y-12 hidden lg:block">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white">
              EmailEngine
            </span>
          </div>

          <div className="space-y-10">
            {[
              {
                id: 1,
                title: "Your Profile",
                text: "Admin identity for your organization.",
              },
              {
                id: 2,
                title: "Plan Selection",
                text: "Custom infrastructure based on volume.",
              },
              {
                id: 3,
                title: "Secure Checkout",
                text: "One-time setup & initial month.",
              },
            ].map((s) => (
              <div
                key={s.id}
                className={cn(
                  "flex gap-4 transition-all duration-500 relative",
                  step === s.id ? "opacity-100 translate-x-2" : "opacity-40",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 z-10",
                    step >= s.id
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-200"
                      : "bg-slate-200 dark:bg-slate-800 text-slate-400",
                  )}
                >
                  {step > s.id ? <CheckCircle2 className="w-4 h-4" /> : s.id}
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 dark:text-white">
                    {s.title}
                  </h4>
                  <p className="text-sm font-medium text-slate-500 leading-tight">
                    {s.text}
                  </p>
                </div>
                {s.id < 3 && (
                  <div className="absolute left-[15px] top-8 w-[1px] h-10 bg-slate-200 dark:bg-slate-800" />
                )}
              </div>
            ))}
          </div>

          <div className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 shadow-sm space-y-4">
            <ShieldCheck className="w-8 h-8 text-indigo-600" />
            <h3 className="font-bold text-lg">Enterprise Security Built-in</h3>
            <p className="text-sm text-slate-500 leading-relaxed italic">
              Your data is encrypted using AES-256 standard and stored in
              isolated multi-tenant vaults before reached the sheets.
            </p>
          </div>
        </div>

        {/* Right: Main Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="rounded-[3rem] border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                  <CardHeader className="p-10 pb-6">
                    <CardTitle className="text-3xl font-black tracking-tight">
                      Create Workspace
                    </CardTitle>
                    <CardDescription className="text-base">
                      Start the professionalization of your corporate mailing
                      system.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-10 pb-10 space-y-6">
                    {error && (
                      <div className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl text-red-600 text-sm font-bold flex gap-3">
                        <Lock className="w-4 h-4 shrink-0" /> {error}
                      </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                      <div className="space-y-3">
                        <Label htmlFor="orgName">Organization Name</Label>
                        <div className="relative">
                          <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="orgName"
                            placeholder="e.g. Acme Corporation"
                            className="pl-12 h-14 rounded-2xl bg-slate-50 border-none dark:bg-slate-950/50"
                            value={orgName}
                            onChange={(e) => setOrgName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="flex justify-end pt-1">
                          <a
                            href="https://wa.me/2340000000000?text=I%20want%20to%20onboard%20my%20organization%20but%20I%20need%20help%20setting%20up%20a%20domain%20for%20EmailEngine."
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1.5 transition-colors"
                          >
                            No Domain? Get Setup Help{" "}
                            <Globe className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <Label htmlFor="fullName">Your Full Name</Label>
                          <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                              id="fullName"
                              placeholder="John Doe"
                              className="pl-12 h-14 rounded-2xl bg-slate-50 border-none dark:bg-slate-950/50"
                              value={fullName}
                              onChange={(e) => setFullName(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        <div className="space-y-3">
                          <Label htmlFor="email">Work Email</Label>
                          <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                              id="email"
                              type="email"
                              placeholder="john@example.com"
                              className="pl-12 h-14 rounded-2xl bg-slate-50 border-none dark:bg-slate-950/50"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <Label htmlFor="password">
                          Security Key (Password)
                        </Label>
                        <div className="relative">
                          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-12 h-14 rounded-2xl bg-slate-50 border-none dark:bg-slate-950/50"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-xl shadow-xl shadow-indigo-100 dark:shadow-none translate-y-0 active:scale-95 transition-all mt-4"
                      >
                        {isLoading ? (
                          <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                          "Continue Setup"
                        )}
                      </Button>
                    </form>
                    <p className="text-center text-sm text-slate-500">
                      Already a partner?{" "}
                      <Link
                        href="/login"
                        className="text-indigo-600 font-bold hover:underline"
                      >
                        Login here
                      </Link>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="rounded-[3rem] border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                  <CardHeader className="p-10 pb-6 text-center lg:text-left">
                    <CardTitle className="text-3xl font-black tracking-tight">
                      Select Strategy
                    </CardTitle>
                    <CardDescription className="text-base">
                      Choose the infrastructure that matches your email volume.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-10 pb-10 space-y-8">
                    <div className="grid gap-4">
                      {Object.entries(plans).map(([id, p]) => (
                        <button
                          key={id}
                          onClick={() => setSelectedPlan(id)}
                          className={cn(
                            "w-full p-6 lg:p-8 rounded-[2rem] border-2 transition-all text-left flex items-center justify-between group",
                            selectedPlan === id
                              ? "border-indigo-600 bg-indigo-50/20 dark:bg-indigo-500/5 ring-4 ring-indigo-50 dark:ring-indigo-500/10"
                              : "border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 bg-white dark:bg-slate-900",
                          )}
                        >
                          <div className="flex items-center gap-6">
                            <div
                              className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0",
                                selectedPlan === id
                                  ? "bg-indigo-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-800 text-slate-400 group-hover:bg-slate-200",
                              )}
                            >
                              <Zap className="w-6 h-6" />
                            </div>
                            <div>
                              <h4 className="text-xl font-black capitalize">
                                {id}
                              </h4>
                              <p className="text-sm font-medium text-slate-500">
                                {p.emails} emails per month
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                              ₦{p.price.toLocaleString()}
                            </div>
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                              / monthly
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>

                    <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl flex items-start gap-4 border border-slate-100 dark:border-slate-700">
                      <Zap className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
                      <div className="space-y-1 text-sm font-medium text-slate-500 leading-relaxed">
                        A one-time setup fee of{" "}
                        <strong className="text-slate-900 dark:text-white">
                          ₦10,000
                        </strong>{" "}
                        will be added to your first invoice to initialize your
                        custom domain infrastructure.
                      </div>
                    </div>

                    <Button
                      onClick={() => setStep(3)}
                      className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-xl shadow-xl shadow-indigo-100 dark:shadow-none translate-y-0 active:scale-95 transition-all mt-4 group"
                    >
                      Next Step{" "}
                      <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="rounded-[3rem] border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
                  <CardHeader className="p-10 pb-6 text-center lg:text-left">
                    <CardTitle className="text-3xl font-black tracking-tight">
                      Initialize Workspace
                    </CardTitle>
                    <CardDescription className="text-base">
                      Complete the initialization payment to enter the
                      dashboard.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="px-10 pb-10 space-y-10">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span className="text-slate-500">
                          Initial Setup Fee
                        </span>
                        <span className="text-slate-900 dark:text-white">
                          ₦10,000
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-lg font-bold">
                        <span className="text-slate-500 capitalize">
                          {selectedPlan} Plan (1st Month)
                        </span>
                        <span className="text-slate-900 dark:text-white">
                          ₦{plans[selectedPlan].price.toLocaleString()}
                        </span>
                      </div>
                      <div className="h-[1px] bg-slate-100 dark:bg-slate-800 w-full" />
                      <div className="flex items-center justify-between text-3xl font-black tracking-tighter">
                        <span>Total Amount</span>
                        <span className="text-indigo-600">
                          ₦
                          {(
                            plans[selectedPlan].price +
                            plans[selectedPlan].setup
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center grayscale opacity-50 gap-6 my-10">
                      <img
                        src="https://upload.wikimedia.org/wikipedia/commons/1/1f/Paystack.png"
                        alt="Paystack"
                        className="h-8"
                      />
                      <span className="h-6 w-px bg-slate-200" />
                      <CreditCard className="w-8 h-8 text-slate-400" />
                    </div>

                    <Button
                      onClick={handleInitializePayment}
                      disabled={isLoading}
                      className="w-full h-20 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-2xl shadow-xl shadow-indigo-100 dark:shadow-none translate-y-0 active:scale-95 transition-all group"
                    >
                      {isLoading ? (
                        <Loader2 className="w-8 h-8 animate-spin" />
                      ) : (
                        <>
                          Pay Securely{" "}
                          <ArrowRight className="w-8 h-8 ml-4 group-hover:translate-x-2 transition-transform" />
                        </>
                      )}
                    </Button>

                    <div className="flex items-center justify-center gap-3 text-slate-400 font-bold text-sm uppercase tracking-widest">
                      <ShieldCheck className="w-5 h-5 text-green-500" /> Secure
                      Encryption Active
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
