"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema, socialLinksSchema } from "@/lib/validations/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { AVAILABILITY_STATUSES } from "@/lib/constants";


export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      headline: "",
      bio: "",
      location: "",
      pronouns: "",
      availabilityStatus: "not_specified" as (typeof AVAILABILITY_STATUSES)[number],
      availabilityNote: "",
    },
  });

  const socialForm = useForm({
    resolver: zodResolver(socialLinksSchema),
    defaultValues: {
      websiteUrl: "",
      linkedinUrl: "",
      githubUrl: "",
      twitterUrl: "",
      dribbbleUrl: "",
      behanceUrl: "",
      youtubeUrl: "",
      mediumUrl: "",
      devtoUrl: "",
      emailPublic: "",
      calendarUrl: "",
    },
  });

  useEffect(() => {
    async function loadProfile() {
      const res = await fetch("/api/users/profile");
      if (res.ok) {
        const { data } = await res.json();
        if (data) {
          profileForm.reset({
            fullName: data.fullName,
            headline: data.headline,
            bio: data.bio,
            location: data.location,
            pronouns: data.pronouns,
            availabilityStatus: data.availabilityStatus,
            availabilityNote: data.availabilityNote,
          });
          socialForm.reset({
            websiteUrl: data.websiteUrl || "",
            linkedinUrl: data.linkedinUrl || "",
            githubUrl: data.githubUrl || "",
            twitterUrl: data.twitterUrl || "",
            dribbbleUrl: data.dribbbleUrl || "",
            behanceUrl: data.behanceUrl || "",
            youtubeUrl: data.youtubeUrl || "",
            mediumUrl: data.mediumUrl || "",
            devtoUrl: data.devtoUrl || "",
            emailPublic: data.emailPublic || "",
            calendarUrl: data.calendarUrl || "",
          });
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  async function saveProfile(data: Record<string, unknown>) {
    setSaving(true);
    const res = await fetch("/api/users/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) toast.success("Profile saved!");
    else toast.error("Failed to save profile");
    setSaving(false);
  }

  async function saveSocial(data: Record<string, unknown>) {
    setSaving(true);
    const res = await fetch("/api/users/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (res.ok) toast.success("Social links saved!");
    else toast.error("Failed to save");
    setSaving(false);
  }

  if (loading) {
    return <div className="flex items-center justify-center py-12 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your profile and account</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="social">Social Links</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>This information will be displayed on your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(saveProfile)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" {...profileForm.register("fullName")} />
                    {profileForm.formState.errors.fullName && (
                      <p className="text-sm text-destructive">{profileForm.formState.errors.fullName.message}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="headline">Headline</Label>
                    <Input id="headline" placeholder="Full-Stack Developer" {...profileForm.register("headline")} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" rows={4} placeholder="Tell visitors about yourself..." {...profileForm.register("bio")} />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input id="location" placeholder="San Francisco, CA" {...profileForm.register("location")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pronouns">Pronouns</Label>
                    <Input id="pronouns" placeholder="they/them" {...profileForm.register("pronouns")} />
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Availability</Label>
                    <Select
                      value={profileForm.watch("availabilityStatus")}
                      onValueChange={(val) => { if (val) profileForm.setValue("availabilityStatus", val as (typeof AVAILABILITY_STATUSES)[number]); }}
                    >
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {AVAILABILITY_STATUSES.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availabilityNote">Availability Note</Label>
                    <Input id="availabilityNote" placeholder="Available from June 2026" {...profileForm.register("availabilityNote")} />
                  </div>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Profile"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>Add your social media and professional profiles</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={socialForm.handleSubmit(saveSocial)} className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="websiteUrl">Website</Label>
                    <Input id="websiteUrl" placeholder="https://yoursite.com" {...socialForm.register("websiteUrl")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl">LinkedIn</Label>
                    <Input id="linkedinUrl" placeholder="https://linkedin.com/in/..." {...socialForm.register("linkedinUrl")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl">GitHub</Label>
                    <Input id="githubUrl" placeholder="https://github.com/..." {...socialForm.register("githubUrl")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitterUrl">Twitter / X</Label>
                    <Input id="twitterUrl" placeholder="https://x.com/..." {...socialForm.register("twitterUrl")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dribbbleUrl">Dribbble</Label>
                    <Input id="dribbbleUrl" placeholder="https://dribbble.com/..." {...socialForm.register("dribbbleUrl")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="youtubeUrl">YouTube</Label>
                    <Input id="youtubeUrl" placeholder="https://youtube.com/@..." {...socialForm.register("youtubeUrl")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="emailPublic">Public Email</Label>
                    <Input id="emailPublic" type="email" placeholder="hello@you.com" {...socialForm.register("emailPublic")} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="calendarUrl">Calendar Link</Label>
                    <Input id="calendarUrl" placeholder="https://cal.com/..." {...socialForm.register("calendarUrl")} />
                  </div>
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Links"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="account" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
                <h3 className="font-medium text-destructive">Danger Zone</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Permanently delete your account and all your data.
                </p>
                <Button variant="destructive" size="sm" className="mt-3">
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
