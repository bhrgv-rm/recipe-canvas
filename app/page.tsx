import { auth } from "@/auth";
import Link from "next/link";
import { SignOut } from "@/components/sign-out";
import { SignIn } from "@/components/sign-in";
import { PrismaClient } from "@prisma/client";
import FoodCard from "@/components/ui/food-card";
import type { Metadata } from "next";
import Favicon from "@/app/react.svg";
import { Inter } from "next/font/google";
import SM_Card from "@/components/ui/sm-card";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

// Move PrismaClient initialization outside the component
const prisma = new PrismaClient();

export const metadata: Metadata = {
  title: "first",
  description: "second",
  icons: {
    icon: Favicon.src,
  },
};

// You can remove getUser if it's not being used, or if needed, update it for proper error handling
async function getUser(email: string) {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      console.log(`No user found with email: ${email}`);
      return null;
    }
    console.table(user);
    return user;
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) {
    return "Good Morning";
  } else if (hour < 18) {
    return "Good Afternoon";
  } else {
    return "Good Evening";
  }
}

export default async function Home() {
  const session = await auth();
  const recipes = await prisma.recipe.findMany({
    include: {
      author: {
        select: { name: true },
      },
    },
    take: 20,
  });

  const d = new Date();

  if (!session) {
    return (
      <div
        className={`${inter.className} h-screen flex items-center justify-center`}
      >
        <SignIn />
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className={inter.className + " flex flex-col items-center"}>
        {session && (
          <>
            <div className="w-full h-80 flex items-center justify-center text-7xl">
              {getGreeting()}, {session.user?.name}
            </div>
            <div className="w-[90%] flex gap-2 flex-wrap justify-center">
              {recipes.length === 0 ? (
                <p>No recipes found.</p>
              ) : (
                recipes.map((recipe) => (
                  <SM_Card
                    key={recipe.id}
                    img={recipe.image || "/default-image.jpg"}
                    title={recipe.title}
                    url={`/recipe/${recipe.id}`}
                    author={recipe.author?.name}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
