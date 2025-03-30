import { auth } from "@/auth";
import { PrismaClient } from "@prisma/client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import useStore from "@/lib/store";
import { redirect } from "next/navigation";
import { Session } from "next-auth";

const prisma = new PrismaClient();
const Navbar = async () => {
  const session = await auth();
  // const { user } = useStore();
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
        <Link href="/user">{user?.name}</Link>
        <Link href="/api/auth/signout">Logout</Link>
      </div>
    </div>
  );
};

export default Navbar;

// use client";

// const Navbar = () => {
//   const { user, setUser } = useStore(); // This will now work because the component is client-side
//   const [session, setSession] = useState<Session | null>(null);

//   useEffect(() => {
//     const fetchSession = async () => {
//       const sessionData = await auth();
//       setSession(sessionData);
//     };

//     fetchSession();
//   }, []); // Fetch session on component mount

//   if (!session?.user) {
//     redirect("/login");
//   } else {
//     setUser(session.user);
//   }

//   // const email = session?.user?.email as string;

//   return (
//     <div className="navbar">
//       <Link className="flex-1" href="/">
//         Recipe Canvas
//       </Link>
//       <div className="flex-auto">
//         <Link href="/recipe/new">New Recipe</Link>
//         <Link href="/user">{user?.name}</Link>
//         <Link href="/api/auth/signout">Logout</Link>
//       </div>
//     </div>
//   );
// };

// export default Navbar;
