import { NextResponse } from "next/server";
import { getUsers, UserRecord } from "@/lib/googleSheetsDomains";
import { hashPassword } from "@/lib/encryption";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    }

    const users = await getUsers();
    const user = users.find(u => u.email === email && u.passwordHash === hashPassword(password));

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Don't send the password hash back
    const { passwordHash, ...safeUser } = user;

    return NextResponse.json({
      success: true,
      user: safeUser,
      token: user.passwordHash // Using the hash as a simple bearer token for now
    });

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
