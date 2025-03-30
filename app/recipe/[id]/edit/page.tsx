import React from "react";
import { PrismaClient } from "@prisma/client";
import { auth } from "@/auth";
import { notFound, redirect } from "next/navigation";
import Navbar from "@/components/Navbar";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
const prisma = new PrismaClient();

const EditRecipe = async ({ params }: { params: { id: string } }) => {
  const session = await auth();

  if (!session || !session.user?.email) {
    return <div>You are not logged in.</div>;
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: params.id },
  });

  if (!recipe) {
    return <div>Recipe not found.</div>;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return <div>User not found.</div>;
  }

  const isAuthor = recipe.authorId === user.id;

  if (!isAuthor) {
    notFound();
  }

  const updateRecipe = async (formData: FormData) => {
    "use server";

    const title = formData.get("title") as string;

    // Server-side validation
    if (!title || title.trim() === "") {
      throw new Error("Title cannot be empty");
    }

    try {
      await prisma.recipe.update({
        where: { id: params.id },
        data: {
          title,
        },
      });

      // Redirect to the updated recipe page
    } catch (error) {
      // Log the error and rethrow to be caught by error boundary
      console.error("Failed to update recipe:", error);
      throw new Error("Failed to update recipe");
    } finally {
      redirect(`/recipe/${params.id}`);
    }
  };

  return (
    <>
      <Navbar />
      <div
        className="max-w-md mx-auto flex flex-col justify-center"
        style={{ height: "calc(100vh - 50px)" }}
      >
        <h1 className="text-2xl font-bold mb-4">Edit Recipe </h1>
        <form action={updateRecipe}>
          <div className="mb-4">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              placeholder="Title"
              type="text"
              defaultValue={recipe.title}
              required
              className="w-full px-3 py-2"
            />
          </div>
          <button type="submit" className="w-full py-2">
            Save Changes
          </button>
        </form>
        <p className="text-yellow-400 flex text-center justify-center mt-4 items-center">
          <ExclamationTriangleIcon className="size-8 mr-1" /> - The work for
          editing recipes is in progress.{" "}
        </p>
      </div>
    </>
  );
};

export default EditRecipe;
