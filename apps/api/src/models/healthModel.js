export function buildHealthStatus() {
  return {
    status: "ok",
    service: "theblackmoney-api",
    timestamp: new Date().toISOString()
  };
}
