import { NextResponse } from "next/server";
import { getOrganizations, saveOrganization } from "@/lib/googleSheetsDomains";
import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: Request) {
  try {
    const signature = req.headers.get("x-paystack-signature");
    if (!signature) {
       return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    const body = await req.text();
    const hash = crypto.createHmac("sha512", PAYSTACK_SECRET_KEY!).update(body).digest("hex");

    if (hash !== signature) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const event = JSON.parse(body);

    if (event.event === "charge.success") {
       const metadata = event.data.metadata;
       const orgId = metadata.orgId;
       const planId = metadata.planId;
       const isInitialSetup = metadata.isInitialSetup;

       const orgs = await getOrganizations();
       const org = orgs.find(o => o.id === orgId);

       if (org) {
          const limits: Record<string, number> = {
            silver: 5000,
            gold: 25000,
            premium: 1000000
          };

          org.billingStatus = 'active';
          org.plan = planId;
          org.emailLimit = limits[planId] || 5000;
          if (isInitialSetup) {
             org.setupPaid = true;
          }
          
          // Extend expiry by 30 days
          const currentExpiry = org.expiryDate ? new Date(org.expiryDate) : new Date();
          const newExpiry = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);
          org.expiryDate = newExpiry.toISOString();

          await saveOrganization(org);
          console.log(`Organization ${orgId} activated/renewed via Paystack.`);
       }
    }

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error("Paystack Webhook Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
