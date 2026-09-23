import { NextResponse } from "next/server";
import { getSystemSetting } from "@/lib/googleSheetsDomains";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const silverPrice = await getSystemSetting("PLAN_SILVER_PRICE", "15000");
    const goldPrice = await getSystemSetting("PLAN_GOLD_PRICE", "45000");
    const premiumPrice = await getSystemSetting("PLAN_PREMIUM_PRICE", "95000");
    const setupFee = await getSystemSetting("PLAN_SETUP_FEE", "10000");

    const plans = {
      silver: { price: parseInt(silverPrice || "15000", 10), emails: "5,000", setup: parseInt(setupFee || "10000", 10) },
      gold: { price: parseInt(goldPrice || "45000", 10), emails: "25,000", setup: parseInt(setupFee || "10000", 10) },
      premium: { price: parseInt(premiumPrice || "95000", 10), emails: "Unlimited", setup: parseInt(setupFee || "10000", 10) },
    };

    return NextResponse.json(plans);
  } catch (error) {
    console.error("Public Plans API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
