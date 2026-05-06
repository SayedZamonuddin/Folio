export default function OnboardingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 px-4 py-10">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold">Folio</h1>
        <p className="mt-1 text-muted-foreground">Set up your portfolio</p>
      </div>
      <div className="w-full max-w-lg">{children}</div>
    </div>
  );
}
