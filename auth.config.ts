import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";

import type { NextAuthConfig } from "next-auth";
export default {
  providers: [Google, Credentials],
} satisfies NextAuthConfig;
