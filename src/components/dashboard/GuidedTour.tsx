"use client";

import React, { useState, useEffect, useRef } from "react";
import { STATUS } from "react-joyride";
import { useSession } from "next-auth/react";
import dynamic from "next/dynamic";

// Lazy-load Joyride with SSR disabled
const Joyride = dynamic(
  () => import("react-joyride").then((mod) => mod.Joyride as any),
  { ssr: false }
) as any;

const TOUR_STEPS: any[] = [
  {
    target: "body",
    placement: "center",
    disableBeacon: true,
    disableOverlayClose: true,
    spotlightClicks: false,
    content: (
      <div className="space-y-4 font-sans text-left">
        <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white mb-4 shadow-lg shadow-indigo-200">
          <span className="font-bold text-2xl">👋</span>
        </div>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">Welcome to EmailEngine</h3>
        <p className="text-slate-500 text-sm leading-relaxed">
          Your professional workspace is now active. Follow this quick tour to configure your domain, verify DNS, and start sending enterprise-grade email.
        </p>
      </div>
    ),
  },
  {
    target: ".tour-step-domains",
    placement: "right",
    disableBeacon: true,
    content: (
      <div className="space-y-2 font-sans text-left">
        <h3 className="text-lg font-bold text-slate-900">1. Add Your Domain</h3>
        <p className="text-slate-500 text-sm">
          Connect your custom domain (e.g., yourcompany.com) so emails are sent from your brand — not a generic address.
        </p>
      </div>
    ),
  },
  {
    target: ".tour-step-settings",
    placement: "right",
    disableBeacon: true,
    content: (
      <div className="space-y-2 font-sans text-left">
        <h3 className="text-lg font-bold text-slate-900">2. Brand Configuration</h3>
        <p className="text-slate-500 text-sm">
          Upload your logo and configure a professional HTML email signature for your entire team.
        </p>
      </div>
    ),
  },
  {
    target: ".tour-step-team",
    placement: "right",
    disableBeacon: true,
    content: (
      <div className="space-y-2 font-sans text-left">
        <h3 className="text-lg font-bold text-slate-900">3. Onboard Your Team</h3>
        <p className="text-slate-500 text-sm">
          Add staff members and assign roles with title-based access so your entire company is unified under one workspace.
        </p>
      </div>
    ),
  },
  {
    target: ".tour-step-webmail",
    placement: "right",
    disableBeacon: true,
    content: (
      <div className="space-y-2 font-sans text-left">
        <h3 className="text-lg font-bold text-slate-900">4. Start Sending</h3>
        <p className="text-slate-500 text-sm">
          You're ready. Start composing high-deliverability emails from your professional business infrastructure.
        </p>
      </div>
    ),
  },
];

export function GuidedTour() {
  const { data: session, status } = useSession();
  const [run, setRun] = useState(false);
  const [isClientMounted, setIsClientMounted] = useState(false);
  const hasFired = useRef(false); // Prevent double-firing

  // Step 1: Wait for client hydration
  useEffect(() => {
    setIsClientMounted(true);
  }, []);

  // Step 2: Once authenticated AND client is mounted, start tour
  useEffect(() => {
    if (!isClientMounted) return;
    if (status !== "authenticated" || !session) return;
    if (hasFired.current) return;

    const hasCompletedTour = localStorage.getItem("tour_completed");
    const ranThisSession = sessionStorage.getItem("tour_ran");

    if (!hasCompletedTour && !ranThisSession) {
      hasFired.current = true;
      sessionStorage.setItem("tour_ran", "true");
      // Small delay to ensure sidebar nav DOM targets are fully painted
      const t = setTimeout(() => setRun(true), 800);
      return () => clearTimeout(t);
    }
  }, [isClientMounted, session, status]);

  const handleCallback = (data: any) => {
    const { status: tourStatus, type } = data;

    // Mark complete on finish or skip
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(tourStatus)) {
      setRun(false);
      localStorage.setItem("tour_completed", "true");
    }
  };

  // Don't render anything server-side or before mount
  if (!isClientMounted) return null;

  return (
    <Joyride
      callback={handleCallback}
      continuous={true}
      disableCloseOnEsc={true}
      disableOverlayClose={true}
      disableScrolling={true}
      hideCloseButton={false}
      run={run}
      scrollToFirstStep={false}
      showProgress={true}
      showSkipButton={true}
      spotlightPadding={8}
      steps={TOUR_STEPS}
      styles={{
        options: {
          zIndex: 10000,
          primaryColor: "#4f46e5",
          textColor: "#0f172a",
          backgroundColor: "#ffffff",
          overlayColor: "rgba(15, 23, 42, 0.6)",
          arrowColor: "#ffffff",
        },
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: "#4f46e5",
          borderRadius: "12px",
          fontWeight: "800",
          fontSize: "14px",
          padding: "10px 22px",
          color: "#ffffff",
        },
        buttonBack: {
          color: "#64748b",
          marginRight: 10,
          fontWeight: "600",
        },
        buttonSkip: {
          color: "#94a3b8",
          fontSize: "13px",
        },
        tooltip: {
          borderRadius: "24px",
          padding: "28px",
          boxShadow: "0 25px 60px -12px rgba(0, 0, 0, 0.3)",
          maxWidth: "360px",
        },
        spotlight: {
          borderRadius: "16px",
        },
        overlay: {
          mixBlendMode: "normal",
        },
      } as any}
    />
  );
}
