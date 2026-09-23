"use client";

import React, { useState, useEffect } from "react";
import { 
  Building2, 
  Palette, 
  Upload, 
  Save, 
  CheckCircle2, 
  X, 
  Loader2, 
  Image as ImageIcon,
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface Organization {
  id: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
}

export default function SettingsPage() {
  const [org, setOrg] = useState<Organization | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [primaryColor, setPrimaryColor] = useState("#4F46E5");
  const [secondaryColor, setSecondaryColor] = useState("#FFFFFF");

  const fetchOrg = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/dashboard/settings");
      if (res.ok) {
        const data = await res.json();
        setOrg(data);
        setName(data.name || "");
        setLogoUrl(data.logoUrl || "");
        setPrimaryColor(data.primaryColor || "#4F46E5");
        setSecondaryColor(data.secondaryColor || "#FFFFFF");
      }
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrg();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/dashboard/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, logoUrl, primaryColor, secondaryColor }),
      });

      if (res.ok) {
        setMessage({ type: 'success', text: "Settings saved successfully" });
      } else {
        setMessage({ type: 'error', text: "Failed to save settings" });
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
        <h1 className="text-3xl font-bold tracking-tight">Organization Profile</h1>
        <p className="text-slate-500 dark:text-slate-400">Customize how your company appears across the platform and in outgoing emails.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-10">
        {/* Branding Section */}
        <section className="grid md:grid-cols-3 gap-8 items-start">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Palette className="w-5 h-5 text-indigo-600" /> Branding
            </h3>
            <p className="text-sm text-slate-500">Update your company name, logo, and core branding colors.</p>
          </div>
          
          <Card className="md:col-span-2 border-slate-200 dark:border-slate-800 shadow-sm bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-3xl overflow-hidden">
            <CardHeader className="pb-8 border-b border-slate-100 dark:border-slate-800">
              <CardTitle className="text-xl">Company Details</CardTitle>
              <CardDescription>This information is used for labels and identification.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8 pt-8">
              <div className="space-y-3">
                <Label htmlFor="orgName">Organization Name</Label>
                <Input 
                  id="orgName" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Inc."
                  className="h-11 rounded-xl"
                />
              </div>

              {/* Logo Upload Simulation */}
              <div className="space-y-4">
                <Label>Organization Logo</Label>
                <div className="flex items-center gap-6 p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <div className="w-20 h-20 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center overflow-hidden shrink-0 group relative cursor-pointer">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo" className="w-full h-full object-contain p-2" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-slate-300" />
                    )}
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1 space-y-2">
                    <p className="text-sm font-medium">Upload a new logo</p>
                    <p className="text-xs text-slate-500">Recommended size: 512x512px. JPG or PNG.</p>
                    <Input 
                        placeholder="Paste logo URL (Cloudinary link)" 
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        className="h-9 text-xs rounded-lg mt-2"
                    />
                  </div>
                </div>
              </div>

              {/* Color Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <Label>Primary Color</Label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="color" 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none"
                    />
                    <Input 
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="flex-1 font-mono text-sm h-11 rounded-xl"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label>Secondary Color</Label>
                  <div className="flex items-center gap-4">
                    <input 
                      type="color" 
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-12 h-12 rounded-xl cursor-pointer bg-transparent border-none"
                    />
                    <Input 
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="flex-1 font-mono text-sm h-11 rounded-xl"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="bg-slate-50/50 dark:bg-slate-800/30 py-6 px-8 border-t border-slate-100 dark:border-slate-800 justify-between items-center">
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <Info className="w-4 h-4" />
                These will be used in your outgoing emails
              </div>
              <Button 
                type="submit" 
                className="bg-indigo-600 hover:bg-indigo-700 px-8 h-12 rounded-xl shadow-lg shadow-indigo-100 dark:shadow-none font-semibold transition-all hover:scale-[1.02]"
                disabled={isSaving}
              >
                {isSaving ? (
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                ) : (
                  <Save className="w-5 h-5 mr-2" />
                )}
                Save Branding
              </Button>
            </CardFooter>
          </Card>
        </section>

        {/* Preview Section */}
        <section className="grid md:grid-cols-3 gap-8 items-start">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600" /> Real-time Preview
            </h3>
            <p className="text-sm text-slate-500">See how your branding looks on a sample email.</p>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div 
              className="w-full bg-slate-100 dark:bg-slate-950 rounded-3xl p-8 border border-slate-200 dark:border-slate-800 shadow-inner min-h-[300px] flex flex-col items-center justify-center transition-all duration-500"
              style={{ backgroundColor: secondaryColor }}
            >
              <div className="max-w-md w-full bg-white dark:bg-slate-900 rounded-2xl shadow-xl overflow-hidden animate-in zoom-in duration-300">
                <div className="p-6 flex flex-col items-center gap-4 text-center">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center p-2 mb-2">
                    {logoUrl ? (
                      <img src={logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Building2 className="w-10 h-10 text-slate-300" />
                    )}
                  </div>
                  <h4 className="text-xl font-bold tracking-tight">{name || "Organization Name"}</h4>
                  <div className="h-px w-10 bg-slate-200 dark:bg-slate-800" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    This is a preview of how your emails will look. You can customize the button colors below.
                  </p>
                  <Button 
                    className="w-full rounded-xl h-11 font-semibold pointer-events-none"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Action Button
                  </Button>
                </div>
              </div>
              <p className="mt-6 text-xs text-slate-400 font-medium tracking-widest uppercase">Email Rendering Preview</p>
            </div>
          </div>
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
