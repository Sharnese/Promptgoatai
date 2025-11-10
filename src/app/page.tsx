import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Navbar } from "@/components/navbar"
import { Sparkles, Zap, Lock, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import Image from "next/image"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single()
    profile = data
  }

  const categories = [
    { name: "Clinical & Human Services", icon: "🏥" },
    { name: "Business & Admin", icon: "💼" },
    { name: "Self-Reflection & Wellness", icon: "🧘" },
    { name: "AI Productivity & Writing", icon: "✍️" },
    { name: "Compliance & Operations", icon: "📋" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <Navbar user={profile ? { email: profile.email, isPro: profile.is_pro, role: profile.role } : null} />
      
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="relative mb-8 h-64 rounded-2xl overflow-hidden">
          <Image
            src="/Prompt-goat-photo.png"
            alt="The G.O.A.T — Employee of the Month"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        </div>
        
        <Badge className="mb-4" variant="secondary">
          <Sparkles className="w-3 h-3 mr-1" />
          AI-Powered Prompt Library
        </Badge>
        
        <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
          Your AI Prompt Library
        </h1>
        
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Browse hundreds of expertly crafted AI prompts. Copy, customize, and accelerate your workflow with PromptPort.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href={user ? "/app/prompts" : "/signup"}>
            <Button size="lg" className="text-lg">
              <Sparkles className="w-5 h-5 mr-2" />
              {user ? "Browse Prompts" : "Get Started Free"}
            </Button>
          </Link>
          <Link href="#pricing">
            <Button size="lg" variant="outline" className="text-lg">
              View Pricing
            </Button>
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Explore Categories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => (
            <Card key={cat.name} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader className="text-center">
                <div className="text-4xl mb-2">{cat.icon}</div>
                <CardTitle className="text-sm">{cat.name}</CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Why PromptPort?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card>
            <CardHeader>
              <Zap className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Instant Access</CardTitle>
              <CardDescription>
                Copy prompts with one click. No complex setup required.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Sparkles className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Expert Crafted</CardTitle>
              <CardDescription>
                Prompts designed by professionals across multiple industries.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Lock className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Premium Content</CardTitle>
              <CardDescription>
                Access advanced prompts with Pro membership.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Simple Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <div className="text-3xl font-bold">$0<span className="text-lg font-normal">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Access to free prompts</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Search & filter</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Copy to clipboard</li>
              </ul>
              <Link href="/signup">
                <Button className="w-full mt-6" variant="outline">Get Started</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card className="border-primary">
            <CardHeader>
              <Badge className="w-fit mb-2">Most Popular</Badge>
              <CardTitle>Pro</CardTitle>
              <div className="text-3xl font-bold">$9<span className="text-lg font-normal">/month</span></div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />All free features</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Premium prompts</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Priority support</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Early access to new prompts</li>
              </ul>
              <Link href={user ? "/app/billing" : "/signup"}>
                <Button className="w-full mt-6">Upgrade to Pro</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="font-bold">PromptPort</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2025 PromptPort. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
