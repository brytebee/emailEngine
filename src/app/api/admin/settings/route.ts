import { NextResponse } from "next/server";
import { getSystemSetting, saveSystemSetting } from "@/lib/googleSheetsDomains";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const silver = await getSystemSetting("PLAN_SILVER_LIMIT", "5");
    const gold = await getSystemSetting("PLAN_GOLD_LIMIT", "12");
    const premium = await getSystemSetting("PLAN_PREMIUM_LIMIT", "99");
    
    // Prices
    const silverPrice = await getSystemSetting("PLAN_SILVER_PRICE", "15000");
    const goldPrice = await getSystemSetting("PLAN_GOLD_PRICE", "45000");
    const premiumPrice = await getSystemSetting("PLAN_PREMIUM_PRICE", "95000");
    const setupFee = await getSystemSetting("PLAN_SETUP_FEE", "10000");

    return NextResponse.json({ 
      silver, gold, premium, 
      silverPrice, goldPrice, premiumPrice, setupFee 
    });
  } catch (error) {
    console.error("System Settings GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const isAdmin = await verifyAdmin();
  if (!isAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { 
      silver, gold, premium, 
      silverPrice, goldPrice, premiumPrice, setupFee 
    } = await req.json();

    if (silver) await saveSystemSetting("PLAN_SILVER_LIMIT", silver.toString());
    if (gold) await saveSystemSetting("PLAN_GOLD_LIMIT", gold.toString());
    if (premium) await saveSystemSetting("PLAN_PREMIUM_LIMIT", premium.toString());

    if (silverPrice) await saveSystemSetting("PLAN_SILVER_PRICE", silverPrice.toString());
    if (goldPrice) await saveSystemSetting("PLAN_GOLD_PRICE", goldPrice.toString());
    if (premiumPrice) await saveSystemSetting("PLAN_PREMIUM_PRICE", premiumPrice.toString());
    if (setupFee) await saveSystemSetting("PLAN_SETUP_FEE", setupFee.toString());

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("System Settings POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
