import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { saveTenantDomain, getTenantDomains, TenantDomainRecord } from "@/lib/googleSheetsDomains";
import { registerDomainWithResend } from "@/lib/resend";
import crypto from "crypto";

export async function GET() {
  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Admins and Staff can see their org's domains
    const domains = await getTenantDomains(user.orgId);
    return NextResponse.json(domains);
  } catch (error) {
    console.error("GET /api/dashboard/domains error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getUserFromRequest();
  
  // Only Admins or SuperAdmins can register domains
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const { domainName } = await req.json();

    if (!domainName) {
      return NextResponse.json({ error: "Domain name is required" }, { status: 400 });
    }

    // 1. Register with Resend
    const resendConfig = await registerDomainWithResend(domainName);

    // 2. Save to our database
    const newDomain: TenantDomainRecord = {
      id: crypto.randomUUID(),
      orgId: user.orgId,
      domainName: domainName,
      resendDomainId: resendConfig.id,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    await saveTenantDomain(newDomain);

    return NextResponse.json({
      success: true,
      domain: newDomain,
      dnsRecords: resendConfig.records // Return these for the UI guide
    });

  } catch (error: any) {
    console.error("POST /api/dashboard/domains error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
