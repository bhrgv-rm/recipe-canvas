import { signIn } from "@/auth";
import { PrismaClient } from "@prisma/client";
import { redirect } from "next/navigation";
import PassField from "./pass-field";
import saltAndHashPassword from "@/utils/salt_hash";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function checkUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    return { error: "User not found" };
  }

  const isPasswordCorrect = await bcrypt.compare(password, user.password);

  if (!isPasswordCorrect) {
    return { error: "Incorrect password" };
  }

  return { success: true };
}
export async function CredsSignIn() {
  async function handleSignIn(formData: FormData) {
    "use server";
    const result = await checkUser(formData);

    if (result.error) {
      console.error(result.error);
      return;
    }

    await signIn("credentials", {
      redirect: false,
      ...Object.fromEntries(formData),
    });
    redirect("/");
  }

  return (
    <form action={handleSignIn} className="flex flex-col gap-3">
      <input
        name="email"
        type="email"
        placeholder="Email"
        required
        autoComplete="off"
      />
      <PassField />
      <button type="submit">Sign In</button>
    </form>
  );
}
