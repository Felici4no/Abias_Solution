import { randomUUID } from "node:crypto";
import { findRecord, insertRecord } from "../database/localDatabase.js";

export function registerCourier(payload) {
  const validation = validateCourierPayload(payload);

  if (!validation.ok) {
    return {
      ok: false,
      statusCode: 400,
      error: "Invalid courier payload",
      fields: validation.fields
    };
  }

  const normalizedDocument = onlyDigits(payload.document);
  const alreadyRegistered = findRecord("couriers", (courier) => {
    return courier.document === normalizedDocument;
  });

  if (alreadyRegistered) {
    return {
      ok: false,
      statusCode: 409,
      error: "Courier already registered",
      fields: {
        document: "Document already exists"
      }
    };
  }

  const now = new Date().toISOString();
  const courier = {
    id: randomUUID(),
    fullName: normalizeText(payload.fullName),
    document: normalizedDocument,
    phone: onlyDigits(payload.phone),
    email: normalizeOptionalEmail(payload.email),
    city: normalizeText(payload.city),
    state: normalizeState(payload.state),
    status: "pending_onboarding",
    createdAt: now,
    updatedAt: now
  };

  insertRecord("couriers", courier);

  return {
    ok: true,
    courier
  };
}

export function findCourierById(courierId) {
  return findRecord("couriers", (courier) => {
    return courier.id === courierId;
  });
}

export function validateCourierPayload(payload) {
  if (!payload || typeof payload !== "object" || payload._invalidJson) {
    return {
      ok: false,
      fields: {
        body: "Body must be a valid JSON object"
      }
    };
  }

  const fields = {};
  const fullName = normalizeText(payload.fullName);
  const document = onlyDigits(payload.document);
  const phone = onlyDigits(payload.phone);
  const email = normalizeOptionalEmail(payload.email);
  const city = normalizeText(payload.city);
  const state = normalizeState(payload.state);

  if (fullName.length < 3) {
    fields.fullName = "Full name must have at least 3 characters";
  }

  if (document.length !== 11) {
    fields.document = "Document must contain 11 digits";
  }

  if (phone.length < 10 || phone.length > 11) {
    fields.phone = "Phone must contain 10 or 11 digits";
  }

  if (payload.email && !isValidEmail(email)) {
    fields.email = "Email must be valid";
  }

  if (city.length < 2) {
    fields.city = "City is required";
  }

  if (!/^[A-Z]{2}$/.test(state)) {
    fields.state = "State must be a two-letter code";
  }

  return {
    ok: Object.keys(fields).length === 0,
    fields
  };
}

function normalizeText(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().replace(/\s+/g, " ");
}

function onlyDigits(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.replace(/\D/g, "");
}

function normalizeOptionalEmail(value) {
  if (typeof value !== "string") {
    return null;
  }

  const email = value.trim().toLowerCase();
  return email || null;
}

function normalizeState(value) {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim().toUpperCase();
}

function isValidEmail(value) {
  if (!value) {
    return true;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
