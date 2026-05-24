import { randomUUID } from "node:crypto";
import { findCourierById } from "./courierRegistrationModel.js";

const connectedAccounts = [];
const supportedProviders = ["ifood", "99"];

export function connectDeliveryPlatformAccount(payload) {
  const validation = validateConnectionPayload(payload);

  if (!validation.ok) {
    return {
      ok: false,
      statusCode: 400,
      error: "Invalid delivery platform connection payload",
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
        courierId: "Courier must be registered before connecting a platform account"
      }
    };
  }

  const provider = normalizeProvider(payload.provider);
  const alreadyConnected = connectedAccounts.some((account) => {
    return account.courierId === courier.id && account.provider === provider;
  });

  if (alreadyConnected) {
    return {
      ok: false,
      statusCode: 409,
      error: "Delivery platform account already connected",
      fields: {
        provider: "Provider already connected for this courier"
      }
    };
  }

  const now = new Date().toISOString();
  const connectedAccount = {
    id: randomUUID(),
    courierId: courier.id,
    provider,
    providerAccountId: buildProviderAccountId(courier.id, provider),
    connectionStatus: "connected",
    lastSyncedAt: now,
    createdAt: now,
    updatedAt: now
  };
  const operationalSnapshot = buildOperationalSnapshot(courier, connectedAccount);

  connectedAccounts.push({
    ...connectedAccount,
    operationalSnapshot
  });

  return {
    ok: true,
    connectedAccount,
    operationalSnapshot
  };
}

export function validateConnectionPayload(payload) {
  if (!payload || typeof payload !== "object" || payload._invalidJson) {
    return {
      ok: false,
      fields: {
        body: "Body must be a valid JSON object"
      }
    };
  }

  const fields = {};
  const provider = normalizeProvider(payload.provider);

  if (typeof payload.courierId !== "string" || payload.courierId.trim().length === 0) {
    fields.courierId = "Courier id is required";
  }

  if (!supportedProviders.includes(provider)) {
    fields.provider = "Provider must be one of: ifood, 99";
  }

  return {
    ok: Object.keys(fields).length === 0,
    fields
  };
}

function normalizeProvider(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toLowerCase();
}

function buildProviderAccountId(courierId, provider) {
  return `${provider}_${courierId.slice(0, 8)}`;
}

function buildOperationalSnapshot(courier, connectedAccount) {
  const seed = createSeed(`${courier.id}:${connectedAccount.provider}`);
  const activeDays30d = 10 + (seed % 18);
  const deliveryCount30d = activeDays30d * (4 + (seed % 7));
  const averageWeeklyEarnings = 450 + (seed % 950);
  const averageRating = Number((4 + (seed % 10) / 10).toFixed(1));
  const platformTenureDays = 90 + (seed % 900);
  const cancellationRate = Number(((seed % 9) / 100).toFixed(2));

  return {
    provider: connectedAccount.provider,
    deliveryCount30d,
    activeDays30d,
    averageWeeklyEarnings,
    averageRating,
    platformTenureDays,
    cancellationRate,
    sampledAt: connectedAccount.lastSyncedAt
  };
}

function createSeed(value) {
  return Array.from(value).reduce((total, character) => {
    return total + character.charCodeAt(0);
  }, 0);
}
