import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { PrismaClient } from "@prisma/client";
import Navbar from "@/components/Navbar";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
const prisma = new PrismaClient();
const page = async () => {
  const session = await auth();
  if (!session || !session.user?.email) {
    redirect("/");
  }
  const user = await prisma.user.findFirst({
    where: { email: session.user?.email },
  });
  const updateUser = async (formData: FormData) => {
    "use server";
    const name = formData.get("name") as string;
    const userName = formData.get("username") as string;

    if (!name || name.trim() === "") {
      throw new Error("Name is Empty.");
    }

    try {
      await prisma.user.update({
        where: { id: user?.id },
        data: { name, userName },
      });
    } catch (error) {
      console.error("Failed to update user. - ", error);
      throw new Error("Failed to update user.");
    } finally {
      redirect(`/user`);
    }
  };
  return (
    <>
      <Navbar />

      <div
        className="max-w-md mx-auto flex flex-col justify-center"
        style={{ height: "calc(100vh - 50px)" }}
      >
        <h1 className="text-2xl font-bold mb-4 mt-4">Edit Profile</h1>
        <form action={updateUser}>
          <div className="mb-4">
            <label htmlFor="name">Name</label>
            <input
              name="name"
              id="name"
              type="text"
              defaultValue={user?.name}
              autoComplete="off"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="username">Username</label>
            <input
              name="username"
              id="username"
              type="text"
              autoComplete="off"
              defaultValue={user?.userName}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
            />
          </div>
          <button type="submit" className="w-full">
            Save Changes
          </button>
        </form>
        <p className="text-yellow-400 flex text-center justify-center mt-4 items-center">
          <ExclamationTriangleIcon className="size-8 mr-1" /> - The work for
          editing profiles is in progress.{" "}
        </p>
      </div>
    </>
  );
};

export default page;
