import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { HeroSection } from "@/components/portfolio/sections/HeroSection";
import { AboutSection } from "@/components/portfolio/sections/AboutSection";
import { ProjectsSection } from "@/components/portfolio/sections/ProjectsSection";
import { ExperienceSection } from "@/components/portfolio/sections/ExperienceSection";
import { EducationSection } from "@/components/portfolio/sections/EducationSection";
import { SkillsSection } from "@/components/portfolio/sections/SkillsSection";
import { TestimonialsSection } from "@/components/portfolio/sections/TestimonialsSection";

export const revalidate = 60;

export default async function PortfolioPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      projects: { where: { status: "published" }, orderBy: { sortOrder: "asc" }, include: { techStack: true } },
      experiences: { orderBy: { startDate: "desc" } },
      education: { orderBy: { startDate: "desc" } },
      skills: { orderBy: [{ category: "asc" }, { sortOrder: "asc" }] },
      testimonials: { where: { isVisible: true, requestStatus: "received" }, orderBy: { sortOrder: "asc" } },
    },
  });

  if (!user) notFound();

  const sectionMap: Record<string, React.ReactNode> = {
    about: user.bio ? <AboutSection key="about" bio={user.bio} /> : null,
    projects: user.projects.length > 0 ? <ProjectsSection key="projects" projects={user.projects} username={username} /> : null,
    experience: user.experiences.length > 0 ? <ExperienceSection key="experience" experiences={user.experiences} /> : null,
    education: user.education.length > 0 ? <EducationSection key="education" education={user.education} /> : null,
    skills: user.skills.length > 0 ? <SkillsSection key="skills" skills={user.skills} /> : null,
    testimonials: user.testimonials.length > 0 ? <TestimonialsSection key="testimonials" testimonials={user.testimonials} /> : null,
  };

  return (
    <div className="min-h-screen" style={{ "--accent": user.accentColor } as React.CSSProperties}>
      <HeroSection user={user} />
      <main className="mx-auto max-w-4xl px-6 py-12 space-y-16">
        {user.sectionOrder.map((section) => sectionMap[section]).filter(Boolean)}
      </main>
      <footer className="border-t py-8 text-center text-sm text-muted-foreground">
        <p>Built with Folio</p>
      </footer>
    </div>
  );
}
