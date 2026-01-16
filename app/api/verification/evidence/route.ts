import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { evidence, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Get user and organization
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user?.organizationId) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Fetch evidence for the organization
    const evidenceList = await db.query.evidence.findMany({
      where: eq(evidence.organizationId, user.organizationId),
      with: {
        requirement: true,
        document: true,
        submitter: true,
        verifier: true,
      },
      orderBy: (evidence, { desc }) => [desc(evidence.submittedAt)],
    });

    return NextResponse.json(evidenceList);
  } catch (error) {
    console.error("Error fetching evidence:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { requirementId, evidenceType, title, description, documentId, expiresAt } = body;

    // Get user and organization
    const user = await db.query.users.findFirst({
      where: eq(users.clerkId, userId),
    });

    if (!user?.organizationId || !user.id) {
      return NextResponse.json({ error: "Organization not found" }, { status: 404 });
    }

    // Create evidence record
    const [newEvidence] = await db
      .insert(evidence)
      .values({
        organizationId: user.organizationId,
        requirementId,
        evidenceType,
        title,
        description,
        documentId: documentId || null,
        submittedBy: user.id,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      })
      .returning();

    return NextResponse.json(newEvidence, { status: 201 });
  } catch (error) {
    console.error("Error creating evidence:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
