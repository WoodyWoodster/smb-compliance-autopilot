import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trainingProgress, trainingAssessments, users } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { courseId, score, passed, conversation, evaluation } = body;

    // Get user and organization
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user?.organizationId || !user.id) {
      return NextResponse.json({ error: "User or organization not found" }, { status: 404 });
    }

    // Check if progress record exists
    const existingProgress = await db.query.trainingProgress.findFirst({
      where: and(
        eq(trainingProgress.userId, user.id),
        eq(trainingProgress.courseId, courseId)
      ),
    });

    const now = new Date();
    const expiresAt = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate()); // 1 year from now

    if (existingProgress) {
      // Update existing progress
      await db
        .update(trainingProgress)
        .set({
          status: passed ? "completed" : "in_progress",
          completedAt: passed ? now : null,
          score: score,
          expiresAt: passed ? expiresAt : null,
        })
        .where(eq(trainingProgress.id, existingProgress.id));
    } else {
      // Create new progress record
      await db.insert(trainingProgress).values({
        userId: user.id,
        organizationId: user.organizationId,
        courseId: courseId,
        status: passed ? "completed" : "in_progress",
        startedAt: now,
        completedAt: passed ? now : null,
        score: score,
        expiresAt: passed ? expiresAt : null,
      });
    }

    // Save the assessment record
    if (conversation && evaluation) {
      await db.insert(trainingAssessments).values({
        courseId: courseId,
        userId: user.id,
        organizationId: user.organizationId,
        conversation: conversation,
        evaluation: evaluation,
        passed: passed,
        score: score,
        completedAt: now,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving training completion:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
