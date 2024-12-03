"use client";
import { useState } from "react";
import NewUser from "@/components/ui/new-user";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function New() {
  return (
    <div>
      <NewUser />
    </div>
  );
}
