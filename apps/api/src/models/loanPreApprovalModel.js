import { randomUUID } from "node:crypto";
import { findCourierById } from "./courierRegistrationModel.js";
import { findLatestOperationalScoreByCourierId } from "./operationalScoreEngineModel.js";
import { insertRecord } from "../database/localDatabase.js";

const LOAN_POLICY_VERSION = "personal-loan-pre-approval-v1";
const MIN_LOAN_AMOUNT = 300;
const MAX_LOAN_AMOUNT = 12000;
export function calculateLoanPreApproval(payload) {
  const validation = validateLoanPreApprovalPayload(payload);

  if (!validation.ok) {
    return {
      ok: false,
      statusCode: 400,
      error: "Invalid loan pre-approval payload",
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
        courierId: "Courier must be registered before loan pre-approval"
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
        operationalScore: "Calculate an operational score before loan pre-approval"
      }
    };
  }

  const decision = buildLoanDecision(operationalScore);
  const loanPreApproval = {
    id: randomUUID(),
    courierId: courier.id,
    productType: "personal_loan",
    policyVersion: LOAN_POLICY_VERSION,
    operationalScoreId: operationalScore.id,
    score: operationalScore.score,
    riskBand: operationalScore.riskBand,
    currency: "BRL",
    status: decision.status,
    approvedAmount: decision.approvedAmount,
    termMonths: decision.termMonths,
    monthlyInterestRate: decision.monthlyInterestRate,
    estimatedInstallment: decision.estimatedInstallment,
    breakdown: decision.breakdown,
    calculatedAt: new Date().toISOString()
  };

  insertRecord("loanPreApprovals", loanPreApproval);

  return {
    ok: true,
    loanPreApproval
  };
}

export function validateLoanPreApprovalPayload(payload) {
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

function buildLoanDecision(operationalScore) {
  if (operationalScore.score < 550) {
    return rejectedDecision(operationalScore);
  }

  const monthlyIncomeProxy = operationalScore.inputs.averageWeeklyEarnings * 4;
  const exposureMultiplier = loanExposureMultiplier(operationalScore.score);
  const rawAmount = monthlyIncomeProxy * exposureMultiplier;
  const approvedAmount = Math.max(
    MIN_LOAN_AMOUNT,
    Math.min(MAX_LOAN_AMOUNT, roundToNearestHundred(rawAmount))
  );
  const termMonths = defineTermMonths(operationalScore.score);
  const monthlyInterestRate = defineMonthlyInterestRate(operationalScore.score);
  const estimatedInstallment = calculateInstallment(approvedAmount, monthlyInterestRate, termMonths);

  return {
    status: "pre_approved",
    approvedAmount,
    termMonths,
    monthlyInterestRate,
    estimatedInstallment,
    breakdown: buildApprovalBreakdown({
      operationalScore,
      monthlyIncomeProxy,
      exposureMultiplier,
      approvedAmount,
      termMonths,
      monthlyInterestRate,
      estimatedInstallment
    })
  };
}

function rejectedDecision(operationalScore) {
  return {
    status: "rejected",
    approvedAmount: 0,
    termMonths: 0,
    monthlyInterestRate: 0,
    estimatedInstallment: 0,
    breakdown: {
      eligibility: {
        score: operationalScore.score,
        minimumScore: 550,
        reason: "Score operacional abaixo do minimo para emprestimo pessoal."
      }
    }
  };
}

function buildApprovalBreakdown({
  operationalScore,
  monthlyIncomeProxy,
  exposureMultiplier,
  approvedAmount,
  termMonths,
  monthlyInterestRate,
  estimatedInstallment
}) {
  return {
    incomeProxy: {
      weeklyEarnings: operationalScore.inputs.averageWeeklyEarnings,
      estimatedMonthlyIncome: roundMoney(monthlyIncomeProxy),
      reason: "Usa ganhos semanais medios como proxy de renda mensal recorrente."
    },
    riskPolicy: {
      score: operationalScore.score,
      riskBand: operationalScore.riskBand,
      exposureMultiplier,
      monthlyInterestRate,
      termMonths,
      reason: "Score define exposicao, prazo e taxa mensal da pre-aprovacao."
    },
    affordability: {
      approvedAmount,
      estimatedInstallment,
      installmentToIncomeRatio: roundPercentage(estimatedInstallment / monthlyIncomeProxy),
      reason: "Monitora se a parcela estimada cabe na renda operacional observada."
    }
  };
}

function loanExposureMultiplier(score) {
  if (score >= 850) {
    return 2;
  }

  if (score >= 750) {
    return 1.5;
  }

  if (score >= 650) {
    return 1;
  }

  return 0.6;
}

function defineTermMonths(score) {
  if (score >= 750) {
    return 12;
  }

  if (score >= 650) {
    return 9;
  }

  return 6;
}

function defineMonthlyInterestRate(score) {
  if (score >= 850) {
    return 0.029;
  }

  if (score >= 750) {
    return 0.039;
  }

  if (score >= 650) {
    return 0.049;
  }

  return 0.059;
}

function calculateInstallment(amount, monthlyInterestRate, termMonths) {
  const factor = (monthlyInterestRate * (1 + monthlyInterestRate) ** termMonths)
    / ((1 + monthlyInterestRate) ** termMonths - 1);

  return roundMoney(amount * factor);
}

function roundToNearestHundred(value) {
  return Math.round(value / 100) * 100;
}

function roundMoney(value) {
  return Number(value.toFixed(2));
}

function roundPercentage(value) {
  return Number(value.toFixed(2));
}
