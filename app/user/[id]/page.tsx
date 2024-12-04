import React from "react";
import { PrismaClient } from "@prisma/client";
import { notFound } from "next/navigation";
import { auth } from "@/auth";

const prisma = new PrismaClient();

const USER_ID_PAGE = async ({ params }: { params: { id: string } }) => {
  const session = await auth();
  const userImage = session?.user?.image ?? "@/public/next.svg";
  if (!session) {
    return <div>You are not authenticated</div>;
  }

  const reqUser = await prisma.user.findUnique({
    where: { id: params.id },
  });

  if (!reqUser) {
    notFound();
  }

  if (session?.user?.email === reqUser.email) {
    return (
      <div>
        <img
          src={userImage}
          width={250}
          className="rounded-md"
          alt="User's profile image"
        />
      </div>
    );
  }

  return <div>{`Welcome ${reqUser?.name}`}</div>;
};

export default USER_ID_PAGE;
