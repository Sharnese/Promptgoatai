# 🔧 Stripe Checkout Session Error Fix

## Error Diagnosis
The error "Edge Function returned a non-2xx status code" means the `create-checkout-session` function is failing.

## Most Likely Cause
**Missing environment variables** on the edge function.

## Quick Fix Steps

### 1. Check Edge Function Logs
In Supabase Dashboard → Edge Functions → `create-checkout-session` → Logs

Look for errors like:
- `❌ Missing STRIPE_SECRET_KEY`
- `❌ Missing STRIPE_PRICE_MONTHLY`

### 2. Verify Environment Variables Are Set
The function needs these environment variables:
- `STRIPE_SECRET_KEY` - Your Stripe secret key (starts with `sk_test_` or `sk_live_`)
- `STRIPE_PRICE_MONTHLY` - Your Stripe Price ID (starts with `price_`)

### 3. Update Edge Function Code (with better logging)
Replace the edge function code with this improved version:

```typescript
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS"
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  
  try {
    const { userId, email, successUrl, cancelUrl } = await req.json();
    console.log("📥 Request:", { userId, email });
    
    if (!userId || !successUrl || !cancelUrl) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    const priceId = Deno.env.get("STRIPE_PRICE_MONTHLY");
    
    console.log("🔑 Env check:", { hasKey: !!stripeKey, priceId });
    
    if (!stripeKey) {
      return new Response(JSON.stringify({ error: "Missing STRIPE_SECRET_KEY" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }
    
    if (!priceId) {
      return new Response(JSON.stringify({ error: "Missing STRIPE_PRICE_MONTHLY" }), {
        status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
      });
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl,
      client_reference_id: userId,
      metadata: { user_id: userId },
      customer_email: email || undefined
    });

    console.log("✅ Session created:", session.id);
    return new Response(JSON.stringify({ url: session.url }), {
      status: 200, headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  } catch (err) {
    console.error("❌ Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { "Content-Type": "application/json", ...corsHeaders }
    });
  }
});
```

### 4. Test the Fix
1. Click "Go Pro" button
2. Check browser console for detailed error messages
3. Check edge function logs in Supabase Dashboard
4. Error message will now tell you exactly what's missing

## Common Issues & Solutions

### Issue: "Missing STRIPE_SECRET_KEY"
**Solution:** Set the environment variable in Supabase Dashboard → Project Settings → Edge Functions → Add secret

### Issue: "Missing STRIPE_PRICE_MONTHLY"  
**Solution:** Get your Price ID from Stripe Dashboard → Products → Click your product → Copy Price ID

### Issue: Stripe API error
**Solution:** Check that your Stripe key is valid and not expired

## Verification Checklist
- [ ] STRIPE_SECRET_KEY is set on the edge function
- [ ] STRIPE_PRICE_MONTHLY is set on the edge function  
- [ ] Price ID is for a recurring subscription (not one-time)
- [ ] Stripe key matches your account (test vs live mode)
- [ ] Edge function logs show successful session creation
