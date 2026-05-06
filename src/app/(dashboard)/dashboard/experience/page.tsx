"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { experienceSchema } from "@/lib/validations/experience";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { TagInput } from "@/components/dashboard/TagInput";
import { Briefcase, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { EMPLOYMENT_TYPES } from "@/lib/constants";

interface Experience {
  id: string;
  company: string;
  role: string;
  employmentType: string | null;
  location: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
  tags: string[];
}

export default function ExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: "",
      role: "",
      employmentType: "" as string,
      location: "",
      startDate: "",
      endDate: "",
      description: "",
      tags: [] as string[],
    },
  });

  useEffect(() => {
    fetch("/api/experience")
      .then((res) => res.json())
      .then(({ data }) => setExperiences(data || []))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(data: Record<string, unknown>) {
    setSaving(true);
    const res = await fetch("/api/experience", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, tags }),
    });
    if (res.ok) {
      const { data: newExp } = await res.json();
      setExperiences([...experiences, newExp]);
      setOpen(false);
      reset();
      setTags([]);
      toast.success("Experience added!");
    }
    setSaving(false);
  }

  async function deleteExperience(id: string) {
    if (!confirm("Delete this experience?")) return;
    const res = await fetch(`/api/experience/${id}`, { method: "DELETE" });
    if (res.ok) {
      setExperiences(experiences.filter((e) => e.id !== id));
      toast.success("Deleted");
    }
  }

  if (loading) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Experience</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add Experience
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
            <DialogHeader><DialogTitle>Add Experience</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Company *</Label>
                  <Input {...register("company")} />
                  {errors.company && <p className="text-sm text-destructive">{errors.company.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Role *</Label>
                  <Input {...register("role")} />
                  {errors.role && <p className="text-sm text-destructive">{errors.role.message}</p>}
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Type</Label>
                  <Select value={watch("employmentType") || ""} onValueChange={(val) => { if (val) setValue("employmentType", val as string); }}>
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      {EMPLOYMENT_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Location</Label>
                  <Input {...register("location")} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input type="date" {...register("startDate")} />
                  {errors.startDate && <p className="text-sm text-destructive">{errors.startDate.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" {...register("endDate")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={3} {...register("description")} />
              </div>
              <div className="space-y-2">
                <Label>Skills / Technologies</Label>
                <TagInput value={tags} onChange={setTags} />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Adding..." : "Add Experience"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {experiences.length === 0 ? (
        <EmptyState
          icon={Briefcase}
          title="No experience yet"
          description="Add your work history to showcase your career journey."
          actionLabel="Add Experience"
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <Card key={exp.id} className="group">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">{exp.role}</CardTitle>
                  <p className="text-sm text-muted-foreground">{exp.company}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100"
                  onClick={() => deleteExperience(exp.id)}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {new Date(exp.startDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                  {" — "}
                  {exp.endDate ? new Date(exp.endDate).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Present"}
                  {exp.employmentType && ` · ${exp.employmentType}`}
                </p>
                {exp.description && <p className="mt-2 text-sm">{exp.description}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
