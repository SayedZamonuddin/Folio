interface AboutSectionProps {
  bio: string;
}

export function AboutSection({ bio }: AboutSectionProps) {
  return (
    <section id="about">
      <h2 className="text-2xl font-bold">About</h2>
      <div className="mt-4 prose prose-neutral max-w-none">
        <p className="text-muted-foreground whitespace-pre-wrap">{bio}</p>
      </div>
    </section>
  );
}
