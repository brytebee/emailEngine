import { NextResponse } from "next/server";
import { saveOrganization, saveUser, OrganizationRecord, UserRecord, getOrganizations } from "@/lib/googleSheetsDomains";
import { hashPassword } from "@/lib/encryption";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    let { email, password, fullName, orgName } = await req.json();

    if (!email || !password || !fullName || !orgName) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    email = email.toLowerCase().trim();

    // Check Global Email Uniqueness
    const { getUsers } = await import('@/lib/googleSheetsDomains');
    const existingUsers = await getUsers();
    if (existingUsers.some((u: any) => u.email.toLowerCase() === email)) {
       return NextResponse.json({ error: "Email address is already tied to an existing workspace." }, { status: 409 });
    }

    const orgId = crypto.randomUUID();
    const userId = crypto.randomUUID();

    const newOrg: OrganizationRecord = {
      id: orgId,
      name: orgName,
      logoUrl: "",
      primaryColor: "#4f46e5", // Indigo-600
      secondaryColor: "#f8fafc",
      billingStatus: 'suspended',
      plan: 'none',
      setupPaid: false,
      emailLimit: 0,
      expiryDate: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };

    const newUser: UserRecord = {
      id: userId,
      orgId: orgId,
      email: email,
      passwordHash: hashPassword(password),
      role: 'admin',
      fullName: fullName,
      title: "Organization Admin",
      signatureHtml: "",
      createdAt: new Date().toISOString(),
    };

    await saveOrganization(newOrg);
    await saveUser(newUser);

    // Return the token (password hash) for initial session
    return NextResponse.json({ 
      success: true, 
      token: newUser.passwordHash,
      orgId: orgId,
      userId: userId
    });

  } catch (error: any) {
    console.error("Registration Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
