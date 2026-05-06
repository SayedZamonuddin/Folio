import { Card, CardContent } from "@/components/ui/card";

interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string | null;
  content: string;
  relationship: string | null;
}

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section id="testimonials">
      <h2 className="text-2xl font-bold">Testimonials</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {testimonials.map((t) => (
          <Card key={t.id}>
            <CardContent className="pt-6">
              <blockquote className="text-sm italic text-muted-foreground">
                &ldquo;{t.content}&rdquo;
              </blockquote>
              <div className="mt-4">
                <p className="text-sm font-medium">{t.authorName}</p>
                {t.authorRole && (
                  <p className="text-xs text-muted-foreground">{t.authorRole}</p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
