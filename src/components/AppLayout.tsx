import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Sparkles,
  Zap,
  Lock,
  Check,
  ArrowRight,
  Shield,
  Stethoscope,
  Briefcase,
  Heart,
  PenTool,
  ClipboardCheck,
  Headphones,
  LineChart,
  AlertTriangle,
  Megaphone,
  Boxes,
  Handshake,
  Clapperboard,
  Scale,
  FileText,
  AppWindow,
  Code,
  GraduationCap
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { FreePromptLibrary } from '@/components/free-prompt-library';

export default function AppLayout() {
  const navigate = useNavigate();
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: string;
  } | null>(null);

  const categories = [
    {
      name: 'Clinical & Human Services',
      icon: Stethoscope,
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Compliance & Operations',
      icon: ClipboardCheck,
      color: 'from-slate-500 to-slate-600'
    },
    {
      name: 'Personal Productivity & Life Skills',
      icon: Sparkles,
      color: 'from-amber-400 to-amber-500'
    },
    {
      name: 'Customer Support & Success',
      icon: Headphones,
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      name: 'Finance & Operations',
      icon: LineChart,
      color: 'from-emerald-400 to-emerald-500'
    },
    {
      name: 'Design & Visual Creativity',
      icon: PenTool,
      color: 'from-pink-500 to-rose-500'
    },
    {
      name: 'Difficult Conversations',
      icon: AlertTriangle,
      color: 'from-red-500 to-orange-500'
    },
    {
      name: 'Marketing & Growth Strategy',
      icon: Megaphone,
      color: 'from-purple-500 to-indigo-500'
    },
    {
      name: 'Product & Feature Development',
      icon: Boxes,
      color: 'from-cyan-500 to-blue-500'
    },
    {
      name: 'Sales & Business Development',
      icon: Handshake,
      color: 'from-orange-400 to-amber-500'
    },
    {
      name: 'AI Video & Image Production',
      icon: Clapperboard,
      color: 'from-fuchsia-500 to-purple-500'
    },
    {
      name: 'Legal & Compliance',
      icon: Scale,
      color: 'from-zinc-600 to-zinc-800'
    },
    {
      name: 'Content Creation & Blogging',
      icon: FileText,
      color: 'from-sky-400 to-sky-500'
    },
    {
      name: 'No Code App Builders',
      icon: AppWindow,
      color: 'from-teal-400 to-teal-500'
    },
    {
      name: 'Coding',
      icon: Code,
      color: 'from-slate-700 to-slate-900'
    },
    {
      name: 'AI Productivity & Writing',
      icon: PenTool,
      color: 'from-indigo-400 to-indigo-500'
    },
    {
      name: 'Self-Reflection & Wellness',
      icon: Heart,
      color: 'from-rose-400 to-rose-500'
    },
    {
      name: 'Learning & Education',
      icon: GraduationCap,
      color: 'from-blue-400 to-blue-500'
    },
    {
      name: 'Business & Admin',
      icon: Briefcase,
      color: 'from-yellow-500 to-yellow-600'
    }
  ];

  const features = [
    {
      icon: Zap,
      title: 'Instant Access',
      desc: 'Copy prompts with one click. No complex setup required.'
    },
    {
      icon: Sparkles,
      title: 'Expert Crafted',
      desc: 'Prompts designed by professionals across multiple industries.'
    },
    {
      icon: Lock,
      title: 'Premium Content',
      desc: 'Access advanced prompts with Pro membership.'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      desc: 'Your data is protected with enterprise-grade security.'
    },
    {
      icon: Check,
      title: 'Always Updated',
      desc: 'New prompts added weekly by our expert team.'
    }
  ];

  const openModal = (title: string, content: string) =>
    setModalContent({
      title,
      content
    });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-purple-500/10 to-pink-500/10" />
        <div className="container mx-auto px-4 py-24 md:py-32 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="text-left space-y-8">
              <Badge className="w-fit" variant="secondary">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Prompt Library
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                “Prompts that work. Ideas that spark.”
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg">
                Curated prompts for clinical, business, creative, and everyday workflows. Start free, upgrade anytime.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="text-lg group"
                  onClick={() => navigate('/signup')}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  “Try Free → Upgrade for Weekly Drops.”
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg"
                  onClick={() => navigate('/signup')}
                >
                  Explore the Library
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl" />
              <img
                src="/prompt-goat-photo.png"
                alt="The G.O.A.T — Employee of the Month"
                className="relative rounded-2xl shadow-2xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Explore Categories</h2>
          <p className="text-muted-foreground text-lg">
            Every workflow, covered in one clean library.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Card
              key={cat.name}
              className="hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1"
              onClick={() => navigate('/signup')}
              onMouseEnter={() => setHoveredCategory(cat.name)}
              onMouseLeave={() => setHoveredCategory(null)}
            >
              <CardHeader className="text-center p-4">
                <div
                  className={`mb-3 transition-transform flex justify-center ${
                    hoveredCategory === cat.name ? 'scale-110' : ''
                  }`}
                >
                  <div
                    className={`w-12 h-12 md:w-14 md:h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}
                  >
                    <cat.icon className="w-6 h-6 md:w-7 md:h-7 text-white" />
                  </div>
                </div>
                <CardTitle className="text-[10px] sm:text-xs md:text-sm leading-tight">
                  {cat.name}
                </CardTitle>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Free Prompt Library */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Free Prompt Library</h2>
          <p className="text-muted-foreground text-lg">
            Browse, search, and copy prompts instantly—no login required.
          </p>
        </div>
        <FreePromptLibrary />
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why PromptGoatAI?</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-primary mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">
                  {feature.desc}
                </CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing CTA */}
      <section className="bg-muted/30 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-2">Choose Your Plan</h3>
              <p className="text-muted-foreground">
                Free: Browse core prompts • Pro: Unlock premium drops • $15/mo • Cancel anytime
              </p>
            </div>
            <Button size="lg" onClick={() => navigate('/signup')}>
              Upgrade to Pro
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
          <CardHeader className="text-center space-y-4 py-12">
            <CardTitle className="text-4xl font-bold">
              Ready to Get Started?
            </CardTitle>
            <CardDescription className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
              Join professionals using PromptGoatAI to enhance their AI workflows.
            </CardDescription>

            <div className="pt-4">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg"
                onClick={() => navigate('/signup')}
              >
                Start Free Today
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t mt-20 bg-muted/50">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img
                  src="https://d64gsuwffb70l.cloudfront.net/68fdb98a1a41ecca41313355_1761679297358_d2ec59d1.png"
                  alt="PromptGoatAI Logo"
                  className="w-8 h-8"
                />
                <span className="font-bold text-xl">PromptGoatAI</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Your AI prompt library for enhanced productivity.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() => navigate('/signup')}
                    className="hover:text-foreground transition-colors"
                  >
                    Browse Prompts
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => navigate('/signup')}
                    className="hover:text-foreground transition-colors"
                  >
                    Pricing
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() =>
                      openModal(
                        'About PromptGoatAI',
                        'PromptGoatAI helps you get quality results from AI faster. We curate and structure prompts for real-world workflows—clinical documentation, business ops, writing, creative work, and personal productivity—so you can skip the trial-and-error and get to outcomes.'
                      )
                    }
                    className="hover:text-foreground transition-colors"
                  >
                    About
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      openModal(
                        'Contact',
                        'Questions or support: promptgoatai@gmail.com\n\nWe aim to respond within 1–2 business days.'
                      )
                    }
                    className="hover:text-foreground transition-colors"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-3">Legal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <button
                    onClick={() =>
                      openModal(
                        'Privacy Policy — PromptGoatAI',
                        'We collect only the information needed to create your account, manage subscriptions, and improve the service. We do not sell personal data. Payment information is handled by Stripe and never stored on PromptGoatAI servers. You can request deletion of your account and associated data at any time by emailing promptgoatai@gmail.com.'
                      )
                    }
                    className="hover:text-foreground transition-colors"
                  >
                    Privacy
                  </button>
                </li>
                <li>
                  <button
                    onClick={() =>
                      openModal(
                        'Terms of Use — PromptGoatAI',
                        'PromptGoatAI offers a Free tier and a Pro subscription at $15/month. Subscriptions renew automatically each month until canceled. You can cancel anytime, and access remains through the end of the current billing period. Refunds are not provided for partial periods. Premium prompts and certain features require an active Pro subscription. Payments are processed by Stripe and subject to Stripe terms. By using PromptGoatAI, you agree to these terms.'
                      )
                    }
                    className="hover:text-foreground transition-colors"
                  >
                    Terms
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t pt-8 text-center text-sm text-muted-foreground">
            © 2025 PromptGoatAI. All rights reserved.
          </div>
        </div>
      </footer>

      {/* Modal */}
      <Dialog open={!!modalContent} onOpenChange={() => setModalContent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{modalContent?.title}</DialogTitle>
          </DialogHeader>
          <div className="whitespace-pre-wrap text-sm text-muted-foreground">
            {modalContent?.content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
