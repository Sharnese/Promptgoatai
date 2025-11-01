# Deployment Instructions for Stripe Webhook

## 🚀 Deploy Updated Webhook Function

The webhook function has been updated with enhanced functionality. Deploy it using the Supabase CLI:

```bash
# 1. Make sure you're in the project root directory
cd /path/to/your/project

# 2. Deploy the webhook function
supabase functions deploy stripe-webhook --no-verify-jwt

# 3. Verify deployment
supabase functions list
```

## 🔑 Set Environment Variables

Ensure all required secrets are configured:

```bash
# Set Stripe Secret Key (for API calls)
supabase secrets set STRIPE_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Set Webhook Secret (for signature verification)
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_YOUR_SECRET_HERE

# Verify secrets are set
supabase secrets list
```

## 🔗 Configure Stripe Webhook Endpoint

1. **Get your webhook URL:**
   - After deployment, note the function URL
   - Format: `https://YOUR_PROJECT.supabase.co/functions/v1/stripe-webhook`

2. **Add to Stripe Dashboard:**
   - Go to: https://dashboard.stripe.com/test/webhooks
   - Click "Add endpoint"
   - Paste your webhook URL
   - Select events:
     - `checkout.session.completed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Click "Add endpoint"

3. **Copy Webhook Secret:**
   - After creating the endpoint, click "Reveal" under "Signing secret"
   - Copy the secret (starts with `whsec_`)
   - Set it: `supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_...`

## ✅ Test the Webhook

### Option 1: Stripe CLI (Recommended)
```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login to Stripe
stripe login

# Trigger test event
stripe trigger checkout.session.completed
```

### Option 2: Test Payment
1. Create a test Payment Link in Stripe Dashboard
2. Complete a test payment (card: 4242 4242 4242 4242)
3. Check Supabase Edge Function logs for webhook events

## 📊 Monitor Webhook

### View Logs:
```bash
# Real-time logs
supabase functions logs stripe-webhook --follow

# Or in Supabase Dashboard:
# Functions → stripe-webhook → Logs
```

### Check for Success:
Look for these log messages:
- ✅ `Webhook verified: checkout.session.completed`
- ✅ `Checkout completed: {email: "...", subscriptionId: "..."}`
- ✅ `Sub retrieved: {id: "...", status: "active"}`
- ✅ `Sub upserted`
- ✅ `is_pro=true for user@example.com`

## 🐛 Troubleshooting

### Webhook Not Receiving Events:
- Verify webhook URL is correct in Stripe Dashboard
- Check webhook is enabled (not disabled)
- Ensure endpoint is listening for correct events

### Signature Verification Failed:
- Verify `STRIPE_WEBHOOK_SECRET` matches Stripe Dashboard
- Check secret is set correctly: `supabase secrets list`

### Profile Not Updating:
- Check email matches between Stripe customer and Supabase profile
- Verify RLS policies allow service role to update profiles
- Check database logs for errors

### Subscription Not Created:
- Verify subscriptions table exists and has correct columns
- Check webhook logs for upsert errors
- Ensure service role has write access to subscriptions table

## 📝 Verification Checklist

- [ ] Webhook function deployed successfully
- [ ] `STRIPE_SECRET_KEY` secret is set
- [ ] `STRIPE_WEBHOOK_SECRET` secret is set
- [ ] Webhook endpoint added to Stripe Dashboard
- [ ] Webhook is listening for correct events
- [ ] Test payment completes successfully
- [ ] Webhook logs show successful processing
- [ ] `profiles.is_pro` updates in database
- [ ] Subscription record created in database
- [ ] Frontend shows Pro badge after payment

## 🎯 Quick Test Command

```bash
# Deploy and test in one go
supabase functions deploy stripe-webhook --no-verify-jwt && \
stripe trigger checkout.session.completed && \
supabase functions logs stripe-webhook --tail 20
```

This will:
1. Deploy the webhook
2. Trigger a test event
3. Show the last 20 log entries
