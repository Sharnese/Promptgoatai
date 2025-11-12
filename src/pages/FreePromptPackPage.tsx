import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PromptTemplate {
  category_name: string;
  prompt_title: string | null;
  prompt_text: string;
}

export function FreePromptPackPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [grouped, setGrouped] = useState<Record<string, PromptTemplate[]>>({});

  useEffect(() => {
    const load = async () => {
      // 1️⃣ Ensure user is logged in
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        // Not authorized → send to login
        navigate("/login");
        return;
      }

      // 2️⃣ Fetch free-pack prompts
      const { data, error } = await supabase
        .from("prompt_pack_templates")
        .select("category_name, prompt_title, prompt_text")
        .eq("is_free_pack", true)
        .order("category_name", { ascending: true })
        .order("prompt_title", { ascending: true });

      if (error) {
        console.error("Error loading free prompt pack:", error);
        setLoading(false);
        return;
      }

      const byCategory: Record<string, PromptTemplate[]> = {};
      (data || []).forEach((p: any) => {
        if (!byCategory[p.category_name]) byCategory[p.category_name] = [];
        byCategory[p.category_name].push(p);
      });

      setGrouped(byCategory);
      setLoading(false);
    };

    load();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">
            Free Prompt Pack
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl">
            Thanks for being part of PromptGoatAI. These 50 prompts are yours
            to use anytime—curated across marketing, operations, clinical,
            sales, productivity, coding, creativity, and more.
          </p>
        </header>

        {loading ? (
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
      </div>
    </div>
  );
}
