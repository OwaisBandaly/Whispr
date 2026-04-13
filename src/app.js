import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import {
  metricsAuthMiddleware,
  metricsHandler,
  metricsMiddleware,
} from "./monitoring/metrics.js";

const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(metricsMiddleware);

import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import chatRoute from "./routes/chat.route.js"

app.get("/metrics", metricsAuthMiddleware, metricsHandler);
app.use("/api/auth", authRoute);
app.use("/api/user", userRoute);
app.use("/api/chat", chatRoute);

export default app;
