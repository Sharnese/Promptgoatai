import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

interface PromptsFilterProps {
  onCategoryChange: (categoryId: string | null) => void
}

export function PromptsFilter({ onCategoryChange }: PromptsFilterProps) {
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    supabase
      .from("prompt_categories")
      .select("*")
      .order("name")
      .then(({ data }) => {
        if (data) setCategories(data)
      })
  }, [])

  return (
    <div className="flex gap-4">
      <Select onValueChange={(val) => onCategoryChange(val === "all" ? null : val)}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>

        {/* 👇 Scroll lives here */}
        <SelectContent>
          <div className="max-h-64 overflow-y-auto">
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  )
}
