import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { authorizeRequest } from "./auth/authModel.js";
import { logError, logInfo } from "./observability/logger.js";
import { recordHttpRequest } from "./observability/metricsModel.js";
import { routes } from "./routes/index.js";
import { sendJson } from "./views/jsonView.js";

export function createApp() {
  return createServer(async (request, response) => {
    const startedAt = performance.now();
    const requestId = request.headers["x-request-id"] ?? randomUUID();
    const requestUrl = new URL(request.url, "http://localhost");
    response.setHeader("X-Request-Id", requestId);

    const route = routes.find((candidate) => {
      return candidate.method === request.method && candidate.path === requestUrl.pathname;
    });

    try {
      if (!route) {
        return sendJson(response, 404, {
          error: "Route not found",
          path: requestUrl.pathname
        });
      }

      if (!route.public && !authorizeRequest(request)) {
        return sendJson(response, 401, {
          error: "Unauthorized",
          message: "Use a valid Bearer token to access this route"
        });
      }

      return await route.handler(request, response);
    } catch (error) {
      logError("http_request_failed", {
        requestId,
        method: request.method,
        path: requestUrl.pathname,
        error: error.message
      });

      return sendJson(response, 500, {
        error: "Internal server error",
        detail: error.message
      });
    } finally {
      const durationMs = Math.round(performance.now() - startedAt);
      recordHttpRequest({
        method: request.method,
        path: requestUrl.pathname,
        statusCode: response.statusCode,
        durationMs
      });
      logInfo("http_request_completed", {
        requestId,
        method: request.method,
        path: requestUrl.pathname,
        statusCode: response.statusCode,
        durationMs
      });
    }
  });
}
