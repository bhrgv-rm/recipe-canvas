import { auth } from "@/auth";
import Link from "next/link";
import { SignOut } from "@/components/sign-out";
import { SignIn } from "@/components/sign-in";
import Navbar from "@/components/Navbar";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import Vibrant from "node-vibrant";
import SM_Card from "@/components/ui/sm-card";

const prisma = new PrismaClient();
export default async function Home() {
  const session = await auth();

  if (!session || !session.user?.email) {
    notFound();
  }
  const reqUser = await prisma.user.findUnique({
    where: { email: session?.user?.email },
    include: { authoredRecipes: true },
  });
  if (!reqUser) {
    notFound();
  }
  if (!session) {
    return (
      <div className="h-screen flex items-center justify-center">
        <SignIn />
      </div>
    );
  }

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
          <a href="/user/edit">Edit Account</a>
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
}
