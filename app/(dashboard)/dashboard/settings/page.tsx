import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Check } from "lucide-react";
import { PLANS } from "@/lib/stripe";
import { PricingCard } from "@/components/settings/pricing-card";
import { OrganizationSettings } from "@/components/settings/organization-settings";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // TODO: Fetch organization data from database
  const organization = {
    id: "org_123",
    name: "Sample Dental Practice",
    type: "dental",
    subscriptionTier: "starter" as const,
    stripeCustomerId: null,
  };

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
