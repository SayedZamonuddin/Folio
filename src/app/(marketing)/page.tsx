import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { FolderKanban, Briefcase, BarChart3, Palette, Zap, Shield } from "lucide-react";

export default function LandingPage() {
  return (
    <>
      {/* Hero */}
      <section className="flex flex-col items-center justify-center px-6 py-24 text-center sm:py-32">
        <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">
          Your career, one link.
        </h1>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground">
          Build a beautiful portfolio in minutes. Showcase your projects, experience, and skills.
          Share it with anyone.
        </p>
        <div className="mt-8 flex gap-4">
          <Button size="lg" asChild>
            <Link href="/signup">Create Your Portfolio — Free</Link>
          </Button>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          No credit card required. Live portfolio in under 3 minutes.
        </p>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-center text-3xl font-bold">Everything you need to stand out</h2>
          <p className="mt-3 text-center text-muted-foreground">
            Designed for how hiring managers actually review portfolios.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: FolderKanban, title: "Project Showcase", description: "Present your work with structured case studies. Problem, process, outcome — the format that gets you hired." },
              { icon: Briefcase, title: "Career Timeline", description: "Visual experience and education timeline that tells your career story at a glance." },
              { icon: Palette, title: "4 Beautiful Themes", description: "Default, Minimal, Bold, or Editorial. Each with custom accent colors and typography." },
              { icon: BarChart3, title: "Analytics Dashboard", description: "Know who's viewing your portfolio. Track referrers, devices, and top content." },
              { icon: Zap, title: "5-Minute Setup", description: "Guided onboarding gets you from signup to published portfolio in under 3 minutes." },
              { icon: Shield, title: "Your Data, Always", description: "Full JSON export anytime. No lock-in. Your portfolio is yours." },
            ].map((feature) => (
              <Card key={feature.title}>
                <CardContent className="pt-6">
                  <feature.icon className="h-8 w-8 text-primary" />
                  <h3 className="mt-4 font-semibold">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold">How it works</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[
              { step: "1", title: "Sign up", description: "Create your account with email or Google/GitHub." },
              { step: "2", title: "Build", description: "Add projects, experience, skills, and customize your theme." },
              { step: "3", title: "Share", description: "Your portfolio goes live at folio.site/yourname. Share it everywhere." },
            ].map((item) => (
              <div key={item.step}>
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold">
                  {item.step}
                </div>
                <h3 className="mt-4 font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30 py-20">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <h2 className="text-3xl font-bold">Ready to stand out?</h2>
          <p className="mt-3 text-muted-foreground">
            Join thousands of professionals who use Folio to showcase their work.
          </p>
          <Button size="lg" className="mt-8" asChild>
            <Link href="/signup">Create Your Portfolio</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
