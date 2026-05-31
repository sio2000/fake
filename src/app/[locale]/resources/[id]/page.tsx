import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ResourceArticleView from "@/components/resources/ResourceArticleView";
import { getResourceById } from "@/lib/db/file-store";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const resource = await getResourceById(id);
  if (!resource) return { title: "The Pouma Academy" };
  return {
    title: `${resource.title} | The Pouma Academy`,
    description: resource.description.slice(0, 160),
  };
}

export default async function ResourceArticlePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { id } = await params;
  const resource = await getResourceById(id);
  if (!resource) notFound();

  return <ResourceArticleView resource={resource} />;
}
