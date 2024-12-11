import React from "react";
import NewRecipe from "@/components/ui/new-recipe";
import { auth } from "@/auth";
import Navbar from "@/components/Navbar";

const Page = async () => {
  const session = await auth();
  return (
    <>
      <Navbar />
      <div className="create-recipe max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Create New Recipe</h1>
        <p className="mb-4">Creating as {session?.user?.name}</p>
        <NewRecipe />
      </div>
    </>
  );
};

export default Page;
