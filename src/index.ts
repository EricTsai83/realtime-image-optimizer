import { Hono } from "hono";
import { createCorsMiddleware } from "./lib/cors";
import { createOptimizeRouter } from "./routes/optimize";

const app = new Hono();

// Apply CORS middleware globally
app.use("*", createCorsMiddleware());

// Mount optimize router
const optimizeRouter = createOptimizeRouter();
app.route("/", optimizeRouter);

// For local development with Bun
export default {
  port: 3001,
  fetch: app.fetch,
};

// For Vercel serverless
export { app };
