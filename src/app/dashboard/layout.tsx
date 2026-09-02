"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
  User,
  Users,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";

type AuthState = "checking" | "authorized" | "redirecting";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState<AuthState>("checking");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  
  // Prevent checkProfile from running more than once per session resolution
  const hasCheckedRef = useRef(false);

  useEffect(() => {
    // Still resolving – hold the splash
    if (status === "loading") return;

    // Not logged in – send to login immediately
    if (status === "unauthenticated") {
      router.replace("/login");
      return;
    }

    // Already checked this session cycle – skip
    if (status === "authenticated" && hasCheckedRef.current) return;

    if (status === "authenticated") {
      hasCheckedRef.current = true;

      const checkProfile = async () => {
        // If user just came from the payment verify page, give Google Sheets
        // 1.5s to propagate the setupPaid=true row update before reading
        const isFreshFromPayment = searchParams.get("fresh") === "1";
        if (isFreshFromPayment) {
          await new Promise((r) => setTimeout(r, 1500));
        }

        try {
          const res = await fetch("/api/dashboard/profile", {
            headers: { "Cache-Control": "no-store, no-cache", "Pragma": "no-cache" },
          });

          // If 401 on a fresh-from-payment redirect, retry once after 1s
          // (JWT cookie might not be fully flushed yet)
          if (res.status === 401 && isFreshFromPayment) {
            await new Promise((r) => setTimeout(r, 1000));
            const retry = await fetch("/api/dashboard/profile", {
              headers: { "Cache-Control": "no-store, no-cache", "Pragma": "no-cache" },
            });
            if (retry.status === 401) {
              await signOut({ callbackUrl: "/login" });
              return;
            }
            const retryData = await retry.json();
            return applyProfileData(retryData);
          }

          if (res.status === 401) {
            await signOut({ callbackUrl: "/login" });
            return;
          }

          const userData = await res.json();
          applyProfileData(userData);

        } catch (e) {
          console.error("Profile check failed:", e);
          // Fail open – let the user in; individual pages handle their own errors
          setAuthState("authorized");
        }
      };

      const applyProfileData = (userData: any) => {
        // Unpaid – send back to onboarding (unless verifying payment right now)
        if (!userData.setupPaid && !pathname.includes("/billing/verify")) {
          setAuthState("redirecting");
          router.replace("/onboarding");
          return;
        }

        // Suspended – send to suspended page, but allow billing pages through
        if (
          userData.isSuspended &&
          !pathname.startsWith("/dashboard/billing") &&
          pathname !== "/suspended"
        ) {
          setAuthState("redirecting");
          router.replace("/suspended");
          return;
        }

        setAuthState("authorized");
      };

      checkProfile();
    }
    // Intentionally NOT including pathname in deps — we only re-check auth on session change
  }, [status]); // eslint-disable-line react-hooks/exhaustive-deps

  const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Domains", href: "/dashboard/domains", icon: Globe, tourClass: "tour-step-domains" },
    { name: "Webmail", href: "/dashboard/mail", icon: Mail, tourClass: "tour-step-webmail" },
    { name: "Team", href: "/dashboard/team", icon: Users, tourClass: "tour-step-team" },
    { name: "Settings", href: "/dashboard/settings", icon: Settings, tourClass: "tour-step-settings" },
  ];

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/login" });
  };

  // ── Splash screen while auth is resolving or redirecting ──────────────────
  if (authState === "checking" || authState === "redirecting") {
    return (
      <div className="fixed inset-0 bg-white dark:bg-[#0F172A] flex flex-col items-center justify-center space-y-6">
        {/* Radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(79,70,229,0.08)_0%,_transparent_70%)] pointer-events-none" />
        <div className="relative">
          <div className="w-20 h-20 border-[3px] border-indigo-100 dark:border-indigo-900/30 rounded-full" />
          <Loader2 className="w-12 h-12 animate-spin text-indigo-600 absolute top-4 left-4" />
        </div>
        <div className="space-y-1 text-center">
          <p className="text-xs font-black tracking-[0.35em] text-slate-400 uppercase animate-pulse">
            {authState === "redirecting" ? "Redirecting" : "Syncing Vault"}
          </p>
          <p className="text-[11px] text-slate-300 dark:text-slate-600">EmailEngine Enterprise</p>
        </div>
      </div>
    );
  }

  // ── Authorized – render full shell ───────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0F172A] text-slate-900 dark:text-slate-100 flex font-sans">
      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ──────────────────────────────────────────────────────── */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-[#1E293B] border-r border-slate-200 dark:border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 flex flex-col",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between flex-shrink-0">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200 dark:shadow-none">
              E
            </div>
            <span className="font-bold text-xl tracking-tight">EmailEngine</span>
          </Link>
          <button
            className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                  (item as any).tourClass || "",
                  isActive
                    ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-semibold shadow-sm"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                )}
              >
                <item.icon
                  className={cn(
                    "w-5 h-5 flex-shrink-0 transition-colors duration-200",
                    isActive
                      ? "text-indigo-600 dark:text-indigo-400"
                      : "group-hover:text-slate-700 dark:group-hover:text-slate-300"
                  )}
                />
                <span className="text-sm">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Footer */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex-shrink-0">
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">
                {(session?.user as any)?.orgName || session?.user?.name || "My Company"}
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate capitalize">
                {(session?.user as any)?.role || "Admin"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl text-sm"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-3" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* ── Main Content ─────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="h-16 lg:h-[68px] bg-white/80 dark:bg-[#0F172A]/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <span>Workspace</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-semibold text-slate-900 dark:text-slate-200 capitalize">
                {pathname.split("/").filter(Boolean).pop()?.replace(/-/g, " ") || "Overview"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-green-700 dark:text-green-400 bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 px-3 py-1 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              Active Subscription
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-10 max-w-[1400px] mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
