import { type NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GithubProvider from "next-auth/providers/github"

import prisma from "@/lib/prisma";
import { db } from "@/lib/db"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db as any),
  secret: process.env.NEXTAUTH_SECRET,
  site: process.env.NEXTAUTH_URL,
  useSecureCookies: false,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID, 
      clientSecret: process.env.GITHUB_SECRET,
    })
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log("fire signin Callback");
      return true;
    },
    async redirect({ url, baseUrl }) {
      console.log("fire redirect Callback");
      return baseUrl;
    },
    async session({ session, user, token }) {
      console.log("fire SESSION Callback");
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id,
          randomKey: token.randomKey,
        },
      };
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      console.log("fire jwt Callback");
      if (user) {
        const u = user as unknown as any;
        return {
          ...token,
          id: u.id,
          randomKey: u.randomKey,
        };
      }
      return token;
    },
  },
};

