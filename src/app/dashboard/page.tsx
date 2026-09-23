"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Zap, 
  Globe, 
  Mail, 
  TrendingUp, 
  CheckCircle2, 
  ArrowUpRight, 
  Plus,
  ShieldCheck,
  Loader2,
  Calendar,
  AlertTriangle,
  Image as ImageIcon,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SetupChecklist } from "@/components/dashboard/SetupChecklist";
import { GuidedTour } from "@/components/dashboard/GuidedTour";

const iconMap: Record<string, any> = {
  Globe,
  ShieldCheck,
  ImageIcon,
  Users
};

export default function OverviewPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<any>(null);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/dashboard/overview");
      if (res.ok) {
        const json = await res.json();
        setData(json);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  const { org, stats, setupSteps, isSetupComplete } = data || {};
  const processedSteps = setupSteps?.map((s: any) => ({
    ...s,
    icon: iconMap[s.icon] || Globe
  })) || [];

  return (
    <div className="space-y-10 animate-in fade-in duration-700 pb-20">
      <GuidedTour />
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
             {isSetupComplete ? `Welcome back, ${org?.name || 'Admin'}` : `Welcome to EmailEngine! 👋`}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
             {isSetupComplete 
               ? "Here is what is happening with your organization today." 
               : "Let's get your professional business workspace ready for operations."}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard/mail">
             <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-8 h-12 shadow-lg shadow-indigo-100 dark:shadow-none font-bold">
               <Plus className="w-5 h-5 mr-2" /> New Message
             </Button>
          </Link>
        </div>
      </div>

      {/* Setup Checklist (Shown only if setup is incomplete) */}
      {!isSetupComplete && (
         <div className="mb-12">
            <SetupChecklist steps={processedSteps} />
         </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-xl transition-all">
          <CardContent className="p-8 space-y-4">
             <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600">
                <Mail className="w-6 h-6" />
             </div>
             <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Emails Sent</p>
                <div className="flex items-baseline gap-2">
                   <h3 className="text-3xl font-black">{stats?.messagesOut || 0}</h3>
                   <span className="text-xs font-bold text-green-500 flex items-center"><TrendingUp className="w-3 h-3 mr-0.5" /> +12%</span>
                </div>
             </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-xl transition-all">
          <CardContent className="p-8 space-y-4">
             <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600">
                <Globe className="w-6 h-6" />
             </div>
             <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Active Domains</p>
                <h3 className="text-3xl font-black">{stats?.domainsActive || 0}</h3>
             </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-xl transition-all">
          <CardContent className="p-8 space-y-4">
             <div className="w-12 h-12 bg-green-50 dark:bg-green-500/10 rounded-2xl flex items-center justify-center text-green-600">
                <Zap className="w-6 h-6" />
             </div>
             <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Plan Type</p>
                <h3 className="text-3xl font-black">{stats?.plan || 'Free'}</h3>
             </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-slate-100 shadow-sm bg-white dark:bg-slate-900 overflow-hidden group hover:shadow-xl transition-all">
          <CardContent className="p-8 space-y-4">
             <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-600">
                <ShieldCheck className="w-6 h-6" />
             </div>
             <div>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Quota Used</p>
                <h3 className="text-3xl font-black">{stats?.usagePercent || 0}%</h3>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
         {/* Recent Inbox (Simplified/Placeholder) */}
         <Card className="lg:col-span-2 rounded-[2.5rem] border-slate-100 shadow-2xl bg-white dark:bg-slate-900 overflow-hidden">
            <CardHeader className="p-10 pb-6 flex flex-row items-center justify-between">
               <div>
                  <CardTitle className="text-2xl font-black tracking-tight">Recent Activity</CardTitle>
                  <CardDescription>Latest system interactions across your organization.</CardDescription>
               </div>
            </CardHeader>
            <CardContent className="p-10 pt-0">
               <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 opacity-40">
                  <Mail className="w-12 h-12 text-slate-300" />
                  <p className="text-slate-500 font-medium">No recent activity detected.</p>
               </div>
            </CardContent>
         </Card>

         {/* Action Sidebar */}
         <div className="space-y-6">
            <Card className="rounded-[2.5rem] border-none bg-indigo-600 text-white shadow-xl p-8 space-y-6 relative overflow-hidden">
               <div className="relative z-10 space-y-4">
                  <h3 className="text-2xl font-black">Go Pro</h3>
                  <p className="text-indigo-100 text-sm leading-relaxed opacity-90">
                     Unlock multi-attachment uploads, unlimited domains, and team collaboration features.
                  </p>
                  <Button className="w-full h-14 bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-xl shadow-indigo-700/20">
                     Upgrade Now
                  </Button>
               </div>
               <Zap className="absolute -bottom-10 -right-10 w-48 h-48 opacity-10 rotate-12" />
            </Card>

            <Card className="rounded-[2.5rem] border-slate-100 bg-white dark:bg-slate-900 shadow-xl p-8 space-y-4">
               <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h4 className="font-bold">System Status</h4>
               </div>
               <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500">Resend Domain API</span>
                     <span className="flex items-center gap-1.5 text-green-500 font-bold"><div className="w-2 h-2 rounded-full bg-green-500" /> Healthy</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                     <span className="text-slate-500">Google Sheets Storage</span>
                     <span className="flex items-center gap-1.5 text-green-500 font-bold"><div className="w-2 h-2 rounded-full bg-green-500" /> Healthy</span>
                  </div>
               </div>
            </Card>
         </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-10 animate-in fade-in duration-500 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          <div className="h-4 w-96 bg-slate-100 dark:bg-slate-800/50 rounded-xl animate-pulse" />
        </div>
        <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-44 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 animate-pulse" />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 h-[400px] bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 animate-pulse" />
        <div className="space-y-6">
           <div className="h-48 bg-indigo-100 dark:bg-indigo-900/20 rounded-[2.5rem] animate-pulse" />
           <div className="h-32 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
