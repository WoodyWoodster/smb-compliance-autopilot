import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trainingProgress, users, organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user
    let user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    // If user doesn't exist in DB, create them
    if (!user) {
      const clerkUser = await currentUser();
      if (!clerkUser) {
        return NextResponse.json([]); // No user, no progress
      }

      // Create organization first
      const [org] = await db
        .insert(organizations)
        .values({
          name: clerkUser.firstName ? `${clerkUser.firstName}'s Practice` : "My Practice",
          type: "other",
        })
        .returning();

      // Create user
      const [newUser] = await db
        .insert(users)
        .values({
          clerkId: userId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          organizationId: org.id,
          role: "admin",
        })
        .returning();

      user = newUser;
    }

    if (!user?.id) {
      return NextResponse.json([]); // Still no user, return empty
    }

    // Fetch all training progress for this user
    const progress = await db.query.trainingProgress.findMany({
      where: eq(trainingProgress.userId, user.id),
    });

    return NextResponse.json(progress);
  } catch (error) {
    console.error("Error fetching training progress:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
