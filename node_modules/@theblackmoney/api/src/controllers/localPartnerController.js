import { listLocalPartners } from "../models/cashbackModel.js";
import { sendJson } from "../views/jsonView.js";

export function listPartners(_request, response) {
  return sendJson(response, 200, {
    localPartners: listLocalPartners()
  });
}
