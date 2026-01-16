import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { createCheckoutSession, PLANS, getPriceByLookupKey, type PlanId } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId, organizationId } = await req.json();

    if (!planId || !organizationId) {
      return NextResponse.json(
        { error: "Plan ID and organization ID are required" },
        { status: 400 }
      );
    }

    const plan = PLANS[planId as PlanId];
    if (!plan) {
      return NextResponse.json(
        { error: "Invalid plan selected" },
        { status: 400 }
      );
    }

    const priceId = await getPriceByLookupKey(plan.lookupKey);
    if (!priceId) {
      return NextResponse.json(
        { error: "Price not found for selected plan" },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const successUrl = `${baseUrl}/dashboard/settings?success=true`;
    const cancelUrl = `${baseUrl}/dashboard/settings?canceled=true`;

    // TODO: Get or create Stripe customer ID from database
    const customerId = undefined; // Will be created by Stripe if undefined

    const session = await createCheckoutSession(
      customerId,
      priceId,
      organizationId,
      successUrl,
      cancelUrl
    );

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
