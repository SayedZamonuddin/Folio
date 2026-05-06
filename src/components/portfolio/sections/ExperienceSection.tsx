interface Experience {
  id: string;
  company: string;
  role: string;
  employmentType: string | null;
  location: string | null;
  startDate: Date | string;
  endDate: Date | string | null;
  description: string | null;
  tags: string[];
}

interface ExperienceSectionProps {
  experiences: Experience[];
}

export function ExperienceSection({ experiences }: ExperienceSectionProps) {
  return (
    <section id="experience">
      <h2 className="text-2xl font-bold">Experience</h2>
      <div className="mt-6 space-y-8">
        {experiences.map((exp) => (
          <div key={exp.id} className="relative pl-6 border-l-2 border-muted">
            <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-primary" />
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h3 className="font-semibold">{exp.role}</h3>
                <p className="text-sm text-muted-foreground">{exp.company}</p>
              </div>
              <p className="text-xs text-muted-foreground sm:text-right">
                {new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                {" — "}
                {exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present"}
              </p>
            </div>
            {exp.description && (
              <p className="mt-2 text-sm text-muted-foreground whitespace-pre-wrap">{exp.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
