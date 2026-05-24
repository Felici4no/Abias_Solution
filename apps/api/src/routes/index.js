import { createCourier } from "../controllers/courierController.js";
import { createDeliveryPlatformConnection } from "../controllers/deliveryPlatformController.js";
import { listDomainEntities } from "../controllers/domainController.js";
import { getHealth } from "../controllers/healthController.js";
import { createOperationalScore } from "../controllers/operationalScoreController.js";

export const routes = [
  {
    method: "GET",
    path: "/health",
    handler: getHealth
  },
  {
    method: "GET",
    path: "/domain/entities",
    handler: listDomainEntities
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
  }
];
