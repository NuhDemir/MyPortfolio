import { createHttpApp } from "./src/app/http/app.js";

const app = createHttpApp({ enableStatic: process.env.NODE_ENV === "production" });

export default app;
