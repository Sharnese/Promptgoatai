import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, LogOut, User, Settings, MessageSquare, BookMarked, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

export function Navbar() {
  const {
    user,
    profile,
    signOut
  } = useAuth();
  return <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-bold text-xl">
          <img src="https://d64gsuwffb70l.cloudfront.net/68fdb98a1a41ecca41313355_1761679297358_d2ec59d1.png" alt="PromptGoatAI Logo" className="w-8 h-8" />
          PromptGoatAI
        </Link>

        <div className="flex items-center gap-4">
          {user ? <>
              <Link to="/prompts"><Button variant="ghost">Browse Prompts</Button></Link>
              <Link to="/app/chat"><Button variant="ghost">AI Chat</Button></Link>
              {profile?.role === 'admin' && <Link to="/admin"><Button variant="ghost">Admin</Button></Link>}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon"><User className="h-4 w-4" /></Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{user.email}</p>
                    {profile?.is_pro && <p className="text-xs text-muted-foreground">Pro Member</p>}
                  </div>
                  <DropdownMenuItem asChild><Link to="/profile" className="cursor-pointer"><User className="mr-2 h-4 w-4" />Profile</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/favorites" className="cursor-pointer"><Heart className="mr-2 h-4 w-4" />My Favorites</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/app/my-prompts" className="cursor-pointer"><BookMarked className="mr-2 h-4 w-4" />My Custom Prompts</Link></DropdownMenuItem>

                  <DropdownMenuItem asChild><Link to="/billing" className="cursor-pointer"><Sparkles className="mr-2 h-4 w-4" />Billing</Link></DropdownMenuItem>
                  <DropdownMenuItem asChild><Link to="/settings" className="cursor-pointer"><Settings className="mr-2 h-4 w-4" />Settings</Link></DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer"><LogOut className="mr-2 h-4 w-4" />Sign Out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </> : <>
              <Link to="/login"><Button variant="ghost">Log In</Button></Link>
              <Link to="/signup"><Button>Sign Up</Button></Link>
            </>}
        </div>
      </div>
    </nav>;
}