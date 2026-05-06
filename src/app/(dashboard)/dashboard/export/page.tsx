"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Download } from "lucide-react";
import { toast } from "sonner";

export default function ExportPage() {
  const [exporting, setExporting] = useState(false);

  async function exportJSON() {
    setExporting(true);
    try {
      const res = await fetch("/api/users/export");
      if (!res.ok) throw new Error("Export failed");
      const data = await res.json();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "folio-export.json";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Export downloaded!");
    } catch {
      toast.error("Failed to export data");
    }
    setExporting(false);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Export Data</h1>
        <p className="text-muted-foreground">Your data is yours. Export everything at any time.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>JSON Export</CardTitle>
          <CardDescription>
            Download all your portfolio content as a structured JSON file. Includes projects,
            experience, education, skills, testimonials, and profile data.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={exportJSON} disabled={exporting}>
            <Download className="mr-2 h-4 w-4" />
            {exporting ? "Exporting..." : "Export as JSON"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
