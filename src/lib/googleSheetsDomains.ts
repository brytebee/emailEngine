import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export interface DomainRecord {
  domain: string;
  encryptedKey: string;
  createdAt: string;
}

export interface AuthRecord {
  username: string;
  email: string;
  passwordHash: string;
  resetToken?: string;
  tokenExpiry?: string;
}

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

  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID, serviceAccountAuth);

  let retries = 3;
  while (retries > 0) {
    try {
      await doc.loadInfo();
      break; // Success!
    } catch (loadError: any) {
      if (
        loadError?.response?.status === 503 || 
        loadError?.message?.includes("503") ||
        loadError?.message?.includes("EAI_AGAIN") ||
        loadError?.message?.includes("ECONNRESET")
      ) {
        retries--;
        if (retries === 0) {
          throw new Error("Google Sheets connection failed: Service Unavailable (503). Max retries reached.");
        }
        // Wait 1 second before retrying
        console.warn(`Google API 503 error. Retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      console.error("Error loading spreadsheet:", loadError);
      if (
        loadError instanceof Error &&
        (loadError.message.includes("DECODER") ||
          loadError.message.includes("unsupported") ||
          loadError.message.includes("SSL"))
      ) {
        throw new Error("Google Sheets connection failed: SSL/TLS configuration issue. Please check your service account credentials.");
      }
      throw loadError;
    }
  }

  let domainsSheet = doc.sheetsByTitle["Domains"];
  if (!domainsSheet) {
    domainsSheet = await doc.addSheet({
      title: "Domains",
      headerValues: ["Domain", "Encrypted Key", "Created At"],
    });
  }

  let authSheet = doc.sheetsByTitle["DomainAuth"];
  if (!authSheet) {
    authSheet = await doc.addSheet({
      title: "DomainAuth",
      headerValues: ["Username", "Email", "Password Hash", "Reset Token", "Token Expiry"],
    });
  }
  // Note: Do NOT call setHeaderRow on existing sheets — it rewrites and can corrupt row data.

  return { doc, domainsSheet, authSheet };
};

// --- DOMAINS ---

export const getDomains = async (): Promise<DomainRecord[]> => {
  const { domainsSheet } = await initializeGoogleSheet();
  const rows = await domainsSheet.getRows();
  return rows.map((row) => ({
    domain: row.get("Domain") || "",
    encryptedKey: row.get("Encrypted Key") || "",
    createdAt: row.get("Created At") || "",
  })).filter(d => d.domain);
};

export const addOrUpdateDomain = async (domain: string, encryptedKey: string): Promise<void> => {
  const { domainsSheet } = await initializeGoogleSheet();
  const rows = await domainsSheet.getRows();
  
  const existingRow = rows.find((row) => row.get("Domain") === domain);
  if (existingRow) {
    existingRow.set("Encrypted Key", encryptedKey);
    await existingRow.save();
  } else {
    await domainsSheet.addRow({
      Domain: domain,
      "Encrypted Key": encryptedKey,
      "Created At": new Date().toISOString(),
    });
  }
};

export const deleteDomain = async (domain: string): Promise<void> => {
  const { domainsSheet } = await initializeGoogleSheet();
  const rows = await domainsSheet.getRows();
  const existingRow = rows.find((row) => row.get("Domain") === domain);
  if (existingRow) {
    await existingRow.delete();
  }
};

// --- AUTH ---

export const getAuthRecords = async (): Promise<AuthRecord[]> => {
  const { authSheet } = await initializeGoogleSheet();
  const rows = await authSheet.getRows();
  return rows.map((row) => ({
    username: row.get("Username") || "",
    email: row.get("Email") || "",
    passwordHash: row.get("Password Hash") || "",
    resetToken: row.get("Reset Token") || "",
    tokenExpiry: row.get("Token Expiry") || "",
  })).filter(a => a.username);
};

export const setAuthRecord = async (record: AuthRecord): Promise<void> => {
  const { authSheet } = await initializeGoogleSheet();
  const rows = await authSheet.getRows();
  const existingRow = rows.find((row) => row.get("Username") === record.username);
  
  if (existingRow) {
    existingRow.set("Email", record.email);
    existingRow.set("Password Hash", record.passwordHash);
    existingRow.set("Reset Token", record.resetToken || "");
    existingRow.set("Token Expiry", record.tokenExpiry || "");
    await existingRow.save();
  } else {
    await authSheet.addRow({
      Username: record.username,
      Email: record.email,
      "Password Hash": record.passwordHash,
      "Reset Token": record.resetToken || "",
      "Token Expiry": record.tokenExpiry || "",
    });
  }
};

export const deleteAuthRecord = async (username: string): Promise<void> => {
  const { authSheet } = await initializeGoogleSheet();
  const rows = await authSheet.getRows();
  const existingRow = rows.find((row) => row.get("Username") === username);
  if (existingRow) {
    await existingRow.delete();
  }
};
