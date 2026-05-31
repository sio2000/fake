import type { Resource } from "@/lib/db/types";
import { normalizeExternalUrl, displayHostname } from "@/lib/url";

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)$/i;
const PDF_EXT = /\.pdf$/i;

/** Internal blog-style article page */
export function getResourceReadPath(locale: string, id: string): string {
  return `/${locale}/resources/${id}`;
}

export function getExternalArticleUrl(r: Resource): string | null {
  if (!r.url?.trim()) return null;
  return normalizeExternalUrl(r.url);
}

export function getExternalLinkLabel(r: Resource): string | null {
  if (!r.url?.trim()) return null;
  return displayHostname(r.url);
}

export function getFileUrl(r: Resource): string | null {
  if (!r.fileUrl?.trim()) return null;
  const path = r.fileUrl.trim();
  return path.startsWith("/") ? path : `/${path}`;
}

export function isImageResource(r: Resource): boolean {
  if (r.thumbnailUrl) return true;
  const target = r.fileUrl ?? "";
  return IMAGE_EXT.test(target);
}

export function isPdfResource(r: Resource): boolean {
  const target = r.fileUrl ?? "";
  return PDF_EXT.test(target) || r.type === "pdf";
}

export function getThumbnailSrc(r: Resource): string | null {
  if (r.thumbnailUrl?.trim()) {
    const path = r.thumbnailUrl.trim();
    return path.startsWith("/") ? path : `/${path}`;
  }
  if (r.fileUrl && IMAGE_EXT.test(r.fileUrl)) {
    const path = r.fileUrl.trim();
    return path.startsWith("/") ? path : `/${path}`;
  }
  return null;
}
