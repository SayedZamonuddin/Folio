-- Folio Database Schema
-- Run this in Supabase SQL Editor

CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "supabaseId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "headline" TEXT,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "coverImageUrl" TEXT,
    "resumeUrl" TEXT,
    "location" TEXT,
    "pronouns" TEXT,
    "availabilityStatus" TEXT NOT NULL DEFAULT 'not_specified',
    "availabilityNote" TEXT,
    "websiteUrl" TEXT,
    "linkedinUrl" TEXT,
    "githubUrl" TEXT,
    "twitterUrl" TEXT,
    "dribbbleUrl" TEXT,
    "behanceUrl" TEXT,
    "youtubeUrl" TEXT,
    "mediumUrl" TEXT,
    "devtoUrl" TEXT,
    "emailPublic" TEXT,
    "calendarUrl" TEXT,
    "theme" TEXT NOT NULL DEFAULT 'default',
    "accentColor" TEXT NOT NULL DEFAULT '#2563eb',
    "fontFamily" TEXT NOT NULL DEFAULT 'inter',
    "darkMode" BOOLEAN NOT NULL DEFAULT false,
    "sectionOrder" TEXT[] DEFAULT ARRAY['about', 'projects', 'experience', 'education', 'skills', 'testimonials']::TEXT[],
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "showResume" BOOLEAN NOT NULL DEFAULT true,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT,
    "role" TEXT,
    "thumbnailUrl" TEXT,
    "problemStatement" TEXT,
    "process" TEXT,
    "outcome" TEXT,
    "content" TEXT,
    "liveUrl" TEXT,
    "sourceUrl" TEXT,
    "caseStudyUrl" TEXT,
    "tags" TEXT[],
    "category" TEXT,
    "teamSize" TEXT,
    "duration" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'published',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "ProjectTech" (
    "id" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "iconUrl" TEXT,
    "url" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "ProjectTech_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "projectId" TEXT,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "type" TEXT NOT NULL,
    "mimeType" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "caption" TEXT,
    "altText" TEXT,
    "embedUrl" TEXT,
    "embedType" TEXT,
    "codeContent" TEXT,
    "codeLanguage" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Experience" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "companyUrl" TEXT,
    "role" TEXT NOT NULL,
    "employmentType" TEXT,
    "description" TEXT,
    "logoUrl" TEXT,
    "location" TEXT,
    "locationType" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "tags" TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Education" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "institutionUrl" TEXT,
    "degree" TEXT NOT NULL,
    "field" TEXT,
    "description" TEXT,
    "logoUrl" TEXT,
    "grade" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3),
    "activities" TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "proficiency" INTEGER,
    "yearsOfExp" INTEGER,
    "iconUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Certification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "issuingOrg" TEXT NOT NULL,
    "issuingOrgUrl" TEXT,
    "logoUrl" TEXT,
    "credentialId" TEXT,
    "credentialUrl" TEXT,
    "issueDate" TIMESTAMP(3) NOT NULL,
    "expiryDate" TIMESTAMP(3),
    "description" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Certification_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Publication" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "publisher" TEXT,
    "url" TEXT,
    "thumbnailUrl" TEXT,
    "description" TEXT,
    "publishedDate" TIMESTAMP(3),
    "coAuthors" TEXT[],
    "doi" TEXT,
    "citations" INTEGER,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Publication_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorRole" TEXT,
    "authorAvatar" TEXT,
    "authorUrl" TEXT,
    "content" TEXT NOT NULL,
    "relationship" TEXT,
    "projectId" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "requestEmail" TEXT,
    "requestStatus" TEXT NOT NULL DEFAULT 'received',
    "requestToken" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CustomSection" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "icon" TEXT,
    "content" TEXT,
    "layout" TEXT NOT NULL DEFAULT 'list',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "CustomSection_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "CustomSectionItem" (
    "id" TEXT NOT NULL,
    "sectionId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "description" TEXT,
    "url" TEXT,
    "imageUrl" TEXT,
    "date" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "tags" TEXT[],
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "CustomSectionItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "SocialLink" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "label" TEXT,
    "iconUrl" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "SocialLink_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "PortfolioView" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referrer" TEXT,
    "country" TEXT,
    "device" TEXT,
    "browser" TEXT,
    "path" TEXT,
    "sessionId" TEXT,
    "duration" INTEGER,
    CONSTRAINT "PortfolioView_pkey" PRIMARY KEY ("id")
);

-- Unique indexes
CREATE UNIQUE INDEX "User_supabaseId_key" ON "User"("supabaseId");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "Skill_userId_name_key" ON "Skill"("userId", "name");
CREATE UNIQUE INDEX "Testimonial_requestToken_key" ON "Testimonial"("requestToken");

-- Performance indexes
CREATE INDEX "User_username_idx" ON "User"("username");
CREATE INDEX "User_supabaseId_idx" ON "User"("supabaseId");
CREATE INDEX "Project_userId_idx" ON "Project"("userId");
CREATE INDEX "Project_userId_status_sortOrder_idx" ON "Project"("userId", "status", "sortOrder");
CREATE INDEX "ProjectTech_projectId_idx" ON "ProjectTech"("projectId");
CREATE INDEX "Media_projectId_idx" ON "Media"("projectId");
CREATE INDEX "Experience_userId_idx" ON "Experience"("userId");
CREATE INDEX "Education_userId_idx" ON "Education"("userId");
CREATE INDEX "Skill_userId_idx" ON "Skill"("userId");
CREATE INDEX "Certification_userId_idx" ON "Certification"("userId");
CREATE INDEX "Publication_userId_idx" ON "Publication"("userId");
CREATE INDEX "Testimonial_userId_idx" ON "Testimonial"("userId");
CREATE INDEX "Testimonial_requestToken_idx" ON "Testimonial"("requestToken");
CREATE INDEX "CustomSection_userId_idx" ON "CustomSection"("userId");
CREATE INDEX "CustomSectionItem_sectionId_idx" ON "CustomSectionItem"("sectionId");
CREATE INDEX "SocialLink_userId_idx" ON "SocialLink"("userId");
CREATE INDEX "PortfolioView_userId_viewedAt_idx" ON "PortfolioView"("userId", "viewedAt");
CREATE INDEX "PortfolioView_userId_referrer_idx" ON "PortfolioView"("userId", "referrer");

-- Foreign keys
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ProjectTech" ADD CONSTRAINT "ProjectTech_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Media" ADD CONSTRAINT "Media_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Education" ADD CONSTRAINT "Education_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Certification" ADD CONSTRAINT "Certification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Publication" ADD CONSTRAINT "Publication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Testimonial" ADD CONSTRAINT "Testimonial_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CustomSection" ADD CONSTRAINT "CustomSection_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "CustomSectionItem" ADD CONSTRAINT "CustomSectionItem_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "CustomSection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "SocialLink" ADD CONSTRAINT "SocialLink_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "PortfolioView" ADD CONSTRAINT "PortfolioView_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
