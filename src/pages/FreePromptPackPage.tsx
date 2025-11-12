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

export default function FreePromptPackPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [grouped, setGrouped] = useState<Record<string, PromptTemplate[]>>({});

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from("prompt_pack_templates")
        .select("category_name, prompt_title, prompt_text")
        .eq("is_free_pack", true)
        .order("category_name", { ascending: true })
        .order("prompt_title", { ascending: true });

      if (error) { console.error(error); setLoading(false); return; }

      const byCat: Record<string, PromptTemplate[]> = {};
      (data || []).forEach((p: any) => {
        if (!byCat[p.category_name]) byCat[p.category_name] = [];
        byCat[p.category_name].push(p);
      });

      setGrouped(byCat);
      setLoading(false);
    })();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2">
          <h1 className="text-3xl md:text-4xl font-semibold">Free Prompt Pack</h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl">
            50 expert prompts across marketing, operations, clinical, sales, productivity, coding, and more.
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
            {Object.entries(grouped).map(([cat, prompts]) => (
              <Card key={cat} className="bg-slate-900 border-slate-800">
                <CardHeader><CardTitle className="text-lg md:text-xl">{cat}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  {prompts.map((p, idx) => (
                    <div key={idx} className="p-3 rounded-md bg-slate-950/70 border border-slate-800 text-xs md:text-sm">
                      {p.prompt_title && <div className="font-semibold text-slate-100 mb-1">{p.prompt_title}</div>}
                      <div className="text-slate-300 whitespace-pre-line">{p.prompt_text}</div>
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
