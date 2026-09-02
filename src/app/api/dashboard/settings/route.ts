import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getOrganizations, saveOrganization, OrganizationRecord } from "@/lib/googleSheetsDomains";

export async function GET() {
  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orgs = await getOrganizations();
    const org = orgs.find(o => o.id === user.orgId);

    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    return NextResponse.json(org);
  } catch (error) {
    console.error("GET /api/dashboard/settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const user = await getUserFromRequest();
  
  // Only Admins or SuperAdmins can edit branding
  if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
    return NextResponse.json({ error: "Forbidden: Admin access required" }, { status: 403 });
  }

  try {
    const data = await req.json();
    const orgs = await getOrganizations();
    const org = orgs.find(o => o.id === user.orgId);

    if (!org) {
       return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    const updatedOrg: OrganizationRecord = {
      ...org,
      name: data.name || org.name,
      logoUrl: data.logoUrl || org.logoUrl,
      primaryColor: data.primaryColor || org.primaryColor,
      secondaryColor: data.secondaryColor || org.secondaryColor,
    };

    await saveOrganization(updatedOrg);

    return NextResponse.json({ success: true, organization: updatedOrg });

  } catch (error) {
    console.error("POST /api/dashboard/settings error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
