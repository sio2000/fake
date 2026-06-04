type BlobsContext = {
  siteID?: string;
  token?: string;
  apiURL?: string;
  edgeURL?: string;
};

function parseBlobsContext(): BlobsContext {
  const raw = process.env.NETLIFY_BLOBS_CONTEXT;
  if (!raw) return {};
  try {
    return JSON.parse(Buffer.from(raw, "base64").toString("utf8")) as BlobsContext;
  } catch {
    return {};
  }
}

/** Shared Netlify Blobs store — same as resources.json / contacts.json */
export async function getBlobStore(name = "pouma-data") {
  const { getStore } = await import("@netlify/blobs");
  const ctx = parseBlobsContext();
  const siteID = process.env.NETLIFY_SITE_ID ?? ctx.siteID;
  const token = process.env.NETLIFY_BLOBS_TOKEN ?? ctx.token;

  if (siteID && token) {
    return getStore({
      name,
      siteID,
      token,
      apiURL: ctx.apiURL,
      edgeURL: ctx.edgeURL,
      consistency: "strong",
    });
  }

  return getStore({ name, consistency: "strong" });
}
