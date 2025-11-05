export interface Profile {
  user_id: string
  email: string
  first_name: string | null
  last_name: string | null
  role: string
  is_pro: boolean
  deactivated_at: string | null
  created_at: string
}

export interface PromptCategory {
  id: string
  name: string
}

export interface Prompt {
  id: string
  category_id: string | null
  title: string
  description: string | null
  body: string
  is_premium: boolean
  created_at: string
  prompt_categories?: PromptCategory
}

export interface Subscription {
  id: string
  email: string
  price_id: string
  status: string
  current_period_end: string | null
  created_at: string
}
