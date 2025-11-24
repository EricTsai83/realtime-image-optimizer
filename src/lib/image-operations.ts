type OperationKey = "width" | "height" | "format" | "quality";

type OperationMap = Readonly<Record<string, string>>;

/**
 * Extracts supported IPX operations from query parameters.
 */
function buildOperations(searchParams: URLSearchParams): OperationMap {
  const operations: Record<string, string> = {};

  const width = searchParams.get("w");
  if (width) {
    operations.width = width;
  }

  const height = searchParams.get("h");
  if (height) {
    operations.height = height;
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
    searchParams.has("q")
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

function cloneToArrayBuffer(data: Uint8Array): ArrayBuffer {
  const buffer = new ArrayBuffer(data.byteLength);
  new Uint8Array(buffer).set(data);
  return buffer;
}

export {
  type OperationKey,
  type OperationMap,
  buildOperations,
  hasOperationParams,
  ensureUint8Array,
  cloneToArrayBuffer,
};
