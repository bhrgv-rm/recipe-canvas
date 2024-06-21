import { auth } from "@/auth";
import Link from "next/link";
import { SignOut } from "@/components/sign-out";
import { SignIn } from "@/components/sign-in";
// import { z } from "zod";

export default async function Home() {
  const session = await auth();
  console.log(session);
  console.log(session?.user?.email);

  return (
    <>
      {session === null && <SignIn />}
      {session && (
        <>
          <h2 className="justify-center items-center">
            Logged in as <b>{session?.user?.name}</b>
          </h2>
          <div>
            {/* Iterate over properties of session.user */}
            {Object.entries(session.user).map(([key, value]) => (
              <div key={key}>
                <h1>
                  {key} - <span>{value}</span>
                </h1>
              </div>
            ))}
          </div>
          <Link href="/signout">Wanna Sign-Out?</Link>
          <SignOut />
        </>
      )}
    </>
  );
}
