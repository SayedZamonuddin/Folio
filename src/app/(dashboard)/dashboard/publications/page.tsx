"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { BookOpen, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Publication {
  id: string;
  title: string;
  type: string;
  publisher: string | null;
  url: string | null;
  description: string | null;
  publishedDate: string | null;
}

export default function PublicationsPage() {
  const [pubs, setPubs] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/publications")
      .then((res) => res.json())
      .then(({ data }) => setPubs(data || []))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      title: fd.get("title"),
      type: fd.get("type") || "article",
      publisher: fd.get("publisher") || null,
      url: fd.get("url") || null,
      description: fd.get("description") || null,
      publishedDate: fd.get("publishedDate") || null,
    };
    const res = await fetch("/api/publications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const { data } = await res.json();
      setPubs([...pubs, data]);
      setOpen(false);
      toast.success("Publication added!");
    }
    setSaving(false);
  }

  async function deletePub(id: string) {
    if (!confirm("Delete this publication?")) return;
    const res = await fetch(`/api/publications/${id}`, { method: "DELETE" });
    if (res.ok) {
      setPubs(pubs.filter((p) => p.id !== id));
      toast.success("Deleted");
    }
  }

  if (loading) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Publications</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add Publication
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Add Publication</DialogTitle></DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Title *</Label>
                <Input name="title" required placeholder="My Research Paper" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Type *</Label>
                  <select name="type" className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm">
                    <option value="article">Article</option>
                    <option value="paper">Paper</option>
                    <option value="book">Book</option>
                    <option value="blog">Blog Post</option>
                    <option value="talk">Talk</option>
                    <option value="podcast">Podcast</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Published Date</Label>
                  <Input name="publishedDate" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Publisher / Venue</Label>
                <Input name="publisher" placeholder="IEEE, Medium, etc." />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input name="url" type="url" placeholder="https://..." />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea name="description" rows={3} placeholder="Brief summary..." />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Adding..." : "Add Publication"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {pubs.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No publications yet"
          description="Add your articles, papers, talks, or blog posts."
          actionLabel="Add Publication"
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {pubs.map((pub) => (
            <Card key={pub.id} className="group">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">{pub.title}</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {pub.type.charAt(0).toUpperCase() + pub.type.slice(1)}
                    {pub.publisher && ` · ${pub.publisher}`}
                  </p>
                </div>
                <div className="flex gap-1">
                  {pub.url && (
                    <a href={pub.url} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                    </a>
                  )}
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => deletePub(pub.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              {(pub.description || pub.publishedDate) && (
                <CardContent>
                  {pub.publishedDate && (
                    <p className="text-xs text-muted-foreground">{new Date(pub.publishedDate).toLocaleDateString()}</p>
                  )}
                  {pub.description && <p className="mt-1 text-sm text-muted-foreground">{pub.description}</p>}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
