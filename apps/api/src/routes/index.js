import { listDomainEntities } from "../controllers/domainController.js";
import { getHealth } from "../controllers/healthController.js";

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
  }
];
