"use client";

import React from "react";
import { 
  Lock, 
  CreditCard, 
  AlertCircle, 
  ArrowRight, 
  ShieldAlert,
  Globe,
  LifeBuoy
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export default function SuspendedPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] flex flex-col items-center justify-center p-6 lg:p-12 font-sans animte-in fade-in duration-700">
      <div className="absolute top-0 left-0 w-full h-1.5 bg-red-600 shadow-[0_0_15px_rgba(220,38,38,0.5)]" />
      
      <div className="max-w-4xl w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left Side: Illustration & Branding */}
        <div className="space-y-8 text-center lg:text-left">
           <div className="flex items-center gap-3 justify-center lg:justify-start">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-200">E</div>
              <span className="font-black text-2xl tracking-tighter text-slate-900 dark:text-white">EmailEngine</span>
           </div>
           
           <div className="space-y-4">
              <h1 className="text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
                Service <span className="text-red-500 underline decoration-red-200 underline-offset-8">Suspended</span>
              </h1>
              <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
                Your organization's access has been temporarily restricted due to an <strong>unpaid subscription</strong> or payment failure.
              </p>
           </div>

           <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                 <ShieldAlert className="w-5 h-5 text-red-500" />
                 <span className="text-sm font-semibold">Data Secured</span>
              </div>
              <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                 <Globe className="w-5 h-5 text-indigo-500" />
                 <span className="text-sm font-semibold">Domains Saved</span>
              </div>
           </div>
        </div>

        {/* Right Side: Action Card */}
        <Card className="border-slate-200 dark:border-slate-800 shadow-2xl bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-[3rem] overflow-hidden">
          <CardHeader className="p-8 lg:p-12 pb-6">
            <div className="w-20 h-20 bg-red-100 dark:bg-red-500/20 rounded-[2rem] flex items-center justify-center mb-8 mx-auto lg:mx-0">
               <Lock className="w-10 h-10 text-red-600" />
            </div>
            <CardTitle className="text-3xl font-black tracking-tighter text-center lg:text-left">Immediate Action Required</CardTitle>
          </CardHeader>
          <CardContent className="px-8 lg:px-12 space-y-6">
             <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-4">
                <div className="flex items-center justify-between text-sm">
                   <span className="font-bold text-slate-400 uppercase tracking-widest">Outstanding Balance</span>
                   <span className="text-2xl font-black">₦15,000.00</span>
                </div>
                <p className="text-sm text-slate-500 italic">Pay via Paystack to automatically restore full service access instantly.</p>
             </div>
             
             <Button 
                className="w-full h-16 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[1.5rem] font-black text-xl shadow-xl shadow-indigo-100 dark:shadow-none translate-y-0 active:scale-95 transition-all group"
                onClick={() => window.location.href = '/dashboard/billing'}
             >
                Resume Service Now <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
             </Button>

             <div className="flex items-center justify-center gap-6 pt-4 grayscale opacity-60">
                <img src="https://static.paystack.com/assets/img/paystack-logo.svg" alt="Paystack" className="h-6" />
                <span className="h-4 w-px bg-slate-200" />
                <div className="flex gap-2">
                   <CreditCard className="w-6 h-6 text-slate-400" />
                </div>
             </div>
          </CardContent>
          <CardFooter className="bg-slate-100 dark:bg-slate-800/50 p-8 flex items-center justify-center gap-3">
             <LifeBuoy className="w-5 h-5 text-slate-400" />
             <span className="text-sm font-medium text-slate-500">Need billing help? <strong>billing@brytebee.com</strong></span>
          </CardFooter>
        </Card>
      </div>

      {/* Decorative Background Blob */}
      <div className="fixed -bottom-40 -left-20 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed -top-40 -right-20 w-[600px] h-[600px] bg-red-500/5 rounded-full blur-[120px] pointer-events-none" />
    </div>
  );
}
