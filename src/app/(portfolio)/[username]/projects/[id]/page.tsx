import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ExternalLink, Code2 } from "lucide-react";
import Link from "next/link";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ username: string; id: string }>;
}) {
  const { username, id } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, isPublic: true },
  });

  if (!user || !user.isPublic) notFound();

  const project = await prisma.project.findFirst({
    where: { id, userId: user.id, status: "published" },
    include: { techStack: true, media: true },
  });

  if (!project) notFound();

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-3xl px-6 py-12">
        <Link
          href={`/${username}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to portfolio
        </Link>

        <h1 className="text-3xl font-bold">{project.title}</h1>

        {project.role && (
          <p className="mt-2 text-lg text-muted-foreground">{project.role}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {project.category && <Badge variant="secondary">{project.category}</Badge>}
          {project.teamSize && <span className="text-sm text-muted-foreground">Team: {project.teamSize}</span>}
          {project.duration && <span className="text-sm text-muted-foreground">{project.duration}</span>}
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="outline">{tag}</Badge>
          ))}
        </div>

        <div className="mt-6 flex gap-3">
          {project.liveUrl && (
            <Button size="sm" asChild>
              <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" /> Live Demo
              </a>
            </Button>
          )}
          {project.sourceUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                <Code2 className="mr-2 h-4 w-4" /> Source Code
              </a>
            </Button>
          )}
        </div>

        {project.summary && (
          <p className="mt-8 text-lg text-muted-foreground">{project.summary}</p>
        )}

        {project.problemStatement && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold">The Challenge</h2>
            <p className="mt-3 text-muted-foreground whitespace-pre-wrap">{project.problemStatement}</p>
          </div>
        )}

        {project.process && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold">The Process</h2>
            <p className="mt-3 text-muted-foreground whitespace-pre-wrap">{project.process}</p>
          </div>
        )}

        {project.outcome && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold">The Outcome</h2>
            <p className="mt-3 text-muted-foreground whitespace-pre-wrap">{project.outcome}</p>
          </div>
        )}

        {project.content && !project.problemStatement && !project.process && (
          <div className="mt-10">
            <div className="prose prose-neutral max-w-none">
              <p className="whitespace-pre-wrap">{project.content}</p>
            </div>
          </div>
        )}

        {project.techStack.length > 0 && (
          <div className="mt-10">
            <h2 className="text-xl font-semibold">Tech Stack</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <Badge key={tech.id} variant="secondary">{tech.name}</Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
