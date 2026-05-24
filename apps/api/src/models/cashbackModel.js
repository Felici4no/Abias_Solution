import { randomUUID } from "node:crypto";
import { findCourierById } from "./courierRegistrationModel.js";
import { ensureSeedRecords, findRecord, insertRecord, readCollection } from "../database/localDatabase.js";

const CASHBACK_POLICY_VERSION = "community-cashback-v1";
const DEFAULT_INVOICE_ID = "next-open-invoice";
const seedPartners = [
  {
    id: "partner-mercado-quilombo",
    tradeName: "Mercado Quilombo",
    category: "grocery",
    neighborhood: "Capao Redondo",
    city: "Sao Paulo",
    state: "SP",
    cashbackRate: 0.06,
    status: "active"
  },
  {
    id: "partner-padaria-ubuntu",
    tradeName: "Padaria Ubuntu",
    category: "bakery",
    neighborhood: "Cidade Tiradentes",
    city: "Sao Paulo",
    state: "SP",
    cashbackRate: 0.04,
    status: "active"
  },
  {
    id: "partner-auto-corre",
    tradeName: "Auto Corre Periferia",
    category: "maintenance",
    neighborhood: "Brasilândia",
    city: "Sao Paulo",
    state: "SP",
    cashbackRate: 0.08,
    status: "active"
  }
];

export function listLocalPartners() {
  return ensureSeedRecords("localPartners", seedPartners);
}

export function applyCommunityCashback(payload) {
  const validation = validateCashbackPayload(payload);

  if (!validation.ok) {
    return {
      ok: false,
      statusCode: 400,
      error: "Invalid cashback payload",
      fields: validation.fields
    };
  }

  const courier = findCourierById(payload.courierId);

  if (!courier) {
    return {
      ok: false,
      statusCode: 404,
      error: "Courier not found",
      fields: {
        courierId: "Courier must be registered before cashback calculation"
      }
    };
  }

  const localPartner = findActivePartner(payload.localPartnerId);

  if (!localPartner) {
    return {
      ok: false,
      statusCode: 404,
      error: "Local partner not found",
      fields: {
        localPartnerId: "Partner must exist and be active"
      }
    };
  }

  const now = new Date().toISOString();
  const amount = normalizeMoney(payload.amount);
  const cashbackAmount = roundMoney(amount * localPartner.cashbackRate);
  const invoiceId = normalizeInvoiceId(payload.invoiceId);
  const transaction = insertRecord("transactions", {
    id: randomUUID(),
    courierId: courier.id,
    localPartnerId: localPartner.id,
    amount,
    currency: "BRL",
    category: localPartner.category,
    status: "settled",
    occurredAt: now
  });
  const cashback = insertRecord("cashbacks", {
    id: randomUUID(),
    courierId: courier.id,
    transactionId: transaction.id,
    amount: cashbackAmount,
    currency: "BRL",
    status: "applied_to_invoice",
    invoiceId,
    policyVersion: CASHBACK_POLICY_VERSION,
    createdAt: now,
    appliedAt: now
  });

  return {
    ok: true,
    transaction,
    cashback,
    invoiceDiscount: buildInvoiceDiscount(courier.id, invoiceId)
  };
}

export function validateCashbackPayload(payload) {
  if (!payload || typeof payload !== "object" || payload._invalidJson) {
    return {
      ok: false,
      fields: {
        body: "Body must be a valid JSON object"
      }
    };
  }

  const fields = {};

  if (typeof payload.courierId !== "string" || payload.courierId.trim().length === 0) {
    fields.courierId = "Courier id is required";
  }

  if (typeof payload.localPartnerId !== "string" || payload.localPartnerId.trim().length === 0) {
    fields.localPartnerId = "Local partner id is required";
  }

  if (!Number.isFinite(Number(payload.amount)) || Number(payload.amount) <= 0) {
    fields.amount = "Amount must be greater than zero";
  }

  return {
    ok: Object.keys(fields).length === 0,
    fields
  };
}

function findActivePartner(localPartnerId) {
  listLocalPartners();

  return findRecord("localPartners", (partner) => {
    return partner.id === localPartnerId && partner.status === "active";
  });
}

function buildInvoiceDiscount(courierId, invoiceId) {
  const appliedCashbacks = readCollection("cashbacks").filter((cashback) => {
    return cashback.courierId === courierId
      && cashback.invoiceId === invoiceId
      && cashback.status === "applied_to_invoice";
  });
  const totalDiscount = appliedCashbacks.reduce((total, cashback) => {
    return total + cashback.amount;
  }, 0);

  return {
    invoiceId,
    currency: "BRL",
    totalCashbackDiscount: roundMoney(totalDiscount),
    appliedCashbacks: appliedCashbacks.length
  };
}

function normalizeInvoiceId(value) {
  if (typeof value !== "string" || value.trim().length === 0) {
    return DEFAULT_INVOICE_ID;
  }

  return value.trim();
}

function normalizeMoney(value) {
  return roundMoney(Number(value));
}

function roundMoney(value) {
  return Number(value.toFixed(2));
}
