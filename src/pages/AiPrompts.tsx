import { useEffect } from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Check } from "lucide-react"

export function AiPromptsPage() {
  useEffect(() => {
    // Basic SEO for SPA
    document.title = "Best AI Prompts for Every Model | PromptGoatAI"

    const description =
      "High-performance AI prompts for ChatGPT, Claude, Gemini, Sora, Kling, Midjourney and more. Free examples plus access to the full PromptGoatAI prompt library."

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null
    if (!meta) {
      meta = document.createElement("meta")
      meta.name = "description"
      document.head.appendChild(meta)
    }
    meta.content = description
  }, [])

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50">
      {/* Top bar / breadcrumb */}
      <header className="border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            {/* If you have a logo image, swap this div for <img /> */}
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-amber-400 text-slate-950 font-black text-xl">
              🐐
            </div>
            <div>
              <div className="text-sm uppercase tracking-[0.25em] text-amber-300">
                PromptGoatAI
              </div>
              <p className="text-xs text-slate-400">
                Expert-crafted prompts for every AI model
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" className="text-slate-300 hover:text-amber-300">
                Back to Dashboard
              </Button>
            </Link>
            <Link to="/signup">
              <Button className="bg-amber-400 text-slate-950 hover:bg-amber-300">
                Get Free Prompt Pack
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto max-w-6xl px-4 py-10 space-y-12">
        {/* Hero section */}
        <section className="grid gap-8 md:grid-cols-[3fr,2fr] items-center">
          <div className="space-y-5">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">
              Best AI Prompts for{" "}
              <span className="bg-gradient-to-r from-amber-300 to-amber-500 bg-clip-text text-transparent">
                Every Model You Use
              </span>
            </h1>
            <p className="text-slate-300 text-sm md:text-base max-w-xl">
              Copy-paste-ready prompts engineered for ChatGPT, Claude, Gemini, Sora, Kling,
              Midjourney and more. Use this page as a free starter pack—then unlock the full
              PromptGoatAI library inside the app.
            </p>

            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-amber-400" />
                <span>Role-based prompts with clear context and expected output.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-amber-400" />
                <span>Optimized for real-world use: business, content, creative, and more.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 text-amber-400" />
                <span>Works across major AI tools, not just ChatGPT.</span>
              </li>
            </ul>

            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/signup">
                <Button className="bg-amber-400 text-slate-950 hover:bg-amber-300">
                  Unlock Full Library
                </Button>
              </Link>
              <a href="#prompt-sections">
                <Button variant="outline" className="border-amber-400 text-amber-300 hover:bg-amber-400/10">
                  Scroll to Prompts
                </Button>
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-500/40 bg-gradient-to-b from-slate-900 to-slate-950 p-5 shadow-xl shadow-amber-500/10">
            <p className="text-xs uppercase tracking-[0.25em] text-amber-300 mb-3">
              Example Prompt Card
            </p>
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle className="text-sm text-amber-200">
                  High-Conversion Social Media Post Prompt
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-slate-200 space-y-2">
                <p className="font-mono text-[11px] leading-relaxed">
                  You are a social media strategist for {`"{brand}."`} Create a{" "}
                  {`{platform}`} post that hooks attention in 2 seconds, uses the brand voice
                  described here: {`"{voice_description}"`}, and ends with a clear call to action:
                  {`"{cta}"`}. Return: hook, caption, and 3 hashtag options.
                </p>
                <div className="flex justify-between items-center pt-2">
                  <span className="rounded-full bg-slate-800 px-2 py-1 text-[10px] uppercase tracking-wide text-slate-300">
                    Works with ChatGPT / Claude / Gemini
                  </span>
                  <button className="text-[10px] text-amber-300 hover:underline">
                    Copy prompt
                  </button>
                </div>
              </CardContent>
            </Card>
            <p className="mt-3 text-[11px] text-slate-400">
              Prompts on this page are just a sample. Inside PromptGoatAI you get full categorized
              libraries, custom prompts, and pro-level templates.
            </p>
          </div>
        </section>

        {/* Prompt sections */}
        <section id="prompt-sections" className="space-y-8">
          <h2 className="text-2xl font-semibold text-amber-200">
            Copy-Paste AI Prompts by Use Case
          </h2>

          {/* Business & Productivity */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-amber-300">
                1. Business & Productivity Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-100">
              <PromptBlock
                label="Task & Priority Breakdown"
                text={`You are a productivity coach. I will paste my to-do list. Turn it into:
1) A prioritized list (High/Medium/Low).
2) Estimated time for each item.
3) A simple schedule for today.
4) One suggestion to simplify or delegate. Here is my list: {paste_tasks_here}`}
              />
              <PromptBlock
                label="Email Rewrite for Clarity & Respect"
                text={`You are a professional communication coach. Rewrite the email below so it is clear, direct, and respectful, while still setting firm boundaries. Keep my original meaning but improve tone and structure. Return: subject line + email body. Email: {paste_email_here}`}
              />
              <PromptBlock
                label="Meeting Summary & Action Items"
                text={`You are an executive assistant. I will paste raw meeting notes. Turn them into:
- 3–5 bullet summary
- Decisions made
- Action items with owner + due date
Keep it concise and skimmable. Notes: {paste_notes_here}`}
              />
            </CardContent>
          </Card>

          {/* Content & Social Media */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-amber-300">
                2. Content & Social Media Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-100">
              <PromptBlock
                label="30-Day Content Calendar"
                text={`You are a content strategist for an online brand that helps {target_audience} with {main_offer}. Create a 30-day content calendar for {platform}, with:
- Topic
- Hook
- Content angle (story, tip, myth, etc.)
- Call to action
Make it conversational and aligned with this brand voice: {describe_voice}.`}
              />
              <PromptBlock
                label="Hook + Caption Generator"
                text={`You are a copywriter for short-form video. Generate 5 hook + caption pairs for {platform} about {topic}. Hooks must be 1 sentence, pattern-breaking, and curiosity-driven. Captions should expand the idea in 2–4 sentences and end with a call to action: {desired_action}.`}
              />
              <PromptBlock
                label="Carousel Outline"
                text={`You are a content designer. Create an outline for a 7-slide carousel on {topic}. Return:
- Slide 1: Big promise
- Slide 2–6: Key points (one per slide)
- Slide 7: Call to action
Keep the text short enough to fit on social graphics.`}
              />
            </CardContent>
          </Card>

          {/* AI Video & Image */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-amber-300">
                3. AI Video & Image Prompts (Sora / Kling / Midjourney-style)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-100">
              <PromptBlock
                label="Short Promo Video Prompt"
                text={`You are a creative director crafting a 10-second promo video prompt for an AI video model like Sora or Kling. The product is {product}, the audience is {audience}, and the vibe is {vibe: cinematic, playful, etc.}. Return a single, detailed prompt including:
- Visual description
- Camera movement
- Lighting and mood
- Text overlay (exact wording in English)
- Ending frame (logo or call to action).`}
              />
              <PromptBlock
                label="Character Design Prompt"
                text={`You are a visual art director creating a character design prompt for an AI image model. Design a character that represents {brand} as a {type of mascot: goat, robot, guide, etc.}. Include:
- Age / energy
- Clothing style and colors
- Facial expression
- Background style
- Overall mood
Return as one detailed prompt paragraph.`}
              />
              <PromptBlock
                label="Scene Storyboard Prompt"
                text={`You are a storyboard artist. Create 4 shot descriptions for an AI video about {story_concept}. Each shot should include:
- Camera angle
- Subject action
- Background elements
- Lighting and mood
Return as “Shot 1, Shot 2, Shot 3, Shot 4”.`}
              />
            </CardContent>
          </Card>

          {/* Self-Reflection & Coaching */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="text-lg text-amber-300">
                4. Self-Reflection & Coaching Prompts
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-100">
              <PromptBlock
                label="Daily Check-In"
                text={`You are a gentle, honest self-reflection coach. Ask me 5 short questions to check in on my day: mood, energy, wins, challenges, and one thing I’m proud of. Then, based on my answers, reflect back a 1-paragraph summary and 2 small suggestions for tomorrow.`}
              />
              <PromptBlock
                label="Decision Clarity Prompt"
                text={`You are a decision-making coach. Help me think through this decision: {describe_decision}. Ask me:
1) What are my options?
2) What matters most to me here?
3) What am I afraid of?
4) Best-case / worst-case for each option.
Then, summarize what you heard and suggest 1–2 next steps, without telling me what to do.`}
              />
              <PromptBlock
                label="Goal Breakdown"
                text={`You are a supportive coach. I will share one goal. Break it into:
- Why this matters to me (based on what you infer)
- 3–5 milestones
- First 3 tiny actions I can take this week
Keep it encouraging and realistic. Goal: {describe_goal}.`}
              />
            </CardContent>
          </Card>
        </section>

        {/* CTA section */}
        <section className="rounded-3xl border border-amber-500/40 bg-gradient-to-r from-slate-900 to-slate-950 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <h3 className="text-xl md:text-2xl font-semibold text-amber-200">
              Want the full PromptGoatAI library?
            </h3>
            <p className="text-sm text-slate-200">
              This page is just your free sample. Inside PromptGoatAI you get categorized prompt
              libraries, custom prompt generation, and new drops for different AI tools as they
              launch.
            </p>
          </div>
          <Link to="/signup">
            <Button size="lg" className="bg-amber-400 text-slate-950 hover:bg-amber-300">
              Create Free Account
            </Button>
          </Link>
        </section>

        {/* FAQ section */}
        <section className="pb-10">
          <h2 className="text-2xl font-semibold text-amber-200 mb-4">
            AI Prompt FAQ
          </h2>
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-sm text-slate-100">
                Do these AI prompts only work with ChatGPT?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-300">
                No. These prompts are designed to work across multiple models, including ChatGPT,
                Claude, Gemini, and other large language models. Many of the video and image-style
                prompts can also be adapted for Sora, Kling, Midjourney, and similar tools.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2">
              <AccordionTrigger className="text-sm text-slate-100">
                What makes PromptGoatAI different from random prompts online?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-300">
                PromptGoatAI focuses on high-utility prompts that are role-based, specific, and
                tied to real-world outcomes—business workflows, marketing, creative projects,
                coaching, and more. They are curated so you spend less time guessing and more time
                getting results.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3">
              <AccordionTrigger className="text-sm text-slate-100">
                Can I customize these prompts for my niche?
              </AccordionTrigger>
              <AccordionContent className="text-sm text-slate-300">
                Yes. Most prompts include placeholders like {"{audience}"} or {"{topic}"}. Swap
                those for your niche, brand voice, or offer. Inside the PromptGoatAI app, you can
                also generate custom prompts tailored to your use case.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>
    </div>
  )
}

interface PromptBlockProps {
  label: string
  text: string
}

function PromptBlock({ label, text }: PromptBlockProps) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      // You can swap this for a toast if you’re using a toast system
      alert("Prompt copied to clipboard")
    } catch {
      alert("Unable to copy prompt")
    }
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
      <div className="mb-2 flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-amber-200">{label}</h3>
        <button
          onClick={handleCopy}
          className="text-[11px] rounded-full border border-amber-400/60 px-2 py-1 text-amber-300 hover:bg-amber-400/10"
        >
          Copy prompt
        </button>
      </div>
      <pre className="whitespace-pre-wrap break-words text-xs text-slate-100 font-mono">
        {text}
      </pre>
    </div>
  )
}
