import assert from "node:assert/strict";
import { test } from "node:test";
import { fileURLToPath } from "node:url";

process.env.LOCAL_DATABASE_PATH = fileURLToPath(
  new URL(`../data/test-db-${Date.now()}.json`, import.meta.url)
);

const { authorizeRequest } = await import("../src/auth/authModel.js");
const { applyCommunityCashback, listLocalPartners } = await import("../src/models/cashbackModel.js");
const { calculateCreditCardLimit } = await import("../src/models/creditCardLimitModel.js");
const { registerCourier, validateCourierPayload } = await import("../src/models/courierRegistrationModel.js");
const { connectDeliveryPlatformAccount } = await import("../src/models/deliveryPlatformConnectionModel.js");
const { calculateLoanPreApproval } = await import("../src/models/loanPreApprovalModel.js");
const { calculateOperationalScore } = await import("../src/models/operationalScoreEngineModel.js");
const { getMetricsSnapshot, recordHttpRequest } = await import("../src/observability/metricsModel.js");

test("validates courier registration payload", () => {
  const validation = validateCourierPayload({
    fullName: "A",
    document: "123",
    phone: "11",
    email: "not-an-email",
    city: "",
    state: "Sao Paulo"
  });

  assert.equal(validation.ok, false);
  assert.equal(validation.fields.fullName, "Full name must have at least 3 characters");
  assert.equal(validation.fields.document, "Document must contain 11 digits");
  assert.equal(validation.fields.email, "Email must be valid");
});

test("runs the core financial journey from courier onboarding to cashback", () => {
  const suffix = String(Date.now()).slice(-8);
  const created = registerCourier({
    fullName: "Camila Pereira",
    document: `321${suffix}`,
    phone: "11988887777",
    email: "camila@example.com",
    city: "Sao Paulo",
    state: "SP"
  });

  assert.equal(created.ok, true);
  assert.equal(created.courier.status, "pending_onboarding");

  const connection = connectDeliveryPlatformAccount({
    courierId: created.courier.id,
    provider: "ifood"
  });

  assert.equal(connection.ok, true);
  assert.equal(connection.connectedAccount.connectionStatus, "connected");
  assert.equal(connection.operationalSnapshot.deliveryCount30d > 0, true);

  const score = calculateOperationalScore({
    courierId: created.courier.id
  });

  assert.equal(score.ok, true);
  assert.equal(score.operationalScore.version, "operational-score-v1");
  assert.equal(score.operationalScore.score >= 0, true);

  const creditCardLimit = calculateCreditCardLimit({
    courierId: created.courier.id
  });

  assert.equal(creditCardLimit.ok, true);
  assert.equal(creditCardLimit.creditCardLimit.policyVersion, "credit-card-limit-v1");

  const loanPreApproval = calculateLoanPreApproval({
    courierId: created.courier.id
  });

  assert.equal(loanPreApproval.ok, true);
  assert.equal(loanPreApproval.loanPreApproval.policyVersion, "personal-loan-pre-approval-v1");

  const partner = listLocalPartners()[0];
  const cashback = applyCommunityCashback({
    courierId: created.courier.id,
    localPartnerId: partner.id,
    amount: 200,
    invoiceId: "invoice-test"
  });

  assert.equal(cashback.ok, true);
  assert.equal(cashback.cashback.status, "applied_to_invoice");
  assert.equal(cashback.invoiceDiscount.totalCashbackDiscount > 0, true);
});

test("authorizes requests with the configured bearer token", () => {
  assert.equal(authorizeRequest({
    headers: {
      authorization: "Bearer dev-token"
    }
  }), true);
  assert.equal(authorizeRequest({
    headers: {
      authorization: "Bearer invalid-token"
    }
  }), false);
});

test("records basic request metrics", () => {
  recordHttpRequest({
    method: "GET",
    path: "/health",
    statusCode: 200,
    durationMs: 3
  });

  const snapshot = getMetricsSnapshot();

  assert.equal(snapshot.totalRequests >= 1, true);
  assert.equal(snapshot.requestsByStatusCode["200"] >= 1, true);
  assert.equal(snapshot.requestsByRoute["GET /health"] >= 1, true);
});
