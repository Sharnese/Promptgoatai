import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, Check, ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Prompt = {
  title: string;
  text: string;
};

type Category = {
  id: string;
  name: string;
  prompts: Prompt[];
};

const FREE_PROMPT_CATEGORIES: Category[] = [
  {
    id: "clinical-human-services",
    name: "Clinical & Human Services",
    prompts: [
      {
        title: "Person-Centered Progress Note",
        text: `You are a licensed clinician writing a person-centered progress note.

Client: {age, diagnoses, strengths}
Session focus: {skill/behavior/goal}
Context: {setting, duration}

Write a brief note that:
- Reflects the person’s own words when possible
- Connects interventions to their stated goals
- Describes progress using observable language
- Ends with 1–2 next steps for staff and/or client

Output in a short SOAP-style format (S, O, A, P).`
      },
      {
        title: "Support Plan Refresh (Quarterly)",
        text: `Act as a human-services planner reviewing a quarterly support plan.

Inputs:
- Strengths and interests
- Current living/work situation
- Risks and safety considerations
- 2–3 main outcomes or goals

Create a one-page summary that includes:
1) Strengths & what’s working (3–5 bullets)
2) Current risks & safeguards
3) Each outcome with:
   - Why it matters to the person
   - How staff support it day-to-day
4) Any recommended adjustments for the next quarter.

Keep language plain, respectful, and person-centered.`
      }
    ]
  },
  {
    id: "compliance-operations",
    name: "Compliance & Operations",
    prompts: [
      {
        title: "Simple SOP Draft",
        text: `You are an operations lead documenting a Standard Operating Procedure (SOP) for {process}.

Create an SOP with:
- Purpose (2–3 sentences)
- Scope (who and when it applies)
- Roles & responsibilities
- Step-by-step instructions (numbered list)
- Quality checks or approvals
- What to do if something goes wrong

Write it in clear language that any new staff can follow.`
      }
    ]
  },
  {
    id: "personal-productivity-life-skills",
    name: "Personal Productivity & Life Skills",
    prompts: [
      {
        title: "Today Breakdown Planner",
        text: `You are a productivity coach. I’ll share everything on my mind for today.

1) Ask me for:
   - My must-do tasks
   - Nice-to-have tasks
   - Personal/life tasks
2) Turn my answers into:
   - A short prioritized list (High/Medium/Low)
   - A simple time-blocked schedule for today
   - 1 suggestion to remove or delegate a task

Keep it kind and realistic, not hustle culture.`
      }
    ]
  },
  {
    id: "customer-support-success",
    name: "Customer Support & Success",
    prompts: [
      {
        title: "Calm, Clear Support Reply",
        text: `Act as a senior customer support rep.

I’ll paste a frustrated customer message here: {paste_message}.

Write a reply that:
- Acknowledges their feelings
- Briefly explains what happened (if known)
- Gives 1–2 concrete steps you’re taking
- Offers a clear next step or timeframe

Tone: calm, respectful, and human. 140–180 words.`
      }
    ]
  },
  {
    id: "finance-operations",
    name: "Finance & Operations",
    prompts: [
      {
        title: "Simple Cash Flow Snapshot",
        text: `You are a small-business finance coach.

I’ll provide:
- Monthly revenue numbers
- Main expense categories
- Current cash on hand

Create a simple snapshot that includes:
- Average monthly profit or loss
- Rough runway (months of cash left)
- 2–3 places to look for savings
- 1 suggestion for improving cash flow next month.

Explain in plain, non-technical language.`
      }
    ]
  },
  {
    id: "design-visual-creativity",
    name: "Design & Visual Creativity",
    prompts: [
      {
        title: "Mini Brand Moodboard in Words",
        text: `Act as a creative director.

Brand type: {e.g. wellness coach, SaaS tool, artist}
Vibe: {e.g. calm, bold, playful}
Audience: {describe briefly}

Create a “moodboard in words” with:
- 3–4 visual themes
- A color palette (3–5 hex codes)
- Font style suggestions
- 3 visual references (described, not links)

Keep it short but vivid enough for a designer.`
      }
    ]
  },
  {
    id: "difficult-conversations",
    name: "Difficult Conversations",
    prompts: [
      {
        title: "Script for Hard Conversation",
        text: `You are a conflict-sensitive communication coach.

Situation: {describe what’s going on}
Person: {relationship to you}

Write a short script that includes:
- A calm opening line
- How to state the issue using “I” language
- One clear boundary or request
- A closing line that invites dialogue

Keep the tone honest, firm, and respectful.`
      }
    ]
  },
  {
    id: "marketing-growth-strategy",
    name: "Marketing & Growth Strategy",
    prompts: [
      {
        title: "3-Post Intro Sequence",
        text: `You are a marketing strategist for {type_of_business}.

Create 3 social posts that:
- Introduce who we are
- Explain the main problem we solve
- Invite people to take a simple next step (like follow, comment, or click)

For each post, give:
- Hook line
- 2–3 sentence caption
- Call to action.`
      }
    ]
  },
  {
    id: "product-feature-development",
    name: "Product & Feature Development",
    prompts: [
      {
        title: "Quick Feature Outline",
        text: `Act as a product manager.

Feature idea: {describe briefly}
Audience: {who it’s for}

Return:
- One-sentence feature summary
- Problem it solves (3 bullets)
- Basic user flow (step-by-step)
- 2 simple success metrics to track

Keep it light and practical.`
      }
    ]
  },
  {
    id: "sales-business-development",
    name: "Sales & Business Development",
    prompts: [
      {
        title: "Gentle Outreach Email",
        text: `You are a business development rep.

I’ll share:
- Who I’m reaching out to
- What I offer
- Any connection or reason

Write a short warm outreach email (100–140 words) that:
- Acknowledges who they are
- States the value clearly
- Ends with a soft, specific CTA (like a 15-min call) without pressure.`
      }
    ]
  },
  {
    id: "ai-video-image-production",
    name: "AI Video & Image Production",
    prompts: [
      {
        title: "Short Promo Video Prompt",
        text: `Act as a creative director writing a prompt for an AI video tool (like Sora or Kling).

Product: {what you’re promoting}
Audience: {who it’s for}
Vibe: {cinematic, playful, cozy, etc.}

Write one detailed video prompt that includes:
- Setting and visuals
- Camera movement
- Lighting and mood
- On-screen text (exact wording in English)
- Ending frame (logo or simple CTA).`
      }
    ]
  },
  {
    id: "legal-compliance",
    name: "Legal & Compliance",
    prompts: [
      {
        title: "Plain-Language Policy Summary",
        text: `You are a compliance translator.

I’ll paste a policy or legal text: {paste_here}.

Rewrite it in plain language so staff can understand:
- What this policy is about
- Who it applies to
- What they must do or not do
- What happens if it’s ignored

Keep it accurate but easy to read.`
      }
    ]
  },
  {
    id: "content-creation-blogging",
    name: "Content Creation & Blogging",
    prompts: [
      {
        title: "Blog Outline Builder",
        text: `You are an editor.

Topic: {what I want to write about}
Audience: {who I’m writing for}
Goal: {what I want this post to do}

Create an outline with:
- Working title options (3)
- H2/H3 sections
- Notes on what to cover in each section
- 1 idea for a call to action at the end.`
      }
    ]
  },
  {
    id: "no-code-app-builders",
    name: "No Code App Builders",
    prompts: [
      {
        title: "No-Code App Game Plan",
        text: `Act as a no-code architect.

Idea: {describe app idea}
Tool: {Bubble, Glide, Softr, etc.}

Return:
- Core features (3–5)
- Simple data structure (tables + key fields)
- Main screens and flows
- 1–2 automations or integrations to add later

Explain like you’re talking to a non-developer.`
      }
    ]
  },
  {
    id: "coding",
    name: "Coding",
    prompts: [
      {
        title: "Debugging Buddy Prompt",
        text: `You are a friendly senior developer.

Language / framework: {e.g. React, Node, Python}
Bug description: {what’s going wrong}
Relevant code: {paste snippet}

Help by:
- Asking clarifying questions if needed
- Suggesting likely causes
- Proposing a plan to test and fix the issue

Explain steps clearly, not just paste code.`
      }
    ]
  },
  {
    id: "ai-productivity-writing",
    name: "AI Productivity & Writing",
    prompts: [
      {
        title: "Clarity Rewrite",
        text: `You are an editor.

Text: {paste any draft}

Rewrite it so it is:
- Clear and straightforward
- In active voice where possible
- Slightly warm and human

Return:
1) A short note on what you changed
2) The improved version of the text.`
      }
    ]
  },
  {
    id: "self-reflection-wellness",
    name: "Self-Reflection & Wellness",
    prompts: [
      {
        title: "Gentle Daily Check-In",
        text: `You are a supportive reflection coach.

Ask me 5 short questions about:
- How I’m feeling
- What felt good today
- What felt hard
- One thing I’m grateful for
- One thing I’d like to try tomorrow

Then reflect back a short, kind summary in 3–4 sentences.`
      }
    ]
  },
  {
    id: "learning-education",
    name: "Learning & Education",
    prompts: [
      {
        title: "Simple Study Plan",
        text: `You are a study coach.

Subject: {what I’m learning}
Time available: {hours per week}
Timeline: {e.g. 4 weeks, 8 weeks}

Create a study plan that includes:
- Weekly focus
- How to practice or review
- A light check-in at the end of each week

Keep it realistic and not overwhelming.`
      }
    ]
  },
  {
    id: "business-admin",
    name: "Business & Admin",
    prompts: [
      {
        title: "One-Page Business Snapshot",
        text: `Act as a business admin helper.

I’ll share a brief description of my business: {paste_here}.

Create a one-page snapshot with:
- What we do
- Who we serve
- Main offers or services
- How we currently operate (very simple)
- 1–2 admin systems we should tighten up (like invoicing, scheduling, or records).`
      }
    ]
  }
];

export default function FreePromptPackPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 1500);
    } catch {
      // optional: toast error
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top bar */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          {/* Logo + Title */}
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
                Free Prompt Pack • 20 Copy-Paste AI Prompts
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link to="/prompts">
              <Button
                variant="ghost"
                className="text-slate-300 hover:text-amber-300 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8 space-y-8">
        {/* Hero */}
        <section className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold leading-tight">
            Your Free{" "}
            <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
              PromptGoatAI Starter Pack
            </span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-2xl">
            20 role-based prompts across clinical, business, creative, and life categories —
            ready to paste into ChatGPT or any AI model so you can see how PromptGoatAI thinks.
          </p>
        </section>

        {/* Categories + Prompts */}
        <section className="space-y-6">
          {FREE_PROMPT_CATEGORIES.map((category) => (
            <Card
              key={category.id}
              className="bg-slate-900/70 border-slate-800"
            >
              <CardHeader className="flex flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Badge className="bg-amber-400 text-slate-900 font-semibold">
                    {category.name}
                  </Badge>
                  <span className="text-xs text-slate-400">
                    {category.prompts.length} prompt
                    {category.prompts.length > 1 ? "s" : ""}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.prompts.map((prompt, index) => {
                  const key = `${category.id}-${index}`;
                  const isCopied = copiedKey === key;
                  return (
                    <div
                      key={key}
                      className="rounded-xl border border-slate-800 bg-slate-950/70 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-sm font-semibold text-amber-200">
                          {prompt.title}
                        </h3>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={cn(
                            "h-8 w-8 text-slate-300 hover:text-amber-300",
                            isCopied && "text-emerald-400"
                          )}
                          onClick={() => handleCopy(prompt.text, key)}
                          title="Copy prompt"
                          aria-label="Copy prompt"
                        >
                          {isCopied ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <pre className="mt-2 whitespace-pre-wrap text-xs text-slate-200 font-mono leading-relaxed">
                        {prompt.text}
                      </pre>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </div>
  );
}
