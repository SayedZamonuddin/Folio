"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Layers, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface CustomSection {
  id: string;
  title: string;
  icon: string | null;
  layout: string;
  items: { id: string; title: string }[];
}

export default function SectionsPage() {
  const [sections, setSections] = useState<CustomSection[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/sections")
      .then((res) => res.json())
      .then(({ data }) => setSections(data || []))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      title: fd.get("title"),
      layout: fd.get("layout") || "list",
    };
    const res = await fetch("/api/sections", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const { data } = await res.json();
      setSections([...sections, { ...data, items: [] }]);
      setOpen(false);
      toast.success("Section created!");
    }
    setSaving(false);
  }

  async function deleteSection(id: string) {
    if (!confirm("Delete this section and all its items?")) return;
    const res = await fetch(`/api/sections/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSections(sections.filter((s) => s.id !== id));
      toast.success("Deleted");
    }
  }

  if (loading) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Custom Sections</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add Section
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Create Custom Section</DialogTitle></DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Section Title *</Label>
                <Input name="title" required placeholder="Awards, Volunteering, Hobbies..." />
              </div>
              <div className="space-y-2">
                <Label>Layout</Label>
                <select name="layout" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                  <option value="list">List</option>
                  <option value="grid">Grid</option>
                  <option value="timeline">Timeline</option>
                </select>
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Creating..." : "Create Section"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {sections.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No custom sections yet"
          description="Create sections for awards, volunteering, languages, hobbies, or anything else."
          actionLabel="Create Section"
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <Card key={section.id} className="group">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">{section.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {section.layout} layout · {section.items.length} item{section.items.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => deleteSection(section.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              {section.items.length > 0 && (
                <CardContent>
                  <ul className="space-y-1">
                    {section.items.map((item) => (
                      <li key={item.id} className="text-sm text-muted-foreground">• {item.title}</li>
                    ))}
                  </ul>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
