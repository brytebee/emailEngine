// lib/googleSheetsEmailTracking.ts
import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export interface ExcelEmailTrackingData {
  username: string;
  emailsSent: number;
  dailyLimit: number;
  date: string;
  lastReset: string;
  remainingEmails: number;
}

// Get current date in YYYY-MM-DD format
const getCurrentDate = (): string => {
  return new Date().toISOString().split("T")[0];
};

// Initialize Google Sheets connection
const initializeGoogleSheet = async () => {
  if (
    !process.env.GOOGLE_SHEET_ID ||
    !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL ||
    !process.env.GOOGLE_PRIVATE_KEY
  ) {
    throw new Error("Missing required Google Sheets environment variables");
  }

  const serviceAccountAuth = new JWT({
    email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SHEET_ID,
    serviceAccountAuth
  );

  try {
    await doc.loadInfo();
  } catch (loadError) {
    console.error("Error loading spreadsheet:", loadError);

    // Handle specific SSL/TLS errors with better error messages
    if (
      loadError instanceof Error &&
      (loadError.message.includes("DECODER") ||
        loadError.message.includes("unsupported") ||
        loadError.message.includes("SSL"))
    ) {
      throw new Error(
        "Google Sheets connection failed: SSL/TLS configuration issue. Please check your service account credentials."
      );
    }

    throw loadError;
  }

  // Get or create the EmailTracking sheet
  let sheet = doc.sheetsByTitle["EmailTracking"];

  if (!sheet) {
    sheet = await doc.addSheet({
      title: "EmailTracking",
      headerValues: [
        "Username",
        "Emails Sent",
        "Daily Limit",
        "Date",
        "Last Reset",
        "Remaining Emails",
      ],
    });
  }

  return { doc, sheet };
};

// Get all email tracking data from Google Sheets
export const getAllEmailTrackingData = async (): Promise<
  ExcelEmailTrackingData[]
> => {
  try {
    const { sheet } = await initializeGoogleSheet();
    const rows = await sheet.getRows();

    return rows
      .map((row) => ({
        username: row.get("Username") || "",
        emailsSent: parseInt(row.get("Emails Sent")) || 0,
        dailyLimit: parseInt(row.get("Daily Limit")) || 20,
        date: row.get("Date") || getCurrentDate(),
        lastReset: row.get("Last Reset") || new Date().toISOString(),
        remainingEmails: parseInt(row.get("Remaining Emails")) || 0,
      }))
      .filter((item) => item.username);
  } catch (error) {
    console.error("Error loading Google Sheets tracking data:", error);
    return [];
  }
};

// Get email tracking data for specific user
export const getUserEmailTrackingFromExcel = async (
  username: string,
  dailyLimit: number = 20
): Promise<ExcelEmailTrackingData> => {
  const currentDate = getCurrentDate();
  const allData = await getAllEmailTrackingData();

  let userData = allData.find((item) => item.username === username);

  // If user doesn't exist or date is different (new day), reset count
  if (!userData || userData.date !== currentDate) {
    userData = {
      username,
      emailsSent: 0,
      dailyLimit,
      date: currentDate,
      lastReset: new Date().toISOString(),
      remainingEmails: dailyLimit,
    };

    // Update Google Sheets
    await updateUserEmailTrackingInExcel(userData);
  }

  return userData;
};

// Update or add user email tracking data in Google Sheets
export const updateUserEmailTrackingInExcel = async (
  userData: ExcelEmailTrackingData
): Promise<void> => {
  try {
    const { sheet } = await initializeGoogleSheet();
    const rows = await sheet.getRows();

    // Find existing user row
    const existingRow = rows.find(
      (row) => row.get("Username") === userData.username
    );

    if (existingRow) {
      // Update existing row
      existingRow.set("Emails Sent", userData.emailsSent);
      existingRow.set("Daily Limit", userData.dailyLimit);
      existingRow.set("Date", userData.date);
      existingRow.set("Last Reset", userData.lastReset);
      existingRow.set("Remaining Emails", userData.remainingEmails);
      await existingRow.save();
    } else {
      // Add new row
      await sheet.addRow({
        Username: userData.username,
        "Emails Sent": userData.emailsSent,
        "Daily Limit": userData.dailyLimit,
        Date: userData.date,
        "Last Reset": userData.lastReset,
        "Remaining Emails": userData.remainingEmails,
      });
    }
  } catch (error) {
    console.error("Error updating Google Sheets tracking data:", error);
    throw error;
  }
};

// Increment email count for user
export const incrementUserEmailCountInExcel = async (
  username: string,
  dailyLimit: number = 20
): Promise<ExcelEmailTrackingData> => {
  const userData = await getUserEmailTrackingFromExcel(username, dailyLimit);

  userData.emailsSent += 1;
  userData.remainingEmails = Math.max(
    0,
    userData.dailyLimit - userData.emailsSent
  );

  await updateUserEmailTrackingInExcel(userData);

  return userData;
};

// Check if user can send email
export const canUserSendEmailFromExcel = async (
  username: string,
  dailyLimit: number = 20
): Promise<boolean> => {
  const userData = await getUserEmailTrackingFromExcel(username, dailyLimit);
  return userData.emailsSent < userData.dailyLimit;
};

// Get email statistics from Google Sheets
export const getEmailStatsFromExcel = async () => {
  const allData = await getAllEmailTrackingData();
  const currentDate = getCurrentDate();

  const todayData = allData.filter((item) => item.date === currentDate);

  return {
    totalUsersToday: todayData.length,
    totalEmailsSentToday: todayData.reduce(
      (sum, item) => sum + item.emailsSent,
      0
    ),
    usersAtLimit: todayData.filter((item) => item.emailsSent >= item.dailyLimit)
      .length,
    averageEmailsPerUser:
      todayData.length > 0
        ? Math.round(
            todayData.reduce((sum, item) => sum + item.emailsSent, 0) /
              todayData.length
          )
        : 0,
  };
};

// Clean up old data (older than specified days)
export const cleanupOldExcelData = async (
  daysToKeep: number = 30
): Promise<void> => {
  try {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);
    const cutoffDateString = cutoffDate.toISOString().split("T")[0];

    const { sheet } = await initializeGoogleSheet();
    const rows = await sheet.getRows();

    let deletedCount = 0;

    // Delete rows older than cutoff date (in reverse order to avoid index issues)
    for (let i = rows.length - 1; i >= 0; i--) {
      const row = rows[i];
      const rowDate = row.get("Date");
      if (rowDate && rowDate < cutoffDateString) {
        await row.delete();
        deletedCount++;
      }
    }

    console.log(
      `Cleaned up Google Sheets data, removed ${deletedCount} old records`
    );
  } catch (error) {
    console.error("Error cleaning up Google Sheets data:", error);
  }
};

// Export data to CSV for backup
export const exportEmailTrackingToCSV = async (): Promise<string> => {
  try {
    const allData = await getAllEmailTrackingData();
    const csv = [
      "Username,Emails Sent,Daily Limit,Date,Last Reset,Remaining Emails",
      ...allData.map(
        (item) =>
          `${item.username},${item.emailsSent},${item.dailyLimit},${item.date},${item.lastReset},${item.remainingEmails}`
      ),
    ].join("\n");

    // Note: You'll need to implement file saving logic for your deployment environment
    // This is a simplified version - in production, you might want to save to cloud storage
    const csvData = Buffer.from(csv).toString("base64");

    return csvData; // Return base64 encoded CSV data
  } catch (error) {
    console.error("Error exporting to CSV:", error);
    throw error;
  }
};
