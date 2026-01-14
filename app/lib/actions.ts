"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function getFeedbacks() {
  try {
    return await prisma.feedback.findMany({ orderBy: { createdAt: "desc" } });
  } catch (error) {
    return [];
  }
}

export async function createFeedback(content: string) {
  try {
    if (!content.trim()) return { success: false };
    await prisma.feedback.create({ data: { content } });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

export async function addReaction(id: string, type: "upvotes" | "downvotes" | "laughs") {
  try {
    await prisma.feedback.update({
      where: { id },
      data: { [type]: { increment: 1 } },
    });
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}