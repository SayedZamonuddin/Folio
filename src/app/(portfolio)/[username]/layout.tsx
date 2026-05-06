import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
    select: { fullName: true, headline: true, bio: true },
  });

  if (!user) return {};

  return {
    title: `${user.fullName}${user.headline ? ` — ${user.headline}` : ""} | Folio`,
    description: user.bio?.slice(0, 160) || user.headline || `${user.fullName}'s portfolio`,
    openGraph: {
      title: user.fullName,
      description: user.headline || undefined,
    },
  };
}

export default async function PortfolioLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true, isPublic: true },
  });

  if (!user || !user.isPublic) {
    notFound();
  }

  return <>{children}</>;
}
