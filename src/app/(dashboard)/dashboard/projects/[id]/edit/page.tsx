"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { projectSchema } from "@/lib/validations/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TagInput } from "@/components/dashboard/TagInput";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { PROJECT_CATEGORIES } from "@/lib/constants";

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [tags, setTags] = useState<string[]>([]);

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: "",
      summary: "",
      role: "",
      category: "",
      liveUrl: "",
      sourceUrl: "",
      tags: [] as string[],
      featured: false,
      status: "published" as const,
      problemStatement: "",
      process: "",
      outcome: "",
    },
  });

  useEffect(() => {
    async function load() {
      const res = await fetch(`/api/projects/${id}`);
      if (!res.ok) {
        toast.error("Project not found");
        router.push("/dashboard/projects");
        return;
      }
      const { data } = await res.json();
      if (data) {
        reset({
          title: data.title || "",
          summary: data.summary || "",
          role: data.role || "",
          category: data.category || "",
          liveUrl: data.liveUrl || "",
          sourceUrl: data.sourceUrl || "",
          tags: data.tags || [],
          featured: data.featured || false,
          status: data.status || "published",
          problemStatement: data.problemStatement || "",
          process: data.process || "",
          outcome: data.outcome || "",
        });
        setTags(data.tags || []);
      }
      setLoading(false);
    }
    load();
  }, [id, reset, router]);

  async function onSubmit(data: Record<string, unknown>) {
    setSaving(true);
    const res = await fetch(`/api/projects/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, tags }),
    });

    if (res.ok) {
      toast.success("Project updated!");
      router.push("/dashboard/projects");
    } else {
      toast.error("Failed to update project");
    }
    setSaving(false);
  }

  if (loading) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Project</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="casestudy">Case Study</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-6 space-y-4">
            <Card>
              <CardHeader><CardTitle>Project Details</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title *</Label>
                  <Input id="title" {...register("title")} />
                  {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="summary">Summary</Label>
                  <Textarea id="summary" placeholder="1-2 sentences about this project" {...register("summary")} />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="role">Your Role</Label>
                    <Input id="role" placeholder="Lead Developer" {...register("role")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select
                      value={watch("category") || ""}
                      onValueChange={(val) => { if (val) setValue("category", val); }}
                    >
                      <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {PROJECT_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>{c}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <TagInput value={tags} onChange={setTags} placeholder="React, TypeScript, Node.js..." />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="liveUrl">Live URL</Label>
                    <Input id="liveUrl" placeholder="https://..." {...register("liveUrl")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sourceUrl">Source Code URL</Label>
                    <Input id="sourceUrl" placeholder="https://github.com/..." {...register("sourceUrl")} />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Checkbox
                      id="featured"
                      checked={watch("featured")}
                      onCheckedChange={(checked) => setValue("featured", checked === true)}
                    />
                    <Label htmlFor="featured">Featured Project</Label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="casestudy" className="mt-6 space-y-4">
            <Card>
              <CardHeader><CardTitle>Case Study</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="problemStatement">The Challenge</Label>
                  <Textarea
                    id="problemStatement"
                    rows={4}
                    placeholder="What problem were you solving?"
                    {...register("problemStatement")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="process">The Process</Label>
                  <Textarea
                    id="process"
                    rows={4}
                    placeholder="How did you approach it?"
                    {...register("process")}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="outcome">The Outcome</Label>
                  <Textarea
                    id="outcome"
                    rows={4}
                    placeholder="What were the results?"
                    {...register("outcome")}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex gap-3">
          <Button type="submit" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
