import { NextResponse } from "next/server";
import { getAuthRecords, setAuthRecord } from "@/lib/googleSheetsDomains";
import { hashPassword } from "@/lib/encryption";

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();
    if (!token || !newPassword) {
      return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
    }

    const records = await getAuthRecords();
    const adminRecord = records.find(r => r.resetToken === token);

    if (!adminRecord) {
      return NextResponse.json({ error: "Invalid or expired reset token" }, { status: 400 });
    }

    if (!adminRecord.tokenExpiry || new Date(adminRecord.tokenExpiry).getTime() < Date.now()) {
      return NextResponse.json({ error: "Reset token has expired" }, { status: 400 });
    }

    // Update password and clear tokens
    await setAuthRecord({
      ...adminRecord,
      passwordHash: hashPassword(newPassword),
      resetToken: "",
      tokenExpiry: ""
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/domains/auth/reset error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
