"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { educationSchema } from "@/lib/validations/education";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { GraduationCap, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string | null;
  startDate: string;
  endDate: string | null;
  description: string | null;
}

export default function EducationPage() {
  const [education, setEducation] = useState<Education[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      description: "",
      activities: [] as string[],
    },
  });

  useEffect(() => {
    fetch("/api/education")
      .then((res) => res.json())
      .then(({ data }) => setEducation(data || []))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(data: Record<string, unknown>) {
    setSaving(true);
    const res = await fetch("/api/education", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      const { data: newEdu } = await res.json();
      setEducation([...education, newEdu]);
      setOpen(false);
      reset();
      toast.success("Education added!");
    }
    setSaving(false);
  }

  async function deleteEducation(id: string) {
    if (!confirm("Delete this education entry?")) return;
    const res = await fetch(`/api/education/${id}`, { method: "DELETE" });
    if (res.ok) {
      setEducation(education.filter((e) => e.id !== id));
      toast.success("Deleted");
    }
  }

  if (loading) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Education</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add Education
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Add Education</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="space-y-2">
                <Label>Institution *</Label>
                <Input {...register("institution")} />
                {errors.institution && <p className="text-sm text-destructive">{errors.institution.message}</p>}
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Degree *</Label>
                  <Input placeholder="Bachelor of Science" {...register("degree")} />
                  {errors.degree && <p className="text-sm text-destructive">{errors.degree.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label>Field of Study</Label>
                  <Input placeholder="Computer Science" {...register("field")} />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Start Date *</Label>
                  <Input type="date" {...register("startDate")} />
                </div>
                <div className="space-y-2">
                  <Label>End Date</Label>
                  <Input type="date" {...register("endDate")} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea rows={3} placeholder="Notable coursework, thesis, achievements..." {...register("description")} />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Adding..." : "Add Education"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {education.length === 0 ? (
        <EmptyState
          icon={GraduationCap}
          title="No education yet"
          description="Add your educational background — degrees, bootcamps, or self-taught programs."
          actionLabel="Add Education"
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {education.map((edu) => (
            <Card key={edu.id} className="group">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">{edu.degree}{edu.field && ` in ${edu.field}`}</CardTitle>
                  <p className="text-sm text-muted-foreground">{edu.institution}</p>
                </div>
                <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => deleteEducation(edu.id)}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  {new Date(edu.startDate).getFullYear()} — {edu.endDate ? new Date(edu.endDate).getFullYear() : "Present"}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
