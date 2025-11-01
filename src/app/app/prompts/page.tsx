import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { PromptCard } from "@/components/prompt-card"
import { PromptsFilter } from "@/components/prompts-filter"
import type { Prompt } from "@/lib/types"

export default async function PromptsPage({
  searchParams,
}: {
  searchParams: { search?: string; category?: string }
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  const { data: categories } = await supabase
    .from('prompt_categories')
    .select('*')
    .order('name')

  let query = supabase
    .from('prompts')
    .select('*, prompt_categories(*)')
    .order('created_at', { ascending: false })

  if (searchParams.category) {
    query = query.eq('category_id', searchParams.category)
  }

  const { data: prompts } = await query

  let filteredPrompts = prompts || []
  
  if (searchParams.search) {
    const search = searchParams.search.toLowerCase()
    filteredPrompts = filteredPrompts.filter(
      (p) =>
        p.title.toLowerCase().includes(search) ||
        p.description?.toLowerCase().includes(search) ||
        p.body.toLowerCase().includes(search)
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={{ email: profile.email, isPro: profile.is_pro, role: profile.role }} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Browse Prompts</h1>
          <p className="text-muted-foreground">
            Discover and copy AI prompts for your workflow
          </p>
        </div>

        <PromptsFilter categories={categories || []} />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredPrompts.map((prompt: Prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              isPro={profile.is_pro}
            />
          ))}
        </div>

        {filteredPrompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No prompts found</p>
          </div>
        )}
      </div>
    </div>
  )
}
