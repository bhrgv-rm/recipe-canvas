import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { auth } from "@/auth";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  const session = await auth();

  // Check if user is not logged in
  if (!session || !session.user?.email) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to create a recipe." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();
    console.log(session.user?.id);
    const {
      title,
      image,
      ingredients,
      steps,
      nutritionalFacts,
      difficulty,
      cookingTime,
      preparationTips,
    } = body;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }, // Safely use email as it’s guaranteed to exist
    });

    // Ensure user exists before creating the recipe
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const newRecipe = await prisma.recipe.create({
      data: {
        title,
        image,
        ingredients,
        steps,
        nutritionalFacts,
        difficulty: Number(difficulty),
        cookingTime: Number(cookingTime),
        preparationTips,
        authorId: user.id, // Set the author to the logged-in user
      },
    });

    return NextResponse.json(newRecipe, { status: 201 });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The error code for unique constraint failure
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "Recipe creation failed due to a constraint" },
          { status: 409 } // Conflict status code
        );
      }
    }

    console.error("Recipe creation error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
