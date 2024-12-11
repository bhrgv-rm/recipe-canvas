import { PrismaClient } from "@prisma/client";
import {
  TrashIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/solid";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import NotFound from "@/app/not-found";
import Navbar from "@/components/Navbar";
const prisma = new PrismaClient();

export default async function RecipeDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/");
  }

  const recipe = await prisma.recipe.findUnique({
    where: { id: params.id },
    include: {
      author: true,
    },
  });

  if (!recipe) {
    return <NotFound />;
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  // Determine if the current user can delete the recipe
  const isOwnerOrAdmin = recipe.authorId === user?.id;

  const handleDelete = async () => {
    "use server";

    if (!isOwnerOrAdmin) {
      throw new Error("Not authorized to delete this recipe");
    }

    try {
      await prisma.recipe.delete({
        where: { id: recipe.id },
      });

      redirect("/");
    } catch (error) {
      console.error("Error deleting recipe:", error);
      throw error;
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">{recipe.title}</h1>

          {isOwnerOrAdmin && (
            <div className="flex items-center gap-4">
              <a href="/">Edit Recipe</a>
              <form action={handleDelete}>
                <button
                  type="submit"
                  className="text-red-500 p-2 rounded-full"
                  aria-label="Delete Recipe"
                >
                  <TrashIcon className="h-6 w-6" />
                </button>
              </form>
            </div>
          )}
        </div>

        {recipe.image && (
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-96 object-cover rounded-lg mb-6"
          />
        )}

        <div className="md:grid-cols-2 gap-6">
          <h2 className="text-2xl font-semibold mb-4">Ingredients</h2>
          <ul className="list-disc list-inside space-y-2">
            {Array.isArray(recipe.ingredients) &&
            recipe.ingredients.length > 0 ? (
              recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {/* Ensure ingredient is a string or can be converted to a string */}
                  {typeof ingredient === "string" ||
                  typeof ingredient === "number"
                    ? ingredient
                    : JSON.stringify(ingredient)}{" "}
                  {/* This will render the object as a string if it's not a primitive */}
                </li>
              ))
            ) : (
              <li>No ingredients listed.</li>
            )}
          </ul>
        </div>

        <div className="mt-6 grid md:grid-cols-3 gap-4">
          {recipe.difficulty && (
            <div className="bg-foreground text-background p-4 rounded-lg">
              <h3 className="font-semibold">Difficulty</h3>
              <p>{recipe.difficulty}/5</p>
            </div>
          )}

          {recipe.cookingTime && (
            <div className="bg-foreground text-background p-4 rounded-lg">
              <h3 className="font-semibold">Cooking Time</h3>
              <p>{recipe.cookingTime} minutes</p>
            </div>
          )}

          {recipe.author && (
            <div className="bg-foreground text-background p-4 rounded-lg">
              <h3 className="font-semibold">Created By</h3>
              <a
                href={`/user/${recipe.authorId}`}
                className="flex items-center gap-1"
              >
                {isOwnerOrAdmin ? "You" : recipe.author.name}
                <ArrowTopRightOnSquareIcon className="size-4" />
              </a>
            </div>
          )}
        </div>

        <div className="mt-6">
          <h2 className="text-2xl font-semibold mb-4">Cooking Steps</h2>
          <ol className="list-decimal list-inside space-y-2">
            {recipe.steps.length > 0 ? (
              recipe.steps.map((step, index) => <li key={index}>{step}</li>)
            ) : (
              <li>No steps listed.</li>
            )}
          </ol>
        </div>

        {recipe.preparationTips && recipe.preparationTips.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Preparation Tips</h2>
            <ul className="list-disc list-inside space-y-2">
              {recipe.preparationTips.map((tip, index) => (
                <li key={index}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {recipe.nutritionalFacts && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4">Nutritional Facts</h2>
            <div className="bg-foreground text-background p-4 rounded-lg">
              {Object.entries(recipe.nutritionalFacts).map(([key, value]) => (
                <div key={key} className="flex justify-between">
                  <span className="capitalize">
                    {key.replace(/([A-Z])/g, " $1")}
                  </span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
