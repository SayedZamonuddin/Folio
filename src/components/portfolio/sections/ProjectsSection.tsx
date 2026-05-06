import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";

interface Project {
  id: string;
  title: string;
  summary: string | null;
  role: string | null;
  category: string | null;
  tags: string[];
  liveUrl: string | null;
  thumbnailUrl: string | null;
  featured: boolean;
  techStack: { id: string; name: string }[];
}

interface ProjectsSectionProps {
  projects: Project[];
  username: string;
}

export function ProjectsSection({ projects, username }: ProjectsSectionProps) {
  return (
    <section id="projects">
      <h2 className="text-2xl font-bold">Projects</h2>
      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <Card key={project.id} className="group transition-shadow hover:shadow-lg">
            <Link href={`/${username}/projects/${project.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    {project.role && (
                      <p className="text-sm text-muted-foreground">{project.role}</p>
                    )}
                  </div>
                  {project.liveUrl && (
                    <ExternalLink className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {project.summary && (
                  <p className="mb-3 text-sm text-muted-foreground line-clamp-2">{project.summary}</p>
                )}
                <div className="flex flex-wrap gap-1">
                  {project.tags.slice(0, 4).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                  ))}
                </div>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>
    </section>
  );
}
