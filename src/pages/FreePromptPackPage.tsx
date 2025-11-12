import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import {
  Copy,
  Check,
  ArrowLeft,
  Sparkles,
  Search,
} from "lucide-react";

/** Brand palette */
const GOLD = "#FFD700";
const ELECTRIC_BLUE = "#0070F3";

/** Curated Free Prompt Pack
 *  3 prompts per category — optimized for ChatGPT with role, context, instructions, and expected output.
 */
type Prompt = { title: string; text: string };
type Pack = { id: string; category: string; prompts: Prompt[] };

const FREE_PACK: Pack[] = [
  {
    id: "084724f0-8a57-4a32-b484-c6babe5e43dc",
    category: "Clinical & Human Services",
    prompts: [
      {
        title: "Person-Centered Progress Note",
        text:
`You are a licensed clinician writing a person-centered progress note.
Client: {age, dx, goals}
Session focus: {skill/behavior}
Context: {setting, duration}
Write a SOAP note using plain language that:
- Reflects client voice (“client said/feels…”)
- Links interventions to goals
- States measurable progress + next steps
Output: 180–220 words, bullet points allowed, HIPAA-safe (no PHI beyond provided).`
      },
      {
        title: "Support Plan Refresh",
        text:
`Act as a human-services planner updating a quarterly support plan.
Inputs: strengths, risks, environments, preferred supports, 2–3 SMART goals.
Deliver:
1) Strengths summary (3 bullets)
2) Risks + mitigation (table: risk | early signs | staff action)
3) SMART goals with weekly strategies
4) Dignity/autonomy note (2 sentences)
Output must be ready to paste into an EHR.`
      },
      {
        title: "Behavior Incident Debrief (Restorative)",
        text:
`Role: BCBA-informed coach facilitating a restorative debrief.
Incident: {what happened}
Antecedents: {known triggers}
Create a debrief that includes:
- What/So What/Now What reflections (client + staff)
- Environmental adjustments
- Replacement skills with teaching steps
- Data to collect next 2 weeks
Output: concise checklist + 100-word narrative.`
      }
    ]
  },
  {
    id: "188c8adf-c505-4a85-a3f7-d3f159a4d03d",
    category: "Compliance & Operations",
    prompts: [
      {
        title: "SOP in 10 Minutes",
        text:
`You are an operations lead. Draft an SOP for {process}.
Include: purpose, scope, roles, inputs, step-by-step, SLAs, risks/controls, audit checklist.
Output: Markdown with clear headings and a one-page version at top.`
      },
      {
        title: "Policy → Procedure Mapper",
        text:
`Given policy text: {paste}, map the exact procedures required to comply.
Return a table: policy clause | required action | owner | frequency | evidence artifact.`
      },
      {
        title: "Internal Audit Plan",
        text:
`Create a 90-day internal audit plan for {domain}.
Sections: objectives, risk areas, sampling method, interview guide, artifacts, scoring rubric (0–3), reporting template.`
      }
    ]
  },
  {
    id: "28065f37-cba6-4416-b048-9e87fd431272",
    category: "Personal Productivity & Life Skills",
    prompts: [
      {
        title: "Deep-Work Day Blueprint",
        text:
`Role: Focus coach. Design a deep-work schedule for {role} with {constraints}.
Include: 3 focus blocks, break protocol, distraction rules, end-of-day review checklist.
Output: timeline + checklist.`
      },
      {
        title: "Weekly Review",
        text:
`Create a weekly review for {goals}.
Sections: Wins, Stuck points, Next actions (contextual), Calendar clean-up, Waiting-For list, 3 priorities.
Output: 1-pager.`
      },
      {
        title: "Decision Matrix",
        text:
`Build an Eisenhower x Impact matrix for these tasks: {list}. Return table with decision (do/schedule/delegate/delete) + next step.`
      }
    ]
  },
  {
    id: "2a889359-75a8-47dc-8c97-7126cf3d8bc2",
    category: "Customer Support & Success",
    prompts: [
      {
        title: "Tone-Perfect Reply",
        text:
`Act as a senior CSM. Draft a response to this customer issue: {paste}.
Constraints: empathetic, specific fix, next step, and timeline; include help-center link + invite to 15-min call.
Output: email in 120–160 words.`
      },
      {
        title: "Proactive Success Plan",
        text:
`Create a 30-day success plan for new customer {segment}.
Include: kickoff agenda, day-7 check-in, value milestones, QBR template (light).`
      },
      {
        title: "Churn Risk Playbook",
        text:
`Given account telemetry {metrics}, produce: risk score, top 3 hypotheses, outreach sequence (3 emails + 1 call script), and save-offer.`
      }
    ]
  },
  {
    id: "3387a5fe-c935-4f15-a507-50d6ad5e78dc",
    category: "Finance & Operations",
    prompts: [
      {
        title: "Unit Economics Snapshot",
        text:
`Compute unit economics for {product}: CAC, LTV, payback period.
Inputs: ARPU, gross margin, churn, CAC.
Return: table + 3 insights + 1 action.`
      },
      {
        title: "Cost-Cutting Opportunities",
        text:
`Given expense list {csv/summary}, find 10% savings: vendor renegotiations, eliminations, automation ideas.
Output: ranked table with est. impact.`
      },
      {
        title: "Cash Flow Forecast (13-week)",
        text:
`Create a 13-week cash forecast with inflows/outflows and triggers for runway alerts at 8/6/4 weeks.`
      }
    ]
  },
  {
    id: "382f549e-7f83-4fc1-8919-a37a9df482f1",
    category: "Design & Visual Creativity",
    prompts: [
      {
        title: "Brand Moodboard in Words",
        text:
`You are a creative director. Generate 3 moodboard directions for {brand} (style, palette, type, references). Output: bullets + hex codes.`
      },
      {
        title: "Hero Section Copy",
        text:
`Write 3 hero headline + subhead options for {product}, each with a distinct angle (outcome, social proof, simplicity).`
      },
      {
        title: "Creative Brief",
        text:
`Draft a one-page brief for a landing page: audience, promise, proof, sections, wireframe notes, do/don’t.`
      }
    ]
  },
  {
    id: "4356425a-e6ce-4793-b3c9-9b4e9d4deb1f",
    category: "Difficult Conversations",
    prompts: [
      {
        title: "Manager Feedback Script",
        text:
`Write a psychologically safe feedback script using SBI model for issue: {behavior}. Include opener, ask, and follow-up plan.`
      },
      {
        title: "Scope Pushback (Client)",
        text:
`Draft a respectful boundary email pushing back on out-of-scope request. Include options A/B/C and clear next step.`
      },
      {
        title: "Conflict Mediation",
        text:
`Create a 30-minute mediation agenda with prompts that move two peers from blame to problem-solving.`
      }
    ]
  },
  {
    id: "40dc5125-7a4b-401b-bf5f-f6ff5ea90dbb",
    category: "Marketing & Growth Strategy",
    prompts: [
      {
        title: "3-Post Launch Burst",
        text:
`Act as a growth marketer. Create a 3-post social burst for {offer} (hook, value, CTA). Platforms: IG, LinkedIn, X.`
      },
      {
        title: "Positioning Mini-Doc",
        text:
`Write a positioning statement, key messages (3), and objection handling for {product} vs {competitor}.`
      },
      {
        title: "Lead Magnet Outline",
        text:
`Outline a 5-page lead magnet for {audience} that ladders into {paid offer}. Include page titles and bullet content.`
      }
    ]
  },
  {
    id: "77bfc52f-4fa3-4f22-85df-4c67aebeae10",
    category: "Product & Feature Development",
    prompts: [
      {
        title: "MVP Feature Slice",
        text:
`Propose 3 MVP features for {idea} with job-to-be-done, acceptance criteria, and success metric.`
      },
      {
        title: "User Interview Guide",
        text:
`Create a 10-question interview guide to validate {hypothesis}. Include warm-up, behavioral, and ending questions.`
      },
      {
        title: "Release Notes (Human-Friendly)",
        text:
`Write friendly release notes for {version}. Template: What's new, Why it matters, How to use, Known limits.`
      }
    ]
  },
  {
    id: "8a647b8f-4b77-4c28-aef9-9897034a8f4e",
    category: "Sales & Business Development",
    prompts: [
      {
        title: "Warm Outreach",
        text:
`Draft a 120-word warm email to {persona} at {company} referencing {trigger}. CTA: 15-min discovery.`
      },
      {
        title: "Discovery Call Map",
        text:
`Create a discovery flow: goals, pains, current tools, impact, timeline, next step. Include 2 killer questions.`
      },
      {
        title: "Proposal Skeleton",
        text:
`Produce a proposal outline with scope, timeline, outcomes, pricing options (good/better/best), and assumptions.`
      }
    ]
  },
  {
    id: "9426eeeb-592c-40a8-9e13-fe68d8e9cefc",
    category: "AI Video & Image Production",
    prompts: [
      {
        title: "Short Promo Script (10s)",
        text:
`Write a 10-second script for {tool}. Include opening hook, benefit line, CTA overlay text. Output: SRT timing + VO.`
      },
      {
        title: "Storyboard (6 shots)",
        text:
`Create a 6-shot storyboard for a vertical video: scene, action, on-screen text, asset notes.`
      },
      {
        title: "Image Set Brief",
        text:
`Generate 5 image prompts in a consistent style for {theme}. Include lighting, lens, mood, color direction.`
      }
    ]
  },
  {
    id: "948260cb-229f-4a76-87fe-b7fcbf70945c",
    category: "Legal & Compliance",
    prompts: [
      {
        title: "Contract Redline Summary",
        text:
`Summarize deltas between Contract A and B. Table: clause | change | risk | suggested language.`
      },
      {
        title: "Privacy Notice Draft",
        text:
`Draft a human-readable privacy notice for {app}. Sections: data we collect, why, how long, rights, contact.`
      },
      {
        title: "Regulatory Mapping",
        text:
`Map {regulation} requirements to current controls. Output: matrix with status (meets/gap) + remediation.`
      }
    ]
  },
  {
    id: "9ba15533-4333-4f06-9030-0167bfbb9b6e",
    category: "Content Creation & Blogging",
    prompts: [
      {
        title: "Topic → Outline",
        text:
`You are an editor. Turn topic {topic} into an outline with H2/H3, angle, and evidence suggestions.`
      },
      {
        title: "Repurpose Engine",
        text:
`Repurpose this article {url/text} into: 1 newsletter, 2 tweets, 1 LinkedIn post, and 3 IG captions.`
      },
      {
        title: "Editorial Calendar",
        text:
`Create a 6-week content calendar for {niche}. Columns: date, title, format, CTA, asset notes.`
      }
    ]
  },
  {
    id: "a8930d93-5b1b-4c60-bed1-9f65eacdc313",
    category: "No Code App Builders",
    prompts: [
      {
        title: "Build Plan (No-Code)",
        text:
`Design a build plan in {tool} for {app idea}. Include schema, core flows, auth, 3 automations, and limits.`
      },
      {
        title: "Zap/Automation Map",
        text:
`List the automations for {process}. Table: trigger | action | app | error handling.`
      },
      {
        title: "MVP UI Wireframe (Text)",
        text:
`Describe wireframe for 3 key screens with sections, inputs, and nav.`
      }
    ]
  },
  {
    id: "ade0eccc-6acb-4173-954b-19bb6b2cb78d",
    category: "Coding",
    prompts: [
      {
        title: "Bug Report → Fix Plan",
        text:
`Given bug report {details}, produce repro steps, root cause hypothesis, failing test idea, patch plan, and rollback.`
      },
      {
        title: "Refactor Proposal",
        text:
`Suggest a refactor for {module}. Include risks, before/after snippets, and success criteria.`
      },
      {
        title: "API Contract",
        text:
`Define a REST API for {resource}. Endpoints, params, status codes, and sample payloads.`
      }
    ]
  },
  {
    id: "bb12bb90-6d3f-4f93-9db8-edabb5afce81",
    category: "AI Productivity & Writing",
    prompts: [
      {
        title: "Rewrite for Clarity",
        text:
`Role: Editor. Rewrite this text for clarity, active voice, and warmth. Keep meaning. Return diff + final. Text: {paste}.`
      },
      {
        title: "Idea Expander",
        text:
`Generate 10 angles for {topic}, grouped by audience sophistication (beginner/intermediate/advanced).`
      },
      {
        title: "Prompt Chain",
        text:
`Create a 3-step prompt chain to research → synthesize → produce a draft for {goal}.`
      }
    ]
  },
  {
    id: "c8ecf42b-2ab7-4710-9fca-968c5b1748cc",
    category: "Self-Reflection & Wellness",
    prompts: [
      {
        title: "Micro-Journaling",
        text:
`Give me 5 daily micro-journal prompts tailored to {theme}. Output: one-liners I can answer in 60 seconds.`
      },
      {
        title: "Energy Audit",
        text:
`Create an energy audit template: activities that drain/fuel me, score 1–5, weekly swap plan.`
      },
      {
        title: "Reset Routine",
        text:
`Design a 30-minute reset routine (breath, movement, planning) for {situation}.`
      }
    ]
  },
  {
    id: "d663175b-1eb2-40cf-8fbb-8b06429e69ae",
    category: "Learning & Education",
    prompts: [
      {
        title: "Study Plan Optimizer",
        text:
`You are an academic coach. Build a 4-week study plan for {subject} with retrieval practice and spaced repetition.`
      },
      {
        title: "Socratic Tutor",
        text:
`Teach {concept} via Socratic questions. 6 questions escalating difficulty + concise explanations.`
      },
      {
        title: "Lesson Plan (60 min)",
        text:
`Create a 60-minute lesson with objective, hook, modeling, guided practice, check for understanding, independent work.`
      }
    ]
  },
  {
    id: "faa62c02-19a5-4d46-8182-99449ee2b892",
    category: "Business & Admin",
    prompts: [
      {
        title: "One-Page Business Plan",
        text:
`Fill a lean canvas for {business}: problem, solution, customers, value prop, channels, revenue, cost, unfair advantage.`
      },
      {
        title: "Hiring Scorecard",
        text:
`Create a scorecard for role {role}. Competencies, outcomes in 90 days, interview prompts, and rubric.`
      },
      {
        title: "Meeting → Decision Notes",
        text:
`Turn these messy notes {paste} into decisions, owners, due dates, and next agenda.`
      }
    ]
  }
];

/** Simple fuzzy filter on title/category/text */
function filterPack(q: string) {
  const query = q.toLowerCase();
  if (!query) return FREE_PACK;
  return FREE_PACK.map(cat => ({
    ...cat,
    prompts: cat.prompts.filter(
      p =>
        p.title.toLowerCase().includes(query) ||
        p.text.toLowerCase().includes(query) ||
        cat.category.toLowerCase().includes(query)
    ),
  })).filter(c => c.prompts.length > 0);
}

export default function FreePromptPackPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
        return;
      }
      setAuthed(true);
    })();
  }, [navigate]);

  const data = filterPack(search);

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1500);
  };

  const copyCategory = async (prompts: Prompt[], key: string) => {
    const bundle = prompts.map(p => `### ${p.title}\n${p.text}`).join("\n\n");
    await copy(bundle, key);
  };

  if (!authed) return null;

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(1200px 500px at 10% -10%, rgba(255,215,0,0.08), transparent), radial-gradient(1200px 500px at 110% 10%, rgba(0,112,243,0.10), transparent), #0B1020",
      }}
    >
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 pt-8 pb-4">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <img
              src="https://d64gsuwffb70l.cloudfront.net/68fdb98a1a41ecca41313355_1761679297358_d2ec59d1.png"
              alt="PromptGoatAI"
              className="w-10 h-10 rounded"
            />
            <div>
              <h1 className="text-white text-2xl md:text-3xl font-semibold tracking-tight">
                Free Prompt Pack
              </h1>
              <p className="text-slate-300 text-sm">
                50+ pro prompts across 19 categories · Copy & paste ready
              </p>
            </div>
          </div>

         <div className="flex items-center gap-2">
  <Link to="/prompts">
    <Button
      className="bg-[#0070F3] hover:bg-[#005AD1] text-white font-semibold shadow-md transition-all"
    >
      <ArrowLeft className="w-4 h-4 mr-2 text-white" />
      Back to Dashboard
    </Button>
  </Link>
</div>


        {/* Search */}
        <div className="mt-6 relative max-w-2xl">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts or categories…"
            className="pl-9 bg-[#0F1730] border-slate-800 text-slate-100 placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 pb-16 space-y-6">
        {data.map((cat) => (
          <Card
            key={cat.id}
            className="bg-[#0F1730]/70 border-slate-800 backdrop-blur"
            style={{ boxShadow: "0 10px 30px rgba(0,0,0,0.25)" }}
          >
            <CardHeader className="flex flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Badge
                  className="text-black"
                  style={{ backgroundColor: GOLD, color: "#111" }}
                >
                  {cat.category}
                </Badge>
                <span className="text-slate-400 text-xs">
                  {cat.prompts.length} prompts
                </span>
              </div>

              <Button
                variant="secondary"
                className="bg-[#0B5BD7] hover:bg-[#0A4EC0] text-white"
                onClick={() => copyCategory(cat.prompts, `cat-${cat.id}`)}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Copy All in Category
              </Button>
            </CardHeader>

            <CardContent className="grid md:grid-cols-2 gap-4">
              {cat.prompts.map((p, idx) => {
                const key = `${cat.id}-${idx}`;
                const isCopied = copiedKey === key;
                return (
                  <div
                    key={key}
                    className="group p-4 rounded-xl border border-slate-800 bg-[#0B1020]/80 hover:bg-[#0B1020]/95 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-slate-100 font-semibold leading-snug">
                        {p.title}
                      </h3>
                      <Button
                        size="icon"
                        variant="ghost"
                        className={cn(
                          "h-8 w-8",
                          isCopied ? "text-green-400" : "text-slate-300 hover:text-white"
                        )}
                        onClick={() => copy(p.text, key)}
                        aria-label="Copy prompt"
                        title="Copy prompt"
                      >
                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <pre className="mt-2 text-[12.5px] leading-relaxed whitespace-pre-wrap text-slate-300">
{p.text}
                    </pre>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}

        {/* Footer note */}
        <div className="text-center text-slate-400 text-xs mt-10">
          © {new Date().getFullYear()} PromptGoatAI • Colors:{" "}
          <span style={{ color: GOLD }}>Gold</span> &{" "}
          <span style={{ color: ELECTRIC_BLUE }}>Electric Blue</span>
        </div>
      </div>

      <Toaster />
    </div>
  );
}
