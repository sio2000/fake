"use client";

import Image from "next/image";
import { isUploadMediaUrl } from "@/lib/upload-url";

type Props = {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  priority?: boolean;
};

/**
 * Uploaded resources are served from /api/uploads/... — use unoptimized/native
 * loading so Netlify does not break previews via the image optimizer.
 */
export default function ResourceImage({ src, alt, className, fill, sizes, priority }: Props) {
  const unoptimized = isUploadMediaUrl(src);

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized={unoptimized}
        className={className}
        sizes={sizes}
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={675}
      unoptimized={unoptimized}
      className={className}
      sizes={sizes}
      priority={priority}
    />
  );
}
