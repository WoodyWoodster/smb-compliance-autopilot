import Stripe from "stripe";

let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2025-12-15.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

export const stripe = {
  get checkout() {
    return getStripe().checkout;
  },
  get billingPortal() {
    return getStripe().billingPortal;
  },
  get subscriptions() {
    return getStripe().subscriptions;
  },
  get webhooks() {
    return getStripe().webhooks;
  },
};

export const PLANS = {
  starter: {
    name: "Starter",
    price: 49,
    priceId: process.env.STRIPE_STARTER_PRICE_ID,
    features: [
      "HIPAA compliance only",
      "Up to 5 policy documents",
      "Basic task management",
      "Email support",
      "1 user",
    ],
    limits: {
      policies: 5,
      users: 1,
      regulations: ["hipaa"],
    },
  },
  professional: {
    name: "Professional",
    price: 149,
    priceId: process.env.STRIPE_PROFESSIONAL_PRICE_ID,
    features: [
      "Multi-regulation support",
      "Unlimited policy documents",
      "Advanced task automation",
      "Priority email support",
      "Up to 5 users",
      "Custom policy templates",
    ],
    limits: {
      policies: -1, // unlimited
      users: 5,
      regulations: ["hipaa", "osha", "state_privacy"],
    },
  },
  business: {
    name: "Business",
    price: 299,
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID,
    features: [
      "Everything in Professional",
      "Unlimited users",
      "Priority phone support",
      "Dedicated success manager",
      "Custom integrations",
      "Audit preparation assistance",
    ],
    limits: {
      policies: -1,
      users: -1,
      regulations: ["hipaa", "osha", "state_privacy", "pci_dss"],
    },
  },
} as const;

export type PlanId = keyof typeof PLANS;

export async function createCheckoutSession(
  customerId: string | undefined,
  priceId: string,
  organizationId: string,
  successUrl: string,
  cancelUrl: string
) {
  const session = await stripe.checkout.sessions.create({
    customer: customerId,
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: successUrl,
    cancel_url: cancelUrl,
    metadata: {
      organizationId,
    },
    subscription_data: {
      metadata: {
        organizationId,
      },
    },
  });

  return session;
}

export async function createCustomerPortalSession(
  customerId: string,
  returnUrl: string
) {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: returnUrl,
  });

  return session;
}

export async function getSubscription(subscriptionId: string) {
  return stripe.subscriptions.retrieve(subscriptionId);
}

export async function cancelSubscription(subscriptionId: string) {
  return stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  });
}
