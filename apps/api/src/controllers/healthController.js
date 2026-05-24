import { buildHealthStatus } from "../models/healthModel.js";
import { sendJson } from "../views/jsonView.js";

export function getHealth(_request, response) {
  return sendJson(response, 200, buildHealthStatus());
}
