"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Settings, Zap } from "lucide-react";
import { useSession } from "next-auth/react";

export default function AdminSettingsPlansPage() {
  const { data: session } = useSession();
  const [token, setToken] = useState<string>("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  
  const [silver, setSilver] = useState("5");
  const [gold, setGold] = useState("12");
  const [premium, setPremium] = useState("99");
  
  const [silverPrice, setSilverPrice] = useState("15000");
  const [goldPrice, setGoldPrice] = useState("45000");
  const [premiumPrice, setPremiumPrice] = useState("95000");
  const [setupFee, setSetupFee] = useState("10000");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchSettings = async (authToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSilver(data.silver);
        setGold(data.gold);
        setPremium(data.premium);
        if(data.silverPrice) setSilverPrice(data.silverPrice);
        if(data.goldPrice) setGoldPrice(data.goldPrice);
        if(data.premiumPrice) setPremiumPrice(data.premiumPrice);
        if(data.setupFee) setSetupFee(data.setupFee);
      } else {
        setError("Failed to fetch settings. Unauthorized.");
        setIsLoggedIn(false);
      }
    } catch (err) {
      setError("An error occurred fetching settings.");
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-login if NextAuth session represents an admin
  useEffect(() => {
    if (session?.user && ['admin', 'superadmin'].includes((session.user as any).role)) {
      setIsLoggedIn(true);
      fetchSettings(""); // No legacy token needed because session cookie handles auth
    }
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput) return;
    setError("");
    try {
      setIsLoading(true);
      const res = await fetch("/api/domains/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${passwordInput}`
        }
      });
      if (res.ok) {
        setToken(passwordInput);
        setIsLoggedIn(true);
        fetchSettings(passwordInput);
      } else {
        setError("Invalid master password");
      }
    } catch (err) {
      setError("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "" // Fallback for session
        },
        body: JSON.stringify({ 
          silver, gold, premium,
          silverPrice, goldPrice, premiumPrice, setupFee
        })
      });
      
      if (res.ok) {
        setSuccess("Plan boundaries updated globally.");
      } else {
        setError("Failed to save settings.");
      }
    } catch (err) {
      setError("An error occurred while saving.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setSuccess(""), 4000);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <Card className="w-full max-w-md shadow-2xl overflow-hidden rounded-[2rem] border-slate-100 dark:border-slate-800">
          <CardHeader className="bg-white dark:bg-slate-900 px-8 py-6">
            <CardTitle className="text-2xl font-black">Admin Settings</CardTitle>
            <CardDescription className="font-medium text-slate-500">Authenticate to access system limits.</CardDescription>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="px-8 py-6 bg-slate-50/50 dark:bg-slate-950/50">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Master Key</Label>
                  <Input 
                    id="password" 
                    type="password" 
                    placeholder="••••••••"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    disabled={isLoading}
                    className="h-12 rounded-xl"
                  />
                </div>
                {error && <p className="text-sm text-red-500 font-bold">{error}</p>}
              </div>
            </CardContent>
            <CardFooter className="px-8 py-6 bg-slate-50/50 dark:bg-slate-950/50">
              <Button type="submit" className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-200 dark:shadow-none" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isLoading ? "Authenticating..." : "Access Console"}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 lg:p-12 font-sans overflow-hidden relative">
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10">
            <div className="absolute top-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
        </div>

        <div className="max-w-3xl mx-auto space-y-10 animate-in fade-in duration-700">
            <div>
               <h1 className="text-4xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-3">
                  <Settings className="w-8 h-8 text-indigo-600" />
                  Plan Configuration
               </h1>
               <p className="text-slate-500 font-medium mt-2">
                  Dynamically adjust maximum team member quotas and pricing globally. Set limits for each tier to protect server resources. Prices operate independently for seamless onboarding.
               </p>
            </div>

            <Card className="rounded-[2.5rem] border-slate-100 dark:border-slate-800 shadow-2xl bg-white dark:bg-slate-900 backdrop-blur-xl">
               <form onSubmit={handleSave}>
                  <CardContent className="p-8 lg:p-12 space-y-8">
                     
                     <div className="grid gap-6">
                        {/* Silver Tier */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                           <div>
                              <h3 className="text-xl font-bold flex items-center gap-2">
                                 <span className="w-3 h-3 rounded-full bg-slate-300" /> Silver Tier Maximum
                              </h3>
                              <p className="text-sm text-slate-500 font-medium">Cap on total authorized accounts for the entry plan.</p>
                           </div>
                           <div className="w-full md:w-32 flex flex-col gap-2">
                              <Label className="text-xs text-slate-400 font-bold uppercase">Max Users</Label>
                              <Input 
                                 type="number" 
                                 min="-1"
                                 value={silver} 
                                 onChange={e => setSilver(e.target.value)} 
                                 className="h-10 rounded-xl text-md font-bold text-center" 
                              />
                           </div>
                           <div className="w-full md:w-32 flex flex-col gap-2">
                              <Label className="text-xs text-slate-400 font-bold uppercase">Price (₦)</Label>
                              <Input 
                                 type="number" 
                                 min="0"
                                 value={silverPrice} 
                                 onChange={e => setSilverPrice(e.target.value)} 
                                 className="h-10 rounded-xl text-md font-bold text-center" 
                              />
                           </div>
                        </div>

                        {/* Gold Tier */}
                        <div className="p-6 bg-indigo-50 dark:bg-indigo-500/5 rounded-3xl border border-indigo-100 dark:border-indigo-500/20 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                           <div>
                              <h3 className="text-xl font-bold flex items-center gap-2">
                                 <span className="w-3 h-3 rounded-full bg-indigo-400" /> Gold Tier Maximum
                              </h3>
                              <p className="text-sm text-indigo-500/70 dark:text-indigo-400/70 font-medium">Cap on total authorized accounts for the intermediate plan.</p>
                           </div>
                           <div className="w-full md:w-32 flex flex-col gap-2">
                              <Label className="text-xs text-slate-400 font-bold uppercase">Max Users</Label>
                              <Input 
                                 type="number" 
                                 min="-1"
                                 value={gold} 
                                 onChange={e => setGold(e.target.value)} 
                                 className="h-10 rounded-xl text-md font-bold text-center border-indigo-200 dark:border-indigo-500/30" 
                              />
                           </div>
                           <div className="w-full md:w-32 flex flex-col gap-2">
                              <Label className="text-xs text-slate-400 font-bold uppercase">Price (₦)</Label>
                              <Input 
                                 type="number" 
                                 min="0"
                                 value={goldPrice} 
                                 onChange={e => setGoldPrice(e.target.value)} 
                                 className="h-10 rounded-xl text-md font-bold text-center border-indigo-200 dark:border-indigo-500/30" 
                              />
                           </div>
                        </div>

                        {/* Premium Tier */}
                        <div className="p-6 bg-purple-50 dark:bg-purple-500/5 rounded-3xl border border-purple-100 dark:border-purple-500/20 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between relative overflow-hidden group">
                           <div className="relative z-10">
                              <h3 className="text-xl font-bold flex items-center gap-2">
                                 <Zap className="w-5 h-5 text-purple-600 fill-purple-600" /> Premium Tier Maximum
                              </h3>
                              <p className="text-sm text-purple-500/70 dark:text-purple-400/70 font-medium">
                                 Top-tier quota. Entering 99 imposes a hard ceiling before requiring a custom negotiation plan. -1 removes all limits.
                              </p>
                           </div>
                           <div className="w-full md:w-32 relative z-10 flex flex-col gap-2">
                              <Label className="text-xs text-slate-400 font-bold uppercase">Max Users</Label>
                              <Input 
                                 type="number" 
                                 min="-1"
                                 value={premium} 
                                 onChange={e => setPremium(e.target.value)} 
                                 className="h-10 rounded-xl text-md font-bold text-center border-purple-200 dark:border-purple-500/30" 
                              />
                           </div>
                           <div className="w-full md:w-32 relative z-10 flex flex-col gap-2">
                              <Label className="text-xs text-slate-400 font-bold uppercase">Price (₦)</Label>
                              <Input 
                                 type="number" 
                                 min="0"
                                 value={premiumPrice} 
                                 onChange={e => setPremiumPrice(e.target.value)} 
                                 className="h-10 rounded-xl text-md font-bold text-center border-purple-200 dark:border-purple-500/30" 
                              />
                           </div>
                        </div>

                        {/* Setup Fee */}
                        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-700/50 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                           <div>
                              <h3 className="text-xl font-bold flex items-center gap-2">
                                 <Settings className="w-5 h-5 text-slate-600" /> Infrastructure Setup Fee
                              </h3>
                              <p className="text-sm text-slate-500 font-medium">One-time global cost for initializing domain endpoints for new partners.</p>
                           </div>
                           <div className="w-full md:w-32 flex flex-col gap-2">
                              <Label className="text-xs text-slate-400 font-bold uppercase">Fee (₦)</Label>
                              <Input 
                                 type="number" 
                                 min="0"
                                 value={setupFee} 
                                 onChange={e => setSetupFee(e.target.value)} 
                                 className="h-10 rounded-xl text-md font-bold text-center border-slate-200" 
                              />
                           </div>
                        </div>
                     </div>

                  </CardContent>
                  <CardFooter className="px-8 lg:px-12 py-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                     <div>
                        {error && <span className="text-red-500 font-bold">{error}</span>}
                        {success && <span className="text-green-500 font-bold flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> {success}</span>}
                     </div>
                     <Button type="submit" disabled={isSaving} className="w-full sm:w-auto h-14 px-8 rounded-2xl bg-slate-900 hover:bg-black dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 font-black text-lg shadow-xl translate-y-0 active:scale-95 transition-all">
                        {isSaving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : null}
                        {isSaving ? "Synchronizing..." : "Apply Global Limits"}
                     </Button>
                  </CardFooter>
               </form>
            </Card>
        </div>
    </div>
  );
}
