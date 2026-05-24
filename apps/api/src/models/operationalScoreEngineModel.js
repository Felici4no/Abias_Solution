import { randomUUID } from "node:crypto";
import { findCourierById } from "./courierRegistrationModel.js";
import { findConnectedAccountsByCourierId } from "./deliveryPlatformConnectionModel.js";

const SCORE_ENGINE_VERSION = "operational-score-v1";
const MAX_SCORE = 1000;
const scoreWeights = {
  activityRecurrence: 250,
  deliveryVolume: 200,
  earningsPredictability: 200,
  reputation: 150,
  platformTenure: 100,
  cancellationBehavior: 100
};

const operationalScores = [];

export function calculateOperationalScore(payload) {
  const validation = validateScorePayload(payload);

  if (!validation.ok) {
    return {
      ok: false,
      statusCode: 400,
      error: "Invalid operational score payload",
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
        courierId: "Courier must be registered before score calculation"
      }
    };
  }

  const connectedAccounts = findConnectedAccountsByCourierId(courier.id);

  if (connectedAccounts.length === 0) {
    return {
      ok: false,
      statusCode: 422,
      error: "Insufficient operational data",
      fields: {
        connectedAccounts: "Connect at least one delivery platform account before score calculation"
      }
    };
  }

  const inputs = aggregateOperationalInputs(connectedAccounts);
  const breakdown = buildScoreBreakdown(inputs);
  const score = Math.min(
    MAX_SCORE,
    Math.round(Object.values(breakdown).reduce((total, item) => total + item.points, 0))
  );
  const operationalScore = {
    id: randomUUID(),
    courierId: courier.id,
    score,
    version: SCORE_ENGINE_VERSION,
    riskBand: defineRiskBand(score),
    inputs,
    breakdown,
    calculatedAt: new Date().toISOString()
  };

  operationalScores.push(operationalScore);

  return {
    ok: true,
    operationalScore
  };
}

export function findLatestOperationalScoreByCourierId(courierId) {
  return operationalScores.findLast((operationalScore) => {
    return operationalScore.courierId === courierId;
  });
}

export function validateScorePayload(payload) {
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

function aggregateOperationalInputs(connectedAccounts) {
  const snapshots = connectedAccounts.map((account) => account.operationalSnapshot);
  const totalDeliveryCount30d = sum(snapshots, "deliveryCount30d");
  const activeDays30d = Math.min(30, Math.max(...snapshots.map((snapshot) => snapshot.activeDays30d)));
  const averageWeeklyEarnings = average(snapshots, "averageWeeklyEarnings");
  const averageRating = average(snapshots, "averageRating");
  const platformTenureDays = Math.max(...snapshots.map((snapshot) => snapshot.platformTenureDays));
  const cancellationRate = average(snapshots, "cancellationRate");

  return {
    connectedProviders: connectedAccounts.map((account) => account.provider),
    deliveryCount30d: totalDeliveryCount30d,
    activeDays30d,
    averageWeeklyEarnings: roundMoney(averageWeeklyEarnings),
    averageRating: roundOneDecimal(averageRating),
    platformTenureDays,
    cancellationRate: roundPercentage(cancellationRate)
  };
}

function buildScoreBreakdown(inputs) {
  return {
    activityRecurrence: scoreComponent({
      value: inputs.activeDays30d,
      target: 24,
      weight: scoreWeights.activityRecurrence,
      reason: "Premia recorrencia de trabalho nos ultimos 30 dias."
    }),
    deliveryVolume: scoreComponent({
      value: inputs.deliveryCount30d,
      target: 180,
      weight: scoreWeights.deliveryVolume,
      reason: "Premia volume de entregas como sinal de capacidade operacional."
    }),
    earningsPredictability: scoreComponent({
      value: inputs.averageWeeklyEarnings,
      target: 1200,
      weight: scoreWeights.earningsPredictability,
      reason: "Premia ganhos semanais recorrentes como proxy de renda previsivel."
    }),
    reputation: scoreComponent({
      value: inputs.averageRating,
      target: 4.8,
      weight: scoreWeights.reputation,
      reason: "Premia avaliacao media alta nas plataformas."
    }),
    platformTenure: scoreComponent({
      value: inputs.platformTenureDays,
      target: 365,
      weight: scoreWeights.platformTenure,
      reason: "Premia tempo de atuacao como indicio de estabilidade."
    }),
    cancellationBehavior: scoreComponent({
      value: Math.max(0, 0.12 - inputs.cancellationRate),
      target: 0.12,
      weight: scoreWeights.cancellationBehavior,
      reason: "Premia baixa taxa de cancelamento."
    })
  };
}

function scoreComponent({ value, target, weight, reason }) {
  const ratio = Math.max(0, Math.min(1, value / target));

  return {
    points: Math.round(ratio * weight),
    weight,
    value,
    target,
    reason
  };
}

function defineRiskBand(score) {
  if (score >= 750) {
    return "low";
  }

  if (score >= 500) {
    return "medium";
  }

  return "high";
}

function sum(items, field) {
  return items.reduce((total, item) => total + item[field], 0);
}

function average(items, field) {
  return sum(items, field) / items.length;
}

function roundMoney(value) {
  return Number(value.toFixed(2));
}

function roundOneDecimal(value) {
  return Number(value.toFixed(1));
}

function roundPercentage(value) {
  return Number(value.toFixed(2));
}
