import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { getUsers, UserRecord } from "@/lib/googleSheetsDomains";
import { hashPassword } from "@/lib/encryption";
import crypto from "crypto";
// import { saveUser } from "@/lib/googleSheetsDomains"; // if we want to auto-create users

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Work Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const users = await getUsers();
        const user = users.find(
          (u) => u.email === credentials.email && u.passwordHash === hashPassword(credentials.password)
        );

        if (!user) {
          throw new Error("Invalid credentials");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          orgId: user.orgId
        } as any;
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // First time login
      if (user) {
        token.id = user.id;
        token.role = (user as any).role || 'staff';
        token.orgId = (user as any).orgId;

        // If Google Provider was used, we need to find or verify the user in our Google Sheets DB
        if (account?.provider === "google") {
          const users = await getUsers();
          const dbUser = users.find((u) => u.email === user.email);
          if (dbUser) {
             token.id = dbUser.id;
             token.role = dbUser.role;
             token.orgId = dbUser.orgId;
          } else {
             // For now, if they don't exist in our sheet, we might want to reject them, 
             // or consider them a new org founder pending setup.
             // We'll give a provisional token
             token.isNewUser = true;
          }
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).orgId = token.orgId;
        (session.user as any).isNewUser = token.isNewUser;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
    error: "/login"
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
