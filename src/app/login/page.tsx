"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Loader2, 
  ShieldCheck,
  Zap,
  Globe,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      // Cleanup legacy token if exists
      localStorage.removeItem("auth_token");
      
      router.push("/dashboard");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-all duration-700 font-sans">
      
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[140px]" />
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-[480px] space-y-10">
         {/* Simple Logo */}
         <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-[1.25rem] bg-indigo-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-200">
               <Mail className="w-8 h-8" />
            </div>
            <div className="text-center">
               <h1 className="text-3xl font-black tracking-tighter">EmailEngine</h1>
               <p className="text-sm font-semibold tracking-widest text-slate-400 uppercase">Enterprise Login</p>
            </div>
         </div>

         <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all duration-500 overflow-hidden">
            <CardHeader className="p-10 pb-6 text-center">
               <CardTitle className="text-2xl font-black tracking-tight">Welcome Back</CardTitle>
               <CardDescription>Enter your workspace credentials to continue.</CardDescription>
            </CardHeader>
            <CardContent className="px-10 pb-10 space-y-6">
               {error && (
                  <motion.div 
                     initial={{ opacity: 0, y: -10 }}
                     animate={{ opacity: 1, y: 0 }}
                     className="p-4 bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20 rounded-2xl text-red-600 text-sm font-bold flex gap-3 items-center"
                  >
                     <AlertCircle className="w-5 h-5 shrink-0" />
                     {error}
                  </motion.div>
               )}
               
               <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-3">
                     <Label htmlFor="email">Work Email</Label>
                     <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input 
                           id="email" 
                           type="email" 
                           placeholder="admin@company.com" 
                           className="pl-12 h-14 rounded-2xl bg-slate-50 border-none dark:bg-slate-950/50"
                           value={email}
                           onChange={(e) => setEmail(e.target.value)}
                           required 
                        />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <div className="flex items-center justify-between">
                        <Label htmlFor="password">Password</Label>
                        <Link href="/api/auth/reset" className="text-xs font-bold text-indigo-600 hover:underline">Forgot?</Link>
                     </div>
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
                     className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.75rem] font-black text-xl shadow-xl shadow-indigo-100 dark:shadow-none translate-y-0 active:scale-95 transition-all mt-4 group"
                  >
                     {isLoading ? (
                        <Loader2 className="w-6 h-6 animate-spin" />
                     ) : (
                        <>Sign In <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" /></>
                     )}
                  </Button>
               </form>
               <p className="text-center text-sm text-slate-500">
                  New here? <Link href="/onboarding" className="text-indigo-600 font-bold hover:underline">Create a Workspace</Link>
               </p>
            </CardContent>
         </Card>

         {/* Trust Badges */}
         <div className="flex items-center justify-center gap-6 opacity-30">
            <ShieldCheck className="w-6 h-6" />
            <Zap className="w-6 h-6" />
            <Globe className="w-6 h-6" />
         </div>
      </div>
    </div>
  );
}
