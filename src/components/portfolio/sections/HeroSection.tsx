import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Mail, Calendar, Globe, ExternalLink } from "lucide-react";


interface HeroSectionProps {
  user: {
    fullName: string;
    headline: string | null;
    avatarUrl: string | null;
    location: string | null;
    availabilityStatus: string;
    emailPublic: string | null;
    calendarUrl: string | null;
    websiteUrl: string | null;
    githubUrl: string | null;
    linkedinUrl: string | null;
    twitterUrl: string | null;
    resumeUrl: string | null;
    showResume: boolean;
  };
}

export function HeroSection({ user }: HeroSectionProps) {
  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const socialLinks = [
    { url: user.websiteUrl, icon: Globe, label: "Website" },
    { url: user.githubUrl, icon: ExternalLink, label: "GitHub" },
    { url: user.linkedinUrl, icon: ExternalLink, label: "LinkedIn" },
    { url: user.twitterUrl, icon: ExternalLink, label: "Twitter" },
  ].filter((l) => l.url);

  return (
    <section className="border-b bg-card py-16">
      <div className="mx-auto max-w-4xl px-6">
        <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:text-left sm:gap-8">
          <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
            <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullName} />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>

          <div className="mt-4 sm:mt-0">
            <h1 className="text-3xl font-bold sm:text-4xl">{user.fullName}</h1>
            {user.headline && (
              <p className="mt-2 text-lg text-muted-foreground">{user.headline}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 sm:justify-start">
              {user.availabilityStatus === "open_to_work" && (
                <Badge className="bg-green-100 text-green-800">Open to Work</Badge>
              )}
              {user.availabilityStatus === "freelancing" && (
                <Badge className="bg-blue-100 text-blue-800">Freelancing</Badge>
              )}
              {user.location && (
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-3 w-3" /> {user.location}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {socialLinks.map((link) => (
                <Button key={link.label} variant="outline" size="icon" asChild>
                  <a href={link.url!} target="_blank" rel="noopener noreferrer" aria-label={link.label}>
                    <link.icon className="h-4 w-4" />
                  </a>
                </Button>
              ))}
              {user.emailPublic && (
                <Button variant="outline" size="icon" asChild>
                  <a href={`mailto:${user.emailPublic}`} aria-label="Email">
                    <Mail className="h-4 w-4" />
                  </a>
                </Button>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              {user.calendarUrl && (
                <Button size="sm" asChild>
                  <a href={user.calendarUrl} target="_blank" rel="noopener noreferrer">
                    <Calendar className="mr-2 h-4 w-4" /> Book a Call
                  </a>
                </Button>
              )}
              {user.showResume && user.resumeUrl && (
                <Button variant="outline" size="sm" asChild>
                  <a href={user.resumeUrl} target="_blank" rel="noopener noreferrer">
                    Download Resume
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
