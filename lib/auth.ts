import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  debug: true,
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        rut: { label: "RUT", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.rut || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { rut: credentials.rut },
          include: {
            Estamento: true,
            Establecimiento: true,
          },
        });

        if (!user || !user.active) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email || "",
          rut: user.rut,
          name: user.name,
          role: user.role,
          mustChangePassword: user.mustChangePassword,
          estamento: user.Estamento?.name || null,
          establecimiento: user.Establecimiento?.name || null,
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.rut = user.rut;
        token.mustChangePassword = user.mustChangePassword;
        token.estamento = user.estamento;
        token.establecimiento = user.establecimiento;
      }

      // Update token if session is updated (e.g. after password change or profile update)
      if (trigger === "update" && session?.user) {
        token.mustChangePassword = session.user.mustChangePassword;
        if (session.user.name) token.name = session.user.name;
        if (session.user.estamento) token.estamento = session.user.estamento;
        if (session.user.establecimiento)
          token.establecimiento = session.user.establecimiento;
      }

      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.rut = token.rut as string;
        session.user.mustChangePassword = token.mustChangePassword as boolean;
        session.user.estamento = token.estamento as string | null | undefined;
        session.user.establecimiento = token.establecimiento as
          | string
          | null
          | undefined;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
