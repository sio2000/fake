import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { readUploadFromBlob } from "@/lib/db/upload-blob";
import { getTmpUploadDir, useNetlifyBlobs } from "@/lib/db/upload-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function guessContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  if (ext === ".pdf") return "application/pdf";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";
  return "application/octet-stream";
}

function fileResponse(body: Buffer, contentType: string) {
  return new NextResponse(new Uint8Array(body), {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

async function readFromDisk(diskPath: string, filename: string) {
  const body = await fs.readFile(diskPath);
  return fileResponse(body, guessContentType(filename));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;
  if (!filename || filename.includes("..") || filename.includes("/")) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (useNetlifyBlobs()) {
    try {
      const blob = await readUploadFromBlob(filename);
      if (blob) return fileResponse(blob.body, blob.contentType);
    } catch (err) {
      console.error("[uploads] blob read failed:", filename, err);
    }
  }

  const localPath = path.join(process.cwd(), "public", "uploads", "resources", filename);
  try {
    return await readFromDisk(localPath, filename);
  } catch {
    // continue
  }

  try {
    return await readFromDisk(path.join(getTmpUploadDir(), filename), filename);
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
