/**
 * Stripe Integration
 * Handles subscription payments and webhooks
 */

import Stripe from "npm:stripe@14.12.0";
import * as planManager from "./planManager.tsx";
import { PlanType } from "./planManager.tsx";

// Initialize Stripe
const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2024-11-20.acacia',
});

// Stripe configuration
export const STRIPE_CONFIG = {
  proPriceId: Deno.env.get('STRIPE_PRO_PRICE_ID') || '', // Monthly subscription price ID
  webhookSecret: Deno.env.get('STRIPE_WEBHOOK_SECRET') || '',
  successUrl: Deno.env.get('STRIPE_SUCCESS_URL') || '',
  cancelUrl: Deno.env.get('STRIPE_CANCEL_URL') || '',
};

/**
 * Create checkout session for Pro plan
 */
export async function createCheckoutSession(
  userId: string,
  email: string,
  customerName?: string
): Promise<{ sessionId: string; url: string }> {
  try {
    // Get or create Stripe customer
    const userPlan = await planManager.getUserPlan(userId);
    let customerId = userPlan.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email,
        name: customerName,
        metadata: {
          userId,
        },
      });
      customerId = customer.id;
      
      // Update user plan with customer ID
      await planManager.updateUserPlan(userId, userPlan.plan, customerId);
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: STRIPE_CONFIG.proPriceId,
          quantity: 1,
        },
      ],
      success_url: `${STRIPE_CONFIG.successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: STRIPE_CONFIG.cancelUrl,
      metadata: {
        userId,
      },
    });

    return {
      sessionId: session.id,
      url: session.url || '',
    };
  } catch (error: any) {
    console.error('Error creating checkout session:', error);
    throw new Error(`Failed to create checkout session: ${error.message}`);
  }
}

/**
 * Create customer portal session
 */
export async function createPortalSession(userId: string): Promise<{ url: string }> {
  try {
    const userPlan = await planManager.getUserPlan(userId);
    
    if (!userPlan.stripeCustomerId) {
      throw new Error('No Stripe customer found for this user');
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: userPlan.stripeCustomerId,
      return_url: STRIPE_CONFIG.successUrl,
    });

    return { url: session.url };
  } catch (error: any) {
    console.error('Error creating portal session:', error);
    throw new Error(`Failed to create portal session: ${error.message}`);
  }
}

/**
 * Handle successful checkout
 */
export async function handleCheckoutComplete(session: Stripe.Checkout.Session): Promise<void> {
  try {
    const userId = session.metadata?.userId;
    const subscriptionId = session.subscription as string;

    if (!userId) {
      console.error('No userId in checkout session metadata');
      return;
    }

    // Get subscription details
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    // Update user plan to Pro
    await planManager.updateUserPlan(
      userId,
      PlanType.PRO,
      session.customer as string,
      subscriptionId,
      subscription.status === 'active' ? 'active' : 'past_due'
    );

    console.log(`User ${userId} upgraded to Pro plan`);
  } catch (error: any) {
    console.error('Error handling checkout complete:', error);
    throw error;
  }
}

/**
 * Handle subscription updated
 */
export async function handleSubscriptionUpdated(subscription: Stripe.Subscription): Promise<void> {
  try {
    const userId = subscription.metadata?.userId;

    if (!userId) {
      // Try to find user by customer ID
      const customerId = subscription.customer as string;
      const prefix = 'plan:';
      const allPlans = await planManager.getUserPlan('').catch(() => null); // This is a workaround
      
      // For now, we'll rely on metadata
      console.error('No userId in subscription metadata');
      return;
    }

    const planType = subscription.status === 'active' ? PlanType.PRO : PlanType.FREE;
    const status = subscription.status === 'active' ? 'active' : 
                   subscription.status === 'canceled' ? 'canceled' : 'past_due';

    await planManager.updateUserPlan(
      userId,
      planType,
      subscription.customer as string,
      subscription.id,
      status
    );

    console.log(`User ${userId} subscription updated: ${subscription.status}`);
  } catch (error: any) {
    console.error('Error handling subscription update:', error);
    throw error;
  }
}

/**
 * Handle subscription canceled
 */
export async function handleSubscriptionCanceled(subscription: Stripe.Subscription): Promise<void> {
  try {
    const userId = subscription.metadata?.userId;

    if (!userId) {
      console.error('No userId in subscription metadata');
      return;
    }

    // Downgrade to free plan
    await planManager.updateUserPlan(
      userId,
      PlanType.FREE,
      subscription.customer as string,
      subscription.id,
      'canceled'
    );

    console.log(`User ${userId} downgraded to Free plan`);
  } catch (error: any) {
    console.error('Error handling subscription cancellation:', error);
    throw error;
  }
}

/**
 * Verify webhook signature
 */
export function verifyWebhookSignature(
  payload: string,
  signature: string
): Stripe.Event {
  try {
    return stripe.webhooks.constructEvent(
      payload,
      signature,
      STRIPE_CONFIG.webhookSecret
    );
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error);
    throw new Error(`Webhook signature verification failed: ${error.message}`);
  }
}

/**
 * Process webhook event
 */
export async function processWebhookEvent(event: Stripe.Event): Promise<void> {
  console.log(`Processing webhook event: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutComplete(event.data.object as Stripe.Checkout.Session);
      break;

    case 'customer.subscription.updated':
      await handleSubscriptionUpdated(event.data.object as Stripe.Subscription);
      break;

    case 'customer.subscription.deleted':
      await handleSubscriptionCanceled(event.data.object as Stripe.Subscription);
      break;

    case 'invoice.payment_failed':
      // Handle failed payment
      const invoice = event.data.object as Stripe.Invoice;
      console.warn(`Payment failed for customer ${invoice.customer}`);
      break;

    default:
      console.log(`Unhandled webhook event type: ${event.type}`);
  }
}

/**
 * Get subscription info
 */
export async function getSubscriptionInfo(userId: string): Promise<any> {
  try {
    const userPlan = await planManager.getUserPlan(userId);

    if (!userPlan.stripeSubscriptionId) {
      return null;
    }

    const subscription = await stripe.subscriptions.retrieve(userPlan.stripeSubscriptionId);
    
    return {
      id: subscription.id,
      status: subscription.status,
      currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      plan: subscription.items.data[0]?.price.id,
    };
  } catch (error: any) {
    console.error('Error getting subscription info:', error);
    return null;
  }
}

export default {
  createCheckoutSession,
  createPortalSession,
  verifyWebhookSignature,
  processWebhookEvent,
  getSubscriptionInfo,
};
