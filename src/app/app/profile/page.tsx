import { createClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user!.id)
    .single()

  return (
    <div className="min-h-screen bg-background">
      <Navbar user={{ email: profile.email, isPro: profile.is_pro, role: profile.role }} />
      
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Your account information
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Name</p>
              <p className="text-lg">
                {profile.first_name} {profile.last_name}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-lg">{profile.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Role</p>
              <Badge variant={profile.role === 'admin' ? 'default' : 'secondary'}>
                {profile.role}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Plan</p>
              <Badge variant={profile.is_pro ? 'success' : 'outline'}>
                {profile.is_pro ? 'Pro' : 'Free'}
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Member Since</p>
              <p className="text-lg">{formatDate(profile.created_at)}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
