import { cors } from "hono/cors";

/**
 * CORS configuration for the image optimization service.
 *
 * Currently allows all origins. In the future, this can be configured
 * via environment variables or fetched from a database/KV store.
 */
const createCorsMiddleware = () => {
  // TODO: In the future, fetch allowed origins from database/KV
  // const allowedOrigins = await fetchAllowedOriginsFromKV();

  return cors({
    origin: "*", // Allow all origins for now
    allowMethods: ["GET", "OPTIONS"],
    allowHeaders: ["Content-Type"],
    exposeHeaders: ["Content-Length", "Content-Type"],
    maxAge: 86400, // 24 hours
  });
};

export { createCorsMiddleware };
