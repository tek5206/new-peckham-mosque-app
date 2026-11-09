// Minimal backend for New Peckham Mosque donations.
//
// Why this exists: Stripe secret keys must NEVER be embedded in the mobile app.
// The app only ever talks to this server, which talks to Stripe using the secret key.
//
// Deploy this anywhere that can run Node (Render, Railway, Fly.io, a small VPS,
// AWS Lambda via a adapter, etc.). Then set BACKEND_URL in
// src/services/donationService.js to this server's public HTTPS URL.
//
// Setup:
//   1. cd backend && npm install
//   2. cp .env.example .env   and put your real Stripe secret key in it
//   3. npm start

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Stripe = require('stripe');

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4242;

// ---- One-time donation ----
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency = 'gbp' } = req.body; // amount in pence, e.g. 2000 = £20.00
    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Minimum donation amount is £1.00' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: { purpose: 'one_time_donation', mosque: 'New Peckham Mosque' },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ---- Recurring monthly donation (subscription with a custom, donor-chosen amount) ----
app.post('/create-subscription', async (req, res) => {
  try {
    const { amount, currency = 'gbp', email, name } = req.body;
    if (!amount || amount < 100) {
      return res.status(400).json({ error: 'Minimum monthly donation is £1.00' });
    }
    if (!email) {
      return res.status(400).json({ error: 'Email is required for recurring donations' });
    }

    // 1. Find or create the Stripe customer
    const existing = await stripe.customers.list({ email, limit: 1 });
    const customer =
      existing.data[0] ||
      (await stripe.customers.create({ email, name }));

    // 2. Create a Price on the fly for this custom amount, attached to a single
    //    reusable Product for "Monthly Donation". Stripe lets you create prices
    //    dynamically — this avoids needing to pre-create a price per £ amount.
    const product = await getOrCreateDonationProduct();
    const price = await stripe.prices.create({
      unit_amount: amount,
      currency,
      recurring: { interval: 'month' },
      product: product.id,
    });

    // 3. Create the subscription in "incomplete" state; the client finishes
    //    payment via the PaymentSheet using the PaymentIntent's client secret.
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{ price: price.id }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    const clientSecret = subscription.latest_invoice.payment_intent.client_secret;

    res.json({
      clientSecret,
      subscriptionId: subscription.id,
      customerId: customer.id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

let cachedProductId = null;
async function getOrCreateDonationProduct() {
  if (cachedProductId) return { id: cachedProductId };
  const products = await stripe.products.list({ limit: 100 });
  let product = products.data.find((p) => p.name === 'New Peckham Mosque Monthly Donation');
  if (!product) {
    product = await stripe.products.create({ name: 'New Peckham Mosque Monthly Donation' });
  }
  cachedProductId = product.id;
  return product;
}

// ---- Cancel a recurring donation (call from a future "My Donations" screen) ----
app.post('/cancel-subscription', async (req, res) => {
  try {
    const { subscriptionId } = req.body;
    const deleted = await stripe.subscriptions.cancel(subscriptionId);
    res.json({ status: deleted.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Mosque donation backend running on port ${PORT}`));
