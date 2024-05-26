import { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "./emails/send-welcome";

async function verifyPassword(inputPassword: string, storedPassword: string): Promise<boolean> {
  return bcrypt.compare(inputPassword, storedPassword);
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    signUp: "/signup",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required");
        }
        const user = await db.user.findFirst({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          throw new Error("No user found with this email");
        }

        const isValidPassword = await verifyPassword(credentials.password, user.password);

        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user = {
          id: token.id,
          name: token.name,
          email: token.email,
        };
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
  },
  events: {
    async createUser(message) {
      await sendWelcomeEmail({
        name: message.user.name,
        email: message.user.email,
      });
    },
  },
};
