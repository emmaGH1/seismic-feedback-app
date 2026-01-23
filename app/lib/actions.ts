/* eslint-disable @typescript-eslint/no-explicit-any */

"use server";

import { PrismaClient } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const globalForPrisma = global as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function getUserId() {
  const cookieStore = await cookies();
  const userIdCookie = cookieStore.get("seismic_user_id");
  
  if (userIdCookie) {
    return userIdCookie.value;
  }
  
  const newId = crypto.randomUUID();
  cookieStore.set("seismic_user_id", newId, { secure: true, httpOnly: true });
  return newId;
}


export async function getFeedbacks() {
  const userId = await getUserId();
  
  const feedbacks = await prisma.feedback.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      votes: {
        where: { userId: userId } // Only fetch MY votes
      }
    }
  });

  // Transform data for the frontend
return feedbacks.map((f: any) => ({
    ...f,
    userVotes: f.votes.map((v: any) => v.type)
  }));
}

// 2. POST: Create feedback
export async function createFeedback(content: string) {
  if (!content.trim()) return { success: false };
  
  await prisma.feedback.create({
    data: { content },
  });
  
  revalidatePath("/");
  return { success: true };
}


export async function toggleReaction(feedbackId: string, type: "upvotes" | "downvotes" | "laughs") {
  const userId = await getUserId();
  
  // Map 'upvotes' -> 'upvote' (singular for the Vote table)
  const voteTypeMap: Record<string, string> = {
    upvotes: 'upvote',
    downvotes: 'downvote',
    laughs: 'laugh'
  };
  const voteType = voteTypeMap[type];

  try {
    // Check if vote exists
    const existingVote = await prisma.vote.findUnique({
      where: {
        userId_feedbackId_type: {
          userId,
          feedbackId,
          type: voteType
        }
      }
    });

    if (existingVote) {
      // REMOVE VOTE (Toggle Off)
      await prisma.vote.delete({
        where: { id: existingVote.id }
      });
      
      // Decrement count
      await prisma.feedback.update({
        where: { id: feedbackId },
        data: { [type]: { decrement: 1 } }
      });

    } else {
      // ADD VOTE (Toggle On)
      await prisma.vote.create({
        data: {
          userId,
          feedbackId,
          type: voteType
        }
      });

      // Increment count
      await prisma.feedback.update({
        where: { id: feedbackId },
        data: { [type]: { increment: 1 } }
      });
    }

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}



export async function deleteFeedback(id: string, secret: string) {

  const ADMIN_SECRET = process.env.ADMIN_SECRET;
  
  if (secret !== ADMIN_SECRET) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.vote.deleteMany({ where: { feedbackId: id } });
    await prisma.feedback.delete({ where: { id } });
    
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}