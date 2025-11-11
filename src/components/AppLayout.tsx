import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
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
  ClipboardCheck
} from 'lucide-react';
import { Navbar } from '@/components/navbar';
import { FreePromptLibrary } from '@/components/free-prompt-library';

export default function AppLayout() {
  const navigate = useNavigate();
  const [modalContent, setModalContent] = useState<{
    title: string;
    content: string;
  } | null>(null);

  // Simple high-level categories for cleaner UI
  const simpleCategories = [
    'Clinical & Human Services',
    'Business & Admin',
    'AI Productivity & Writing',
    'Self-Reflection & Wellness',
    'Marketing & Growth',
    'Sales & Client Outreach',
    'Design & Creative',
    'Compliance & Operations'
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
      desc: 'Your data is protected with modern best practices.'
    },
    {
      icon: Check,
      title: 'Always Updated',
      desc: 'New prompts added weekly for Pro, quarterly for Free.'
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
            {/* Left: Text */}
            <div className="text-left space-y-8">
              <Badge className="w-fit" variant="secondary">
                <Sparkles className="w-3 h-3 mr-1" />
                AI-Powered Prompt Library
              </Badge>

              <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                Prompts that work. Ideas that spark.
              </h1>

              <p className="text-xl text-muted-foreground max-w-lg">
                Curated prompts for clinical, business, creative, and everyday workflows.
                Start free, unlock Pro when you’re ready.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  size="lg"
                  className="text-lg group"
                  onClick={() => navigate('/signup')}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Start Free → Upgrade Anytime
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

            {/* Right: Hero Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 blur-3xl" />
              <img
                src="/prompt_goat_photo.png"
                alt="The G.O.A.T — Employee of the Month"
                className="relative rounded-2xl shadow-2xl w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories - simplified 4-column check list */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Built for real-world workflows
          </h2>
          <p className="text-muted-foreground text-lg">
            PromptGoatAI covers the core categories professionals actually use.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
          {simpleCategories.map((cat) => (
            <div
              key={cat}
              className="flex items-center gap-2 text-sm md:text-base text-muted-foreground"
            >
              <Check className="w-4 h-4 text-primary" />
              <span>{cat}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Free Prompt Library */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Free Prompt Library</h2>
          <p className="text-muted-foreground text-lg">
            Browse, search, and copy free prompts instantly — no login required.
          </p>
        </div>
        <FreePromptLibrary />
      </section>

      {/* Features */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why PromptGoatAI?</h2>
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

      {/* Comparison Grid: Free vs Pro */}
      <section id="comparison" className="container mx-auto px-4 py-20">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            Choose your PromptGoatAI plan
          </h2>
          <p className="text-muted-foreground text-lg">
            Start free. Upgrade when you’re ready for more power.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free */}
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect for trying PromptGoatAI.</CardDescription>
              <div className="text-3xl font-bold mt-2">
                $0<span className="text-lg font-normal">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Access to free prompts
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Browse, search & copy
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Quarterly library updates
                </li>
              </ul>
              <Button
                className="w-full mt-6"
                variant="outline"
                onClick={() => navigate('/signup')}
              >
                Get Started Free
              </Button>
            </CardContent>
          </Card>

          {/* Pro */}
          <Card className="border-primary shadow-lg">
            <CardHeader>
              <Badge className="w-fit mb-2">Most Popular</Badge>
              <CardTitle>Pro</CardTitle>
              <CardDescription>
                For creators, teams, and operators who want everything.
              </CardDescription>
              <div className="text-3xl font-bold mt-2">
                $15<span className="text-lg font-normal">/month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Everything in Free
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Access to all Pro prompts
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Prompt Custom AI Chat
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Request custom prompts & prompt packs
                </li>
                <li className="flex items-center">
                  <Check className="w-4 h-4 mr-2 text-green-500" />
                  Weekly Pro library updates
                </li>
              </ul>
              <Button
                className="w-full mt-6"
                onClick={() => navigate('/signup')}
              >
                Upgrade to Pro
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-r from-primary to-purple-600 text-primary-foreground">
          <CardHeader className="text-center space-y-4 py-12">
            <CardTitle className="text-4xl font-bold">
              Ready to get started?
            </CardTitle>
            <CardDescription className="text-primary-foreground/90 text-lg max-w-2xl mx-auto">
              Join professionals using PromptGoatAI to create better outputs in less time.
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
                        'PromptGoatAI helps you get quality results from AI faster. We curate and structure prompts for real-world workflows so you can skip the trial-and-error and get to outcomes.'
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
                        'We collect only the information needed to create your account, manage subscriptions, and improve the service. Payment info is handled by Stripe. You can request deletion of your data anytime.'
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
                        'PromptGoatAI offers a Free tier and a Pro subscription at $15/month. Subscriptions renew automatically until canceled. Pro features require an active subscription.'
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
