import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Webhook signature verification failed" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const { organizationId } = session.metadata || {};

        if (organizationId) {
          // TODO: Update organization in database
          console.log("Checkout completed for organization:", organizationId);
          console.log("Customer ID:", session.customer);
          console.log("Subscription ID:", session.subscription);

          // Update organization with:
          // - stripeCustomerId: session.customer
          // - stripeSubscriptionId: session.subscription
          // - subscriptionStatus: 'active'
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const { organizationId } = subscription.metadata || {};

        if (organizationId) {
          // TODO: Update subscription status in database
          console.log("Subscription updated for organization:", organizationId);
          console.log("Status:", subscription.status);

          // Update organization with:
          // - subscriptionStatus: subscription.status
          // - subscriptionTier based on price ID
        }
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const { organizationId } = subscription.metadata || {};

        if (organizationId) {
          // TODO: Handle subscription cancellation
          console.log("Subscription deleted for organization:", organizationId);

          // Update organization with:
          // - subscriptionStatus: 'canceled'
          // - subscriptionTier: 'starter' (or free tier)
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Payment succeeded for invoice:", invoice.id);
        // Log successful payment, update billing history
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        console.log("Payment failed for invoice:", invoice.id);
        // TODO: Notify customer, update subscription status
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}
