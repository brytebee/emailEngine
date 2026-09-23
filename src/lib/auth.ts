import { getAuthRecords, setAuthRecord, getUsers, saveUser, UserRecord, getOrganizations, getMessagesCount } from "./googleSheetsDomains";
import { hashPassword } from "./encryption";
import { headers } from "next/headers";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

/**
 * Legacy admin verification (for /admin/domains and other existing routes)
 */
export async function verifyAdmin(): Promise<boolean> {
  const user = await getUserFromRequest();
  if (user && (user.role === 'superadmin' || user.role === 'admin')) {
    return true;
  }

  // Fallback to legacy DomainAuth sheet for backward compatibility
  const reqHeaders = headers();
  const authHeader = reqHeaders.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  
  const token = authHeader.split(" ")[1];
  const passwordHash = hashPassword(token);
  
  let legacyRecords = await getAuthRecords();
  if (legacyRecords.length === 0) {
    // Scaffold default legacy admin if empty
    await setAuthRecord({
      username: "admin",
      email: "admin@example.com",
      passwordHash: hashPassword("admin123")
    });
    legacyRecords = await getAuthRecords();
  }
  
  return legacyRecords.some(r => r.passwordHash === passwordHash || r.username === token);
}

/**
 * Extracts and verifies a user from NextAuth Session or Fallback Authorization header
 */
export async function getUserFromRequest(): Promise<(UserRecord & { 
    isSuspended?: boolean; 
    isExpired?: boolean; 
    setupPaid?: boolean;
    orgName?: string;
    plan?: string;
    emailLimit?: number;
    expiryDate?: string;
    billingStatus?: string;
    messagesUsed?: number;
}) | null> {
  
  const session = await getServerSession(authOptions);
  let userEmail = session?.user?.email;

  const users = await getUsers();

  let user: UserRecord | undefined = undefined;

  // Primary: NextAuth Session
  if (userEmail) {
    user = users.find(u => u.email === userEmail);
  }

  // Fallback: Legacy Token
  if (!user) {
    const reqHeaders = headers();
    const authHeader = reqHeaders.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      
      // Scaffold first SuperAdmin if system is entirely empty
      if (users.length === 0) {
        const defaultAdmin: UserRecord = {
          id: "admin-001",
          orgId: "system",
          email: "admin@system.com",
          passwordHash: hashPassword("admin123"),
          role: 'superadmin',
          fullName: "System Administrator",
          title: "Super Admin",
          signatureHtml: "",
          createdAt: new Date().toISOString(),
        };
        await saveUser(defaultAdmin);
        return defaultAdmin.passwordHash === hashPassword(token) ? defaultAdmin : null;
      }
      
      user = users.find(u => u.passwordHash === hashPassword(token) || u.id === token || u.passwordHash === token);
    }
  }
  if (!user) return null;

  // --- SUBSCRIPTION ENFORCEMENT ---
  const orgs = await getOrganizations();
  const org = orgs.find(o => o.id === user.orgId);

  if (!org) return user; // System/Staff might not have org yet

  // Message Count
  const messagesUsed = await getMessagesCount(user.orgId);

  // Setup Fee Check
  const setupPaid = org.setupPaid;

  // Hard Lockout if Suspended
  const isSuspended = org.billingStatus === 'suspended';
  
  // Soft Lockout / Alert if Expired
  const isExpired = new Date(org.expiryDate).getTime() < Date.now() && org.plan !== 'free';

  return { 
    ...user, 
    isSuspended, 
    isExpired, 
    setupPaid, 
    orgName: org.name,
    plan: org.plan,
    emailLimit: org.emailLimit,
    expiryDate: org.expiryDate,
    billingStatus: org.billingStatus,
    messagesUsed
  };
}

/**
 * Securely verifies if a user has a specific role
 */
export async function verifyUserRole(allowedRoles: ('superadmin' | 'admin' | 'staff')[]): Promise<UserRecord | null> {
  const user = await getUserFromRequest();
  if (!user) return null;
  
  if (allowedRoles.includes(user.role as any)) {
    return user;
  }
  
  return null;
}
