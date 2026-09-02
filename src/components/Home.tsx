"use client";

import React from "react";
import Link from "next/link";
import { 
  Mail, 
  Globe, 
  ShieldCheck, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare,
  Lock,
  Layers,
  Palette
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Home() {
  const plans = [
    {
      name: "Silver",
      price: "15,000",
      description: "Ideal for growing startups and small businesses.",
      emails: "5,000",
      features: [
        "Professional Domain Setup",
        "Custom Branding & Logo",
        "Standard Webmail Client",
        "Basic Inbox Support",
        "Secure Encryption"
      ],
      popular: false
    },
    {
      name: "Gold",
      price: "45,000",
      description: "Perfect for established companies with high volume.",
      emails: "25,000",
      features: [
        "Everything in Silver",
        "Priority Resend Routing",
        "Advanced Webmail Features",
        "Team Management (Up to 10)",
        "24/7 Priority Support"
      ],
      popular: true
    },
    {
      name: "Premium",
      price: "95,000",
      description: "Unlimited power for enterprise-grade operations.",
      emails: "Unlimited",
      features: [
        "Everything in Gold",
        "Unlimited Email Volume",
        "White-label User Portal",
        "Custom API Integration",
        "Dedicated Account Manager"
      ],
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-white font-sans selection:bg-indigo-100 selection:text-indigo-700">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-100 dark:border-slate-800">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <Mail className="w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter">EmailEngine</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-500">
            <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
            <a href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</a>
            <a href="#security" className="hover:text-indigo-600 transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-4">
             <Link href="/login">
                <Button variant="ghost" className="font-bold">Login</Button>
             </Link>
             <Link href="/onboarding">
                <Button className="bg-indigo-600 hover:bg-indigo-700 rounded-xl px-6 font-bold">Start Now</Button>
             </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 overflow-hidden relative">
        <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-8 relative z-10 text-center lg:text-left">
            <Badge variant="outline" className="px-4 py-1.5 rounded-full border-indigo-200 text-indigo-600 bg-indigo-50/50 mb-4">
               <Zap className="w-4 h-4 mr-2" /> Next-Gen B2B Email Infrastructure
            </Badge>
            <h1 className="text-6xl lg:text-7xl font-black tracking-tighter leading-[1.1] text-slate-900 dark:text-white">
               Professional <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Mailing</span> For Modern Business.
            </h1>
            <p className="text-xl text-slate-500 dark:text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
               Transform your company’s communication with a professional white-label email system. Custom domains, rich-text webmail, and enterprise branding—all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
               <Link href="/onboarding">
                  <Button className="h-14 px-10 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-lg shadow-xl shadow-indigo-100 dark:shadow-none gap-3 group">
                     Get Started <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
               </Link>
               <Button variant="outline" className="h-14 px-10 rounded-2xl border-slate-200 dark:border-slate-800 font-bold text-lg">
                  View Demo
               </Button>
            </div>
          </div>
          
          {/* Hero Visual Mockup */}
          <div className="relative">
             <div className="absolute -inset-4 bg-indigo-500/10 blur-[100px] rounded-full" />
             <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-4 md:p-8">
                <div className="flex items-center gap-2 mb-8 px-2">
                   <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-green-400" />
                   </div>
                   <div className="h-6 w-full max-w-[200px] bg-slate-50 dark:bg-slate-800 rounded-full mx-auto" />
                </div>
                <div className="space-y-6 text-slate-300">
                   <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-indigo-600" />
                      <div className="space-y-2 flex-1">
                         <div className="h-4 bg-slate-100 dark:bg-slate-800 rounded-full w-1/3" />
                         <div className="h-3 bg-slate-50 dark:bg-slate-800/50 rounded-full w-2/3" />
                      </div>
                   </div>
                   <div className="p-6 bg-slate-50 dark:bg-slate-800/20 rounded-3xl space-y-4">
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-full" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-full" />
                      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-full w-3/4" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-slate-50 dark:bg-slate-900/30">
         <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
               <h2 className="text-4xl font-black tracking-tight">Everything built for high-end operations.</h2>
               <p className="text-lg text-slate-500">We’ve abstracted away the technical complexity of MX records and SPF protocols.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[
                  { icon: Globe, title: "Custom Domains", text: "Send and receive emails from your actual business domain (e.g., hello@company.com)." },
                  { icon: Palette, title: "White-Label Branding", text: "Fully branded webmail client and email templates for your clients and staff." },
                  { icon: ShieldCheck, title: "Enterprise Security", text: "Every email is encrypted. Your organization data is stored in isolated multi-tenant vaults." },
                  { icon: MessageSquare, title: "Modern Webmail", text: "A rich-text, premium inbox experience with signature builders and attachment handling." },
                  { icon: Layers, title: "Shard-Scale Storage", text: "High-performance architecture built on Google Cloud infrastructure for ultimate reliability." },
                  { icon: Lock, title: "Subscription Control", text: "Automated account management with smart service lockout for billing transparency." }
               ].map((f, i) => (
                  <Card key={i} className="rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all p-8 space-y-6 bg-white dark:bg-slate-900">
                     <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-500/10 rounded-2xl flex items-center justify-center text-indigo-600">
                        <f.icon className="w-7 h-7" />
                     </div>
                     <div className="space-y-3">
                        <h3 className="text-xl font-bold">{f.title}</h3>
                        <p className="text-slate-500 dark:text-slate-400">{f.text}</p>
                     </div>
                  </Card>
               ))}
            </div>
         </div>
      </section>

      {/* Domain Assistance Section */}
      <section className="py-24 bg-indigo-600 text-white relative overflow-hidden">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-white/5 skew-x-12 translate-x-1/2" />
         <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center relative z-10">
            <div className="space-y-8">
               <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20">
                  <Globe className="w-8 h-8 text-white" />
               </div>
               <h2 className="text-5xl font-black tracking-tighter leading-tight">
                  No Domain? <br/>
                  <span className="text-white/60">No Problem.</span>
               </h2>
               <p className="text-xl text-white/80 leading-relaxed max-w-lg">
                  We specialize in the Nigerian business ecosystem. If you don't have a company domain yet, our team will register one for you and handle all the technical MX/SPF/DKIM setup manually.
               </p>
               <div className="flex items-center gap-6 pt-4">
                  <div className="flex -space-x-3">
                     {[1, 2, 3].map((i) => (
                        <div key={i} className="w-12 h-12 rounded-full border-4 border-indigo-600 bg-slate-200" />
                     ))}
                  </div>
                  <p className="text-sm font-bold text-white/90 uppercase tracking-widest leading-none">
                     Support Team <br/> 
                     <span className="text-[10px] text-white/50">Active in Lagos & Abuja</span>
                  </p>
               </div>
            </div>
            <div className="bg-white rounded-[3rem] p-10 space-y-8 shadow-2xl">
               <h3 className="text-3xl font-black text-slate-900 tracking-tight">White-Glove Setup</h3>
               <ul className="space-y-5">
                  {[
                     "Domain Name Registration (e.g. .com, .ng)",
                     "Professional MX Record Routing",
                     "Email Security Authentication (SPF/DKIM)",
                     "Staff Account Provisioning"
                  ].map((item, i) => (
                     <li key={i} className="flex items-center gap-4 text-slate-600 font-bold">
                        <CheckCircle2 className="w-6 h-6 text-indigo-600 shrink-0" />
                        {item}
                     </li>
                  ))}
               </ul>
               <a href="https://wa.me/2340000000000?text=I%20need%20help%20setting%20up%20a%20domain%20for%20EmailEngine" target="_blank" rel="noopener noreferrer">
                  <Button className="w-full h-16 bg-indigo-600 hover:bg-black text-white rounded-2xl font-black text-xl transition-all shadow-xl shadow-indigo-100">
                     Chat with an Expert
                  </Button>
               </a>
            </div>
         </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-24 relative overflow-hidden">
         <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
               <div className="bg-indigo-600 text-white rounded-full px-4 py-1.5 inline-flex items-center justify-center font-black uppercase text-[10px] tracking-widest mb-4">Pricing Model</div>
               <h2 className="text-5xl font-black tracking-tighter">Affordable, yet <span className="text-indigo-600">Premium.</span></h2>
               <p className="text-lg text-slate-500">A one-time setup fee of <strong className="text-slate-900 dark:text-white font-black">₦10,000</strong> applies to all plans for infrastructure initialization.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
               {plans.map((p, i) => (
                  <Card key={i} className={cn(
                     "rounded-[3rem] border-2 flex flex-col relative transition-all duration-500",
                     p.popular 
                        ? "border-indigo-600 dark:border-indigo-500 shadow-2xl scale-105 z-10" 
                        : "border-slate-100 dark:border-slate-800 shadow-sm"
                  )}>
                     {p.popular && (
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
                           Most Popular
                        </div>
                     )}
                     <CardHeader className="p-10 pb-4 text-center">
                        <CardTitle className="text-2xl font-black">{p.name}</CardTitle>
                        <CardDescription className="pt-2">{p.description}</CardDescription>
                     </CardHeader>
                     <CardContent className="px-10 pb-8 space-y-10 flex-1">
                        <div className="text-center">
                           <div className="text-5xl font-black tracking-tighter">₦{p.price}</div>
                           <div className="text-slate-500 font-medium text-sm mt-1">/ month</div>
                        </div>
                        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-3xl text-center">
                           <span className="font-bold text-indigo-600">{p.emails}</span> emails per month
                        </div>
                        <ul className="space-y-4">
                           {p.features.map((f, j) => (
                              <li key={j} className="flex items-center gap-3 text-sm font-medium">
                                 <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
                                 {f}
                              </li>
                           ))}
                        </ul>
                     </CardContent>
                     <CardFooter className="p-10 pt-0">
                        <Link href={`/onboarding?plan=${p.name.toLowerCase()}`} className="w-full">
                           <Button className={cn(
                              "w-full h-14 rounded-2xl font-black text-lg transition-all active:scale-95 shadow-lg shadow-indigo-100 dark:shadow-none",
                              p.popular ? "bg-indigo-600 hover:bg-indigo-700 text-white" : "bg-slate-900 hover:bg-black text-white dark:bg-slate-100 dark:hover:bg-white dark:text-slate-900"
                           )}>
                              Get Started
                           </Button>
                        </Link>
                     </CardFooter>
                  </Card>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950">
         <div className="container mx-auto px-6 text-center space-y-10">
            <h1 className="text-5xl font-black tracking-tight max-w-2xl mx-auto leading-tight">
               Professionalize your corporate communication today.
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Link href="/onboarding">
                  <Button className="h-16 px-12 bg-indigo-600 hover:bg-indigo-700 text-white rounded-3xl font-black text-xl shadow-xl shadow-indigo-100 dark:shadow-none">
                     Join EmailEngine 
                  </Button>
               </Link>
               <a href="https://wa.me/2340000000000?text=Hello%21%20I%27m%20interested%20in%20EmailEngine%20but%20need%20more%20information." target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="h-16 px-12 rounded-3xl border-slate-200 dark:border-slate-800 font-black text-xl opacity-60 hover:opacity-100">
                     Support <Globe className="w-5 h-5 ml-3" />
                  </Button>
               </a>
            </div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-widest flex items-center justify-center gap-4">
               <span>© 2026 EmailEngine B2B System</span>
               <span className="w-1 h-1 rounded-full bg-slate-300" />
               <Link href="/privacy" className="hover:text-indigo-600">Privacy Policy</Link>
            </p>
         </div>
      </section>
    </div>
  );
}
