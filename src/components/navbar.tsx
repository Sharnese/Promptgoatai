import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sparkles,
  LogOut,
  User,
  Settings,
  BookMarked,
  Heart,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Navbar() {
  const { user, profile, signOut } = useAuth();

  // 🔍 Debug: see what we're actually getting
  console.log("Navbar user:", user);
  console.log("Navbar profile:", profile);

  // 🔒 Robust Pro check:
  // Handles boolean, string, numeric edge cases safely.
  const isPro =
    profile?.is_pro === true ||
    profile?.is_pro === "true" ||
    profile?.is_pro === 1;

  console.log("Navbar isPro computed:", isPro);

  return (
    <nav className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo + Brand */}
        <Link to="/" className="flex items-center gap-2 font-bold">
          {/* Bigger, responsive logo */}
          <img
            src="https://d64gsuwffb70l.cloudfront.net/68fdb98a1a41ecca41313355_1761679297358_d2ec59d1.png"
            alt="PromptGoatAI Logo"
            className="w-12 h-12 md:w-10 md:h-10"
          />

          {/* Smaller text, hidden on tiny screens */}
          <span className="hidden sm:inline text-lg md:text-xl font-semibold tracking-tight whitespace-nowrap">
            <span className="text-blue-600">Prompt</span>
            <span className="text-yellow-500">Goat</span>
            <span className="text-slate-800">AI</span>
          </span>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {user ? (
            <>
              {/* Always available */}
              <Link to="/prompts">
                <Button variant="ghost">Browse Prompts</Button>
              </Link>
              {/* Always available */}
<Link to="/prompts">
  <Button variant="ghost">Browse Prompts</Button>
</Link>

{/* ✅ Free Prompt Pack */}
<Link to="/free-prompt-pack">
  <Button variant="ghost">Free Prompt Pack</Button>
</Link>


              {/* ✅ AI Chat: ONLY if isPro is true */}
              {isPro && (
                <Link to="/app/chat">
                  <Button variant="ghost">
                    <Sparkles className="w-4 h-4 mr-2" />
                    AI Chat
                  </Button>
                </Link>
              )}

              {/* (Optional) Upsell version instead of hiding:
                  Uncomment this and remove the block above if you prefer:

              {!isPro && (
                <Link to="/billing">
                  <Button
                    variant="outline"
                    className="border-dashed"
                  >
                    <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                    AI Chat (Pro)
                  </Button>
                </Link>
              )}
              */}

              {/* Admin-only */}
              {profile?.role === "admin" && (
                <Link to="/admin">
                  <Button variant="ghost">Admin</Button>
                </Link>
              )}

              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <User className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="px-2 py-1.5 text-sm">
                    <p className="font-medium">{user.email}</p>
                    {isPro && (
                      <p className="text-xs text-muted-foreground">
                        Pro Member
                      </p>
                    )}
                  </div>

                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/favorites" className="cursor-pointer">
                      <Heart className="mr-2 h-4 w-4" />
                      My Favorites
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/app/my-prompts" className="cursor-pointer">
                      <BookMarked className="mr-2 h-4 w-4" />
                      My Custom Prompts
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/billing" className="cursor-pointer">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Billing
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="cursor-pointer">
                      <Settings className="mr-2 h-4 w-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={signOut}
                    className="cursor-pointer"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost">Log In</Button>
              </Link>
              <Link to="/signup">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
