import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";

export const metadata = { title: "Pricing" };

export default function PricingPage() {
  return (
    <div className="py-20">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h1 className="text-4xl font-bold">Simple, transparent pricing</h1>
        <p className="mt-3 text-lg text-muted-foreground">
          Start free. Upgrade when you need more.
        </p>

        <div className="mt-12 grid gap-8 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Free</CardTitle>
              <CardDescription>Perfect for getting started</CardDescription>
              <p className="text-3xl font-bold">$0<span className="text-sm font-normal text-muted-foreground">/forever</span></p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {[
                  "Unlimited projects",
                  "All 4 themes",
                  "Custom accent colors",
                  "Analytics dashboard",
                  "SEO optimized",
                  "JSON data export",
                  "Testimonial requests",
                  "folio.site/username URL",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full" asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>For professionals who want more</CardDescription>
              <p className="text-3xl font-bold">$8<span className="text-sm font-normal text-muted-foreground">/month</span></p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                {[
                  "Everything in Free",
                  "Custom domain (yourdomain.com)",
                  "Remove Folio branding",
                  "Password-protected pages",
                  "Priority support",
                  "Advanced analytics",
                  "PDF resume export",
                  "AI content suggestions",
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" /> {feature}
                  </li>
                ))}
              </ul>
              <Button className="mt-6 w-full" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
