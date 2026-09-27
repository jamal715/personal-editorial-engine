import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { publicationBySlug } from "../../../lib/publications";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Serve the supplied document directly: no React wrapper, reader styles,
// injected markup, or public static-file URL that bypasses publication state.
export async function GET() {
  const publication = await publicationBySlug("pakistan-sme-credit-since-2013");
  if (!publication || !publication.visible || !["published", "working"].includes(publication.status)) {
    return new Response("This article is not currently public.", {
      status: 404,
      headers: { "Content-Type": "text/plain; charset=utf-8", "Cache-Control": "no-store" },
    });
  }

  const html = await readFile(join(process.cwd(), "content/articles/pakistan-sme-credit-since-2013.html"));
  return new Response(new Uint8Array(html), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
      ...(publication.status === "working" ? { "X-Robots-Tag": "noindex" } : {}),
    },
  });
}
