"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Globe, 
  ArrowLeft, 
  CheckCircle2, 
  Copy, 
  Info, 
  Loader2, 
  AlertCircle,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface DNSRecord {
  type: string;
  name: string;
  value: string;
  priority?: number;
  status: string;
}

export default function NewDomainPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [domainName, setDomainName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dnsRecords, setDnsRecords] = useState<DNSRecord[]>([]);
  const [registeredDomain, setRegisteredDomain] = useState<any>(null);
  const [copiedValue, setCopiedValue] = useState<string | null>(null);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/dashboard/domains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("auth_token")}` // Placeholder for token
        },
        body: JSON.stringify({ domainName }),
      });

      const data = await res.json();

      if (res.ok) {
        setRegisteredDomain(data.domain);
        setDnsRecords(data.dnsRecords);
        setStep(2);
      } else {
        setError(data.error || "Failed to register domain");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (value: string) => {
    navigator.clipboard.writeText(value);
    setCopiedValue(value);
    setTimeout(() => setCopiedValue(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Custom Domain</h1>
          <p className="text-slate-500 dark:text-slate-400">Configure your business domain to start sending and receiving emails.</p>
        </div>
      </div>

      {/* Progress Stepper */}
      <div className="flex items-center gap-4 mb-2">
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
          step >= 1 ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
        )}>
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">1</span>
          Register
        </div>
        <div className="w-10 h-px bg-slate-200 dark:bg-slate-800" />
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
          step >= 2 ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
        )}>
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">2</span>
          DNS Settings
        </div>
        <div className="w-10 h-px bg-slate-200 dark:bg-slate-800" />
        <div className={cn(
          "flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300",
          step >= 3 ? "bg-indigo-600 text-white" : "bg-slate-100 dark:bg-slate-800 text-slate-500"
        )}>
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs">3</span>
          Verify
        </div>
      </div>

      {step === 1 && (
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-8">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
            </div>
            <CardTitle className="text-2xl">What is your domain?</CardTitle>
            <CardDescription className="text-base text-slate-500 dark:text-slate-400">
              Enter the domain you'd like to use for your business emails. (e.g. acme.com)
            </CardDescription>
          </CardHeader>
          <form onSubmit={handleRegister}>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Input 
                  placeholder="acme.com" 
                  value={domainName}
                  onChange={(e) => setDomainName(e.target.value.toLowerCase())}
                  className="h-12 text-lg px-4 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 rounded-xl focus:ring-indigo-500 transition-all"
                  required
                />
                {error && (
                  <div className="flex items-center gap-2 text-red-500 text-sm mt-2 font-medium bg-red-50 dark:bg-red-500/10 p-3 rounded-lg border border-red-100 dark:border-red-500/20">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="pt-4 pb-8 flex flex-col items-start gap-4">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-lg shadow-indigo-200 dark:shadow-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <>Continue <ChevronRight className="w-5 h-5 ml-2" /></>
                )}
              </Button>
              <div className="flex items-start gap-3 text-sm text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <ShieldCheck className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <p>Registering your domain with us allows you to have professional emails like <strong>info@{domainName || "yourdomain.com"}</strong>.</p>
              </div>
            </CardFooter>
          </form>
        </Card>
      )}

      {step === 2 && (
        <div className="space-y-8">
          <Card className="border-slate-200 dark:border-slate-800 shadow-xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline" className="px-3 py-1 font-medium bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20">
                  Step 2: DNS Configuration
                </Badge>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Info className="w-4 h-4" />
                  These settings are required for email stability
                </div>
              </div>
              <CardTitle className="text-2xl flex items-center gap-3">
                Update your DNS records for <span className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-200 dark:decoration-indigo-800 underline-offset-8">{domainName}</span>
              </CardTitle>
              <CardDescription className="text-base pt-2">
                Log in to your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.) and add the following records to your DNS settings.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {dnsRecords.map((record, index) => (
                  <div 
                    key={index} 
                    className="group border border-slate-100 dark:border-slate-800 rounded-2xl p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                          <span className="px-3 py-1 rounded bg-slate-900 text-white text-xs font-bold uppercase tracking-wider">{record.type}</span>
                          <span className="text-sm font-mono text-slate-600 dark:text-slate-400 truncate max-w-[200px]">{record.name}</span>
                        </div>
                        <div className="bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 p-3 rounded-xl flex items-center justify-between group-hover:border-indigo-200 dark:group-hover:border-indigo-900 transition-colors">
                          <code className="text-sm font-mono break-all text-slate-800 dark:text-slate-200">{record.value}</code>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="shrink-0 h-8 w-8 hover:bg-slate-100 dark:hover:bg-slate-800"
                            onClick={() => copyToClipboard(record.value)}
                          >
                            {copiedValue === record.value ? (
                              <CheckCircle2 className="w-4 h-4 text-green-500 animate-in zoom-in" />
                            ) : (
                              <Copy className="w-4 h-4 text-slate-400" />
                            )}
                          </Button>
                        </div>
                        {record.priority !== undefined && (
                          <div className="text-xs text-slate-500 font-medium">
                            Priority: <span className="text-slate-900 dark:text-slate-100">{record.priority}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="pt-6 pb-8 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <Button 
                variant="outline" 
                className="rounded-xl h-12 px-6 font-medium"
                onClick={() => setStep(1)}
              >
                Back to Register
              </Button>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-xl font-semibold shadow-lg shadow-indigo-100 dark:shadow-none"
                onClick={() => setStep(3)}
              >
                I've Added These Records
              </Button>
            </CardFooter>
          </Card>

          <div className="bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl p-6 border border-indigo-100 dark:border-indigo-500/20 flex gap-4">
            <ShieldCheck className="w-6 h-6 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <div className="space-y-1">
              <h4 className="font-semibold text-indigo-900 dark:text-indigo-100">Why do I need these records?</h4>
              <p className="text-sm text-indigo-700 dark:text-indigo-300 leading-relaxed">
                These records establish an encrypted, authorized connection between your domain provider and our email servers. They ensure your emails land in your recipients' inboxes and not in their spam folder.
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <Card className="border-slate-200 dark:border-slate-800 shadow-xl text-center py-12 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm">
          <CardContent className="space-y-8 max-w-md mx-auto">
            <div className="relative mx-auto w-24 h-24">
              <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping duration-[3s]" />
              <div className="relative bg-indigo-100 dark:bg-indigo-500/20 rounded-full w-24 h-24 flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-indigo-600 dark:text-indigo-400 animate-spin" />
              </div>
            </div>
            <div className="space-y-3">
              <CardTitle className="text-3xl">Verifying Connection</CardTitle>
              <CardDescription className="text-lg">
                We're checking your DNS records for <strong>{domainName}</strong>. This usually takes a few seconds but can sometimes take up to 24 hours depending on your registrar.
              </CardDescription>
            </div>
            <div className="pt-4 flex flex-col gap-3">
              <Button 
                className="h-12 rounded-xl text-base font-semibold bg-indigo-600 hover:bg-indigo-700"
                onClick={() => router.push("/dashboard/domains")}
              >
                Check Status Again
              </Button>
              <Button 
                variant="ghost" 
                className="rounded-xl h-12 text-slate-500"
                onClick={() => setStep(2)}
              >
                Go Back to Records
              </Button>
            </div>
            <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <ExternalLink className="w-3 h-3" /> Still having trouble? Contact support
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
