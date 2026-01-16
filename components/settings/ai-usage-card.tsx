"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles } from "lucide-react";
import { format } from "date-fns";

interface AIUsageCardProps {
  used: number;
  limit: number;
  resetAt: Date;
}

export function AIUsageCard({ used, limit, resetAt }: AIUsageCardProps) {
  const isUnlimited = limit === -1;
  const percentage = isUnlimited ? 0 : Math.min((used / limit) * 100, 100);
  const remaining = isUnlimited ? -1 : Math.max(0, limit - used);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5" />
          AI Usage
        </CardTitle>
        <CardDescription>
          AI policy generation usage this billing period
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold">
            {used}
            {!isUnlimited && <span className="text-muted-foreground">/{limit}</span>}
          </span>
          {isUnlimited ? (
            <span className="text-sm text-muted-foreground">Unlimited</span>
          ) : (
            <span className="text-sm text-muted-foreground">
              {remaining} remaining
            </span>
          )}
        </div>

        {!isUnlimited && (
          <Progress value={percentage} className="h-2" />
        )}

        <p className="text-sm text-muted-foreground">
          {isUnlimited ? (
            "Your Business plan includes unlimited AI generations."
          ) : (
            <>
              Resets on {format(resetAt, "MMMM d, yyyy")}
            </>
          )}
        </p>

        {!isUnlimited && percentage >= 80 && (
          <p className="text-sm text-amber-600">
            You&apos;re approaching your monthly limit. Consider upgrading for more generations.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
