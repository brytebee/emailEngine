export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { 
  getOrganizations, 
  getTenantDomains, 
  getUsers, 
  getMessagesCount, 
  getMessages 
} from "@/lib/googleSheetsDomains";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const orgId = (session?.user as any)?.orgId;

    if (!session || !orgId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [orgs, domains, users, msgCount] = await Promise.all([
      getOrganizations(),
      getTenantDomains(orgId),
      getUsers(orgId),
      getMessagesCount(orgId)
    ]);

    const org = orgs.find(o => o.id === orgId);
    if (!org) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Determine setup steps
    const setupSteps = [
      {
        id: "domain",
        title: "Add Business Domain",
        description: "Connect your company's web domain to start sending professional emails.",
        isCompleted: domains.length > 0,
        href: "/dashboard/domains/new",
        icon: "Globe"
      },
      {
        id: "verify",
        title: "Verify Identity",
        description: "Complete DNS verification to ensure your emails are delivered securely.",
        isCompleted: domains.some(d => d.status === 'verified'),
        href: "/dashboard/domains",
        icon: "ShieldCheck"
      },
      {
        id: "branding",
        title: "Upload Branding",
        description: "Add your company logo and colors to professionalize your outgoing mail.",
        isCompleted: !!org.logoUrl,
        href: "/dashboard/settings",
        icon: "ImageIcon"
      },
      {
        id: "team",
        title: "Add Team Members",
        description: "Invite your staff to their new professional workspace.",
        isCompleted: users.length > 1,
        href: "/dashboard/team",
        icon: "Users"
      }
    ];

    // Fetch recent messages for this org
    // Since we don't have a direct "getRecentMessagesForOrg", we'll use a simplified version
    // In a real app, this would be a refined query.
    const recentMessages = []; // Placeholder or derived from getMessages for first user

    return NextResponse.json({
      org,
      stats: {
        messagesIn: 0, // Placeholder
        messagesOut: msgCount,
        domainsActive: domains.filter(d => d.status === 'verified').length,
        domainsPending: domains.filter(d => d.status === 'pending').length,
        plan: org.plan,
        usagePercent: Math.min(100, Math.round((msgCount / (org.emailLimit || 1000)) * 100))
      },
      setupSteps,
      isSetupComplete: setupSteps.every(s => s.isCompleted)
    });

  } catch (error: any) {
    console.error("Dashboard Overview API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
