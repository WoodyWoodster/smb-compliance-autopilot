"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PLANS, type PlanId } from "@/lib/stripe";

interface PricingCardProps {
  planId: PlanId;
  plan: typeof PLANS[PlanId];
  isCurrentPlan: boolean;
  organizationId: string;
}

export function PricingCard({
  planId,
  plan,
  isCurrentPlan,
  organizationId,
}: PricingCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId, organizationId }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create checkout session");
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error("Subscription error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to start subscription"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const isProfessional = planId === "professional";

  return (
    <Card
      className={`relative ${isProfessional ? "border-primary shadow-lg" : ""}`}
    >
      {isProfessional && (
        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
          Most Popular
        </Badge>
      )}
      <CardHeader>
        <CardTitle>{plan.name}</CardTitle>
        <CardDescription>
          <span className="text-3xl font-bold text-foreground">
            ${plan.price}
          </span>
          <span className="text-muted-foreground">/month</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2">
              <Check className="h-4 w-4 mt-0.5 text-green-600 shrink-0" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {isCurrentPlan ? (
          <Button className="w-full" variant="outline" disabled>
            Current Plan
          </Button>
        ) : (
          <Button
            className="w-full"
            variant={isProfessional ? "default" : "outline"}
            onClick={handleSubscribe}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait...
              </>
            ) : (
              `Upgrade to ${plan.name}`
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
