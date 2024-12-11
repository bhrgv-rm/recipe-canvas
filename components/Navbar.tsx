import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import React from "react";
import Link from "next/link";
const prisma = new PrismaClient();

const Navbar = async () => {
  const session = await auth();

  const email = session?.user?.email as string;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  return (
    <div className="navbar">
      <Link className="flex-1" href="/">
        Recipe Canvas
      </Link>
      <div className="flex-auto">
        <Link href="/recipe/new">New Recipe</Link>
        <Link href={`/user/${user?.id}`}>{user?.name}</Link>
        <Link href="/api/auth/signout">Logout</Link>
      </div>
    </div>
  );
};

export default Navbar;
