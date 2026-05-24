import { calculateOperationalScore } from "../models/operationalScoreEngineModel.js";
import { readJsonBody } from "../http/readJsonBody.js";
import { sendJson } from "../views/jsonView.js";

export async function createOperationalScore(request, response) {
  const body = await readJsonBody(request);
  const result = calculateOperationalScore(body);

  if (!result.ok) {
    return sendJson(response, result.statusCode, {
      error: result.error,
      fields: result.fields
    });
  }

  return sendJson(response, 201, {
    operationalScore: result.operationalScore
  });
}
