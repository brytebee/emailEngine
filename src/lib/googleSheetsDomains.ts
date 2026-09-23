import { GoogleSpreadsheet } from "google-spreadsheet";
import { JWT } from "google-auth-library";

export interface DomainRecord {
  domain: string;
  encryptedKey: string;
  createdAt: string;
}

export interface TenantDomainRecord {
  id: string;
  orgId: string;
  domainName: string;
  resendDomainId: string;
  status: 'pending' | 'verified';
  createdAt: string;
}

export interface AuthRecord {
  username: string;
  email: string;
  passwordHash: string;
  resetToken?: string;
  tokenExpiry?: string;
}

export interface OrganizationRecord {
  id: string;
  name: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  billingStatus: 'active' | 'delinquent' | 'suspended';
  plan: string;
  setupPaid: boolean;
  emailLimit: number;
  expiryDate: string;
  createdAt: string;
}

export interface UserRecord {
  id: string;
  orgId: string;
  email: string;
  passwordHash: string;
  role: 'superadmin' | 'admin' | 'staff';
  fullName: string;
  title: string;
  signatureHtml: string;
  createdAt: string;
}

export interface MessageRecord {
  id: string;
  mailboxId: string; // The User ID who owns the inbox
  direction: 'in' | 'out';
  subject: string;
  htmlBody: string;
  attachmentsJson: string;
  from: string;
  to: string;
  timestamp: string;
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
        console.warn(`Google API 503 error. Retrying... (${retries} attempts left)`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        continue;
      }
      
      console.error("Error loading spreadsheet:", loadError);
      throw loadError;
    }
  }

  // --- Ensure Sheets Exist ---
  
  let domainsSheet = doc.sheetsByTitle["Domains"];
  if (!domainsSheet) {
    domainsSheet = await doc.addSheet({
      title: "Domains",
      headerValues: ["Domain", "Encrypted Key", "Created At"],
    });
  }

  let tenantDomainsSheet = doc.sheetsByTitle["TenantDomains"];
  if (!tenantDomainsSheet) {
    tenantDomainsSheet = await doc.addSheet({
      title: "TenantDomains",
      headerValues: ["ID", "Org ID", "Domain Name", "Resend Domain ID", "Status", "Created At"],
    });
  }

  let authSheet = doc.sheetsByTitle["DomainAuth"];
  if (!authSheet) {
    authSheet = await doc.addSheet({
      title: "DomainAuth",
      headerValues: ["Username", "Email", "Password Hash", "Reset Token", "Token Expiry"],
    });
  }

  let orgsSheet = doc.sheetsByTitle["Organizations"];
  if (!orgsSheet) {
    orgsSheet = await doc.addSheet({
      title: "Organizations",
      headerValues: ["ID", "Name", "Logo URL", "Primary Color", "Secondary Color", "Billing Status", "Plan", "Setup Paid", "Email Limit", "Expiry Date", "Created At"],
    });
  }

  let usersSheet = doc.sheetsByTitle["Users"];
  if (!usersSheet) {
    usersSheet = await doc.addSheet({
      title: "Users",
      headerValues: ["ID", "Org ID", "Email", "Password Hash", "Role", "Full Name", "Title", "Signature HTML", "Created At"],
    });
  }

  let messagesSheet = doc.sheetsByTitle["Messages"];
  if (!messagesSheet) {
    messagesSheet = await doc.addSheet({
      title: "Messages",
      headerValues: ["ID", "Mailbox ID", "Direction", "Subject", "HTML Body", "Attachments JSON", "From", "To", "Timestamp"],
    });
  }

  let systemSettingsSheet = doc.sheetsByTitle["SystemSettings"];
  if (!systemSettingsSheet) {
    systemSettingsSheet = await doc.addSheet({
      title: "SystemSettings",
      headerValues: ["Key", "Value", "Updated At"],
    });
  }

  return { doc, domainsSheet, tenantDomainsSheet, authSheet, orgsSheet, usersSheet, messagesSheet, systemSettingsSheet };
};

// --- DOMAINS (Legacy) ---

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

// --- TENANT DOMAINS ---

export const getTenantDomains = async (orgId?: string): Promise<TenantDomainRecord[]> => {
  const { tenantDomainsSheet } = await initializeGoogleSheet();
  const rows = await tenantDomainsSheet.getRows();
  let records = rows.map(row => ({
    id: row.get("ID") || "",
    orgId: row.get("Org ID") || "",
    domainName: row.get("Domain Name") || "",
    resendDomainId: row.get("Resend Domain ID") || "",
    status: (row.get("Status") as any) || "pending",
    createdAt: row.get("Created At") || "",
  })).filter(d => d.id);

  if (orgId) {
    records = records.filter(d => d.orgId === orgId);
  }
  return records;
};

export const saveTenantDomain = async (domain: TenantDomainRecord): Promise<void> => {
  const { tenantDomainsSheet } = await initializeGoogleSheet();
  const rows = await tenantDomainsSheet.getRows();
  const existingRow = rows.find(row => row.get("ID") === domain.id || row.get("Domain Name") === domain.domainName);
  
  const data = {
    ID: domain.id,
    "Org ID": domain.orgId,
    "Domain Name": domain.domainName,
    "Resend Domain ID": domain.resendDomainId,
    Status: domain.status,
    "Created At": domain.createdAt || new Date().toISOString(),
  };

  if (existingRow) {
    Object.entries(data).forEach(([key, value]) => existingRow.set(key, value));
    await existingRow.save();
  } else {
    await tenantDomainsSheet.addRow(data);
  }
};

export const deleteTenantDomain = async (id: string): Promise<void> => {
  const { tenantDomainsSheet } = await initializeGoogleSheet();
  const rows = await tenantDomainsSheet.getRows();
  const existingRow = rows.find(row => row.get("ID") === id);
  if (existingRow) {
    await existingRow.delete();
  }
};

// --- AUTH (Legacy) ---

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
  const row = rows.find((r) => r.get("Username") === username);
  if (row) {
    await row.delete();
  }
};

// --- NEW MULTI-TENANT ENTITIES ---

// Organizations
export const getOrganizations = async (): Promise<OrganizationRecord[]> => {
  const { orgsSheet } = await initializeGoogleSheet();
  const rows = await orgsSheet.getRows();
  return rows.map(row => ({
    id: row.get("ID") || "",
    name: row.get("Name") || "",
    logoUrl: row.get("Logo URL") || "",
    primaryColor: row.get("Primary Color") || "#000000",
    secondaryColor: row.get("Secondary Color") || "#ffffff",
    billingStatus: row.get("Billing Status") as any || "suspended",
    plan: row.get("Plan") || "free",
    setupPaid: row.get("Setup Paid") === "TRUE",
    emailLimit: parseInt(row.get("Email Limit") || "0"),
    expiryDate: row.get("Expiry Date") || "",
    createdAt: row.get("Created At") || "",
  })).filter(o => o.id);
};

export const saveOrganization = async (org: OrganizationRecord): Promise<void> => {
  const { orgsSheet } = await initializeGoogleSheet();
  const rows = await orgsSheet.getRows();
  const existingRow = rows.find(row => row.get("ID") === org.id);
  
  const data = {
    ID: org.id,
    Name: org.name,
    "Logo URL": org.logoUrl,
    "Primary Color": org.primaryColor,
    "Secondary Color": org.secondaryColor,
    "Billing Status": org.billingStatus,
    Plan: org.plan,
    "Setup Paid": org.setupPaid ? "TRUE" : "FALSE",
    "Email Limit": org.emailLimit.toString(),
    "Expiry Date": org.expiryDate,
    "Created At": org.createdAt || new Date().toISOString(),
  };

  if (existingRow) {
    Object.entries(data).forEach(([key, value]) => existingRow.set(key, value));
    await existingRow.save();
  } else {
    await orgsSheet.addRow(data);
  }
};

// Users
export const getUsers = async (orgId?: string): Promise<UserRecord[]> => {
  const { usersSheet } = await initializeGoogleSheet();
  const rows = await usersSheet.getRows();
  let records = rows.map(row => ({
    id: row.get("ID") || "",
    orgId: row.get("Org ID") || "",
    email: row.get("Email") || "",
    passwordHash: row.get("Password Hash") || "",
    role: (row.get("Role") as any) || "staff",
    fullName: row.get("Full Name") || "",
    title: row.get("Title") || "",
    signatureHtml: row.get("Signature HTML") || "",
    createdAt: row.get("Created At") || "",
  })).filter(u => u.id);

  if (orgId) {
    records = records.filter(u => u.orgId === orgId);
  }
  return records;
};

export const saveUser = async (user: UserRecord): Promise<void> => {
  const { usersSheet } = await initializeGoogleSheet();
  const rows = await usersSheet.getRows();
  const existingRow = rows.find(row => row.get("ID") === user.id || row.get("Email") === user.email);
  
  const data = {
    ID: user.id,
    "Org ID": user.orgId,
    Email: user.email,
    "Password Hash": user.passwordHash,
    Role: user.role,
    "Full Name": user.fullName,
    Title: user.title,
    "Signature HTML": user.signatureHtml,
    "Created At": user.createdAt || new Date().toISOString(),
  };

  if (existingRow) {
    Object.entries(data).forEach(([key, value]) => existingRow.set(key, value));
    await existingRow.save();
  } else {
    await usersSheet.addRow(data);
  }
};

// Messages with basic limit monitoring (sharding logic placeholder)
const ROW_LIMIT = 50000; // Safe threshold for single sheet performance

export const saveMessage = async (msg: MessageRecord): Promise<void> => {
  const { doc } = await initializeGoogleSheet();
  
  // Logic to find the current active messages sheet
  let activeSheetName = "Messages";
  let sheet = doc.sheetsByTitle[activeSheetName];
  
  // This is a simple sharding logic: if Messages is full, check Messages_1, etc.
  if (sheet.rowCount > ROW_LIMIT) {
     console.warn("Message sheet approaching limit. Consider sharding.");
  }

  await sheet.addRow({
    ID: msg.id,
    "Mailbox ID": msg.mailboxId,
    Direction: msg.direction,
    Subject: msg.subject,
    "HTML Body": msg.htmlBody,
    "Attachments JSON": msg.attachmentsJson,
    From: msg.from,
    To: msg.to,
    Timestamp: msg.timestamp || new Date().toISOString(),
  });
};

export const getMessages = async (mailboxId: string): Promise<MessageRecord[]> => {
  const { messagesSheet } = await initializeGoogleSheet();
  const rows = await messagesSheet.getRows();
  return rows
    .filter(row => row.get("Mailbox ID") === mailboxId)
    .map(row => ({
      id: row.get("ID") || "",
      mailboxId: row.get("Mailbox ID") || "",
      direction: (row.get("Direction") as any) || "in",
      subject: row.get("Subject") || "",
      htmlBody: row.get("HTML Body") || "",
      attachmentsJson: row.get("Attachments JSON") || "[]",
      from: row.get("From") || "",
      to: row.get("To") || "",
      timestamp: row.get("Timestamp") || "",
    }));
};

export const getMessagesCount = async (orgId: string): Promise<number> => {
   const { messagesSheet, usersSheet } = await initializeGoogleSheet();
   const userRows = await usersSheet.getRows();
   const orgUserIds = userRows
     .filter(row => row.get("Org ID") === orgId)
     .map(row => row.get("ID"));
 
   const msgRows = await messagesSheet.getRows();
   return msgRows.filter(row => orgUserIds.includes(row.get("Mailbox ID"))).length;
};

// --- SYSTEM SETTINGS ---

export const getSystemSetting = async (key: string, defaultValue: string | null = null): Promise<string | null> => {
   const { systemSettingsSheet } = await initializeGoogleSheet();
   const rows = await systemSettingsSheet.getRows();
   const row = rows.find(r => r.get("Key") === key);
   if (row && row.get("Value") !== undefined) {
      return row.get("Value");
   }
   return defaultValue;
};

export const saveSystemSetting = async (key: string, value: string): Promise<void> => {
   const { systemSettingsSheet } = await initializeGoogleSheet();
   const rows = await systemSettingsSheet.getRows();
   const existingRow = rows.find(r => r.get("Key") === key);

   if (existingRow) {
      existingRow.set("Value", value);
      existingRow.set("Updated At", new Date().toISOString());
      await existingRow.save();
   } else {
      await systemSettingsSheet.addRow({
         Key: key,
         Value: value,
         "Updated At": new Date().toISOString()
      });
   }
};
