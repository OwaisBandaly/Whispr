import crypto from "crypto";
import client from "prom-client";
import mongoose from "mongoose";
import { Friend } from "../models/friend.model.js";
import { User } from "../models/auth.model.js";

const METRIC_PREFIX = "auth_app_";

export const register = new client.Registry();

client.collectDefaultMetrics({
  register,
  prefix: METRIC_PREFIX,
});

const httpRequestsTotal = new client.Counter({
  name: `${METRIC_PREFIX}http_requests_total`,
  help: "Total HTTP requests handled by the Express app",
  labelNames: ["method", "route", "status_code"],
  registers: [register],
});

const httpRequestDurationSeconds = new client.Histogram({
  name: `${METRIC_PREFIX}http_request_duration_seconds`,
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10],
  registers: [register],
});

const authEventsTotal = new client.Counter({
  name: `${METRIC_PREFIX}auth_events_total`,
  help: "Authentication lifecycle events",
  labelNames: ["event"],
  registers: [register],
});

const socialEventsTotal = new client.Counter({
  name: `${METRIC_PREFIX}social_events_total`,
  help: "Friend and discovery usage events",
  labelNames: ["event"],
  registers: [register],
});

const chatEventsTotal = new client.Counter({
  name: `${METRIC_PREFIX}chat_events_total`,
  help: "Chat-related usage events",
  labelNames: ["event"],
  registers: [register],
});

const appErrorsTotal = new client.Counter({
  name: `${METRIC_PREFIX}errors_total`,
  help: "Application errors grouped by area",
  labelNames: ["area"],
  registers: [register],
});

new client.Gauge({
  name: `${METRIC_PREFIX}mongodb_up`,
  help: "Whether MongoDB is connected",
  registers: [register],
  collect() {
    this.set(mongoose.connection.readyState === 1 ? 1 : 0);
  },
});

new client.Gauge({
  name: `${METRIC_PREFIX}users_total`,
  help: "Current total number of users",
  registers: [register],
  async collect() {
    this.set(await safeCount(() => User.countDocuments()));
  },
});

new client.Gauge({
  name: `${METRIC_PREFIX}users_verified_total`,
  help: "Current total number of verified users",
  registers: [register],
  async collect() {
    this.set(await safeCount(() => User.countDocuments({ isVerified: true })));
  },
});

new client.Gauge({
  name: `${METRIC_PREFIX}users_onboarded_total`,
  help: "Current total number of onboarded users",
  registers: [register],
  async collect() {
    this.set(await safeCount(() => User.countDocuments({ isOnboarded: true })));
  },
});

new client.Gauge({
  name: `${METRIC_PREFIX}friend_requests_pending_total`,
  help: "Current total number of pending friend requests",
  registers: [register],
  async collect() {
    this.set(await safeCount(() => Friend.countDocuments({ status: "pending" })));
  },
});

new client.Gauge({
  name: `${METRIC_PREFIX}friendships_total`,
  help: "Current total number of accepted friendships",
  registers: [register],
  async collect() {
    this.set(await safeCount(() => Friend.countDocuments({ status: "accepted" })));
  },
});

function isDatabaseReady() {
  return mongoose.connection.readyState === 1;
}

async function safeCount(operation) {
  if (!isDatabaseReady()) {
    return 0;
  }

  try {
    return await operation();
  } catch {
    return 0;
  }
}

function normalizeRoute(req) {
  if (req.baseUrl && req.route?.path) {
    return `${req.baseUrl}${req.route.path}`;
  }

  if (req.route?.path) {
    return req.route.path;
  }

  if (req.path === "/metrics") {
    return "/metrics";
  }

  return (req.path || req.originalUrl || "unknown")
    .split("?")[0]
    .replace(/[0-9a-fA-F]{24}/g, ":id")
    .replace(/[0-9a-fA-F-]{32,}/g, ":token");
}

function safeMetricTokenCompare(candidate, expected) {
  if (!candidate || !expected) {
    return false;
  }

  const left = Buffer.from(candidate);
  const right = Buffer.from(expected);

  if (left.length !== right.length) {
    return false;
  }

  return crypto.timingSafeEqual(left, right);
}

export function metricsMiddleware(req, res, next) {
  const stopTimer = httpRequestDurationSeconds.startTimer();

  res.on("finish", () => {
    const labels = {
      method: req.method,
      route: normalizeRoute(req),
      status_code: String(res.statusCode),
    };

    httpRequestsTotal.inc(labels);
    stopTimer(labels);
  });

  next();
}

export function metricsAuthMiddleware(req, res, next) {
  const expectedToken = process.env.METRICS_TOKEN;

  if (!expectedToken) {
    return next();
  }

  const authHeader = req.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : null;
  const metricsToken = req.get("x-metrics-token") || bearerToken;

  if (safeMetricTokenCompare(metricsToken, expectedToken)) {
    return next();
  }

  return res.status(401).json({
    success: false,
    message: "Unauthorized metrics access",
  });
}

export async function metricsHandler(req, res) {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
}

export function recordAuthEvent(event) {
  authEventsTotal.inc({ event });
}

export function recordSocialEvent(event) {
  socialEventsTotal.inc({ event });
}

export function recordChatEvent(event) {
  chatEventsTotal.inc({ event });
}

export function recordAppError(area) {
  appErrorsTotal.inc({ area });
}
