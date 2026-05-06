import { Card, CardContent } from "@/components/ui/card";
import {
  FolderKanban,
  Briefcase,
  GraduationCap,
  Wrench,
  MessageSquareQuote,
  Palette,
  BarChart3,
  Download,
  Shield,
  Zap,
  Search,
  Layers,
} from "lucide-react";

export const metadata = { title: "Features" };

export default function FeaturesPage() {
  const features = [
    { icon: FolderKanban, title: "Project Showcase", description: "Rich case studies with Problem > Process > Outcome structure. Show how you think, not just what you built." },
    { icon: Briefcase, title: "Experience Timeline", description: "Visual career timeline with company logos, roles, descriptions, and tech tags." },
    { icon: GraduationCap, title: "Education", description: "Degrees, bootcamps, certifications — all in a clean, scannable format." },
    { icon: Wrench, title: "Skills & Technologies", description: "Categorized skill badges with optional proficiency levels. Grouped by Languages, Frameworks, Tools." },
    { icon: MessageSquareQuote, title: "Testimonials", description: "Request recommendations via email. Recipients submit through a branded form. You approve before publishing." },
    { icon: Palette, title: "4 Themes", description: "Default (clean), Minimal (typography-focused), Bold (dramatic), Editorial (magazine-style). Plus custom colors and fonts." },
    { icon: BarChart3, title: "Analytics", description: "Track views, referrers, devices, and top content. Know when someone from LinkedIn checks your portfolio." },
    { icon: Download, title: "Data Export", description: "Full JSON export of all your data at any time. Your portfolio is yours — zero lock-in." },
    { icon: Shield, title: "Privacy Controls", description: "Password-protect your portfolio, toggle sections on/off, or go fully private when needed." },
    { icon: Zap, title: "Lightning Fast", description: "Static generation + edge caching. Your portfolio loads in under 1 second worldwide." },
    { icon: Search, title: "SEO Optimized", description: "Dynamic meta tags, Open Graph images, JSON-LD structured data, and auto-generated sitemaps." },
    { icon: Layers, title: "Custom Sections", description: "Awards, volunteering, languages, hobbies — create any section with flexible layouts." },
  ];

  return (
    <div className="py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h1 className="text-center text-4xl font-bold">Features</h1>
        <p className="mt-3 text-center text-lg text-muted-foreground">
          Everything you need to build a portfolio that gets you hired.
        </p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
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
    </div>
  );
}
