import { NextResponse } from "next/server";
import { deleteDomain } from "@/lib/googleSheetsDomains";
import { clearDomainCache } from "@/config/email-domains";
import { verifyAdmin } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { domain: string } }
) {
  const isAuthorized = await verifyAdmin();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { domain } = params;
    if (!domain) {
      return NextResponse.json({ error: "Domain parameter is missing" }, { status: 400 });
    }

    await deleteDomain(domain);
    clearDomainCache();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/domains/[domain] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
