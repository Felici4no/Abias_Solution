import { randomUUID } from "node:crypto";
import { findCourierById } from "./courierRegistrationModel.js";
import { findLatestOperationalScoreByCourierId } from "./operationalScoreEngineModel.js";

const CREDIT_CARD_POLICY_VERSION = "credit-card-limit-v1";
const MIN_LIMIT = 100;
const MAX_LIMIT = 5000;
const creditCardLimits = [];

export function calculateCreditCardLimit(payload) {
  const validation = validateCreditCardLimitPayload(payload);

  if (!validation.ok) {
    return {
      ok: false,
      statusCode: 400,
      error: "Invalid credit card limit payload",
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
        courierId: "Courier must be registered before credit card limit calculation"
      }
    };
  }

  const operationalScore = findLatestOperationalScoreByCourierId(courier.id);

  if (!operationalScore) {
    return {
      ok: false,
      statusCode: 422,
      error: "Operational score required",
      fields: {
        operationalScore: "Calculate an operational score before credit card limit calculation"
      }
    };
  }

  const limitAmount = calculateLimitAmount(operationalScore);
  const creditCardLimit = {
    id: randomUUID(),
    courierId: courier.id,
    productType: "credit_card",
    policyVersion: CREDIT_CARD_POLICY_VERSION,
    operationalScoreId: operationalScore.id,
    score: operationalScore.score,
    riskBand: operationalScore.riskBand,
    currency: "BRL",
    limitAmount,
    status: defineLimitStatus(limitAmount),
    breakdown: buildLimitBreakdown(operationalScore, limitAmount),
    calculatedAt: new Date().toISOString()
  };

  creditCardLimits.push(creditCardLimit);

  return {
    ok: true,
    creditCardLimit
  };
}

export function validateCreditCardLimitPayload(payload) {
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

  return {
    ok: Object.keys(fields).length === 0,
    fields
  };
}

function calculateLimitAmount(operationalScore) {
  if (operationalScore.score < 450) {
    return 0;
  }

  const weeklyEarnings = operationalScore.inputs.averageWeeklyEarnings;
  const monthlyIncomeProxy = weeklyEarnings * 4;
  const incomeBasedLimit = monthlyIncomeProxy * scoreMultiplier(operationalScore.score);
  const roundedLimit = roundToNearestFifty(incomeBasedLimit);

  return Math.max(MIN_LIMIT, Math.min(MAX_LIMIT, roundedLimit));
}

function scoreMultiplier(score) {
  if (score >= 850) {
    return 0.75;
  }

  if (score >= 750) {
    return 0.6;
  }

  if (score >= 650) {
    return 0.45;
  }

  if (score >= 550) {
    return 0.3;
  }

  return 0.15;
}

function defineLimitStatus(limitAmount) {
  return limitAmount > 0 ? "pre_approved" : "rejected";
}

function buildLimitBreakdown(operationalScore, limitAmount) {
  return {
    incomeProxy: {
      weeklyEarnings: operationalScore.inputs.averageWeeklyEarnings,
      estimatedMonthlyIncome: roundMoney(operationalScore.inputs.averageWeeklyEarnings * 4),
      reason: "Usa ganhos semanais medios como proxy de renda mensal recorrente."
    },
    scorePolicy: {
      score: operationalScore.score,
      riskBand: operationalScore.riskBand,
      multiplier: scoreMultiplier(operationalScore.score),
      reason: "Quanto maior o score operacional, maior a parcela da renda usada para limite."
    },
    guardrails: {
      minimumLimit: MIN_LIMIT,
      maximumLimit: MAX_LIMIT,
      finalLimit: limitAmount,
      reason: "Aplica limites minimos e maximos para controlar exposicao inicial."
    }
  };
}

function roundToNearestFifty(value) {
  return Math.round(value / 50) * 50;
}

function roundMoney(value) {
  return Number(value.toFixed(2));
}
