import { NextResponse } from "next/server";
import { getDomains } from "@/lib/googleSheetsDomains";
import { decrypt } from "@/lib/encryption";
import { verifyAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  const isAuthorized = await verifyAdmin();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { domain } = await req.json();
    if (!domain) {
        return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    const domains = await getDomains();
    const domainRecord = domains.find(d => d.domain === domain);

    if (!domainRecord) {
      return NextResponse.json({ error: "Domain not found" }, { status: 404 });
    }

    const decryptedKey = decrypt(domainRecord.encryptedKey);

    return NextResponse.json({ apiKey: decryptedKey });
  } catch (error) {
    console.error("POST /api/domains/reveal error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
