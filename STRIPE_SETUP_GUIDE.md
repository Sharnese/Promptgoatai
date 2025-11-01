# Stripe Integration Setup Guide

## ✅ What Was Fixed

1. **create-checkout-session** - Now validates all env vars, uses JWT auth, and requires absolute HTTPS URLs
2. **stripe-webhook** - Properly handles subscription events and updates `is_pro` status
3. **Frontend** - Already correctly passes JWT token in Authorization header

## 🔧 Required Setup Steps

### Step 1: Get Your Stripe Price ID (NOT Product ID or Payment Link)

1. Go to Stripe Dashboard → Products
2. Click on your product (e.g., "PromptGoat Pro Monthly")
3. Under **Pricing**, you'll see a price like `$15.00 / month`
4. Click on the price row to expand it
5. Copy the **Price ID** - it starts with `price_` (e.g., `price_1ABC123xyz`)
   - ❌ NOT the Product ID (`prod_...`)
   - ❌ NOT the Payment Link (`https://buy.stripe.com/...`)

### Step 2: Set Supabase Edge Function Secrets

Go to Supabase Dashboard → Edge Functions → Manage Secrets

Set these **8 required secrets**:

```bash
STRIPE_SECRET_KEY = sk_test_... (or sk_live_... for production)
STRIPE_WEBHOOK_SECRET = whsec_... (get this in Step 3)
SUPABASE_URL = https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY = eyJhbGc... (from Settings → API)
PRICE_ID_MONTHLY = price_1ABC123xyz (from Step 1)
SUCCESS_URL = https://your-domain.com/app/billing?success=true
CANCEL_URL = https://your-domain.com/app/billing?canceled=true
```

**Important:**
- `SUCCESS_URL` and `CANCEL_URL` must be **absolute HTTPS URLs**
- Use your actual deployed domain (not localhost)
- For testing, use your preview URL (e.g., `https://preview-xyz.deploypad.app`)

### Step 3: Configure Stripe Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click **Add endpoint**
3. Set endpoint URL to:
   ```
   https://your-project.supabase.co/functions/v1/stripe-webhook
   ```
4. Select these events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)
7. Go back to Supabase and set `STRIPE_WEBHOOK_SECRET` to this value

### Step 4: Frontend Environment Variables

Create/update `.env` in your project root:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc... (from Supabase Settings → API)
```

## 🧪 Testing the Integration

1. **Test Checkout Flow:**
   - Log in to your app
   - Go to `/app/billing`
   - Click "Go Pro - $15/mo"
   - Should redirect to Stripe Checkout
   - Use test card: `4242 4242 4242 4242`, any future date, any CVC

2. **Verify Webhook:**
   - Complete a test payment
   - Check Stripe Dashboard → Developers → Webhooks → Your endpoint
   - Should show successful events
   - Check your Supabase `profiles` table - `is_pro` should be `true`

3. **Check Logs:**
   - Supabase Dashboard → Edge Functions → Logs
   - Look for any errors in `create-checkout-session` or `stripe-webhook`

## 🐛 Troubleshooting

### Error: "Missing: PRICE_ID_MONTHLY"
- You set a Product ID or Payment Link instead of a Price ID
- Go back to Step 1 and get the correct `price_...` ID

### Error: "Missing: SUCCESS_URL (absolute https)"
- Your URL doesn't start with `https://`
- Use your full deployed domain, not relative paths

### Error: "Unauthorized"
- User is not logged in
- Session expired - log out and log back in

### Webhook not firing
- Check the endpoint URL is correct
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Check Stripe Dashboard → Webhooks for delivery attempts

### `is_pro` not updating
- Check webhook logs in Supabase
- Verify `profiles` table has `stripe_customer_id` and `is_pro` columns
- Check that webhook events are being received in Stripe Dashboard

## 📝 Database Schema

Ensure your `profiles` table has these columns:

```sql
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;
```
