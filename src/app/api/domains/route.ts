import { NextResponse } from "next/server";
import { getDomains, addOrUpdateDomain } from "@/lib/googleSheetsDomains";
import { clearDomainCache } from "@/config/email-domains";
import { encrypt } from "@/lib/encryption";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  const isAuthorized = await verifyAdmin();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const domains = await getDomains();
    // Do NOT return the decrypted key. We'll only return a masked version.
    const safeDomains = domains.map(d => ({
      domain: d.domain,
      createdAt: d.createdAt,
      isConfigured: !!d.encryptedKey
    }));
    
    return NextResponse.json(safeDomains);
  } catch (error) {
    console.error("GET /api/domains error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const isAuthorized = await verifyAdmin();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { domain, apiKey } = await req.json();
    if (!domain || !apiKey) {
      return NextResponse.json({ error: "Domain and API Key are required" }, { status: 400 });
    }

    const encryptedKey = encrypt(apiKey);
    await addOrUpdateDomain(domain, encryptedKey);
    clearDomainCache();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/domains error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
