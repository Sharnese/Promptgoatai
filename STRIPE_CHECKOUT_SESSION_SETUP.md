# Stripe Checkout Session Setup Guide

## Overview
This app now uses **Stripe Checkout Sessions** (API-created) instead of Payment Links. This allows us to attach the Supabase `user_id` to each checkout, so the webhook can automatically activate Pro access.

## What Changed

### 1. **Edge Function: `create-checkout-session`**
- **Location**: Deployed to Supabase Edge Functions
- **Purpose**: Creates a Stripe Checkout Session with user metadata
- **Input**: `{ userId, email, successUrl, cancelUrl }`
- **Output**: `{ url }` (Stripe Checkout URL)
- **Key Features**:
  - Attaches `client_reference_id` = Supabase user.id
  - Attaches `metadata.user_id` = Supabase user.id (backup)
  - Uses `STRIPE_PRICE_MONTHLY` env var for the subscription price

### 2. **Client Integration: `src/pages/Billing.tsx`**
- **Changed**: `handleSubscribe` function
- **Old**: Redirected to Payment Link (`VITE_STRIPE_MONTHLY_LINK`)
- **New**: Calls `create-checkout-session` edge function
- **Loading State**: Shows spinner while creating checkout session

### 3. **Webhook: `stripe-webhook`**
- **Updated**: Now stores `stripe_customer_id` in profiles table
- **Events Handled**:
  - `checkout.session.completed` → Sets `is_pro = true`, stores customer ID
  - `customer.subscription.updated` → Updates `is_pro` based on status
  - `customer.subscription.deleted` → Sets `is_pro = false`

## Setup Instructions

### Step 1: Rotate Your Stripe Keys (IMPORTANT)
Since keys may have been exposed, rotate them in Stripe Dashboard:
1. Go to **Developers → API keys**
2. Click **Reveal test key** → **Roll key**
3. Copy the new **Secret key** (starts with `sk_test_...`)

### Step 2: Get Your Price ID
1. Go to **Products** in Stripe Dashboard
2. Find your monthly subscription product
3. Copy the **Price ID** (starts with `price_...`)
4. Ensure it's set to **Recurring** (monthly)

### Step 3: Set Environment Variables
Set these secrets for **BOTH** edge functions (`create-checkout-session` AND `stripe-webhook`):

```bash
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PRICE_MONTHLY=price_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

### Step 4: Configure Webhook in Stripe
1. Go to **Developers → Webhooks** in Stripe Dashboard
2. Click **Add endpoint**
3. **Endpoint URL**: `https://[your-project].supabase.co/functions/v1/stripe-webhook`
4. **Events to send**:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Click **Add endpoint**
6. Copy the **Signing secret** (starts with `whsec_...`)
7. Set it as `STRIPE_WEBHOOK_SECRET` env var

### Step 5: Test the Flow
1. Log in to your app
2. Go to `/app/billing`
3. Click **Go Pro - $15/mo**
4. Should redirect to Stripe Checkout
5. Use test card: `4242 4242 4242 4242`, any future date, any CVC
6. Complete payment
7. Should redirect back with `?success=true`
8. Profile should auto-refresh and show Pro status

## Troubleshooting

### Checkout Session Creation Fails
- **Check**: Edge function logs in Supabase Dashboard
- **Verify**: `STRIPE_SECRET_KEY` and `STRIPE_PRICE_MONTHLY` are set
- **Test**: Price ID is valid and recurring

### Webhook Not Activating Pro Status
- **Check**: Webhook logs in Stripe Dashboard
- **Verify**: `STRIPE_WEBHOOK_SECRET` matches Stripe
- **Test**: Webhook endpoint is reachable
- **Debug**: Check Supabase logs for webhook function

### Pro Status Not Updating
- **Check**: `profiles` table has `is_pro` and `stripe_customer_id` columns
- **Verify**: User ID matches between checkout and profile
- **Test**: Manual refresh button on billing page

## Database Schema
Ensure your `profiles` table has these columns:
```sql
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_pro BOOLEAN DEFAULT FALSE;
```

## Security Notes
- ✅ API keys are server-side only (edge functions)
- ✅ Webhook signature verification enabled
- ✅ User ID attached to prevent unauthorized upgrades
- ✅ No sensitive data exposed to client

## Next Steps
1. Test in **test mode** with test cards
2. When ready for production:
   - Switch to **live mode** in Stripe
   - Update `STRIPE_SECRET_KEY` with live key (`sk_live_...`)
   - Update `STRIPE_PRICE_MONTHLY` with live price ID
   - Update webhook endpoint to use live mode
   - Get new `STRIPE_WEBHOOK_SECRET` for live webhook
