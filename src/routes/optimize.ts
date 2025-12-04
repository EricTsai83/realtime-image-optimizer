import { Hono } from "hono";
import { ipx } from "../lib/ipx-client";
import {
  buildBlurPlaceholderOperations,
  buildOperations,
  encodeDataUrl,
  ensureUint8Array,
  hasOperationParams,
  PLACEHOLDER_BLUR_PARAM,
  PLACEHOLDER_PARAM,
  PLACEHOLDER_QUALITY_PARAM,
  PLACEHOLDER_TYPE_BLUR,
  PLACEHOLDER_WIDTH_PARAM,
} from "../lib/image-operations";

const OPTIMIZE_PREFIX = "/optimize/";
const PLACEHOLDER_ONLY_PARAMS: readonly string[] = [
  PLACEHOLDER_PARAM,
  PLACEHOLDER_WIDTH_PARAM,
  PLACEHOLDER_QUALITY_PARAM,
  PLACEHOLDER_BLUR_PARAM,
];

/**
 * Restores double slashes in protocol prefixes that may have been
 * collapsed by URL parsing (e.g., "https:/example.com" -> "https://example.com")
 */
function restoreProtocolSlashes(path: string): string {
  // Match http:/ or https:/ followed by a non-slash character
  // and restore the double slash
  return path.replace(/^(https?:\/)([^/])/, "$1/$2");
}

function stripOptimizePrefix(pathname: string): string {
  if (!pathname.startsWith(OPTIMIZE_PREFIX)) {
    return "";
  }

  let imagePath = pathname.slice(OPTIMIZE_PREFIX.length);

  // Remove leading "_/" which indicates no operations in IPX URL format
  if (imagePath.startsWith("_/")) {
    imagePath = imagePath.slice(2);
  }

  // Decode URL-encoded characters (e.g., https%3A%2F%2F -> https://)
  // This is necessary because URL.pathname preserves percent-encoding
  imagePath = decodeURIComponent(imagePath);

  // Restore double slashes in protocol that may have been collapsed
  // by URL parsing (e.g., "https:/example.com" -> "https://example.com")
  imagePath = restoreProtocolSlashes(imagePath);

  return imagePath;
}

function resolveContentType(format: string): string {
  return format === "jpeg" ? "image/jpeg" : `image/${format}`;
}

function removePlaceholderParamsFromUrl(url: URL): string {
  const normalizedUrl = new URL(url.href);
  for (const param of PLACEHOLDER_ONLY_PARAMS) {
    normalizedUrl.searchParams.delete(param);
  }

  return normalizedUrl.href;
}

function createOptimizeRouter(): Hono {
  const router = new Hono();

  router.get("/optimize/*", async (c) => {
    const requestUrl = new URL(c.req.url);
    let imagePath: string | undefined;

    try {
      imagePath = stripOptimizePrefix(requestUrl.pathname);

      if (!imagePath) {
        return c.json({ error: "Missing image path" }, 400);
      }

      const placeholderType = requestUrl.searchParams.get(PLACEHOLDER_PARAM);
      if (placeholderType === PLACEHOLDER_TYPE_BLUR) {
        const placeholderOperations = buildBlurPlaceholderOperations(
          requestUrl.searchParams,
        );
        const placeholderResult = await ipx(
          imagePath,
          placeholderOperations,
        ).process();
        const placeholderData = ensureUint8Array(placeholderResult.data);
        const placeholderMimeType = resolveContentType(
          placeholderResult.format ?? placeholderOperations.format,
        );

        // Check if user wants JSON response instead of direct image
        const wantJson = requestUrl.searchParams.get("format") === "json";

        if (wantJson) {
          // Return JSON with placeholder data URL and optimized image URL
          const placeholderDataUrl = encodeDataUrl(
            placeholderData,
            placeholderMimeType,
          );
          const optimizedImageUrl = removePlaceholderParamsFromUrl(requestUrl);

          return c.json(
            {
              type: PLACEHOLDER_TYPE_BLUR,
              placeholderDataUrl,
              optimizedImageUrl,
              placeholderWidth: Number.parseInt(
                placeholderOperations.width,
                10,
              ),
              placeholderQuality: Number.parseInt(
                placeholderOperations.quality,
                10,
              ),
              blurSigma: Number.parseInt(placeholderOperations.blur, 10),
            },
            200,
          );
        }

        // Default: Return the blurred image directly
        return new Response(placeholderData as Uint8Array<ArrayBuffer>, {
          status: 200,
          headers: {
            "Content-Type": placeholderMimeType,
            "Cache-Control": "public, max-age=60, stale-while-revalidate=60",
          },
        });
      }

      if (!hasOperationParams(requestUrl.searchParams)) {
        // Even without operations, use ipx() directly to ensure proper URL handling
        // The ipxWebHandler path had issues with protocol slashes being collapsed
        const processedImage = await ipx(imagePath, {}).process();
        const imageData = ensureUint8Array(processedImage.data);
        const contentType = resolveContentType(processedImage.format ?? "webp");

        return new Response(imageData as Uint8Array<ArrayBuffer>, {
          status: 200,
          headers: {
            "Content-Type": contentType,
            "Cache-Control": "public, max-age=60, stale-while-revalidate=60",
          },
        });
      }

      const operations = buildOperations(requestUrl.searchParams);
      const processedImage = await ipx(imagePath, operations).process();
      const imageData = ensureUint8Array(processedImage.data);
      const contentType = resolveContentType(
        processedImage.format ?? operations.format ?? "webp",
      );

      return new Response(imageData as Uint8Array<ArrayBuffer>, {
        status: 200,
        headers: {
          "Content-Type": contentType,
          "Cache-Control": "public, max-age=60, stale-while-revalidate=60",
        },
      });
    } catch (error) {
      console.error("Image processing error:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error("Error details:", {
        message: errorMessage,
        stack: errorStack,
        imagePath,
        placeholderType: requestUrl.searchParams.get(PLACEHOLDER_PARAM),
      });
      return c.json(
        {
          error: "Image processing failed",
          details: errorMessage,
        },
        500,
      );
    }
  });

  return router;
}

export { createOptimizeRouter };
