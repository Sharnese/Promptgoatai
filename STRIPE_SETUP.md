# Stripe Integration Setup & Troubleshooting

## Quick Setup

### 1. Create Stripe Payment Link

1. Go to [Stripe Dashboard → Payment Links](https://dashboard.stripe.com/test/payment-links)
2. Click "Create payment link"
3. Set up your product:
   - Name: "PromptPort Pro"
   - Price: $15.00 USD
   - Billing: Recurring monthly
4. Configure URLs:
   - **Success URL**: `http://localhost:5173/billing?success=true`
   - **Cancel URL**: `http://localhost:5173/billing?canceled=true`
5. Copy the generated link (e.g., `https://buy.stripe.com/test_xxxxx`)

### 2. Add to Environment

Add to your `.env.local` file:

```env
VITE_STRIPE_MONTHLY_LINK=https://buy.stripe.com/test_xxxxx
```

### 3. Set Up Webhook

```bash
# Install Stripe CLI
brew install stripe/stripe-cli/stripe

# Login to Stripe
stripe login

# Forward webhooks to local Supabase
stripe listen --forward-to http://localhost:54321/functions/v1/stripe-webhook
```

Copy the webhook signing secret and add to Supabase Edge Function secrets.

## Troubleshooting

### "Access Denied" Error

**Cause**: The payment link is not configured or points to a protected route.

**Solutions**:
1. Check `.env.local` has `VITE_STRIPE_MONTHLY_LINK` set
2. Verify the link starts with `https://buy.stripe.com/`
3. Restart dev server after adding env vars
4. Check browser console for configuration errors

### Payment Link Opens But Returns to Billing Without Pro

**Cause**: Webhook not receiving events or not updating database.

**Solutions**:
1. Ensure Stripe CLI is running: `stripe listen --forward-to ...`
2. Check webhook logs for errors
3. Verify Supabase Edge Function has correct env vars:
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
4. Check Supabase logs for webhook function errors

### "Configuration Required" Warning

**Cause**: Environment variable is missing or invalid.

**Solution**: Add valid Stripe Payment Link to `.env.local` and restart dev server.

## Testing the Flow

1. Click "Go Pro - $15/mo" on `/billing`
2. Should redirect to Stripe checkout (test mode)
3. Use test card: `4242 4242 4242 4242`, any future date, any CVC
4. Complete payment
5. Should redirect back to `/billing?success=true`
6. Webhook processes event and sets `profiles.is_pro = true`
7. Refresh page - Pro badge should appear
8. Premium prompts should now be unlocked

## Production Setup

1. Switch to live mode in Stripe Dashboard
2. Create production Payment Link
3. Update production env vars with live link
4. Configure production webhook endpoint
5. Update success/cancel URLs to production domain
