import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      rut?: string;
      role: string;
      mustChangePassword: boolean;
      estamento?: string | null;
      establecimiento?: string | null;
    } & DefaultSession["user"];
  }

  interface User {
    role: string;
    rut: string;
    mustChangePassword: boolean;
    estamento?: string | null;
    establecimiento?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    rut?: string;
    mustChangePassword: boolean;
    estamento?: string | null;
    establecimiento?: string | null;
  }
}
