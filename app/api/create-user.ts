// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET(req: Request) {
//   console.log(req.method);
//   return NextResponse.json("newUser");
// }
// export async function POST(req: Request) {
//   console.log(req.method);
//   return NextResponse.json("newUser");
// }

// pages/api/createUser.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { name, email, username, password, image } = req.body;

    try {
      // Save the new user to the database
      const newUser = await prisma.user.create({
        data: {
          name,
          email,
          userName: username,
          password, // In a real application, ensure to hash the password before storing it
          image,
        },
      });

      // Respond with the created user data
      res.status(201).json(newUser);
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "Error creating user" });
    }
  } else {
    // Only allow POST method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
