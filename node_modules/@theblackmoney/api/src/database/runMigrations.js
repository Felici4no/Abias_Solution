import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { query } from "./postgresDatabase.js";

const migrationsPath = dirname(fileURLToPath(import.meta.url));
const migrationsDirectory = join(migrationsPath, "migrations");

export async function runMigrations() {
  if (!existsSync(migrationsDirectory)) {
    return [];
  }

  await ensureMigrationsTable();

  const files = readdirSync(migrationsDirectory)
    .filter((file) => file.endsWith(".sql"))
    .sort();
  const applied = [];

  for (const file of files) {
    if (await wasMigrationApplied(file)) {
      continue;
    }

    if (await wasLegacySchemaAlreadyApplied(file)) {
      await recordMigration(file);
      applied.push(`${file} (recorded existing schema)`);
      continue;
    }

    const sql = readFileSync(join(migrationsDirectory, file), "utf8");
    await query(sql);
    await recordMigration(file);
    applied.push(file);
  }

  return applied;
}

async function ensureMigrationsTable() {
  await query(`
    create table if not exists schema_migrations (
      filename text primary key,
      applied_at timestamp not null default now()
    )
  `);
}

async function wasMigrationApplied(filename) {
  const result = await query(
    "select filename from schema_migrations where filename = $1",
    [filename]
  );

  return result.rowCount > 0;
}

async function recordMigration(filename) {
  await query(
    "insert into schema_migrations (filename) values ($1) on conflict (filename) do nothing",
    [filename]
  );
}

async function wasLegacySchemaAlreadyApplied(filename) {
  if (filename !== "001_initial_schema.sql") {
    return false;
  }

  const result = await query(
    "select to_regclass($1) as table_name",
    ["public.usuarios"]
  );

  return Boolean(result.rows[0].table_name);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  runMigrations()
    .then((applied) => {
      console.log(`Applied migrations: ${applied.join(", ") || "none"}`);
    })
    .catch((error) => {
      console.error(error.message);
      process.exitCode = 1;
    });
}
