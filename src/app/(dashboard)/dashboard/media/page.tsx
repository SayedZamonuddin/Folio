"use client";

import { EmptyState } from "@/components/dashboard/EmptyState";
import { Image } from "lucide-react";

export default function MediaPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Media Library</h1>
      <EmptyState
        icon={Image}
        title="Media Library"
        description="Upload and manage images for your projects and portfolio. Media uploads will be available when connected to Supabase Storage."
        actionLabel="Coming Soon"
        onAction={() => {}}
      />
    </div>
  );
}
