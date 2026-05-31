import { promises as fs } from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

export function useNetlifyBlobs() {
  return process.env.NETLIFY === "true";
}

async function getDataStore() {
  const { getStore } = await import("@netlify/blobs");
  return getStore({ name: "pouma-data", consistency: "strong" });
}

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

export async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  if (useNetlifyBlobs()) {
    try {
      const store = await getDataStore();
      const data = await store.get(filename, { type: "json" });
      if (data === null) {
        await store.setJSON(filename, fallback);
        return fallback;
      }
      return data as T;
    } catch {
      return fallback;
    }
  }

  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as T;
  } catch {
    await fs.writeFile(filePath, JSON.stringify(fallback, null, 2), "utf-8");
    return fallback;
  }
}

export async function writeJsonFile<T>(filename: string, data: T): Promise<void> {
  if (useNetlifyBlobs()) {
    const store = await getDataStore();
    await store.setJSON(filename, data);
    return;
  }

  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}
