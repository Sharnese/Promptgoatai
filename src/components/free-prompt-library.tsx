import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { FreePromptCard } from './free-prompt-card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface FreePrompt {
  id: string;
  category: string;
  prompt_text: string;
  created_at: string;
}

const categories = [
  'All Categories',
  'Clinical & Human Services',
  'Business & Administration',
  'Compliance & Operations',
  'Difficult Conversations',
  'AI Productivity & Writing',
  'Self-Reflection & Wellness'
];

export function FreePromptLibrary() {
  const [prompts, setPrompts] = useState<FreePrompt[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<FreePrompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPrompts();
  }, []);

  useEffect(() => {
    filterPrompts();
  }, [searchQuery, selectedCategory, prompts]);

  const fetchPrompts = async () => {
    try {
      const { data, error } = await supabase
        .from('free_prompt_library')
        .select('*')
        .order('category', { ascending: true });

      if (error) throw error;
      setPrompts(data || []);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterPrompts = () => {
    let filtered = [...prompts];

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.prompt_text.toLowerCase().includes(query)
      );
    }

    setFilteredPrompts(filtered);
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Loading prompts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search prompts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[280px]">
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {categories.map(cat => (
              <SelectItem key={cat} value={cat}>
                {cat}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPrompts.map(prompt => (
          <FreePromptCard
            key={prompt.id}
            promptText={prompt.prompt_text}
            category={prompt.category}
          />
        ))}
      </div>

      {filteredPrompts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No prompts found matching your criteria.</p>
        </div>
      )}
    </div>
  );
}
