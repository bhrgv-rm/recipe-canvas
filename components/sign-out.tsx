import { signOut } from "@/auth";
import Link from "next/link";

export function SignOut() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <button type="submit">
        <Link href="/api/auth/signout">Sign Out</Link>
      </button>
    </form>
  );
}
