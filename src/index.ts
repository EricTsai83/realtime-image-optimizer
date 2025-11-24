import { Hono } from "hono";
import { serveStatic } from "hono/bun";
import { createOptimizeRouter } from "./routes/optimize";

const app = new Hono();
const optimizeRouter = createOptimizeRouter();

app.use("/favicon.ico", serveStatic({ path: "./favicon.ico" }));
app.route("/", optimizeRouter);

export default {
  port: 3000,
  fetch: app.fetch,
};
