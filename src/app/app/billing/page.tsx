import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, ExternalLink } from "lucide-react"

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('*')
    .eq('email', profile.email)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const monthlyLink = process.env.STRIPE_MONTHLY_LINK
  const yearlyLink = process.env.STRIPE_YEARLY_LINK

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={{ email: profile.email, isPro: profile.is_pro, role: profile.role }} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-muted-foreground">
            Manage your subscription and billing
          </p>
        </div>

        {profile.is_pro && subscription && (
          <Card className="mb-8">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Current Plan</CardTitle>
                <Badge variant="success">Active</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg font-semibold mb-2">Pro Plan</p>
              <p className="text-sm text-muted-foreground">
                Status: {subscription.status}
              </p>
              {subscription.current_period_end && (
                <p className="text-sm text-muted-foreground">
                  Renews: {new Date(subscription.current_period_end).toLocaleDateString()}
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly</CardTitle>
              <div className="text-3xl font-bold">$9<span className="text-lg font-normal">/month</span></div>
              <CardDescription>Billed monthly</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />All free features</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Premium prompts</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Priority support</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Early access</li>
              </ul>
              {!profile.is_pro && monthlyLink && (
                <a href={monthlyLink} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">
                    Subscribe Monthly
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              )}
              {profile.is_pro && (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <Badge className="w-fit mb-2">Best Value</Badge>
              <CardTitle>Yearly</CardTitle>
              <div className="text-3xl font-bold">$90<span className="text-lg font-normal">/year</span></div>
              <CardDescription>Save $18 per year</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />All free features</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Premium prompts</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Priority support</li>
                <li className="flex items-center"><Check className="w-4 h-4 mr-2 text-green-500" />Early access</li>
              </ul>
              {!profile.is_pro && yearlyLink && (
                <a href={yearlyLink} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full">
                    Subscribe Yearly
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              )}
              {profile.is_pro && (
                <Button className="w-full" variant="outline" disabled>
                  Current Plan
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {profile.is_pro && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Manage Subscription</CardTitle>
              <CardDescription>
                To cancel or update your subscription, please contact support at support@promptport.com
              </CardDescription>
            </CardHeader>
          </Card>
        )}
      </div>
    </div>
  )
}
