import React from "react";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { auth } from "@/auth";
import Vibrant from "node-vibrant";
import SM_Card from "@/components/ui/sm-card";
import Navbar from "@/components/Navbar";
const prisma = new PrismaClient();

const USER_ID_PAGE = async ({ params }: { params: { id: string } }) => {
  const session = await auth();

  if (!session) {
    return <div>You are not authenticated</div>;
  }

  const reqUser = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      authoredRecipes: true,
    },
  });

  if (!reqUser) {
    notFound();
  }
  const isOwner = reqUser.email === session.user?.email;

  const palette = await Vibrant.from(reqUser.image).getPalette();
  const vibrantSwatch =
    palette.Vibrant || palette.DarkVibrant || palette.LightVibrant;
  const backgroundColor = vibrantSwatch ? vibrantSwatch.hex : "#ffffff";

  return (
    <>
      <Navbar />
      <div className="user-bg" style={{ backgroundColor }}>
        <div className="absolute">Edit Picture</div>
        <div>
          <img
            src={reqUser.image}
            width={250}
            height={250}
            className="rounded-md"
            alt="User's profile image"
          />
          <p>{reqUser.userName}</p>
          <p>({reqUser.name})</p>
        </div>
      </div>
      <div className="recipes">
        {!reqUser.authoredRecipes.length ? (
          <p>No recipes authored yet.</p>
        ) : (
          <p>Recipes authored: {reqUser.authoredRecipes.length}</p>
        )}
        <ul>
          {reqUser.authoredRecipes.map((recipe) => (
            <li key={recipe.id}>
              <SM_Card
                url={`/recipe/${recipe.id}`}
                img={recipe.image}
                title={recipe.title}
              />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default USER_ID_PAGE;
