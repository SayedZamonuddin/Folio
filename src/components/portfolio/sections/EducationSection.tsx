interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  startDate: Date | string;
  endDate: Date | string | null;
  description: string | null;
}

interface EducationSectionProps {
  education: Education[];
}

export function EducationSection({ education }: EducationSectionProps) {
  return (
    <section id="education">
      <h2 className="text-2xl font-bold">Education</h2>
      <div className="mt-6 space-y-6">
        {education.map((edu) => (
          <div key={edu.id} className="relative pl-6 border-l-2 border-muted">
            <div className="absolute -left-[5px] top-1 h-2 w-2 rounded-full bg-primary" />
            <h3 className="font-semibold">
              {edu.degree}{edu.field && ` in ${edu.field}`}
            </h3>
            <p className="text-sm text-muted-foreground">{edu.institution}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(edu.startDate).getFullYear()} — {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
            </p>
            {edu.description && (
              <p className="mt-2 text-sm text-muted-foreground">{edu.description}</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
