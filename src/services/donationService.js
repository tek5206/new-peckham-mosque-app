// This talks to YOUR backend (see /backend folder), never to Stripe directly from the app.
// Replace with your deployed backend URL before release.
export const BACKEND_URL = 'https://REPLACE_WITH_YOUR_BACKEND.example.com';

export async function createPaymentIntent({ amountPence, currency = 'gbp' }) {
  const res = await fetch(`${BACKEND_URL}/create-payment-intent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountPence, currency }),
  });
  if (!res.ok) throw new Error('Failed to create payment intent');
  return res.json(); // { clientSecret }
}

export async function createSubscription({ amountPence, currency = 'gbp', email, name }) {
  const res = await fetch(`${BACKEND_URL}/create-subscription`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: amountPence, currency, email, name }),
  });
  if (!res.ok) throw new Error('Failed to create subscription');
  return res.json(); // { clientSecret, subscriptionId, customerId }
}

export default { createPaymentIntent, createSubscription, BACKEND_URL };
