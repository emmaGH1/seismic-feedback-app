"use server"; 

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";

// Prevents "too many connections" error during development
const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// 1. GET: Fetch all feedbacks
export async function getFeedbacks() {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
    });
    return feedbacks;
  } catch (error) {
    console.error("Database Error:", error);
    return [];
  }
}

// 2. POST: Create new feedback
export async function createFeedback(content: string) {
  try {
    if (!content.trim()) return { success: false };

    await prisma.feedback.create({
      data: { content },
    });

    revalidatePath("/"); // Refresh the page data automatically
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

// 3. REACTION: Add a reaction
export async function addReaction(id: string, type: "upvotes" | "downvotes" | "laughs") {
  try {
    await prisma.feedback.update({
      where: { id },
      data: {
        [type]: { increment: 1 },
      },
    });

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}