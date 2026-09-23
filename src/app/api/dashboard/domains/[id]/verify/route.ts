import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getTenantDomains, saveTenantDomain } from "@/lib/googleSheetsDomains";
import { verifyResendDomain, getResendDomain } from "@/lib/resend";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = params;

    // 1. Get domain from database
    const domains = await getTenantDomains(user.orgId);
    const domain = domains.find(d => d.id === id);

    if (!domain) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    // 2. Trigger verification with Resend
    await verifyResendDomain(domain.resendDomainId);

    // 3. Poll Resend to get updated status
    const resendStatus = await getResendDomain(domain.resendDomainId);

    // 4. Update status in our database
    if (resendStatus.status === 'verified') {
        domain.status = 'verified';
        await saveTenantDomain(domain);
    }

    return NextResponse.json({
      success: true,
      status: resendStatus.status,
      dnsRecords: resendStatus.records
    });

  } catch (error: any) {
    console.error("POST /api/dashboard/domains/[id]/verify error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
