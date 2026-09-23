"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

function VerifyPaymentPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    if (!reference) {
      setStatus('error');
      return;
    }

    let isMounted = true;

    const verifyTransaction = async () => {
      try {
        const res = await fetch("/api/dashboard/billing/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reference })
        });
        
        if (res.ok && isMounted) {
          setStatus('success');
        } else if (isMounted) {
          setStatus('error');
        }
      } catch (e) {
        if (isMounted) setStatus('error');
      }
    };

    verifyTransaction();

    return () => { isMounted = false; };
  }, [reference]);

  useEffect(() => {
    // Disabled automatic redirect so the user drives the flow manually via the button.
  }, [status, router]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 transition-all duration-700 font-sans">
      
      {/* Background Blobs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />
      </div>

      <Card className="w-full max-w-xl rounded-[3rem] border-slate-100 dark:border-slate-800 shadow-2xl overflow-hidden bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-12 text-center space-y-10">
         
         <div className="flex justify-center">
            {status === 'verifying' ? (
              <div className="relative">
                 <div className="absolute -inset-4 bg-indigo-500/20 blur-xl rounded-full animate-pulse" />
                 <Loader2 className="w-16 h-16 text-indigo-600 animate-spin relative" />
              </div>
            ) : status === 'success' ? (
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 12, stiffness: 200 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-200"
              >
                 <CheckCircle2 className="w-12 h-12" />
              </motion.div>
            ) : (
              <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center text-white">
                 <ShieldCheck className="w-12 h-12 rotate-180" />
              </div>
            )}
         </div>

         <div className="space-y-4">
            <CardTitle className="text-4xl font-black tracking-tight">
               {status === 'verifying' ? "Verifying Initialization..." : status === 'success' ? "Welcome to EmailEngine" : "Payment Error"}
            </CardTitle>
            <CardDescription className="text-lg">
               {status === 'verifying' && "We're confirming your transaction with Paystack. Please hold on."}
               {status === 'success' && "Your workspace is initialized. Professional domain routing is now active."}
               {status === 'error' && "We couldn't verify your payment reference. Please contact support."}
            </CardDescription>
         </div>

         {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="space-y-6"
            >
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-2">
                     <Globe className="w-6 h-6 text-indigo-600 mx-auto" />
                     <p className="text-xs font-bold text-slate-400">DNS Onboarding</p>
                     <p className="font-black">Active</p>
                  </div>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700 space-y-2">
                     <Zap className="w-6 h-6 text-indigo-600 mx-auto" />
                     <p className="text-xs font-bold text-slate-400">Routing Mode</p>
                     <p className="font-black">B2B Standard</p>
                  </div>
               </div>

               <div className="pt-6">
                  <Button 
                    onClick={() => router.push("/dashboard?fresh=1")}
                    className="w-full h-16 bg-slate-900 hover:bg-black text-white dark:bg-white dark:hover:bg-slate-100 dark:text-slate-900 rounded-[2rem] font-black text-xl shadow-xl transition-all active:scale-95 group"
                  >
                     Go to Dashboard <ArrowRight className="w-6 h-6 ml-4 group-hover:translate-x-2 transition-transform" />
                  </Button>
               </div>
            </motion.div>
         )}

         {status === 'error' && (
            <Button 
              onClick={() => router.push("/onboarding")}
              variant="outline"
              className="h-14 px-10 rounded-2xl border-slate-200 dark:border-slate-800 font-bold"
            >
               Back to Onboarding
            </Button>
         )}
      </Card>
    </div>
  );
}

export default function VerifyPaymentPage() {
  return (
    <React.Suspense fallback={null}>
      <VerifyPaymentPageInner />
    </React.Suspense>
  );
}
