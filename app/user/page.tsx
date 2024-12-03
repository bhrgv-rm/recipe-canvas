import { auth } from "@/auth";
import Link from "next/link";
import { SignOut } from "@/components/sign-out";
import { SignIn } from "@/components/sign-in";

export default async function Home() {
  const session = await auth();

  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center">
        <SignIn />
      </div>
    );
  }

  return (
    <div className="h-screen">
      <h2 className="justify-center items-center">
        Logged in as <b>{session?.user?.name}</b>
      </h2>

      <div>
        {session.user &&
          Object.entries(session.user).map(([key, value]) => (
            <div key={key}>
              <h1>
                {key} - <span>{String(value)}</span>
              </h1>
            </div>
          ))}
      </div>

      <Link href="/signout">Wanna Sign-Out?</Link>

      <SignOut />
    </div>
  );
}
