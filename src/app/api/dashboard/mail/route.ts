import { NextResponse } from "next/server";
import { getUserFromRequest } from "@/lib/auth";
import { getMessages, MessageRecord } from "@/lib/googleSheetsDomains";

export async function GET() {
  const user = await getUserFromRequest();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // mailboxId is the User ID
    const messages = await getMessages(user.id);
    
    // Sort by timestamp descending
    const sortedMessages = messages.sort((a, b) => 
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return NextResponse.json(sortedMessages);
  } catch (error) {
    console.error("GET /api/dashboard/mail error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
