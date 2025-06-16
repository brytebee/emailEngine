// hooks/useEmailLimit.ts

import { useState, useEffect, useCallback } from "react";

interface EmailLimitState {
  dailyLimit: number;
  emailsSent: number;
  remainingEmails: number;
  canSendEmail: boolean;
  showWarning: boolean;
  resetTime: Date | null;
  isLoading: boolean;
  error: string | null;
}

interface EmailLimitHook extends EmailLimitState {
  refreshEmailCount: () => Promise<void>;
  // Test functions - remove before production
  setEmailsSentForTest: (count: number) => void;
  resetForTest: () => void;
}

export function useEmailLimit(
  username: string,
  dailyLimit: number = 20
): EmailLimitHook {
  const [emailsSent, setEmailsSent] = useState<number>(0);
  const [resetTime, setResetTime] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const remainingEmails = Math.max(0, dailyLimit - emailsSent);
  const canSendEmail = emailsSent < dailyLimit;
  const showWarning = remainingEmails <= 5 && remainingEmails > 0;

  // Fetch current email count from API
  const refreshEmailCount = useCallback(async () => {
    if (!username) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/v1/do-not-reply?username=${encodeURIComponent(username)}`
      );
      const data = await response.json();

      if (response.ok && data.message === "success") {
        const tracking = data.emailTracking;
        setEmailsSent(tracking.emailsSent);
        if (tracking.resetTime) {
          setResetTime(new Date(tracking.resetTime));
        }
      } else {
        setError(data.error || "Failed to fetch email count");
      }
    } catch (err) {
      setError("Network error while fetching email count");
      console.error("Error fetching email count:", err);
    } finally {
      setIsLoading(false);
    }
  }, [username]);

  // Load initial data when component mounts or username changes
  useEffect(() => {
    if (username) {
      refreshEmailCount();
    }
  }, [username, refreshEmailCount]);

  // Auto-refresh every 5 minutes to keep count in sync
  useEffect(() => {
    if (!username) return;

    const interval = setInterval(() => {
      refreshEmailCount();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [username, refreshEmailCount]);

  // Test functions - remove these before pushing to production
  const setEmailsSentForTest = useCallback(
    (count: number) => {
      if (process.env.NODE_ENV === "development") {
        setEmailsSent(Math.max(0, Math.min(count, dailyLimit + 5))); // Allow slight overflow for testing
      }
    },
    [dailyLimit]
  );

  const resetForTest = useCallback(() => {
    if (process.env.NODE_ENV === "development") {
      setEmailsSent(0);
      setResetTime(null);
    }
  }, []);

  return {
    dailyLimit,
    emailsSent,
    remainingEmails,
    canSendEmail,
    showWarning,
    resetTime,
    isLoading,
    error,
    refreshEmailCount,
    // Test functions
    setEmailsSentForTest,
    resetForTest,
  };
}
