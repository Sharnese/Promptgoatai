import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FreePromptPackPage() {
  return (
    <div className="flex items-center gap-3">
  <img
    src="/prompt-goat-photo.png"
    alt="PromptGoatAI Logo"
    className="h-10 w-10 rounded-full object-cover"
  />
  <div>
    <div className="text-sm uppercase tracking-[0.25em] text-amber-300">
      PromptGoatAI
    </div>
    <p className="text-xs text-slate-400">
      Free Prompt Pack
    </p>
  </div>
</div>


          <Link to="/">
            <Button variant="ghost" className="text-slate-300 hover:text-amber-300">
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-5xl px-4 py-10 space-y-8">
        {/* Hero */}
        <section className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold">
            Download Your{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              Free Prompt Pack
            </span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl">
            A curated set of high–impact prompts to help you see how PromptGoatAI thinks:
            business, content, creative, and reflection prompts you can copy straight into
            ChatGPT or any other AI model.
          </p>
        </section>

        {/* Sample prompt cards */}
        <section className="grid gap-4 md:grid-cols-3">
          <PromptCard
            title="Business Email Fixer"
            description="Paste any rough email and get a clear, respectful, professional version back."
          />
          <PromptCard
            title="30–Day Content Map"
            description="Instant content calendar for your niche, platform, and brand voice."
          />
          <PromptCard
            title="Clarity Coach"
            description="Use AI as a gentle coach to help you think through a decision or goal."
          />
        </section>

        {/* CTA */}
        <section className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-slate-900 to-slate-950 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h2 className="text-xl md:text-2xl font-semibold text-amber-200">
              Ready for the full library?
            </h2>
            <p className="text-sm text-slate-200">
              Create a free account to unlock categorized libraries, custom prompts, and new drops
              for different AI tools as they launch.
            </p>
          </div>
          <Link to="/signup">
            <Button size="lg" className="bg-amber-400 text-slate-950 hover:bg-amber-300">
              Create Free Account
            </Button>
          </Link>
        </section>
      </main>
    </div>
  );
}

function PromptCard(props: { title: string; description: string }) {
  return (
    <Card className="bg-slate-900 border-slate-800 h-full">
      <CardHeader>
        <CardTitle className="text-sm text-amber-200">{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-slate-300">{props.description}</p>
      </CardContent>
    </Card>
  );
}
