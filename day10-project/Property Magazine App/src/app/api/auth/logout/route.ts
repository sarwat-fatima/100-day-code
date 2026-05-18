import { signOut } from "@/lib/auth/auth";
import { cookies } from "next/headers";

export async function POST() {
  // Clear NextAuth session
  await signOut({ redirect: false });

  // Clear all authentication-related cookies
  const cookieStore = await cookies();
  
  // Clear NextAuth cookies
  const cookiesToClear = [
    "next-auth.session-token",
    "next-auth.callback-url",
    "next-auth.csrf-token",
    "next-auth.state",
    "__Secure-next-auth.session-token",
    "__Host-next-auth.csrf-token",
    "SESSIONID"
  ];

  for (const cookieName of cookiesToClear) {
    cookieStore.delete(cookieName);
  }

  return Response.json({ success: true });
}
