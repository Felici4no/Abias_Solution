import { createCashback } from "../controllers/cashbackController.js";
import { createCreditCardLimit } from "../controllers/creditCardLimitController.js";
import { createCourier } from "../controllers/courierController.js";
import { createDeliveryPlatformConnection } from "../controllers/deliveryPlatformController.js";
import { listDomainEntities } from "../controllers/domainController.js";
import { getHealth } from "../controllers/healthController.js";
import { listPartners } from "../controllers/localPartnerController.js";
import { createLoanPreApproval } from "../controllers/loanPreApprovalController.js";
import { getMetrics } from "../controllers/metricsController.js";
import { createOperationalScore } from "../controllers/operationalScoreController.js";

export const routes = [
  {
    method: "GET",
    path: "/health",
    handler: getHealth,
    public: true
  },
  {
    method: "GET",
    path: "/domain/entities",
    handler: listDomainEntities,
    public: true
  },
  {
    method: "GET",
    path: "/metrics",
    handler: getMetrics,
    public: true
  },
  {
    method: "POST",
    path: "/couriers",
    handler: createCourier
  },
  {
    method: "POST",
    path: "/delivery-platform-connections/mock",
    handler: createDeliveryPlatformConnection
  },
  {
    method: "POST",
    path: "/operational-scores/calculate",
    handler: createOperationalScore
  },
  {
    method: "POST",
    path: "/credit-card-limits/calculate",
    handler: createCreditCardLimit
  },
  {
    method: "POST",
    path: "/loan-pre-approvals/calculate",
    handler: createLoanPreApproval
  },
  {
    method: "GET",
    path: "/local-partners",
    handler: listPartners
  },
  {
    method: "POST",
    path: "/cashbacks/apply",
    handler: createCashback
  }
];
