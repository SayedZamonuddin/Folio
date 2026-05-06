"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { Award, Plus, Trash2, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Certification {
  id: string;
  name: string;
  issuingOrg: string;
  issuingOrgUrl: string | null;
  credentialId: string | null;
  credentialUrl: string | null;
  issueDate: string;
  expiryDate: string | null;
  description: string | null;
}

export default function CertificationsPage() {
  const [certs, setCerts] = useState<Certification[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/certifications")
      .then((res) => res.json())
      .then(({ data }) => setCerts(data || []))
      .finally(() => setLoading(false));
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const body = {
      name: fd.get("name"),
      issuingOrg: fd.get("issuingOrg"),
      issuingOrgUrl: fd.get("issuingOrgUrl") || null,
      credentialId: fd.get("credentialId") || null,
      credentialUrl: fd.get("credentialUrl") || null,
      issueDate: fd.get("issueDate"),
      expiryDate: fd.get("expiryDate") || null,
      description: fd.get("description") || null,
    };
    const res = await fetch("/api/certifications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const { data } = await res.json();
      setCerts([...certs, data]);
      setOpen(false);
      toast.success("Certification added!");
    }
    setSaving(false);
  }

  async function deleteCert(id: string) {
    if (!confirm("Delete this certification?")) return;
    const res = await fetch(`/api/certifications/${id}`, { method: "DELETE" });
    if (res.ok) {
      setCerts(certs.filter((c) => c.id !== id));
      toast.success("Deleted");
    }
  }

  if (loading) return <div className="py-12 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Certifications</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            <Plus className="h-4 w-4" /> Add Certification
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Add Certification</DialogTitle></DialogHeader>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>Certification Name *</Label>
                <Input name="name" required placeholder="AWS Solutions Architect" />
              </div>
              <div className="space-y-2">
                <Label>Issuing Organization *</Label>
                <Input name="issuingOrg" required placeholder="Amazon Web Services" />
              </div>
              <div className="space-y-2">
                <Label>Organization URL</Label>
                <Input name="issuingOrgUrl" type="url" placeholder="https://aws.amazon.com" />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Credential ID</Label>
                  <Input name="credentialId" placeholder="ABC-123-XYZ" />
                </div>
                <div className="space-y-2">
                  <Label>Credential URL</Label>
                  <Input name="credentialUrl" type="url" placeholder="https://..." />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Issue Date *</Label>
                  <Input name="issueDate" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label>Expiry Date</Label>
                  <Input name="expiryDate" type="date" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Input name="description" placeholder="Brief description..." />
              </div>
              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Adding..." : "Add Certification"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {certs.length === 0 ? (
        <EmptyState
          icon={Award}
          title="No certifications yet"
          description="Add your professional certifications and credentials."
          actionLabel="Add Certification"
          onAction={() => setOpen(true)}
        />
      ) : (
        <div className="space-y-4">
          {certs.map((cert) => (
            <Card key={cert.id} className="group">
              <CardHeader className="flex flex-row items-start justify-between pb-2">
                <div>
                  <CardTitle className="text-base">{cert.name}</CardTitle>
                  <p className="text-sm text-muted-foreground">{cert.issuingOrg}</p>
                </div>
                <div className="flex gap-1">
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="ghost" size="icon"><ExternalLink className="h-4 w-4" /></Button>
                    </a>
                  )}
                  <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100" onClick={() => deleteCert(cert.id)}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Issued {new Date(cert.issueDate).toLocaleDateString()}
                  {cert.expiryDate && ` · Expires ${new Date(cert.expiryDate).toLocaleDateString()}`}
                </p>
                {cert.credentialId && <p className="mt-1 text-xs text-muted-foreground">ID: {cert.credentialId}</p>}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
