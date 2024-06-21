import Credentials from "next-auth/providers/credentials";
import Github from "next-auth/providers/github";
import Google from "next-auth/providers/google";

import type { NextAuthConfig } from "next-auth";
export default {
  providers: [Google, Github, Credentials],
} satisfies NextAuthConfig;
