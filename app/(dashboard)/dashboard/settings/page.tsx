import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { PLANS } from "@/lib/stripe";
import { PricingCard } from "@/components/settings/pricing-card";
import { OrganizationSettings } from "@/components/settings/organization-settings";
import { AIUsageCard } from "@/components/settings/ai-usage-card";
import { db } from "@/lib/db";
import { users, organizations } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getAIUsageStats } from "@/lib/ai/usage-limits";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Fetch user and organization from database
  const [user] = await db
    .select({
      organizationId: users.organizationId,
    })
    .from(users)
    .where(eq(users.clerkId, userId))
    .limit(1);

  let organization: {
    id: string;
    name: string;
    type: string;
    subscriptionTier: "starter" | "professional" | "business";
    stripeCustomerId: string | null;
  } = {
    id: "org_123",
    name: "Sample Dental Practice",
    type: "dental",
    subscriptionTier: "starter",
    stripeCustomerId: null,
  };

  let aiUsage = {
    used: 0,
    limit: 20,
    resetAt: new Date(),
  };

  if (user?.organizationId) {
    const [org] = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        type: organizations.type,
        subscriptionTier: organizations.subscriptionTier,
        stripeCustomerId: organizations.stripeCustomerId,
      })
      .from(organizations)
      .where(eq(organizations.id, user.organizationId))
      .limit(1);

    if (org) {
      organization = {
        id: org.id,
        name: org.name,
        type: org.type || "other",
        subscriptionTier: (org.subscriptionTier || "starter") as "starter" | "professional" | "business",
        stripeCustomerId: org.stripeCustomerId,
      };

      const usageStats = await getAIUsageStats(org.id);
      aiUsage = {
        used: usageStats.limit === -1 ? 0 : usageStats.limit - usageStats.remaining,
        limit: usageStats.limit,
        resetAt: usageStats.resetAt,
      };
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your organization and subscription
        </p>
      </div>

      {/* Organization Settings */}
      <OrganizationSettings organization={organization} />

      {/* AI Usage */}
      <AIUsageCard
        used={aiUsage.used}
        limit={aiUsage.limit}
        resetAt={aiUsage.resetAt}
      />

      <Separator />

      {/* Subscription Plans */}
      <div className="space-y-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Subscription Plan
          </h2>
          <p className="text-muted-foreground">
            Choose the plan that best fits your practice
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {(Object.entries(PLANS) as [keyof typeof PLANS, typeof PLANS[keyof typeof PLANS]][]).map(
            ([planId, plan]) => (
              <PricingCard
                key={planId}
                planId={planId}
                plan={plan}
                isCurrentPlan={organization.subscriptionTier === planId}
                organizationId={organization.id}
              />
            )
          )}
        </div>
      </div>
    </div>
  );
}
