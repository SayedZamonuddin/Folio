import { Badge } from "@/components/ui/badge";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number | null;
}

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <section id="skills">
      <h2 className="text-2xl font-bold">Skills</h2>
      <div className="mt-6 space-y-4">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="text-sm font-medium text-muted-foreground mb-2">{category}</h3>
            <div className="flex flex-wrap gap-2">
              {skills
                .filter((s) => s.category === category)
                .map((skill) => (
                  <Badge key={skill.id} variant="secondary">
                    {skill.name}
                  </Badge>
                ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
