import Favicon from "@/app/react.svg";
import { auth } from "@/auth";
import type { Metadata } from "next";
import Image from "next/image";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { SignOut } from "@/components/sign-out";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "first",
  description: "second",
  icons: {
    icon: Favicon.src,
  },
};

export default async function Home() {
  const session = await auth();
  return (
    <div className={inter.className}>
      {session === null && <Link href="/api/auth/signin">Login</Link>}
      {session && (
        <>
          <b>{session?.user?.name}</b>
          <SignOut />
        </>
      )}
    </div>
  );
}
