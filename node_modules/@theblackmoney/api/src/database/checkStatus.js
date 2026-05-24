import { checkDatabaseConnection, query } from "./postgresDatabase.js";

try {
  const health = await checkDatabaseConnection();
  const tables = await query(
    "select count(1)::int as total from information_schema.tables where table_schema = $1",
    ["public"]
  );

  console.log(JSON.stringify({
    database: health.status,
    tables: tables.rows[0].total
  }));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
