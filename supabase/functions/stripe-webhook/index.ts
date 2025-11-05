import Stripe from 'https://esm.sh/stripe@14.21.0';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
      apiVersion: '2023-10-16',
    });

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    // read raw text and the signature header
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();

    // lightweight diagnostic logging (DO NOT log full body in production)
    console.log('DEBUG: stripe-signature present?', !!signature);
    console.log('DEBUG: stripe-signature (first 200 chars):', (signature || '').slice(0,200));
    console.log('DEBUG: body length', body.length);
    console.log('DEBUG: body preview', body.slice(0,400));
    console.log('DEBUG: has STRIPE_WEBHOOK_SECRET?', !!Deno.env.get('STRIPE_WEBHOOK_SECRET'));

    // then attempt verification, logging the error if it fails
    let event;
    try {
      // Use the async constructEvent API in Deno/Edge environments so the
      // SubtleCryptoProvider can be used (avoids "cannot be used in a
      // synchronous context" errors).
      event = await stripe.webhooks.constructEventAsync(
        body,
        signature!,
        Deno.env.get('STRIPE_WEBHOOK_SECRET')!
      );
      console.log('✅ Webhook verified:', event.type);
    } catch (err) {
      // log full error server-side for debugging
      console.error('❌ Webhook signature verification failed:', String(err));
      // respond 400 to Stripe but include a short, non-sensitive reason
      return new Response(JSON.stringify({ error: 'Invalid signature' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const customerEmail = session.customer_email || session.customer_details?.email;
      const subscriptionId = session.subscription;

      console.log('📦 Checkout completed:', { email: customerEmail, subscriptionId });

      if (!customerEmail) {
        console.error('❌ No customer email');
        return new Response(JSON.stringify({ error: 'No email' }), { status: 400, headers: corsHeaders });
      }

      if (subscriptionId) {
        try {
          const subscription = await stripe.subscriptions.retrieve(subscriptionId as string);
          console.log('📋 Sub retrieved:', { id: subscription.id, status: subscription.status });

          const { error: subError } = await supabase.from('subscriptions').upsert({
            id: subscription.id,
            email: customerEmail.toLowerCase(),
            customer_id: subscription.customer as string,
            price_id: subscription.items.data[0]?.price.id || '',
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            cancel_at_period_end: subscription.cancel_at_period_end || false,
          }, { onConflict: 'id' });

          if (subError) console.error('❌ Sub upsert error:', subError);
          else console.log('✅ Sub upserted');

          const isPro = subscription.status === 'active' || subscription.status === 'trialing';
          const { error: profileError } = await supabase.from('profiles')
            .update({ is_pro: isPro }).ilike('email', customerEmail);

          if (profileError) console.error('❌ Profile update error:', profileError);
          else console.log(`✅ is_pro=${isPro} for ${customerEmail}`);
        } catch (err) {
          console.error('❌ Sub retrieve error:', err.message);
        }
      }
    }

    if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object;
      console.log('🔄 Sub event:', { type: event.type, id: subscription.id, status: subscription.status });

      const customer = await stripe.customers.retrieve(subscription.customer as string);
      const customerEmail = (customer as Stripe.Customer).email;

      if (!customerEmail) {
        console.error('❌ No customer email');
        return new Response(JSON.stringify({ error: 'No email' }), { status: 400, headers: corsHeaders });
      }

      const { error: subError } = await supabase.from('subscriptions').upsert({
        id: subscription.id,
        email: customerEmail.toLowerCase(),
        customer_id: subscription.customer as string,
        price_id: subscription.items.data[0]?.price.id || '',
        status: subscription.status,
        current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
        cancel_at_period_end: subscription.cancel_at_period_end || false,
      }, { onConflict: 'id' });

      if (subError) console.error('❌ Sub upsert error:', subError);
      else console.log('✅ Sub updated');

      const isPro = subscription.status === 'active' || subscription.status === 'trialing';
      const { error: profileError } = await supabase.from('profiles')
        .update({ is_pro: isPro }).ilike('email', customerEmail);

      if (profileError) console.error('❌ Profile update error:', profileError);
      else console.log(`✅ is_pro=${isPro} for ${customerEmail}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', ...corsHeaders },
    });
  }
});