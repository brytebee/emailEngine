"use client";

import React, { useState, useEffect } from "react";
import { 
  CreditCard, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  History,
  Lock,
  ChevronRight,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function BillingPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [org, setOrg] = useState<any>(null);

  useEffect(() => {
    const fetchBilling = async () => {
      try {
        const res = await fetch("/api/dashboard/profile", {
          headers: {
            "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
          }
        });
        const data = await res.json();
        setOrg(data); // This now includes org.plan, org.emailLimit, etc.
      } catch (e) {
        console.error("Failed to fetch billing info", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchBilling();
  }, []);

  const handlePaystack = async (planId: string, amount: number) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dashboard/billing/pay", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}`
        },
        body: JSON.stringify({ 
          planId, 
          amount,
          isInitialSetup: false 
        })
      });

      const data = await res.json();
      if (data.authorization_url) {
        window.location.href = data.authorization_url;
      }
    } catch (e) {
      alert("Payment initialization failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const isExpiringSoon = new Date(org.expiryDate).getTime() - Date.now() < 3 * 24 * 60 * 60 * 1000;

  return (
    <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Plans & Billing</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your subscription, view usage, and update payment methods.</p>
        </div>
        <Badge variant={org.billingStatus === 'active' ? "outline" : "destructive"} className="px-4 py-1.5 rounded-full text-sm font-bold bg-green-50 dark:bg-green-500/10 text-green-600 border-green-100 dark:border-green-500/20">
          {org.billingStatus.toUpperCase()} SUBSCRIPTION
        </Badge>
      </div>

      {/* Expiry Alert */}
      {isExpiringSoon && (
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-3xl p-6 flex items-start gap-4 animate-in slide-in-from-top-4 duration-500">
          <div className="w-12 h-12 bg-amber-100 dark:bg-amber-500/20 rounded-2xl flex items-center justify-center shrink-0">
             <AlertTriangle className="w-6 h-6 text-amber-600" />
          </div>
          <div className="space-y-1">
             <h3 className="text-lg font-bold text-amber-900 dark:text-amber-100">Subscription Expiring Soon</h3>
             <p className="text-amber-800 dark:text-amber-300">Your current plan expires in 3 days. Please renew your subscription to avoid service interruption and lockout.</p>
             <Button variant="link" className="text-amber-900 dark:text-amber-100 p-0 h-auto font-bold underline underline-offset-4">Renew Now <ChevronRight className="w-4 h-4" /></Button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Usage Card */}
        <Card className="md:col-span-2 border-slate-200 dark:border-slate-800 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-[2.5rem] overflow-hidden">
          <CardHeader className="p-8 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
                <CardTitle className="text-2xl font-black">Current Usage</CardTitle>
                <Clock className="w-5 h-5 text-slate-400" />
            </div>
            <CardDescription className="text-base">Track your monthly resource consumption.</CardDescription>
          </CardHeader>
            <CardContent className="p-8 space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm font-bold uppercase tracking-widest text-slate-400">
                 <span>Verification Messages</span>
                 <span>{org.messagesUsed || 0} / {org.emailLimit || 500}</span>
              </div>
              <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                 <div 
                    className="h-full bg-indigo-600 rounded-full transition-all duration-1000 ease-out shadow-lg shadow-indigo-100" 
                    style={{ width: `${(Math.min((org.messagesUsed || 0) / (org.emailLimit || 500), 1)) * 100}%` }} 
                 />
              </div>
              <p className="text-xs text-slate-500">Cycle ends on {org.expiryDate ? new Date(org.expiryDate).toLocaleDateString() : 'N/A'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <div className="text-sm font-bold text-slate-400 mb-1">Active Domains</div>
                  <div className="text-3xl font-black">1</div>
               </div>
               <div className="p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
                  <div className="text-sm font-bold text-slate-400 mb-1">Setup Fee</div>
                  <div className="text-sm font-bold text-green-500">PAID</div>
               </div>
            </div>
          </CardContent>
          <CardFooter className="bg-slate-50/50 dark:bg-slate-800/30 p-8 border-t border-slate-100 dark:border-slate-800">
             <div className="flex items-start gap-4">
                <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
                <p className="text-sm text-slate-500 leading-relaxed">
                   Your account is secured with <strong>Enterprise Data Encryption</strong>. Billing cycles are managed automatically via Paystack for 100% financial transparency.
                </p>
             </div>
          </CardFooter>
        </Card>

        {/* Plan Summary Card */}
        <Card className="border-slate-900 bg-slate-900 dark:bg-indigo-600 text-white shadow-2xl rounded-[2.5rem] flex flex-col">
           <CardHeader className="p-8">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                 <Zap className="w-6 h-6 text-white" />
              </div>
              <CardTitle className="text-3xl font-black capitalize">{org.plan || 'Silver'} Plan</CardTitle>
              <CardDescription className="text-indigo-100 font-medium opacity-80">Best for professional operations.</CardDescription>
           </CardHeader>
           <CardContent className="px-8 pb-8 flex-1">
              <div className="text-4xl font-black mb-8 capitalize">
                ₦{(org.plan === 'gold' ? 45000 : org.plan === 'premium' ? 95000 : 15000).toLocaleString()} <span className="text-lg font-medium opacity-60">/ Month</span>
              </div>
              <ul className="space-y-4">
                 {[
                   `${org.emailLimit || 5000} Messages / Mo`,
                   "Custom Domain Routing",
                   "White-label Branding",
                   "Secure Webmail Client",
                   "Nigerian Support"
                 ].map((feature, i) => (
                   <li key={i} className="flex items-center gap-3 text-sm font-medium">
                      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />
                      {feature}
                   </li>
                 ))}
              </ul>
           </CardContent>
           <CardFooter className="p-8">
              <Button 
                onClick={() => handlePaystack(org.plan || 'silver', org.plan === 'gold' ? 45000 : org.plan === 'premium' ? 95000 : 15000)}
                className="w-full h-14 bg-white text-slate-900 hover:bg-slate-100 rounded-2xl font-black text-lg transition-all active:scale-95 group"
              >
                  Renew / Upgrade Plan <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
           </CardFooter>
        </Card>
      </div>

      {/* History Table Placeholder */}
      <div className="space-y-6 pt-10">
         <h3 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <History className="w-6 h-6 text-slate-400" /> Billing History
         </h3>
         <Card className="border-slate-100 dark:border-slate-800 rounded-[2rem] overflow-hidden">
            <div className="p-12 text-center text-slate-400">
               <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-20" />
               <p className="text-lg font-medium">No transactions yet.</p>
               <p className="text-sm">Once you upgrade your plan, invoices will appear here.</p>
            </div>
         </Card>
      </div>
    </div>
  );
}
