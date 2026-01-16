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
  get prices() {
    return getStripe().prices;
  },
};

// Cache for Stripe prices (5 minute TTL)
let priceCache: Map<string, { priceId: string; unitAmount: number }> | null = null;
let priceCacheTimestamp = 0;
const PRICE_CACHE_TTL = 5 * 60 * 1000;

export async function getStripePrices(): Promise<Map<string, { priceId: string; unitAmount: number }>> {
  const now = Date.now();

  if (priceCache && now - priceCacheTimestamp < PRICE_CACHE_TTL) {
    return priceCache;
  }

  const prices = await stripe.prices.list({
    active: true,
    expand: ["data.product"],
    limit: 100,
  });

  const cache = new Map<string, { priceId: string; unitAmount: number }>();

  for (const price of prices.data) {
    if (price.lookup_key) {
      cache.set(price.lookup_key, {
        priceId: price.id,
        unitAmount: price.unit_amount ?? 0,
      });
    }
  }

  priceCache = cache;
  priceCacheTimestamp = now;

  return cache;
}

export async function getPriceByLookupKey(lookupKey: string): Promise<string | null> {
  const prices = await getStripePrices();
  return prices.get(lookupKey)?.priceId ?? null;
}

export const PLAN_LOOKUP_KEYS = {
  starter: "starter",
  professional: "professional",
  business: "business",
} as const;

export const PLANS = {
  starter: {
    name: "Starter",
    price: 49,
    lookupKey: PLAN_LOOKUP_KEYS.starter,
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
      aiGenerations: 20,
    },
  },
  professional: {
    name: "Professional",
    price: 149,
    lookupKey: PLAN_LOOKUP_KEYS.professional,
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
      aiGenerations: 100,
    },
  },
  business: {
    name: "Business",
    price: 299,
    lookupKey: PLAN_LOOKUP_KEYS.business,
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
      aiGenerations: -1, // unlimited
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
