import { randomUUID } from "node:crypto";
import { createServer } from "node:http";
import { authorizeRequest } from "./auth/authModel.js";
import { logError, logInfo } from "./observability/logger.js";
import { recordHttpRequest } from "./observability/metricsModel.js";
import { routes } from "./routes/index.js";
import { sendJson } from "./views/jsonView.js";

function matchRoute(candidate, method, pathname) {
  if (candidate.method !== method) return null;
  if (candidate.path === pathname) return {};

  const candidateParts = candidate.path.split("/");
  const pathParts = pathname.split("/");
  if (candidateParts.length !== pathParts.length) return null;

  const params = {};
  for (let i = 0; i < candidateParts.length; i++) {
    if (candidateParts[i].startsWith(":")) {
      params[candidateParts[i].slice(1)] = pathParts[i];
    } else if (candidateParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

export function createApp() {
  return createServer(async (request, response) => {
    const startedAt = performance.now();
    const requestId = request.headers["x-request-id"] ?? randomUUID();
    const requestUrl = new URL(request.url, "http://localhost");
    response.setHeader("X-Request-Id", requestId);
    response.setHeader("Access-Control-Allow-Origin", "*");
    response.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE, OPTIONS");
    response.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Request-Id");

    if (request.method === "OPTIONS") {
      response.writeHead(204);
      return response.end();
    }

    let matchedParams = null;
    const route = routes.find((candidate) => {
      const params = matchRoute(candidate, request.method, requestUrl.pathname);
      if (params !== null) { matchedParams = params; return true; }
      return false;
    });
    if (route && matchedParams) request.params = matchedParams;

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
