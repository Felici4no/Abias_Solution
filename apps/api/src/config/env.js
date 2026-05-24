import { existsSync, readFileSync } from "node:fs";
import { dirname, join, parse } from "node:path";

const envPath = findEnvPath(process.cwd());

export function loadEnv() {
  if (!envPath) {
    return;
  }

  const lines = readFileSync(envPath, "utf8").split(/\r?\n/);

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim().replace(/^["']|["']$/g, "");

    if (key && process.env[key] === undefined) {
      process.env[key] = value;
    }
  }
}

function findEnvPath(startPath) {
  let currentPath = startPath;
  const rootPath = parse(startPath).root;

  while (currentPath !== rootPath) {
    const candidate = join(currentPath, ".env");

    if (existsSync(candidate)) {
      return candidate;
    }

    currentPath = dirname(currentPath);
  }

  const rootCandidate = join(rootPath, ".env");
  return existsSync(rootCandidate) ? rootCandidate : null;
}
