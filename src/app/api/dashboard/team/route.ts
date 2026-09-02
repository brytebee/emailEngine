import { NextResponse } from "next/server";
import { getUsers, saveUser, getOrganizations, getSystemSetting } from "@/lib/googleSheetsDomains";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { hashPassword } from "@/lib/encryption";
import crypto from "crypto";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const orgId = (session?.user as any)?.orgId;

    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const users = await getUsers(orgId);
    // Remove sensitive data
    const safeUsers = users.map(({ passwordHash, ...rest }) => rest);

    return NextResponse.json(safeUsers);
  } catch (error) {
    console.error("Team API GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const orgId = (session?.user as any)?.orgId;

    if (!orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let { email, fullName, title, role = 'staff', password } = await req.json();

    if (!email || !fullName || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    email = email.toLowerCase().trim();

    // --- Dynamic Team Constraints Enforcement ---
    const orgs = await getOrganizations();
    const org = orgs.find(o => o.id === orgId);
    if (!org) {
       return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Get the dynamic limit for the user's plan via System Settings
    const planKey = `PLAN_${org.plan.toUpperCase()}_LIMIT`;
    
    // Explicit Default Fallbacks for System Initial State
    let defaultLimit = "5"; 
    if (org.plan === "gold") defaultLimit = "12";
    if (org.plan === "premium") defaultLimit = "99"; 

    // Retrieve from Database or Fallback
    const maxLimitStr = await getSystemSetting(planKey, defaultLimit);
    const maxLimit = parseInt(maxLimitStr || defaultLimit, 10);

    const currentUsers = await getUsers(orgId);

    // If maxLimit is -1, it means strictly unlimited.
    if (maxLimit !== -1 && currentUsers.length >= maxLimit) {
       return NextResponse.json(
         { error: `Team capacity reached for your ${org.plan} plan (${maxLimit} max members). Please upgrade your plan.` }, 
         { status: 403 }
       );
    }

    // Ensure email doesn't conflict across users
    const existingGlobalUsers = await getUsers();
    if (existingGlobalUsers.some(u => (u.email || "").toLowerCase() === email)) {
       return NextResponse.json({ error: "Email already exists in the system." }, { status: 409 });
    }

    const newUser = {
      id: crypto.randomUUID(),
      orgId,
      email,
      passwordHash: hashPassword(password),
      role,
      fullName,
      title: title || "Team Member",
      signatureHtml: "",
      createdAt: new Date().toISOString(),
    };

    await saveUser(newUser as any);

    const { passwordHash, ...safeUser } = newUser;
    return NextResponse.json(safeUser);
  } catch (error) {
    console.error("Team API POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
