import { NextResponse } from "next/server";
import { deleteAuthRecord } from "@/lib/googleSheetsDomains";
import { verifyAdmin } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { username: string } }
) {
  const isAuthorized = await verifyAdmin();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username } = params;
    if (!username) {
      return NextResponse.json({ error: "Username parameter is missing" }, { status: 400 });
    }

    // Prevent deleting the very last admin
    const { getAuthRecords } = await import("@/lib/googleSheetsDomains");
    const records = await getAuthRecords();
    if (records.length <= 1) {
      return NextResponse.json({ error: "Cannot delete the only admin" }, { status: 400 });
    }

    await deleteAuthRecord(username);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/domains/admins/[username] error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
