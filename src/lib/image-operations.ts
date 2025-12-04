import { Buffer } from "node:buffer";

type OperationKey = "width" | "height" | "format" | "quality" | "fit";

type OperationMap = Readonly<Record<string, string>>;

type BlurPlaceholderOperations = Readonly<{
  width: string;
  quality: string;
  blur: string;
  format: string;
}>;

const PLACEHOLDER_PARAM = "placeholder";
const PLACEHOLDER_TYPE_BLUR = "blur";
const PLACEHOLDER_WIDTH_PARAM = "pw";
const PLACEHOLDER_QUALITY_PARAM = "pq";
const PLACEHOLDER_BLUR_PARAM = "pb";

const DEFAULT_PLACEHOLDER_WIDTH = "24";
const DEFAULT_PLACEHOLDER_QUALITY = "35";
const DEFAULT_PLACEHOLDER_BLUR = "35";
const DEFAULT_PLACEHOLDER_FORMAT = "webp";

/**
 * Extracts supported IPX operations from query parameters.
 *
 * Note: When both width and height are specified, we use 'resize' operation
 * instead of separate 'width' and 'height' operations. This is because:
 * 1. IPX's width/height handlers don't support the 'fit' parameter
 * 2. Only the 'resize' handler supports 'fit' parameter
 * 3. When 'fit' is not specified, we default to 'inside' to maintain aspect ratio
 */
function buildOperations(searchParams: URLSearchParams): OperationMap {
  const operations: Record<string, string> = {};

  const width = searchParams.get("w");
  const height = searchParams.get("h");
  const fit = searchParams.get("fit");

  // When both width and height are specified, use 'resize' operation
  if (width && height) {
    operations.resize = `${width}x${height}`;
    // Default to 'inside' to maintain aspect ratio if fit is not specified
    operations.fit = fit ?? "inside";
  } else {
    // Use separate width/height operations when only one dimension is specified
    if (width) {
      operations.width = width;
    }
    if (height) {
      operations.height = height;
    }
  }

  const format = searchParams.get("format");
  if (format) {
    operations.format = format;
  }

  const quality = searchParams.get("q");
  if (quality) {
    operations.quality = quality;
  }

  return operations;
}

function hasOperationParams(searchParams: URLSearchParams): boolean {
  return (
    searchParams.has("w") ||
    searchParams.has("h") ||
    searchParams.has("format") ||
    searchParams.has("q") ||
    searchParams.has("fit")
  );
}

function ensureUint8Array(data: string | ArrayBuffer | Uint8Array): Uint8Array {
  if (typeof data === "string") {
    return new TextEncoder().encode(data);
  }

  if (data instanceof Uint8Array) {
    return data;
  }

  return new Uint8Array(data);
}

/**
 * Builds IPX operations tailored for blur placeholders.
 */
function buildBlurPlaceholderOperations(
  searchParams: URLSearchParams,
): BlurPlaceholderOperations {
  const width =
    searchParams.get(PLACEHOLDER_WIDTH_PARAM) ?? DEFAULT_PLACEHOLDER_WIDTH;
  const quality =
    searchParams.get(PLACEHOLDER_QUALITY_PARAM) ?? DEFAULT_PLACEHOLDER_QUALITY;
  const blur =
    searchParams.get(PLACEHOLDER_BLUR_PARAM) ?? DEFAULT_PLACEHOLDER_BLUR;
  const format = searchParams.get("format") ?? DEFAULT_PLACEHOLDER_FORMAT;

  return {
    width,
    quality,
    blur,
    format,
  };
}

/**
 * Encodes binary data into a data URL suitable for inline usage.
 */
function encodeDataUrl(data: Uint8Array, mimeType: string): string {
  const base64 = Buffer.from(data).toString("base64");
  return `data:${mimeType};base64,${base64}`;
}

export {
  type OperationKey,
  type OperationMap,
  type BlurPlaceholderOperations,
  buildOperations,
  buildBlurPlaceholderOperations,
  hasOperationParams,
  ensureUint8Array,
  encodeDataUrl,
  PLACEHOLDER_PARAM,
  PLACEHOLDER_TYPE_BLUR,
  PLACEHOLDER_WIDTH_PARAM,
  PLACEHOLDER_QUALITY_PARAM,
  PLACEHOLDER_BLUR_PARAM,
};
