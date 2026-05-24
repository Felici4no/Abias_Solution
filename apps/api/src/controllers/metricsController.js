import { getMetricsSnapshot } from "../observability/metricsModel.js";
import { sendJson } from "../views/jsonView.js";

export function getMetrics(_request, response) {
  return sendJson(response, 200, getMetricsSnapshot());
}
