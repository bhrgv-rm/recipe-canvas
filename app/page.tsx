import Favicon from "@/app/react.svg";
import { auth } from "@/auth";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { SignOut } from "@/components/sign-out";
import { CredsSignIn } from "@/components/creds-sign-in";
import { PrismaClient } from "@prisma/client";
const inter = Inter({ subsets: ["latin"] });

const prisma = new PrismaClient();
export const metadata: Metadata = {
  title: "first",
  description: "second",
  icons: {
    icon: Favicon.src,
  },
};
async function getuser(email: string) {
  const user = await prisma.user.findUnique({ where: { mailID: email } });
  console.log(user);
}
export default async function Home() {
  const session = await auth();
  getuser("bhargavarampentyala@gmail.com");
  return (
    <div className={inter.className}>
      {session === null && (
        <>
          <Link href="/api/auth/signin">Login</Link>
        </>
      )}
      {session && (
        <>
          <b>{session?.user?.name}</b>
          <SignOut />
        </>
      )}
    </div>
  );
}
