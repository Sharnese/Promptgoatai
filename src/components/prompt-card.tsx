import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Lock, Copy, Check, Eye, Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useNavigate } from "react-router-dom"
import type { Prompt } from "@/lib/types"
import { supabase } from "@/lib/supabase"
import { useAuth } from "@/contexts/AuthContext"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PromptCardProps {
  prompt: Prompt
  isPro: boolean
  isLoggedIn?: boolean
}

export function PromptCard({ prompt, isPro, isLoggedIn = true }: PromptCardProps) {
  const [copied, setCopied] = useState(false)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [showFullPrompt, setShowFullPrompt] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)
  const [favoriteId, setFavoriteId] = useState<string | null>(null)
  const { toast } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  const isLocked = prompt.is_premium && !isPro

  useEffect(() => {
    if (user) {
      checkFavorite()
    }
  }, [user, prompt.id])

  const checkFavorite = async () => {
    if (!user) return
    const { data } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id)
      .eq('prompt_id', prompt.id)
      .single()
    
    if (data) {
      setIsFavorited(true)
      setFavoriteId(data.id)
    }
  }

  const toggleFavorite = async () => {
    if (!user) return
    
    if (isFavorited && favoriteId) {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', favoriteId)
      
      if (!error) {
        setIsFavorited(false)
        setFavoriteId(null)
        toast({ title: "Removed from favorites" })
      }
    } else {
      const { data, error } = await supabase
        .from('favorites')
        .insert({ user_id: user.id, prompt_id: prompt.id })
        .select()
        .single()
      
      if (!error && data) {
        setIsFavorited(true)
        setFavoriteId(data.id)
        toast({ title: "Added to favorites", description: "View in My Favorites" })
      }
    }
  }


  const handleCopy = () => {
    if (isLocked) return
    navigator.clipboard.writeText(prompt.body)
    setCopied(true)
    toast({
      title: "Copied!",
      description: "Prompt copied to clipboard",
    })
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLockedClick = () => {
    if (!isLoggedIn) {
      setShowLoginDialog(true)
    } else {
      navigate('/billing')
    }
  }

  return (
    <>
      <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
        <Button 
          onClick={toggleFavorite}
          variant="ghost" 
          size="icon"
          className="absolute top-3 right-3 z-10 hover:bg-background/80"
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'}`} />
        </Button>
        <CardHeader>
          <div className="flex items-start justify-between gap-2 pr-8">
            <CardTitle className="text-lg">{prompt.title}</CardTitle>
            {prompt.is_premium && (
              <Badge variant={isPro ? "success" : "default"}>
                {isPro ? "Pro" : <><Lock className="w-3 h-3 mr-1" />Pro</>}
              </Badge>
            )}
          </div>
          {prompt.description && (
            <CardDescription>{prompt.description}</CardDescription>
          )}
        </CardHeader>

        <CardContent>
          <div className={`relative ${isLocked ? 'blur-sm select-none' : ''}`}>
            <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
              {prompt.body}
            </p>
          </div>
          <div className="flex gap-2">
            {isLocked ? (
              <Button onClick={handleLockedClick} className="flex-1" variant="default">
                <Lock className="w-4 h-4 mr-2" />
                {isLoggedIn ? 'Upgrade to Pro' : 'Create Account for Pro'}
              </Button>
            ) : (
              <>
                <Button onClick={() => setShowFullPrompt(true)} className="flex-1" variant="outline">
                  <Eye className="w-4 h-4 mr-2" />View Full Prompt
                </Button>
                <Button onClick={handleCopy} className="flex-1" variant="outline">
                  {copied ? (
                    <><Check className="w-4 h-4 mr-2" />Copied!</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" />Copy</>
                  )}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showFullPrompt} onOpenChange={setShowFullPrompt}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{prompt.title}</DialogTitle>
            {prompt.description && (
              <DialogDescription>{prompt.description}</DialogDescription>
            )}
          </DialogHeader>
          <div className="mt-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">{prompt.body}</p>
            </div>
            <Button onClick={handleCopy} className="w-full mt-4" variant="default">
              {copied ? (
                <><Check className="w-4 h-4 mr-2" />Copied to Clipboard!</>
              ) : (
                <><Copy className="w-4 h-4 mr-2" />Copy Full Prompt</>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Create an Account to Access Pro Prompts</AlertDialogTitle>
            <AlertDialogDescription>
              This is a premium prompt. Create a free account and upgrade to Pro to access hundreds of premium prompts.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate('/signup')}>
              Create Account
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
