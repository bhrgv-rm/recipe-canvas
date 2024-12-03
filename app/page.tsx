import { auth } from "@/auth";
import Link from "next/link";
import { SignOut } from "@/components/sign-out";
import { SignIn } from "@/components/sign-in";
import { PrismaClient } from "@prisma/client";
import FoodCard from "@/components/ui/food-card";
import type { Metadata } from "next";
import Favicon from "@/app/react.svg";
import { Inter } from "next/font/google";
const inter = Inter({ subsets: ["latin"] });

const prisma = new PrismaClient();
export const metadata: Metadata = {
  title: "first",
  description: "second",
  icons: {
    icon: Favicon.src,
  },
};
async function getuser(email: string) {
  const user = await prisma.user.findUnique({ where: { email: email } });
  console.table(user);
  return user;
}
export default async function Home() {
  const sampleRecipe = {
    id: "1",
    title: "Spaghetti Carbonara",
    image:
      "https://images.pexels.com/photos/5710164/pexels-photo-5710164.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    ingredients: [
      "Spaghetti",
      "Eggs",
      "Pancetta",
      "Parmesan cheese",
      "Black pepper",
    ],
    steps: [
      "Boil spaghetti until al dente.",
      "Fry pancetta until crispy.",
      "Beat eggs and mix with parmesan cheese.",
      "Toss spaghetti with pancetta and egg mixture.",
      "Season with black pepper and serve.",
    ],
    nutritionalFacts: {
      calories: "600 kcal",
      protein: "25g",
      fat: "22g",
      carbs: "85g",
    },
    difficulty: 2,
    cookingTime: 30,
    preparationTips: [
      "Use freshly grated parmesan for best flavor.",
      "Do not overcook the eggs to avoid scrambling.",
    ],
    createdAt: "2024-11-20T10:00:00Z",
    updatedAt: "2024-11-25T12:00:00Z",
  };
  const session = await auth(); // Get the session

  // If no session, show the SignIn component
  if (!session) {
    return (
      <div
        className={
          inter.className + " h-screen flex items-center justify-center"
        }
      >
        <SignIn />
      </div>
    );
  }

  return (
    <div className={inter.className}>
      {session && (
        <>
          <b>{JSON.stringify(session.user)}</b>
          <SignOut />
        </>
      )}
      <FoodCard recipe={sampleRecipe} />
    </div>
  );
}
