import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Users } from "lucide-react"

export function AdminUsers() {
  const [users, setUsers] = useState<any[]>([])

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
    if (data) setUsers(data)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          All Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => (
            <div key={user.user_id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">{user.first_name} {user.last_name}</p>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>{user.role}</Badge>
                {user.is_pro && <Badge>Pro</Badge>}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
