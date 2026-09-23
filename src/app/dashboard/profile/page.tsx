"use client";

import React, { useState, useEffect } from "react";
import { 
  User, 
  Briefcase, 
  FileSignature, 
  Save, 
  CheckCircle2, 
  X, 
  Loader2, 
  Info,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface UserProfile {
  id: string;
  fullName: string;
  title: string;
  signatureHtml: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [title, setTitle] = useState("");
  const [signatureHtml, setSignatureHtml] = useState("");

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dashboard/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
        setFullName(data.fullName || "");
        setTitle(data.title || "");
        setSignatureHtml(data.signatureHtml || "");
      }
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/dashboard/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, title, signatureHtml }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: "Profile updated successfully" });
      } else {
        setMessage({ type: 'error', text: "Failed to update profile" });
      }
    } catch (error) {
      setMessage({ type: 'error', text: "An error occurred" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-500 pb-20">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your personal information and email signature.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        {/* Basic Info Section */}
        <section className="grid md:grid-cols-3 gap-8 items-start">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-600" /> Basic Info
            </h3>
            <p className="text-sm text-slate-500">How you appear as a sender of emails.</p>
          </div>
          
          <Card className="md:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-8 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-xl">Sender Details</CardTitle>
              <CardDescription>Update your name and professional title.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
              <div className="space-y-3">
                <Label htmlFor="fullName">Full Name</Label>
                <div className="relative">
                   <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <Input 
                    id="fullName" 
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. John Doe"
                    className="pl-10 h-11 rounded-xl"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="title">Job Title</Label>
                <div className="relative">
                   <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <Input 
                    id="title" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Head of Growth"
                    className="pl-10 h-11 rounded-xl"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Signature Section */}
        <section className="grid md:grid-cols-3 gap-8 items-start">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FileSignature className="w-5 h-5 text-indigo-600" /> Email Signature
            </h3>
            <p className="text-sm text-slate-500">Your signature will be appended to the bottom of all outgoing emails.</p>
          </div>
          
          <Card className="md:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-8 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-xl">Signature Builder</CardTitle>
              <CardDescription>Support for HTML and rich text signatures.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                   <Label htmlFor="signatureHtml">Signature Content (HTML)</Label>
                   <Badge variant="outline" className="text-xs font-medium">Rich Text Placeholder</Badge>
                </div>
                <Textarea 
                  id="signatureHtml" 
                  value={signatureHtml}
                  onChange={(e) => setSignatureHtml(e.target.value)}
                  placeholder="Enter HTML or Markdown for your signature..."
                  className="min-h-[150px] font-mono text-sm leading-relaxed p-4 rounded-xl border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950"
                />
              </div>

              {/* Signature Preview */}
              <div className="space-y-4">
                <Label className="flex items-center gap-2">
                   <Eye className="w-4 h-4 text-slate-400" /> Preview
                </Label>
                <div 
                    className="p-6 rounded-2xl border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-inner min-h-[120px] transition-all duration-300"
                    dangerouslySetInnerHTML={{ __html: signatureHtml || '<span class="text-slate-400 italic">No signature created yet. Your name and title will be used by default.</span>' }}
                />
                <div className="p-4 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded-xl flex gap-3">
                   <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                   <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                     Your signature is added automatically during the email rendering process. You don't need to include it manually in each message.
                   </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 dark:bg-slate-800/30 py-6 px-8 border-t border-slate-100 dark:border-slate-800">
               <Button 
                type="submit" 
                className="w-full bg-indigo-600 hover:bg-indigo-700 h-12 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none font-semibold transition-all hover:scale-[1.01]"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                Update Profile & Signature
              </Button>
            </CardFooter>
          </Card>
        </section>
      </form>

      {/* Success Toast */}
      {message && (
        <div className={cn(
          "fixed bottom-8 right-8 z-[100] animate-in slide-in-from-right-10 duration-300 p-4 rounded-2xl shadow-2xl flex items-center gap-3 border transition-all",
          message.type === 'success' 
            ? "bg-green-600 text-white border-green-500" 
            : "bg-red-600 text-white border-red-500"
        )}>
          {message.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
          <span className="font-semibold">{message.text}</span>
          <button onClick={() => setMessage(null)} className="ml-4 hover:bg-white/20 p-1 rounded-md transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
