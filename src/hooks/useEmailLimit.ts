// hooks/useEmailLimit.ts

import { useState, useEffect, useCallback } from "react";

interface EmailLimitState {
  dailyLimit: number;
  emailsSent: number;
  remainingEmails: number;
  canSendEmail: boolean;
  showWarning: boolean;
  resetTime: Date | null;
  lastReset: string | null;
  isLoading: boolean;
  error: string | null;
}

interface EmailStats {
  totalUsersToday: number;
  totalEmailsSentToday: number;
  usersAtLimit: number;
  averageEmailsPerUser: number;
}

interface EmailLimitHook extends EmailLimitState {
  refreshEmailCount: () => Promise<void>;
  getEmailStats: () => Promise<EmailStats | null>;
  exportEmailData: () => Promise<string | null>;
  cleanupOldData: (days?: number) => Promise<void>;
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
  const [lastReset, setLastReset] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const remainingEmails = Math.max(0, dailyLimit - emailsSent);
  const canSendEmail = emailsSent < dailyLimit;
  const showWarning = remainingEmails <= 5 && remainingEmails > 0;

  // Fetch current email count from API (now using Excel backend)
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
        setLastReset(tracking.lastReset);
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

  // Get email statistics from Excel
  const getEmailStats = useCallback(async (): Promise<EmailStats | null> => {
    try {
      setIsLoading(true);
      const response = await fetch("/v1/do-not-reply?action=stats");
      const data = await response.json();

      if (response.ok && data.message === "success") {
        return data.stats;
      } else {
        setError(data.error || "Failed to fetch email statistics");
        return null;
      }
    } catch (err) {
      setError("Network error while fetching email statistics");
      console.error("Error fetching email statistics:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Export email data to CSV
  const exportEmailData = useCallback(async (): Promise<string | null> => {
    try {
      setIsLoading(true);
      const response = await fetch("/v1/do-not-reply?action=export");
      const data = await response.json();

      if (response.ok && data.message === "success") {
        return data.csvPath;
      } else {
        setError(data.error || "Failed to export email data");
        return null;
      }
    } catch (err) {
      setError("Network error while exporting email data");
      console.error("Error exporting email data:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cleanup old data from Excel
  const cleanupOldData = useCallback(
    async (days: number = 30): Promise<void> => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/v1/do-not-reply?action=cleanup&days=${days}`
        );
        const data = await response.json();

        if (!response.ok || data.message !== "success") {
          setError(data.error || "Failed to cleanup old data");
        }
      } catch (err) {
        setError("Network error while cleaning up old data");
        console.error("Error cleaning up old data:", err);
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

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

  // Auto-cleanup old data daily (runs once per day when component mounts)
  useEffect(() => {
    const lastCleanup = localStorage.getItem("lastEmailDataCleanup");
    const today = new Date().toDateString();

    if (!lastCleanup || lastCleanup !== today) {
      // Run cleanup in the background
      cleanupOldData(30)
        .then(() => {
          localStorage.setItem("lastEmailDataCleanup", today);
        })
        .catch(console.error);
    }
  }, [cleanupOldData]);

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
      setLastReset(null);
    }
  }, []);

  return {
    dailyLimit,
    emailsSent,
    remainingEmails,
    canSendEmail,
    showWarning,
    resetTime,
    lastReset,
    isLoading,
    error,
    refreshEmailCount,
    getEmailStats,
    exportEmailData,
    cleanupOldData,
    // Test functions
    setEmailsSentForTest,
    resetForTest,
  };
}
