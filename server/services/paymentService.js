import Stripe from 'stripe';

class PaymentService {
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy_key');
  }

  // Create payment intent
  async createPaymentIntent(amount, currency = 'usd', metadata = {}) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        metadata,
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      };

    } catch (error) {
      console.error('Create payment intent error:', error);
      throw new Error('Failed to create payment intent');
    }
  }

  // Confirm payment
  async confirmPayment(paymentIntentId) {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        status: paymentIntent.status,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        paymentMethod: paymentIntent.payment_method
      };

    } catch (error) {
      console.error('Confirm payment error:', error);
      throw new Error('Failed to confirm payment');
    }
  }

  // Create subscription
  async createSubscription(customerId, priceId, metadata = {}) {
    try {
      const subscription = await this.stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        metadata,
        payment_behavior: 'default_incomplete',
        payment_settings: { save_default_payment_method: 'on_subscription' },
        expand: ['latest_invoice.payment_intent'],
      });

      return {
        subscriptionId: subscription.id,
        clientSecret: subscription.latest_invoice.payment_intent.client_secret,
        status: subscription.status
      };

    } catch (error) {
      console.error('Create subscription error:', error);
      throw new Error('Failed to create subscription');
    }
  }

  // Create customer
  async createCustomer(email, name, metadata = {}) {
    try {
      const customer = await this.stripe.customers.create({
        email,
        name,
        metadata
      });

      return {
        customerId: customer.id,
        email: customer.email,
        name: customer.name
      };

    } catch (error) {
      console.error('Create customer error:', error);
      throw new Error('Failed to create customer');
    }
  }

  // Handle webhook
  async handleWebhook(payload, signature) {
    try {
      const event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        case 'invoice.payment_succeeded':
          await this.handleSubscriptionPayment(event.data.object);
          break;
        case 'customer.subscription.deleted':
          await this.handleSubscriptionCancellation(event.data.object);
          break;
        default:
          console.log(`Unhandled event type: ${event.type}`);
      }

      return { received: true };

    } catch (error) {
      console.error('Webhook handling error:', error);
      throw new Error('Webhook handling failed');
    }
  }

  async handlePaymentSuccess(paymentIntent) {
    console.log('Payment succeeded:', paymentIntent.id);
    // Update order status, send confirmation email, etc.
  }

  async handlePaymentFailure(paymentIntent) {
    console.log('Payment failed:', paymentIntent.id);
    // Handle failed payment, notify customer, etc.
  }

  async handleSubscriptionPayment(invoice) {
    console.log('Subscription payment succeeded:', invoice.id);
    // Update subscription status, extend access, etc.
  }

  async handleSubscriptionCancellation(subscription) {
    console.log('Subscription cancelled:', subscription.id);
    // Handle subscription cancellation, update user access, etc.
  }
}

export default new PaymentService();