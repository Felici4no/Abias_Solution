import { createServer } from "node:http";
import { routes } from "./routes/index.js";
import { sendJson } from "./views/jsonView.js";

export function createApp() {
  return createServer(async (request, response) => {
    const requestUrl = new URL(request.url, "http://localhost");
    const route = routes.find((candidate) => {
      return candidate.method === request.method && candidate.path === requestUrl.pathname;
    });

    if (!route) {
      return sendJson(response, 404, {
        error: "Route not found",
        path: requestUrl.pathname
      });
    }

    try {
      return await route.handler(request, response);
    } catch (error) {
      return sendJson(response, 500, {
        error: "Internal server error",
        detail: error.message
      });
    }
  });
}
