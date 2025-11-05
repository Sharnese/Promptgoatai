# PromptPort - AI Prompt Marketplace

A modern AI prompt marketplace built with React, TypeScript, Tailwind CSS, and Supabase.

## Features

- 🔐 User authentication (signup, login, password reset)
- 📚 Browse and search AI prompts
- 💳 Stripe subscription integration (Free & Pro tiers)
- 👤 User profiles and account management
- 🔍 Advanced search and filtering
- 👨‍💼 Admin dashboard for user and prompt management
- 🎨 Modern, responsive UI with Tailwind CSS

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Supabase

1. Create a Supabase project at https://supabase.com
2. Copy `.env.example` to `.env.local`
3. Update the environment variables:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_APP_URL=http://localhost:5173
```

### 3. Set Up Database

Run the SQL in `supabase/schema.sql` in your Supabase SQL editor to create tables.

### 4. Configure Stripe

#### Create Stripe Payment Links

1. Go to https://dashboard.stripe.com/test/payment-links
2. Create a new Payment Link for the Pro plan ($15/month)
3. Configure the success URL: `http://localhost:5173/billing?success=true`
4. Configure the cancel URL: `http://localhost:5173/billing?canceled=true`
5. Copy the Payment Link URL (starts with `https://buy.stripe.com/test_...`)

#### Add to Environment Variables

Add your Stripe payment links to `.env.local`:

```env
VITE_STRIPE_MONTHLY_LINK=https://buy.stripe.com/test_your_monthly_link
VITE_STRIPE_YEARLY_LINK=https://buy.stripe.com/test_your_yearly_link
```

#### Set Up Webhook (Required for Pro Unlock)

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Run `stripe listen --forward-to localhost:54321/functions/v1/stripe-webhook`
3. Copy the webhook signing secret
4. Add to Supabase Edge Function environment variables:
   - `STRIPE_SECRET_KEY` - Your Stripe secret key
   - `STRIPE_WEBHOOK_SECRET` - The webhook signing secret

The webhook will automatically update `profiles.is_pro` when a subscription is created or canceled.


### 5. Run Development Server

```bash
npm run dev
```

Visit http://localhost:5173

## Project Structure

- `/src/pages` - Page components (Login, Signup, Prompts, Profile, etc.)
- `/src/components` - Reusable UI components
- `/src/contexts` - React contexts (Auth, App)
- `/src/lib` - Utilities and Supabase client
- `/supabase` - Database schema and seed data

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Auth & Database)
- React Router
- shadcn/ui components
- Stripe (Payments)
