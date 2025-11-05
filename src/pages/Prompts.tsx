import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { Navbar } from '@/components/navbar'
import { PromptsFilter } from '@/components/prompts-filter'
import { PromptCard } from '@/components/prompt-card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, RefreshCw, Crown } from 'lucide-react'


interface Prompt {
  id: string
  title: string
  description: string
  body: string
  is_premium: boolean
  category_id: string
  prompt_categories: { name: string }
}

export default function Prompts() {
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const { profile, refreshProfile } = useAuth()

  const handleRefreshProfile = async () => {
    setRefreshing(true)
    await refreshProfile()
    setRefreshing(false)
  }


  useEffect(() => {
    fetchPrompts()
  }, [])

  useEffect(() => {
    let filtered = prompts
    if (searchTerm) {
      filtered = filtered.filter(p => 
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category_id === selectedCategory)
    }
    setFilteredPrompts(filtered)
  }, [searchTerm, selectedCategory, prompts])

  async function fetchPrompts() {
    try {
      const { data, error } = await supabase
        .from('prompts')
        .select('*, prompt_categories(*)')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching prompts:', error)
        return
      }
      
      if (data) {
        console.log('Fetched prompts:', data)
        setPrompts(data)
      }
    } catch (err) {
      console.error('Fetch error:', err)
    }
  }


  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">Browse Prompts</h1>
          <div className="flex items-center gap-4">
            {profile?.is_pro && (
              <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                <Crown className="w-4 h-4 mr-1" />Pro Member
              </Badge>
            )}
            <Button 
              onClick={handleRefreshProfile} 
              disabled={refreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </Button>
          </div>
        </div>
        
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <PromptsFilter onCategoryChange={setSelectedCategory} />


        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredPrompts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                {prompts.length === 0 
                  ? 'No prompts available yet. Check back soon!' 
                  : 'No prompts match your search or filter.'}
              </p>
            </div>
          ) : (
            filteredPrompts.map(prompt => (
              <PromptCard key={prompt.id} prompt={prompt} isPro={profile?.is_pro || false} />
            ))
          )}
        </div>


      </div>
    </div>
  )
}
