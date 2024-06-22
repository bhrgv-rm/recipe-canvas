import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GitHub,
    Google,
    Credentials({
      credentials: {
        email: {},
        password: { type: "password" },
      },
      authorize: async (credentials) => {
        const user = await prisma.user.findUnique({
          where: { mailID: credentials.email },
        });

        if (!user) {
          // No user found
          throw new Error("create account maybe");
        }

        // implement using salt and hash
        if (credentials.password !== user.password) {
          // Passwords don't match
          throw new Error("invalid credentials.");
        }

        // Passwords match, return user object with their profile data
        return user;
      },
    }),
  ],
});
