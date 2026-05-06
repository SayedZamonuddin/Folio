"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Wrench, Plus, X } from "lucide-react";
import { toast } from "sonner";

interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number | null;
}

export default function SkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [newSkill, setNewSkill] = useState("");
  const [newCategory, setNewCategory] = useState("Languages");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch("/api/skills")
      .then((res) => res.json())
      .then(({ data }) => setSkills(data || []))
      .finally(() => setLoading(false));
  }, []);

  async function addSkill() {
    if (!newSkill.trim()) return;
    setAdding(true);
    const res = await fetch("/api/skills", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newSkill.trim(), category: newCategory }),
    });
    if (res.ok) {
      const { data } = await res.json();
      setSkills([...skills, data]);
      setNewSkill("");
      toast.success("Skill added!");
    } else {
      toast.error("Failed to add skill (might already exist)");
    }
    setAdding(false);
  }

  async function deleteSkill(id: string) {
    const res = await fetch(`/api/skills/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSkills(skills.filter((s) => s.id !== id));
    }
  }

  const categories = Array.from(new Set(skills.map((s) => s.category)));
  const defaultCategories = ["Languages", "Frameworks", "Tools", "Design", "Soft Skills"];
  const allCategories = Array.from(new Set([...defaultCategories, ...categories]));

  if (loading) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Skills</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Add Skill</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <div className="flex-1">
              <Input
                placeholder="e.g., TypeScript, Figma, React..."
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
              />
            </div>
            <div className="w-40">
              <select
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                {allCategories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <Button onClick={addSkill} disabled={adding || !newSkill.trim()}>
              <Plus className="mr-1 h-4 w-4" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {skills.length === 0 ? (
        <EmptyState
          icon={Wrench}
          title="No skills yet"
          description="Add your technical and professional skills to showcase your expertise."
        />
      ) : (
        <div className="space-y-6">
          {allCategories.filter((c) => skills.some((s) => s.category === c)).map((category) => (
            <div key={category}>
              <Label className="mb-3 block text-sm font-semibold">{category}</Label>
              <div className="flex flex-wrap gap-2">
                {skills.filter((s) => s.category === category).map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="gap-1 py-1.5 pl-3 pr-1.5">
                    {skill.name}
                    <button onClick={() => deleteSkill(skill.id)} className="ml-1 hover:text-destructive">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
