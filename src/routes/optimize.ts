import { Hono } from "hono";
import { ipx, ipxWebHandler } from "../lib/ipx-client";
import {
  buildOperations,
  cloneToArrayBuffer,
  ensureUint8Array,
  hasOperationParams,
} from "../lib/image-operations";

const OPTIMIZE_PREFIX = "/optimize/";

function stripOptimizePrefix(pathname: string): string {
  if (!pathname.startsWith(OPTIMIZE_PREFIX)) {
    return "";
  }

  return pathname.slice(OPTIMIZE_PREFIX.length);
}

function createOptimizeRouter(): Hono {
  const router = new Hono();

  router.get("/optimize/*", async (c) => {
    try {
      const requestUrl = new URL(c.req.url);
      const imagePath = stripOptimizePrefix(requestUrl.pathname);

      if (!imagePath) {
        return c.json({ error: "Missing image path" }, 400);
      }

      if (!hasOperationParams(requestUrl.searchParams)) {
        const passthroughUrl = new URL(requestUrl.toString());
        passthroughUrl.pathname = requestUrl.pathname.replace(
          /^\/optimize/,
          "",
        );
        return ipxWebHandler(new Request(passthroughUrl));
      }

      const operations = buildOperations(requestUrl.searchParams);
      const processedImage = await ipx(imagePath, operations).process();
      const imageData = ensureUint8Array(processedImage.data);
      const responseBody = cloneToArrayBuffer(imageData);
      const contentType =
        processedImage.format === "jpeg"
          ? "image/jpeg"
          : `image/${processedImage.format}`;

      return c.body(responseBody, 200, {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=60, stale-while-revalidate=60",
      });
    } catch (error) {
      console.error("Image processing error:", error);
      return c.json({ error: "Image processing failed" }, 500);
    }
  });

  return router;
}

export { createOptimizeRouter };
