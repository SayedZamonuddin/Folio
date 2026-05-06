"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { usernameSchema } from "@/lib/validations/user";
import { THEMES } from "@/lib/constants";

type Step = 1 | 2 | 3 | 4;

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [username, setUsername] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [usernameChecking, setUsernameChecking] = useState(false);

  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");

  const [theme, setTheme] = useState("default");
  const [accentColor, setAccentColor] = useState("#2563eb");

  async function checkUsername(value: string) {
    setUsername(value);
    setUsernameAvailable(null);

    if (value.length < 3) return;

    const result = usernameSchema.safeParse(value);
    if (!result.success) {
      setUsernameAvailable(false);
      return;
    }

    setUsernameChecking(true);
    try {
      const res = await fetch(`/api/users/check-username?q=${encodeURIComponent(value)}`);
      const data = await res.json();
      setUsernameAvailable(data.available);
    } catch {
      setUsernameAvailable(null);
    } finally {
      setUsernameChecking(false);
    }
  }

  async function handleComplete() {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        setError("Session expired. Please log in again.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/users/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          fullName,
          headline: headline || null,
          bio: bio || null,
          theme,
          accentColor,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error?.message || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="mb-4 flex justify-center gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 w-8 rounded-full ${s <= step ? "bg-primary" : "bg-muted"}`}
            />
          ))}
        </div>
        <CardTitle>
          {step === 1 && "Claim your URL"}
          {step === 2 && "Tell us about you"}
          {step === 3 && "Import your data"}
          {step === 4 && "Pick your look"}
        </CardTitle>
        <CardDescription>
          {step === 1 && "Choose a username for your portfolio link"}
          {step === 2 && "Add your name and a short headline"}
          {step === 3 && "Import from LinkedIn or GitHub (optional)"}
          {step === 4 && "Choose a theme and accent color"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {step === 1 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">folio.site/</span>
                <Input
                  id="username"
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => checkUsername(e.target.value.toLowerCase())}
                />
              </div>
              {usernameChecking && <p className="text-sm text-muted-foreground">Checking...</p>}
              {usernameAvailable === true && (
                <p className="text-sm text-green-600">Username is available!</p>
              )}
              {usernameAvailable === false && (
                <p className="text-sm text-destructive">Username is not available</p>
              )}
            </div>
            <Button
              className="w-full"
              disabled={!usernameAvailable}
              onClick={() => setStep(2)}
            >
              Continue
            </Button>
          </>
        )}

        {step === 2 && (
          <>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Jane Smith"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                placeholder="Full-Stack Developer & Designer"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio (optional)</Label>
              <Textarea
                id="bio"
                placeholder="Tell people a bit about yourself..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(1)}>Back</Button>
              <Button className="flex-1" disabled={!fullName} onClick={() => setStep(3)}>
                Continue
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <div className="rounded-lg border border-dashed p-6 text-center">
              <p className="text-sm text-muted-foreground">
                Import from LinkedIn or GitHub coming soon.
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                You can always add this information manually from your dashboard.
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
              <Button className="flex-1" onClick={() => setStep(4)}>
                Skip & Continue
              </Button>
            </div>
          </>
        )}

        {step === 4 && (
          <>
            <div className="space-y-3">
              <Label>Theme</Label>
              <div className="grid grid-cols-2 gap-3">
                {THEMES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    className={`rounded-lg border p-4 text-left capitalize transition-colors ${
                      theme === t ? "border-primary bg-primary/5" : "hover:border-muted-foreground/30"
                    }`}
                    onClick={() => setTheme(t)}
                  >
                    <span className="text-sm font-medium">{t}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="accentColor">Accent Color</Label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  id="accentColor"
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="h-10 w-10 cursor-pointer rounded border"
                />
                <Input
                  value={accentColor}
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="w-28"
                />
              </div>
            </div>
            {error && (
              <div className="rounded-md border border-orange-200 bg-orange-50 px-4 py-3">
                <p className="text-sm text-orange-800">{error}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep(3)}>Back</Button>
              <Button className="flex-1" disabled={loading} onClick={handleComplete}>
                {loading ? "Publishing..." : "Publish Portfolio"}
              </Button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
