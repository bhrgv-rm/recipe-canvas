import { signIn } from "@/auth";
import { CredsSignIn } from "./creds-sign-in";
import Google from "./google";
import GitHub from "./github";
import { redirect } from "next/navigation";

export function SignIn() {
  return (
    <div className="sign-in flex flex-col items-center gap-3">
      <CredsSignIn />
      <a href="/user/new" className="w-full">
        <button className="w-full">Create Account</button>
      </a>
      <div className="flex gap-3">
        {/* GitHub sign-in form */}
        <form
          action={async () => {
            "use server";
            console.log("GITHUB SIGN_IN");
            await signIn("github");
            redirect("/user/new/github");
          }}
        >
          <button type="submit" className="flex items-center gap-1">
            Signin with <GitHub />
          </button>
        </form>

        {/* Google sign-in form */}
        <form
          action={async () => {
            "use server";
            console.log("GOOGLE SIGN_IN");
            await signIn("google");
            redirect("/user/new/google");
          }}
        >
          <button type="submit" className="flex items-center gap-1">
            Signin with <Google />
          </button>
        </form>
      </div>
    </div>
  );
}
