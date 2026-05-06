"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { MessageSquareQuote, Plus, Trash2, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  authorName: string;
  authorRole: string | null;
  content: string;
  relationship: string | null;
  requestStatus: string;
  isVisible: boolean;
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [content, setContent] = useState("");
  const [relationship, setRelationship] = useState("");

  useEffect(() => {
    fetch("/api/testimonials")
      .then((res) => res.json())
      .then(({ data }) => setTestimonials(data || []))
      .finally(() => setLoading(false));
  }, []);

  async function addTestimonial() {
    if (!authorName || !content) return;
    setSaving(true);
    const res = await fetch("/api/testimonials", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ authorName, authorRole, content, relationship }),
    });
    if (res.ok) {
      const { data } = await res.json();
      setTestimonials([...testimonials, data]);
      setOpen(false);
      setAuthorName("");
      setAuthorRole("");
      setContent("");
      setRelationship("");
      toast.success("Testimonial added!");
    }
    setSaving(false);
  }

  async function deleteTestimonial(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    const res = await fetch(`/api/testimonials/${id}`, { method: "DELETE" });
    if (res.ok) {
      setTestimonials(testimonials.filter((t) => t.id !== id));
      toast.success("Deleted");
    }
  }

  async function approveTestimonial(id: string) {
    const res = await fetch(`/api/testimonials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestStatus: "approved", isVisible: true }),
    });
    if (res.ok) {
      setTestimonials(testimonials.map((t) => t.id === id ? { ...t, requestStatus: "approved", isVisible: true } : t));
      toast.success("Approved!");
    }
  }

  if (loading) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Testimonials</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add Testimonial
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Add Testimonial</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Author Name *</Label>
                  <Input value={authorName} onChange={(e) => setAuthorName(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Author Role</Label>
                  <Input placeholder="CTO at Company" value={authorRole} onChange={(e) => setAuthorRole(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Relationship</Label>
                <Input placeholder="Manager, Colleague, Client..." value={relationship} onChange={(e) => setRelationship(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Testimonial *</Label>
                <Textarea rows={4} placeholder="What they said about you..." value={content} onChange={(e) => setContent(e.target.value)} />
              </div>
              <Button className="w-full" onClick={addTestimonial} disabled={saving || !authorName || !content}>
                {saving ? "Adding..." : "Add Testimonial"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {testimonials.length === 0 ? (
        <EmptyState
          icon={MessageSquareQuote}
          title="No testimonials yet"
          description="Add recommendations from colleagues, clients, or managers to build social proof."
          actionLabel="Add Testimonial"
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {testimonials.map((t) => (
            <Card key={t.id} className="group">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">{t.authorName}</CardTitle>
                  {t.authorRole && <p className="text-sm text-muted-foreground">{t.authorRole}</p>}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100">
                  {t.requestStatus === "pending" && (
                    <Button variant="ghost" size="icon" onClick={() => approveTestimonial(t.id)}>
                      <Check className="h-4 w-4 text-green-500" />
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => deleteTestimonial(t.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm italic">&ldquo;{t.content}&rdquo;</p>
                <div className="mt-2 flex gap-2">
                  {t.relationship && <Badge variant="secondary">{t.relationship}</Badge>}
                  {t.requestStatus === "pending" && <Badge variant="outline">Pending</Badge>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
