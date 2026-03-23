import { NextResponse } from "next/server";
import { getAuthRecords, setAuthRecord } from "@/lib/googleSheetsDomains";
import { hashPassword } from "@/lib/encryption";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  const isAuthorized = await verifyAdmin();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const records = await getAuthRecords();
    const safeRecords = records.map(r => ({
      username: r.username,
      email: r.email,
    }));
    return NextResponse.json(safeRecords);
  } catch (error) {
    console.error("GET /api/domains/admins error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const isAuthorized = await verifyAdmin();
  if (!isAuthorized) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { username, email, password } = await req.json();
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Username, email, and password are required" }, { status: 400 });
    }

    const records = await getAuthRecords();
    const existing = records.find(r => r.username === username);

    // If existing, we are updating the content
    await setAuthRecord({
      username,
      email,
      passwordHash: password ? hashPassword(password) : (existing?.passwordHash || ""),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/domains/admins error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
