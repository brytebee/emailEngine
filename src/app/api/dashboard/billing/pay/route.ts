import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getOrganizations, getSystemSetting } from "@/lib/googleSheetsDomains";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: Request) {
  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { planId, isInitialSetup } = await req.json();

    if (!planId) {
      return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
    }

    const orgs = await getOrganizations();
    const org = orgs.find(o => o.id === user.orgId);

    if (!org) {
       return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // --- Dynamic Pricing Engine ---
    let planPrice = 0;
    if (planId === "silver") planPrice = parseInt(await getSystemSetting("PLAN_SILVER_PRICE", "15000") || "15000", 10);
    else if (planId === "gold") planPrice = parseInt(await getSystemSetting("PLAN_GOLD_PRICE", "45000") || "45000", 10);
    else if (planId === "premium") planPrice = parseInt(await getSystemSetting("PLAN_PREMIUM_PRICE", "95000") || "95000", 10);
    else return NextResponse.json({ error: "Invalid Plan ID" }, { status: 400 });

    const setupFee = isInitialSetup ? parseInt(await getSystemSetting("PLAN_SETUP_FEE", "10000") || "10000", 10) : 0;
    const targetAmount = planPrice + setupFee;

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

    // Initialize Paystack Transaction
    // https://paystack.com/docs/api/transaction/#initialize
    const res = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user.email,
        amount: Math.round(targetAmount * 100), // Paystack expects kobo/cents
        callback_url: `${baseUrl}/dashboard/billing/verify`,
        metadata: {
          orgId: user.orgId,
          planId: planId,
          userId: user.id,
          isInitialSetup: !!isInitialSetup
        }
      }),
    });

    const data = await res.json();

    if (!data.status) {
      return NextResponse.json({ error: data.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      authorization_url: data.data.authorization_url,
      reference: data.data.reference
    });

  } catch (error: any) {
    console.error("Paystack Init Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
