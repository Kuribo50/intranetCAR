import NextAuth from "next-auth/next";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);

const authHandler = async (req: Request, context: { params: any }) => {
  const params = await context.params;
  const res = await handler(req, { params } as any);
  console.log(`[NextAuth] ${req.method} ${req.url} -> Status: ${res.status}`);
  return res;
};

export { authHandler as GET, authHandler as POST };
