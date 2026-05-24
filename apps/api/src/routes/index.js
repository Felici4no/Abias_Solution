import { getHealth } from "../controllers/healthController.js";

export const routes = [
  {
    method: "GET",
    path: "/health",
    handler: getHealth
  }
];
