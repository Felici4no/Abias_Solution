import { loadEnv } from "../config/env.js";

let pool;

export async function query(sql, params = []) {
  const client = await getPool();
  return client.query(sql, params);
}

export async function checkDatabaseConnection() {
  if (!hasDatabaseUrl()) {
    return {
      enabled: false,
      status: "not_configured"
    };
  }

  try {
    const result = await query("select now() as current_time");

    return {
      enabled: true,
      status: "ok",
      currentTime: result.rows[0].current_time
    };
  } catch (error) {
    return {
      enabled: true,
      status: "error",
      error: error.message
    };
  }
}

export function hasDatabaseUrl() {
  loadEnv();
  return Boolean(process.env.DATABASE_URL);
}

export async function closeDatabaseConnection() {
  if (!pool) {
    return;
  }

  await pool.end();
  pool = undefined;
}

async function getPool() {
  loadEnv();

  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured");
  }

  if (!pool) {
    const { Pool } = await import("pg");
    pool = new Pool({
      connectionString: process.env.DATABASE_URL
    });
  }

  return pool;
}
