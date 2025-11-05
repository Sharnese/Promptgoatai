# Landing Page Prompts - Database Migration

## Issue
The landing page cannot display prompts because the current RLS (Row Level Security) policies only allow authenticated users to read prompts. Anonymous visitors need read access to browse prompts on the landing page.

## Solution
Add RLS policies that allow anonymous users to read prompts and categories.

## Migration Steps

### Option 1: Run in Supabase SQL Editor
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Run the following SQL commands:

```sql
-- Allow anonymous users to read prompt categories
create policy "categories_read_public" 
on public.prompt_categories for select to anon 
using (true);

-- Allow anonymous users to read prompts
create policy "prompts_read_public" 
on public.prompts for select to anon 
using (true);
```

### Option 2: Reset Database with Updated Schema
If you prefer to reset your database with the updated schema:

1. Go to Supabase Dashboard > Database > Schema
2. Run the updated `supabase/schema.sql` file
3. Then run `supabase/seed.sql` to populate with sample data

## Verification
After running the migration:
1. Open your landing page in an incognito/private browser window (not logged in)
2. Scroll to the "Browse Free Prompts" section
3. You should now see prompts displayed

## What This Enables
- ✅ Anonymous visitors can browse and search prompts on the landing page
- ✅ Free prompts can be copied by anyone
- ✅ Pro prompts show "Create Account" dialog when clicked by non-logged-in users
- ✅ Logged-in users continue to have full access based on their subscription tier
