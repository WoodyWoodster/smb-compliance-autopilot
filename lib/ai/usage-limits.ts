import { db } from "@/lib/db";
import { organizations } from "@/lib/db/schema";
import { PLANS, type PlanId } from "@/lib/stripe";
import { eq } from "drizzle-orm";

export interface UsageLimitResult {
  allowed: boolean;
  remaining: number;
  limit: number;
  resetAt: Date;
}

function getMonthlyResetDate(): Date {
  const now = new Date();
  const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return nextMonth;
}

function shouldResetUsage(resetAt: Date | null): boolean {
  if (!resetAt) return true;
  return new Date() >= resetAt;
}

export async function checkAIUsageLimit(
  organizationId: string
): Promise<UsageLimitResult> {
  const [org] = await db
    .select({
      aiGenerationsCount: organizations.aiGenerationsCount,
      aiGenerationsResetAt: organizations.aiGenerationsResetAt,
      subscriptionTier: organizations.subscriptionTier,
    })
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1);

  if (!org) {
    throw new Error("Organization not found");
  }

  const tier = (org.subscriptionTier || "starter") as PlanId;
  const plan = PLANS[tier];
  const limit = plan.limits.aiGenerations;

  // Unlimited plan
  if (limit === -1) {
    return {
      allowed: true,
      remaining: -1,
      limit: -1,
      resetAt: getMonthlyResetDate(),
    };
  }

  let currentCount = org.aiGenerationsCount || 0;
  let resetAt = org.aiGenerationsResetAt || new Date();

  // Check if we need to reset the counter
  if (shouldResetUsage(org.aiGenerationsResetAt)) {
    // Reset the counter
    const newResetAt = getMonthlyResetDate();
    await db
      .update(organizations)
      .set({
        aiGenerationsCount: 0,
        aiGenerationsResetAt: newResetAt,
        updatedAt: new Date(),
      })
      .where(eq(organizations.id, organizationId));

    currentCount = 0;
    resetAt = newResetAt;
  }

  const remaining = Math.max(0, limit - currentCount);

  return {
    allowed: currentCount < limit,
    remaining,
    limit,
    resetAt,
  };
}

export async function incrementAIUsage(organizationId: string): Promise<void> {
  const [org] = await db
    .select({
      aiGenerationsCount: organizations.aiGenerationsCount,
    })
    .from(organizations)
    .where(eq(organizations.id, organizationId))
    .limit(1);

  if (!org) {
    throw new Error("Organization not found");
  }

  const currentCount = org.aiGenerationsCount || 0;

  await db
    .update(organizations)
    .set({
      aiGenerationsCount: currentCount + 1,
      updatedAt: new Date(),
    })
    .where(eq(organizations.id, organizationId));
}

export async function getAIUsageStats(
  organizationId: string
): Promise<UsageLimitResult> {
  return checkAIUsageLimit(organizationId);
}
