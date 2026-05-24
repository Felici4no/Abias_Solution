CREATE TABLE couriers (
  id TEXT PRIMARY KEY,
  full_name TEXT NOT NULL,
  document TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  email TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE connected_accounts (
  id TEXT PRIMARY KEY,
  courier_id TEXT NOT NULL REFERENCES couriers(id),
  provider TEXT NOT NULL,
  provider_account_id TEXT NOT NULL,
  connection_status TEXT NOT NULL,
  operational_snapshot TEXT NOT NULL,
  last_synced_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  UNIQUE (courier_id, provider)
);

CREATE TABLE operational_scores (
  id TEXT PRIMARY KEY,
  courier_id TEXT NOT NULL REFERENCES couriers(id),
  score INTEGER NOT NULL,
  version TEXT NOT NULL,
  risk_band TEXT NOT NULL,
  inputs TEXT NOT NULL,
  breakdown TEXT NOT NULL,
  calculated_at TEXT NOT NULL
);

CREATE TABLE financial_decisions (
  id TEXT PRIMARY KEY,
  courier_id TEXT NOT NULL REFERENCES couriers(id),
  product_type TEXT NOT NULL,
  policy_version TEXT NOT NULL,
  decision_payload TEXT NOT NULL,
  calculated_at TEXT NOT NULL
);

CREATE TABLE local_partners (
  id TEXT PRIMARY KEY,
  trade_name TEXT NOT NULL,
  category TEXT NOT NULL,
  neighborhood TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  cashback_rate REAL NOT NULL,
  status TEXT NOT NULL
);

CREATE TABLE transactions (
  id TEXT PRIMARY KEY,
  courier_id TEXT NOT NULL REFERENCES couriers(id),
  local_partner_id TEXT REFERENCES local_partners(id),
  amount REAL NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  occurred_at TEXT NOT NULL
);

CREATE TABLE cashbacks (
  id TEXT PRIMARY KEY,
  courier_id TEXT NOT NULL REFERENCES couriers(id),
  transaction_id TEXT NOT NULL REFERENCES transactions(id),
  invoice_id TEXT NOT NULL,
  amount REAL NOT NULL,
  currency TEXT NOT NULL,
  status TEXT NOT NULL,
  created_at TEXT NOT NULL,
  applied_at TEXT
);
