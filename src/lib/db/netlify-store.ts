type BlobsContext = {
  siteID?: string;
  token?: string;
  apiURL?: string;
  edgeURL?: string;
  uncachedEdgeURL?: string;
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

/**
 * Netlify Blobs store. Uses "eventual" consistency by default — "strong" requires
 * uncachedEdgeURL when edgeURL is set, which breaks on some Next.js runtimes.
 */
export async function getBlobStore(name = "pouma-data") {
  const { getStore } = await import("@netlify/blobs");
  const ctx = parseBlobsContext();
  const siteID = process.env.NETLIFY_SITE_ID ?? ctx.siteID;
  const token = process.env.NETLIFY_BLOBS_TOKEN ?? ctx.token;

  // API access: strong consistency without edge URLs
  if (siteID && token && ctx.apiURL) {
    return getStore({
      name,
      siteID,
      token,
      apiURL: ctx.apiURL,
      consistency: "strong",
    });
  }

  // Edge access with explicit strong only when uncachedEdgeURL exists
  if (siteID && token && ctx.uncachedEdgeURL) {
    return getStore({
      name,
      siteID,
      token,
      edgeURL: ctx.edgeURL,
      uncachedEdgeURL: ctx.uncachedEdgeURL,
      consistency: "strong",
    });
  }

  if (siteID && token) {
    return getStore({
      name,
      siteID,
      token,
      consistency: "eventual",
    });
  }

  // Netlify-injected environment (preferred on production)
  return getStore({ name, consistency: "eventual" });
}
