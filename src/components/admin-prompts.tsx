import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { supabase } from "@/lib/supabase"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash } from "lucide-react"

export function AdminPrompts({ onUpdate }: { onUpdate: () => void }) {
  const [prompts, setPrompts] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [open, setOpen] = useState(false)
  const [editingPrompt, setEditingPrompt] = useState<any>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [body, setBody] = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [isPremium, setIsPremium] = useState(true)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const [promptsRes, catsRes] = await Promise.all([
      supabase.from('prompts').select('*').order('created_at', { ascending: false }),
      supabase.from('prompt_categories').select('*')
    ])
    if (promptsRes.data) setPrompts(promptsRes.data)
    if (catsRes.data) setCategories(catsRes.data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const data = { title, description, body, category_id: categoryId || null, is_premium: isPremium }
    const { error } = editingPrompt
      ? await supabase.from('prompts').update(data).eq('id', editingPrompt.id)
      : await supabase.from('prompts').insert([data])
    setLoading(false)
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Success", description: editingPrompt ? "Prompt updated" : "Prompt created" })
      setOpen(false)
      resetForm()
      loadData()
      onUpdate()
    }
  }

  const handleEdit = (prompt: any) => {
    setEditingPrompt(prompt)
    setTitle(prompt.title)
    setDescription(prompt.description || "")
    setBody(prompt.body)
    setCategoryId(prompt.category_id || "")
    setIsPremium(prompt.is_premium)
    setOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this prompt?")) return
    const { error } = await supabase.from('prompts').delete().eq('id', id)
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" })
    } else {
      toast({ title: "Success", description: "Prompt deleted" })
      loadData()
      onUpdate()
    }
  }

  const resetForm = () => {
    setEditingPrompt(null)
    setTitle("")
    setDescription("")
    setBody("")
    setCategoryId("")
    setIsPremium(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Manage Prompts</CardTitle>
          <Dialog open={open} onOpenChange={(o) => { setOpen(o); if (!o) resetForm() }}>
            <DialogTrigger asChild>
              <Button><Plus className="w-4 h-4 mr-2" />Add Prompt</Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingPrompt ? "Edit Prompt" : "Add Prompt"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Title</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} required /></div>
                <div><Label>Description</Label><Input value={description} onChange={(e) => setDescription(e.target.value)} /></div>
                <div><Label>Prompt Body</Label><Textarea value={body} onChange={(e) => setBody(e.target.value)} required /></div>
                <div><Label>Category</Label>
                  <Select value={categoryId} onValueChange={setCategoryId}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>{categories.map((cat) => <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Access Level</Label>
                  <Select value={isPremium ? "premium" : "free"} onValueChange={(v) => setIsPremium(v === "premium")}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent><SelectItem value="free">Free</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent>
                  </Select>
                </div>
                <Button type="submit" disabled={loading}>{loading ? "Saving..." : editingPrompt ? "Update" : "Create"}</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {prompts.map((prompt) => (
            <div key={prompt.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{prompt.title}</h3>
                  <Badge variant={prompt.is_premium ? "default" : "secondary"}>{prompt.is_premium ? "Premium" : "Free"}</Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">{prompt.description}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleEdit(prompt)}><Edit className="w-4 h-4" /></Button>
                <Button size="sm" variant="destructive" onClick={() => handleDelete(prompt.id)}><Trash className="w-4 h-4" /></Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
