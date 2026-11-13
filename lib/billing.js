// Stripe subscriptions: Checkout to upgrade, the customer portal to manage or cancel, and a webhook that sets the plan.
import Stripe from "stripe";

const ACTIVE = new Set(["active", "trialing", "past_due"]);

export function createBilling(env = process.env) {
  if (!env.STRIPE_SECRET_KEY) return null;
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const appUrl = (env.APP_URL || "http://localhost:3000").replace(/\/$/, "");

  return {
    async checkoutUrl(user) {
      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: env.STRIPE_PRICE_ID, quantity: 1 }],
        success_url: `${appUrl}/?upgraded=1`,
        cancel_url: `${appUrl}/`,
        client_reference_id: user.id,
        ...(user.stripe_customer_id ? { customer: user.stripe_customer_id } : { customer_email: user.email || undefined }),
        subscription_data: { metadata: { user_id: user.id } },
        allow_promotion_codes: true,
      });
      return session.url;
    },
    async portalUrl(user) {
      const session = await stripe.billingPortal.sessions.create({ customer: user.stripe_customer_id, return_url: `${appUrl}/` });
      return session.url;
    },
    // Cancels every live subscription for a customer. Used when someone deletes their account, so billing stops.
    async cancelSubscriptions(customerId) {
      const subs = await stripe.subscriptions.list({ customer: customerId, limit: 20 });
      for (const sub of subs.data) if (sub.status !== "canceled") await stripe.subscriptions.cancel(sub.id);
    },
    parseEvent(rawBody, signature) {
      return stripe.webhooks.constructEvent(rawBody, signature, env.STRIPE_WEBHOOK_SECRET);
    },
  };
}

// Applies a verified Stripe event to the database. Kept separate so it can be tested without Stripe.
export async function applyStripeEvent(store, event) {
  const obj = event.data?.object || {};
  switch (event.type) {
    case "checkout.session.completed": {
      if (obj.mode !== "subscription" || !obj.client_reference_id) return;
      await store.setPlan(obj.client_reference_id, "pro", obj.customer);
      return;
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const plan = event.type !== "customer.subscription.deleted" && ACTIVE.has(obj.status) ? "pro" : "free";
      const userId = obj.metadata?.user_id || (await store.userIdByCustomer(obj.customer));
      if (userId) await store.setPlan(userId, plan, obj.customer);
      else if (obj.customer) await store.setPlanByCustomer(obj.customer, plan);
      return;
    }
  }
}
