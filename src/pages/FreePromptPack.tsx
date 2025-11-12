import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function FreePromptPackPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName.trim() || !email.trim()) {
      setError("Please enter your name and email.");
      return;
    }

    setLoading(true);

    try {
      // 1. Ensure user exists in Supabase Auth
      // Strategy: passwordless "magic" user or simple generated password; here we assume signUp.
      // If user already exists, we skip signUp and just log the "claim".
      const { data: existingUser, error: fetchError } = await supabase
        .from("profiles")
        .select("id, auth_user_id")
        .eq("email", email.toLowerCase())
        .maybeSingle();

      let authUserId = existingUser?.auth_user_id || null;

      if (fetchError) {
        console.error(fetchError);
      }

      if (!authUserId) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: email.toLowerCase(),
          password: crypto.randomUUID(), // random internal password; they can reset later
          options: {
            data: {
              full_name: fullName.trim(),
              source: "free_prompt_pack",
            },
          },
        });

        if (signUpError) {
          // If email already registered in auth, we can safely continue.
          if (signUpError.message?.toLowerCase().includes("already registered")) {
            const { data: existingAuthUser, error: userError } = await supabase
              .from("profiles")
              .select("auth_user_id")
              .eq("email", email.toLowerCase())
              .maybeSingle();
            if (userError || !existingAuthUser) {
              throw signUpError;
            }
            authUserId = existingAuthUser.auth_user_id;
          } else {
            throw signUpError;
          }
        } else {
          authUserId = signUpData.user?.id || null;
        }
      }

      // 2. Record that they claimed the free prompt pack
      const { error: claimError } = await supabase
        .from("free_prompt_pack_claims")
        .insert({
          email: email.toLowerCase(),
          full_name: fullName.trim(),
          auth_user_id: authUserId,
          source: "landing_page",
        });

      if (claimError && !claimError.message.includes("duplicate")) {
        throw claimError;
      }

      // 3. This insert should trigger your workflow (edge function / automation) to send prompts.

      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError("Something went wrong. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950">
        <Card className="w-full max-w-md bg-slate-900 border-slate-800 text-slate-50">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              You’re in 🎉
            </CardTitle>
            <CardDescription className="text-slate-300">
              We’ve created your PromptGoatAI account (or linked your email) and triggered your free prompt pack.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-slate-300">
              Check your email for your prompts. If you don’t see it in a few minutes, check your spam or promotions tab.
            </p>
            <Button
              className="w-full"
              onClick={() => navigate("/")}
            >
              Go to PromptGoatAI
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="w-full max-w-3xl grid gap-10 md:grid-cols-[1.5fr,1fr] items-center">
        {/* Left: Hero */}
        <div className="space-y-4 text-slate-50">
          <h1 className="text-3xl md:text-4xl font-semibold leading-tight">
            Unlock Your Free PromptGoatAI Starter Pack
          </h1>
          <p className="text-slate-300 text-sm md:text-base">
            Drop your details once and get 3 proven, plug-and-play prompts in each core category:
            marketing, content, design, sales, ops, AI writing, and more.
          </p>
          <ul className="text-xs md:text-sm text-slate-400 space-y-1">
            <li>• Instantly get a PromptGoatAI account to manage your prompts.</li>
            <li>• Curated by real workflows — not generic AI fluff.</li>
            <li>• No payment required. Unsubscribe anytime.</li>
          </ul>
        </div>

        {/* Right: Form */}
        <Card className="bg-slate-900 border-slate-800 text-slate-50">
          <CardHeader>
            <CardTitle className="text-xl">Get your free prompts</CardTitle>
            <CardDescription className="text-slate-400">
              Enter your info to create your account and trigger delivery.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-1">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="flex items-start gap-2 text-xs text-slate-400">
                <input
                  id="agree"
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5"
                />
                <label htmlFor="agree">
                  I agree to receive emails from PromptGoatAI about prompts, tools, and resources.
                </label>
              </div>
              {error && (
                <p className="text-xs text-red-400">
                  {error}
                </p>
              )}
              <Button
                type="submit"
                className="w-full font-medium"
                disabled={loading}
              >
                {loading ? "Working on your prompts..." : "Get My Free Prompts"}
              </Button>
              <p className="text-[10px] text-slate-500 text-center mt-2">
                No spam. No card required. Just prompts.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
