import { getAuthRecords, setAuthRecord } from "./googleSheetsDomains";
import { hashPassword } from "./encryption";
import { headers } from "next/headers";

export async function verifyAdmin(): Promise<boolean> {
  const reqHeaders = headers();
  const authHeader = reqHeaders.get("authorization");
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return false;
  }
  
  const password = authHeader.split(" ")[1];
  const passwordHash = hashPassword(password);
  
  let records = await getAuthRecords();
  
  // Scaffold default admin if auth sheet is completely empty
  if (records.length === 0) {
    await setAuthRecord({
      username: "admin",
      email: "admin@example.com", // default placeholder, user should update it
      passwordHash: hashPassword("admin123")
    });
    records = await getAuthRecords();
  }
  
  // Support multiple admin users if they ever add them, but at least "admin" is checked
  return records.some(r => r.passwordHash === passwordHash);
}
