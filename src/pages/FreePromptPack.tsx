import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";

interface PromptTemplate {
  category_name: string;
  prompt_title: string | null;
  prompt_text: string;
}

export function FreePromptPackPage() {
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAuthed, setIsAuthed] = useState(false);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [grouped, setGrouped] = useState<Record<string, PromptTemplate[]>>({});

  // signup form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        setIsAuthed(true);
        await loadPrompts();
      }
      setSessionChecked(true);
    };
    checkSession();
  }, []);

  const loadPrompts = async () => {
    setLoadingPrompts(true);
    const { data, error } = await supabase
      .from("prompt_pack_templates")
      .select("category_name, prompt_title, prompt_text")
      .eq("is_free_pack", true)
      .order("category_name", { ascending: true })
      .order("prompt_title", { ascending: true });

    if (error) {
      console.error("Error loading prompts", error);
      setLoadingPrompts(false);
      return;
    }

    const groupedData: Record<string, PromptTemplate[]> = {};
    (data || []).forEach((p: any) => {
      if (!groupedData[p.category_name]) groupedData[p.category_name] = [];
      groupedData[p.category_name].push(p);
    });

    setGrouped(groupedData);
    setLoadingPrompts(false);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!fullName.trim() || !email.trim() || !password.trim()) {
      setAuthError("Please fill in all fields.");
      return;
    }

    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
            source: "free_prompt_pack",
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("already registered")) {
          setAuthError("This email already has an account. Please log in below to access your free prompt pack.");
        } else {
          setAuthError(error.message || "Something went wrong. Please try again.");
        }
        return;
      }

      if (!data.session) {
        // If your project still requires email confirmation, either:
        // - turn it off for this, or
        // - show a message. Assuming disabled here:
        setAuthError("Account created but no active session. Please log in.");
        return;
      }

      // track claim (optional)
      await supabase.from("free_prompt_pack_claims").insert({
        auth_user_id: data.user?.id,
        full_name: fullName.trim(),
        email: email.toLowerCase(),
        source: "free_prompt_pack_signup",
      }).catch(() => { /* non-blocking */ });

      setIsAuthed(true);
      await loadPrompts();
    } catch (err: any) {
      console.error(err);
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    if (!email.trim() || !password.trim()) {
      setAuthError("Enter your email and password to log in.");
      return;
    }

    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase(),
        password,
      });

      if (error) {
        setAuthError("Invalid email or password. Try again.");
        return;
      }

      if (!data.session) {
        setAuthError("Login failed. Please try again.");
        return;
      }

      setIsAuthed(true);
      await loadPrompts();
    } catch (err: any) {
      console.error(err);
      setAuthError("Something went wrong. Please try again.");
    } finally {
      setAuthLoading(false);
    }
  };

  const showLibrary = isAuthed;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-10">
        <header className="space-y-3 text-center">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Free PromptGoatAI Prompt Pack
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-3xl mx-auto">
            Create or log into your PromptGoatAI account to unlock 50 expert-crafted prompts
            across marketing, clinical, operations, sales, creativity, productivity, coding,
            and more. Once you’re in, this page is always available from the navbar.
          </p>
        </header>

        {/* Auth + Library layout */}
        <div className="grid gap-8 md:grid-cols-[minmax(0,1.4fr),minmax(0,1fr)] items-start">
          {/* Left: Library (if authed) */}
          <div>
            {showLibrary ? (
              <>
                {loadingPrompts ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                      <Skeleton key={i} className="h-32 bg-slate-800" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-6">
                    {Object.entries(grouped).map(([category, prompts]) => (
                      <Card key={category} className="bg-slate-900 border-slate-800">
                        <CardHeader>
                          <CardTitle className="text-lg md:text-xl">
                            {category}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {prompts.map((p, idx) => (
                            <div
                              key={idx}
                              className="p-3 rounded-md bg-slate-950/70 border border-slate-800 text-xs md:text-sm leading-relaxed"
                            >
                              {p.prompt_title && (
                                <div className="font-semibold text-slate-100 mb-1">
                                  {p.prompt_title}
                                </div>
                              )}
                              <div className="text-slate-300 whitespace-pre-line">
                                {p.prompt_text}
                              </div>
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle className="text-xl">
                    Unlock the Free Prompt Pack
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Create a free account or log in to instantly view all 50 prompts.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-400 text-sm">
                    Once signed in, this page will automatically display your full prompt library.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right: Auth panel */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg">
                {showLibrary ? "You’re signed in" : "Sign up or log in"}
              </CardTitle>
              <CardDescription className="text-slate-400">
                Use one account to access all current and future PromptGoatAI resources.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showLibrary && (
                <>
                  <form className="space-y-3" onSubmit={handleSignup}>
                    <div className="space-y-1">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your name"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="password">Password</Label>
                      <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Create a password"
                      />
                    </div>
                    {authError && (
                      <p className="text-xs text-red-400">{authError}</p>
                    )}
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={authLoading}
                    >
                      {authLoading ? "Working on it..." : "Create Free Account & Unlock Pack"}
                    </Button>
                  </form>

                  <div className="border-t border-slate-800 pt-3 mt-3">
                    <p className="text-[10px] text-slate-500 mb-1">
                      Already have an account?
                    </p>
                    <form className="space-y-2" onSubmit={handleLogin}>
                      <div className="space-y-1">
                        <Label htmlFor="login-email">Email</Label>
                        <Input
                          id="login-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="login-password">Password</Label>
                        <Input
                          id="login-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Your password"
                        />
                      </div>
                      <Button
                        type="submit"
                        variant="outline"
                        className="w-full text-xs"
                        disabled{authLoading}
                      >
                        Log In & View Pack
                      </Button>
                    </form>
                  </div>
                </>
              )}

              {showLibrary && (
                <p className="text-xs text-slate-400">
                  You’re logged in. Scroll to explore your full prompt pack.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
