import {
  filenameFromUploadUrl,
  getUploadStore,
  uploadKeyFromFilename,
} from "@/lib/db/upload-storage";

function guessContentType(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase();
  if (ext === "pdf") return "application/pdf";
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "gif") return "image/gif";
  if (ext === "jpg" || ext === "jpeg") return "image/jpeg";
  return "application/octet-stream";
}

async function blobToBuffer(data: unknown): Promise<Buffer | null> {
  if (!data) return null;
  if (Buffer.isBuffer(data)) return data;
  if (data instanceof Uint8Array) return Buffer.from(data);
  if (data instanceof ArrayBuffer) return Buffer.from(data);
  if (typeof data === "string") {
    try {
      return Buffer.from(data, "base64");
    } catch {
      return Buffer.from(data, "utf8");
    }
  }
  if (typeof Blob !== "undefined" && data instanceof Blob) {
    const ab = await data.arrayBuffer();
    return Buffer.from(ab);
  }
  return null;
}

export async function readUploadFromBlob(
  filename: string
): Promise<{ body: Buffer; contentType: string } | null> {
  const store = await getUploadStore();
  const key = uploadKeyFromFilename(filename);

  try {
    const withMeta = await store.getWithMetadata(key);
    if (withMeta?.data) {
      const body = await blobToBuffer(withMeta.data);
      if (body?.length) {
        const contentType =
          (withMeta.metadata?.contentType as string | undefined) ?? guessContentType(filename);
        return { body, contentType };
      }
    }
  } catch {
    // try plain get
  }

  try {
    const raw = await store.get(key);
    const body = await blobToBuffer(raw);
    if (body?.length) {
      return { body, contentType: guessContentType(filename) };
    }
  } catch {
    return null;
  }

  return null;
}

export async function writeUploadToBlob(
  filename: string,
  buffer: Buffer,
  contentType: string
): Promise<void> {
  const store = await getUploadStore();
  const arrayBuffer = buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
  await store.set(uploadKeyFromFilename(filename), arrayBuffer, {
    metadata: { contentType },
  });
}

export async function deleteUploadFromBlob(fileUrl?: string): Promise<void> {
  const name = filenameFromUploadUrl(fileUrl);
  if (!name) return;
  try {
    const store = await getUploadStore();
    await store.delete(uploadKeyFromFilename(name));
  } catch {
    // ignore
  }
}
