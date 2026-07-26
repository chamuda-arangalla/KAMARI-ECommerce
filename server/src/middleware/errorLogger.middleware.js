import { randomUUID } from "node:crypto";
import { logger } from "../utils/logger.js";

const safeErrorMessage = (body) => {
  if (!body || typeof body !== "object") return undefined;
  const value = body.error || body.message;
  return typeof value === "string" ? value.slice(0, 500) : undefined;
};

export const requestLogger = (req, res, next) => {
  const startedAt = process.hrtime.bigint();
  const suppliedRequestId = req.get("x-request-id");
  const requestId =
    suppliedRequestId &&
    suppliedRequestId.length <= 100 &&
    /^[a-zA-Z0-9._-]+$/.test(suppliedRequestId)
      ? suppliedRequestId
      : randomUUID();
  let responseError;

  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  const originalJson = res.json.bind(res);
  res.json = (body) => {
    if (res.statusCode >= 400) responseError = safeErrorMessage(body);
    return originalJson(body);
  };

  res.on("finish", () => {
    if (res.statusCode < 400 || res.locals.errorAlreadyLogged) return;

    const durationMs =
      Number(process.hrtime.bigint() - startedAt) / 1_000_000;
    const details = {
      requestId,
      method: req.method,
      path: `${req.baseUrl}${req.path}`,
      status: res.statusCode,
      durationMs: Number(durationMs.toFixed(2)),
      error: responseError,
      userId: req.user?._id?.toString(),
    };

    if (res.statusCode >= 500) {
      logger.error("api_request_failed", details);
    } else {
      logger.warn("api_request_rejected", details);
    }
  });

  next();
};

export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
    requestId: req.requestId,
  });
};

export const errorHandler = (error, req, res, _next) => {
  const status =
    Number.isInteger(error.status) && error.status >= 400
      ? error.status
      : 500;

  logger.error("unhandled_api_error", {
    requestId: req.requestId,
    method: req.method,
    path: `${req.baseUrl}${req.path}`,
    status,
    error,
  });
  res.locals.errorAlreadyLogged = true;

  if (res.headersSent) return _next(error);

  res.status(status).json({
    success: false,
    message: status >= 500 ? "Internal server error" : error.message,
    requestId: req.requestId,
  });
};
