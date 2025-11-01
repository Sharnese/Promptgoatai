import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/AuthContext"
import { Crown, Check, Sparkles, AlertCircle, Loader2 } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { supabase } from "@/lib/supabase"

export default function Billing() {
  const { profile, refreshProfile, user } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [showSuccess, setShowSuccess] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [checkoutLoading, setCheckoutLoading] = useState(false)




  useEffect(() => {
    const params = new URLSearchParams(location.search)
    if (params.get('success') === 'true') {
      setShowSuccess(true)
      // Auto-refresh profile after successful payment
      const refreshTimer = setTimeout(async () => {
        console.log('🔄 Auto-refreshing profile after payment...')
        await refreshProfile()
        if (profile?.is_pro) {
          toast({ title: "Welcome to Pro! 🎉", description: "Your subscription is now active." })
          // Navigate to dashboard after 2 seconds
          setTimeout(() => {
            navigate('/app/prompts')
          }, 2000)
        }
      }, 2000)
      return () => clearTimeout(refreshTimer)
    }
    if (params.get('canceled') === 'true') {
      toast({ title: "Checkout Canceled", description: "You can upgrade anytime." })
    }

  }, [location, toast, refreshProfile, profile?.is_pro, navigate])


  const handleManualRefresh = async () => {
    setRefreshing(true)
    console.log('🔄 Manually refreshing profile...')
    await refreshProfile()
    setRefreshing(false)
    
    if (profile?.is_pro) {
      toast({ 
        title: "Pro Status Active ✅", 
        description: "You have access to all premium prompts"
      })
      // Navigate to dashboard after confirming pro status
      setTimeout(() => {
        navigate('/app/prompts')
      }, 1500)
    } else {
      toast({ 
        title: "Profile Refreshed", 
        description: "Status updated"
      })
    }
  }



  const handleSubscribe = async () => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to subscribe",
        variant: "destructive",
      })
      return
    }

    setCheckoutLoading(true)
    const timestamp = new Date().toISOString()
    
    console.info('🔍 CHECKOUT_SESSION_START', { 
      timestamp,
      userId: user.id,
      email: user.email,
      framework: 'Vite + React Router + Stripe API'
    })

    try {
      // Get auth token for edge function
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        toast({
          title: "Authentication Required",
          description: "Please log in again",
          variant: "destructive",
        })
        setCheckoutLoading(false)
        return
      }

      const { data, error } = await supabase.functions.invoke('create-checkout-session', {
        headers: {
          Authorization: `Bearer ${session.access_token}`
        }
      })


      if (error) {
        console.error('❌ CHECKOUT_SESSION_ERROR:', error)
        
        // Try to extract error message from response
        let errorMsg = "Failed to create checkout session"
        
        if (error.message) {
          errorMsg = error.message
        }
        
        // Check if data contains error info (some edge function errors return in data)
        if (data && typeof data === 'object' && 'error' in data) {
          errorMsg = data.error
        }
        
        console.error('Error message:', errorMsg)
        
        const isConfigError = errorMsg.includes("configuration") || 
                              errorMsg.includes("not configured") || 
                              errorMsg.includes("Missing") || 
                              errorMsg.includes("STRIPE_SECRET_KEY") ||
                              errorMsg.includes("STRIPE_PRICE_MONTHLY")
        
        toast({
          title: isConfigError ? "Server Configuration Error" : "Checkout Error",
          description: errorMsg,
          variant: "destructive",
        })
        setCheckoutLoading(false)
        return
      }




      if (!data?.url) {
        console.error('❌ NO_CHECKOUT_URL:', data)
        toast({
          title: "Checkout Error",
          description: "No checkout URL returned",
          variant: "destructive",
        })
        setCheckoutLoading(false)
        return
      }

      console.info('✅ REDIRECTING_TO_STRIPE_CHECKOUT:', data.url)
      window.location.href = data.url
    } catch (err) {
      console.error('❌ CHECKOUT_EXCEPTION:', err)
      toast({
        title: "Unexpected Error",
        description: String(err),
        variant: "destructive",
      })
      setCheckoutLoading(false)
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600">Unlock premium AI prompts</p>
        </div>

        {showSuccess && profile?.is_pro && (
          <Card className="mb-8 border-green-500 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Sparkles className="w-6 h-6" />Subscription Activated!
              </CardTitle>
              <CardDescription>Full access to all premium prompts</CardDescription>
            </CardHeader>
          </Card>
        )}


        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Free</CardTitle>
              <div className="text-4xl font-bold mt-4">$0<span className="text-lg font-normal text-muted-foreground">/forever</span></div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-start"><Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" /><span>10 free prompts</span></li>
                <li className="flex items-start"><Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" /><span>Browse categories</span></li>
                <li className="flex items-start"><Check className="w-5 h-5 mr-3 text-green-500 mt-0.5" /><span>Basic search</span></li>
              </ul>
              <Button className="w-full" variant="outline" disabled>Current Plan</Button>
            </CardContent>
          </Card>

          <Card className="relative border-2 border-purple-500 shadow-xl">
            <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1">POPULAR</Badge>
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-2"><Crown className="w-6 h-6 text-purple-600" />Pro</CardTitle>
              <div className="text-4xl font-bold mt-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">$15<span className="text-lg font-normal text-gray-600">/month</span></div>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="space-y-3">
                <li className="flex items-start"><Check className="w-5 h-5 mr-3 text-purple-600 mt-0.5" /><span><strong>30+ premium prompts</strong></span></li>
                <li className="flex items-start"><Check className="w-5 h-5 mr-3 text-purple-600 mt-0.5" /><span>All categories</span></li>
                <li className="flex items-start"><Check className="w-5 h-5 mr-3 text-purple-600 mt-0.5" /><span>Weekly updates</span></li>
                <li className="flex items-start"><Check className="w-5 h-5 mr-3 text-purple-600 mt-0.5" /><span>Priority support</span></li>
              </ul>
              <Button 
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700" 
                onClick={handleSubscribe} 
                disabled={profile?.is_pro || checkoutLoading}
              >
                {checkoutLoading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Creating Checkout...</>
                ) : profile?.is_pro ? (
                  <><Crown className="w-4 h-4 mr-2" />Current Plan</>
                ) : (
                  <>Go Pro - $15/mo</>
                )}
              </Button>

            </CardContent>
          </Card>
        </div>

        {showSuccess && !profile?.is_pro && (
          <Card className="mt-8 max-w-4xl mx-auto border-blue-500 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <AlertCircle className="w-5 h-5" />Waiting for Confirmation
              </CardTitle>
              <CardDescription>Payment successful! Activating your Pro access...</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={handleManualRefresh} disabled={refreshing} variant="outline">
                {refreshing ? 'Refreshing...' : '🔄 Refresh Status'}
              </Button>
            </CardContent>
          </Card>
        )}

        {profile?.is_pro && (
          <Card className="mt-8 max-w-4xl mx-auto">
            <CardHeader>
              <CardTitle>Manage Subscription</CardTitle>
              <CardDescription>Contact support@promptport.com to manage</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Badge variant="outline" className="text-green-600 border-green-600">Active</Badge>
              <div>
                <Button onClick={handleManualRefresh} disabled={refreshing} variant="outline" size="sm">
                  {refreshing ? 'Refreshing...' : '🔄 Refresh Status'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

      </div>
    </div>
  )
}

