import { NextResponse } from "next/server";
import { getOrganizations, saveOrganization, AuthRecord } from "@/lib/googleSheetsDomains";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  
  try {
    const { reference } = await req.json();

    if (!reference) {
      return NextResponse.json({ error: "Missing transaction reference" }, { status: 400 });
    }

    // Call Paystack Verify API
    const verifyReq = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
      },
    });

    const verifyData = await verifyReq.json();

    if (!verifyData.status) {
      return NextResponse.json({ error: verifyData.message || "Paystack verification failed" }, { status: 400 });
    }

    const { status, metadata } = verifyData.data;

    if (status !== "success") {
      return NextResponse.json({ error: "Transaction was not successful" }, { status: 400 });
    }

    // Ensure metadata contains the orgId
    const orgId = metadata.orgId;
    if (!orgId) {
       return NextResponse.json({ error: "Invalid metadata payload" }, { status: 400 });
    }

    // Prevent random authenticated users from verifying a transaction that doesn't belong to them
    if (session && (session?.user as any)?.orgId !== orgId) {
      return NextResponse.json({ error: "Suspicious activity detected" }, { status: 403 });
    }

    // Fetch and Update the Organization
    const orgs = await getOrganizations();
    const org = orgs.find(o => o.id === orgId);

    if (!org) {
       return NextResponse.json({ error: "Internal Error: Organization not found mapping to payload" }, { status: 404 });
    }

    // Set SetupPaid to true, and active
    org.setupPaid = true;
    org.billingStatus = "active";
    if(metadata.planId) {
        org.plan = metadata.planId;
    }
    
    // Default Expiry mapping
    if (metadata.isInitialSetup) {
        const nextMonth = new Date();
        nextMonth.setMonth(nextMonth.getMonth() + 1);
        org.expiryDate = nextMonth.toISOString();
    }

    await saveOrganization(org as any);

    return NextResponse.json({ success: true, orgId: org.id });

  } catch (error) {
    console.error("Billing Verification Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
