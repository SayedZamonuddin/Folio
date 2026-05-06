"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { THEMES, FONT_FAMILIES } from "@/lib/constants";

export default function AppearancePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [theme, setTheme] = useState("default");
  const [accentColor, setAccentColor] = useState("#2563eb");
  const [fontFamily, setFontFamily] = useState("inter");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    async function load() {
      const res = await fetch("/api/users/profile");
      if (res.ok) {
        const { data } = await res.json();
        if (data) {
          setTheme(data.theme);
          setAccentColor(data.accentColor);
          setFontFamily(data.fontFamily);
          setDarkMode(data.darkMode);
        }
      }
      setLoading(false);
    }
    load();
  }, []);

  async function save() {
    setSaving(true);
    const res = await fetch("/api/appearance", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme, accentColor, fontFamily, darkMode }),
    });
    if (res.ok) toast.success("Appearance saved!");
    else toast.error("Failed to save");
    setSaving(false);
  }

  if (loading) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Appearance</h1>
        <p className="text-muted-foreground">Customize how your portfolio looks</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            <CardDescription>Choose a visual style for your portfolio</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((t) => (
                <button
                  key={t}
                  type="button"
                  className={`rounded-lg border p-4 text-left capitalize transition-colors ${
                    theme === t ? "border-primary bg-primary/5 ring-2 ring-primary/20" : "hover:border-muted-foreground/30"
                  }`}
                  onClick={() => setTheme(t)}
                >
                  <span className="text-sm font-medium">{t}</span>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t === "default" && "Clean and balanced"}
                    {t === "minimal" && "Typography-focused"}
                    {t === "bold" && "Statement-making"}
                    {t === "editorial" && "Magazine-style"}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customization</CardTitle>
            <CardDescription>Fine-tune your portfolio&apos;s appearance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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

            <div className="space-y-2">
              <Label>Font Family</Label>
              <Select value={fontFamily} onValueChange={(val) => { if (val) setFontFamily(val); }}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FONT_FAMILIES.map((f) => (
                    <SelectItem key={f} value={f}>
                      {f.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="darkMode"
                checked={darkMode}
                onCheckedChange={(checked) => setDarkMode(checked === true)}
              />
              <Label htmlFor="darkMode">Dark Mode</Label>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save Appearance"}
      </Button>
    </div>
  );
}
