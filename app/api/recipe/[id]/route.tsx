import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json({ error: "ID is required" }, { status: 400 });
  }

  try {
    const user = await prisma.recipe.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        title: true,
        image: true,
        ingredients: true,
        steps: true,
        nutritionalFacts: true,
        difficulty: true,
        cookingTime: true,
        preparationTips: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Explicitly convert to a plain object if needed
    return NextResponse.json(JSON.parse(JSON.stringify(user)));
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
