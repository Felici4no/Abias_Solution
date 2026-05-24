import { domainEntities } from "../models/entities/index.js";
import { sendJson } from "../views/jsonView.js";

export function listDomainEntities(_request, response) {
  return sendJson(response, 200, {
    entities: domainEntities
  });
}
