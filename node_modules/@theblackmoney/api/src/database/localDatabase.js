import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const databasePath = process.env.LOCAL_DATABASE_PATH
  ?? fileURLToPath(new URL("../../data/local-db.json", import.meta.url));

const initialState = {
  schemaVersion: 1,
  couriers: [],
  connectedAccounts: [],
  operationalScores: [],
  creditCardLimits: [],
  loanPreApprovals: [],
  localPartners: [],
  transactions: [],
  cashbacks: [],
  invoices: []
};

export function insertRecord(collectionName, record) {
  const database = readDatabase();
  database[collectionName].push(record);
  writeDatabase(database);
  return record;
}

export function findRecord(collectionName, predicate) {
  return readCollection(collectionName).find(predicate);
}

export function filterRecords(collectionName, predicate) {
  return readCollection(collectionName).filter(predicate);
}

export function findLastRecord(collectionName, predicate) {
  return readCollection(collectionName).findLast(predicate);
}

export function readCollection(collectionName) {
  const database = readDatabase();
  return database[collectionName] ?? [];
}

export function ensureSeedRecords(collectionName, records) {
  const database = readDatabase();

  if (database[collectionName].length > 0) {
    return database[collectionName];
  }

  database[collectionName] = records;
  writeDatabase(database);
  return records;
}

function readDatabase() {
  ensureDatabaseFile();

  const database = JSON.parse(readFileSync(databasePath, "utf8"));
  return {
    ...initialState,
    ...database
  };
}

function writeDatabase(database) {
  mkdirSync(dirname(databasePath), {
    recursive: true
  });
  writeFileSync(databasePath, `${JSON.stringify(database, null, 2)}\n`);
}

function ensureDatabaseFile() {
  if (existsSync(databasePath)) {
    return;
  }

  writeDatabase(initialState);
}
