import { Hono } from "hono";
import { createCorsMiddleware } from "./lib/cors";
import { createOptimizeRouter } from "./routes/optimize";

const app = new Hono();

// Apply CORS middleware globally
app.use("*", createCorsMiddleware());

// Mount optimize router
const optimizeRouter = createOptimizeRouter();
app.route("/", optimizeRouter);

export default app;
