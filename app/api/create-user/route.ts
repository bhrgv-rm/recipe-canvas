import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";

// Initialize Prisma Client
const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    // Parse the incoming request body
    const body = await req.json();
    const { name, email, username, password, image } = body;

    // Check if all required fields are provided
    if (!name || !email || !username || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    try {
      // Create the new user in the database
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          userName: username,
          password, // Note: In production, you should hash the password!
          image,
        },
      });

      // Respond with the created user data
      return NextResponse.json(newUser, { status: 201 });
    } catch (error) {
      // Handle unique constraint violation
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        // The error code for unique constraint failure
        if (error.code === "P2002") {
          return NextResponse.json(
            { error: "Username is already in use" },
            { status: 409 } // Conflict status code
          );
        }
      }

      // Rethrow other errors
      throw error;
    }
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json({ error: "Error creating user" }, { status: 500 });
  }
}

// Optional: Add a GET method to check username availability
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");

  if (!username) {
    return NextResponse.json(
      { error: "Username is required" },
      { status: 400 }
    );
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { userName: username },
      select: { id: true },
    });

    return NextResponse.json({
      available: !existingUser,
    });
  } catch (error) {
    console.error("Error checking username:", error);
    return NextResponse.json(
      { error: "Error checking username" },
      { status: 500 }
    );
  }
}
