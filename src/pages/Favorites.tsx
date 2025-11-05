import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/navbar'
import { PromptCard } from '@/components/prompt-card'
import { Heart } from 'lucide-react'

interface Prompt {
  id: string
  title: string
  description: string
  body: string
  is_premium: boolean
  category_id: string
  prompt_categories: { name: string }
}

export default function Favorites() {
  const [favoritePrompts, setFavoritePrompts] = useState<Prompt[]>([])
  const { user, profile } = useAuth()

  useEffect(() => {
    if (user) {
      fetchFavorites()
    }
  }, [user])

  async function fetchFavorites() {
    const { data, error } = await supabase
      .from('favorites')
      .select('prompt_id, prompts(*, prompt_categories(*))')
      .eq('user_id', user?.id)
      .order('created_at', { ascending: false })
    
    if (data) {
      const prompts = data.map((fav: any) => fav.prompts).filter(Boolean)
      setFavoritePrompts(prompts)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-red-500 fill-red-500" />
          <h1 className="text-4xl font-bold">My Favorites</h1>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoritePrompts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500 text-lg">No favorites yet</p>
              <p className="text-gray-400 text-sm mt-2">Click the heart icon on prompts to add them here</p>
            </div>
          ) : (
            favoritePrompts.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} isPro={profile?.is_pro || false} />
            ))
          )}
        </div>
      </div>
    </div>
  )
}
