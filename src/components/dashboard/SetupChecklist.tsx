import React from "react";
import Link from "next/link";
import { 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Globe, 
  Image as ImageIcon, 
  Users, 
  CreditCard,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface SetupChecklistProps {
  steps: {
    id: string;
    title: string;
    description: string;
    isCompleted: boolean;
    href: string;
    icon: any;
  }[];
}

export const SetupChecklist = ({ steps }: SetupChecklistProps) => {
  const completedCount = steps.filter(s => s.isCompleted).length;
  const progressPercent = (completedCount / steps.length) * 100;

  if (completedCount === steps.length) return null;

  return (
    <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 shadow-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm overflow-hidden">
      <CardHeader className="p-8 lg:p-10 pb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="space-y-1">
            <CardTitle className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Complete Your Setup</CardTitle>
            <CardDescription className="text-base font-medium">Professionalize your business mailing engine in 4 simple steps.</CardDescription>
          </div>
          <div className="text-right">
             <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">{completedCount} of {steps.length} Complete</div>
             <div className="w-48 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden inline-block">
                <div 
                  className="h-full bg-indigo-600 transition-all duration-1000" 
                  style={{ width: `${progressPercent}%` }}
                />
             </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 lg:px-10 lg:pb-10 pt-0 space-y-4">
        {steps.map((step) => (
          <Link key={step.id} href={step.href}>
             <div className={`p-6 rounded-[2rem] border transition-all flex items-center justify-between group ${
                step.isCompleted 
                ? "bg-slate-50/50 dark:bg-slate-800/30 border-transparent opacity-60 pointer-events-none" 
                : "bg-white dark:bg-slate-800/50 border-slate-100 dark:border-slate-700 hover:border-indigo-200 dark:hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/5"
             }`}>
                <div className="flex items-center gap-6">
                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                      step.isCompleted 
                      ? "bg-green-100 dark:bg-green-500/20 text-green-600" 
                      : "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 group-hover:scale-110"
                   }`}>
                      {step.isCompleted ? <CheckCircle2 className="w-7 h-7" /> : <step.icon className="w-7 h-7" />}
                   </div>
                   <div className="space-y-1">
                      <h4 className={`text-xl font-bold ${step.isCompleted ? "text-slate-400 line-through decoration-slate-300" : "text-slate-900 dark:text-white"}`}>
                        {step.title}
                      </h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">{step.description}</p>
                   </div>
                </div>
                {!step.isCompleted && <ChevronRight className="w-6 h-6 text-slate-300 group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />}
             </div>
          </Link>
        ))}
      </CardContent>
      <CardFooter className="bg-indigo-600 p-8 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-6 text-white">
         <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-black leading-tight">Need assistance with your domain?</h4>
            <p className="text-indigo-100 text-sm opacity-80 font-medium">Our team can handle the technical MX/SPF setup for you manually.</p>
         </div>
         <a href="https://wa.me/2340000000000?text=I%20need%20help%20setting%20up%20a%20domain%20for%20my%20organization." target="_blank" rel="noopener noreferrer">
            <Button className="bg-white text-indigo-600 hover:bg-slate-100 rounded-2xl px-8 h-14 font-black transition-all active:scale-95 whitespace-nowrap shadow-xl shadow-indigo-700/20">
               Chat with a Specialist <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
         </a>
      </CardFooter>
    </Card>
  );
};
