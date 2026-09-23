import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { saveUser, UserRecord } from "@/lib/googleSheetsDomains";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // user from auth is already a fresh record from the sheet
  return NextResponse.json(user);
}

export async function POST(req: Request) {
  const user = await getUserFromRequest();
  
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const data = await req.json();

    const updatedUser: UserRecord = {
      ...user,
      fullName: data.fullName || user.fullName,
      title: data.title || user.title,
      signatureHtml: data.signatureHtml || user.signatureHtml,
    };

    await saveUser(updatedUser);

    return NextResponse.json({ success: true, user: updatedUser });

  } catch (error) {
    console.error("POST /api/dashboard/profile error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
