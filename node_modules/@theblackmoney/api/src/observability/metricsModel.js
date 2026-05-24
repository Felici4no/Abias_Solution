const startedAt = new Date();
const metrics = {
  totalRequests: 0,
  requestsByStatusCode: {},
  requestsByRoute: {}
};

export function recordHttpRequest({ method, path, statusCode, durationMs }) {
  metrics.totalRequests += 1;
  increment(metrics.requestsByStatusCode, String(statusCode));
  increment(metrics.requestsByRoute, `${method} ${path}`);
  metrics.lastRequest = {
    method,
    path,
    statusCode,
    durationMs,
    recordedAt: new Date().toISOString()
  };
}

export function getMetricsSnapshot() {
  return {
    service: "theblackmoney-api",
    startedAt: startedAt.toISOString(),
    uptimeSeconds: Math.round(process.uptime()),
    ...metrics
  };
}

function increment(target, key) {
  target[key] = (target[key] ?? 0) + 1;
}
