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
import { createAbiasMembro, getAbiasMembro, getAbiasMembroCredito } from "../controllers/abiasMembrosController.js";
import {
  createAbiasCiclo,
  getAbiasCicloAtivo,
  getAbiasCiclo,
  updateAbiasCicloEstado,
  createAbiasCicloAval,
  createAbiasCicloEvidencia,
  createAbiasCicloConfirmacao
} from "../controllers/abiasCiclosController.js";
import { getAbiasFundo } from "../controllers/abiasFundoController.js";
import { getAbiasPainelGestao, getAbiasCiclosPendentes } from "../controllers/abiasGestaoController.js";
import { getAbiasParecerAi } from "../controllers/abiasAiController.js";

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
  },

  // --- Abias Routes (todas públicas para o MVP) ---
  { method: "POST", path: "/abias/membros",                         handler: createAbiasMembro,            public: true },
  { method: "GET",  path: "/abias/membros/:id",                     handler: getAbiasMembro,               public: true },
  { method: "GET",  path: "/abias/membros/:id/credito",             handler: getAbiasMembroCredito,        public: true },
  { method: "POST", path: "/abias/ciclos",                          handler: createAbiasCiclo,             public: true },
  { method: "GET",  path: "/abias/ciclos/ativo",                    handler: getAbiasCicloAtivo,           public: true },
  { method: "GET",  path: "/abias/ciclos/:id",                      handler: getAbiasCiclo,                public: true },
  { method: "PATCH", path: "/abias/ciclos/:id/estado",              handler: updateAbiasCicloEstado,       public: true },
  { method: "POST", path: "/abias/ciclos/:id/avais",                handler: createAbiasCicloAval,         public: true },
  { method: "POST", path: "/abias/ciclos/:id/evidencias",           handler: createAbiasCicloEvidencia,    public: true },
  { method: "POST", path: "/abias/ciclos/:id/confirmacoes",         handler: createAbiasCicloConfirmacao,  public: true },
  { method: "GET",  path: "/abias/fundo",                           handler: getAbiasFundo,                public: true },
  { method: "GET",  path: "/abias/gestao/painel",                   handler: getAbiasPainelGestao,         public: true },
  { method: "GET",  path: "/abias/gestao/ciclos-pendentes",         handler: getAbiasCiclosPendentes,      public: true },
  { method: "GET",  path: "/abias/gestao/ai-analise/:id",           handler: getAbiasParecerAi,            public: true }
];
