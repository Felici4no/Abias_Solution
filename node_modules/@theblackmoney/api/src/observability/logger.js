export function logInfo(event, details = {}) {
  writeLog("info", event, details);
}

export function logError(event, details = {}) {
  writeLog("error", event, details);
}

function writeLog(level, event, details) {
  const logEntry = {
    level,
    event,
    service: "theblackmoney-api",
    timestamp: new Date().toISOString(),
    ...details
  };

  console.log(JSON.stringify(logEntry));
}
