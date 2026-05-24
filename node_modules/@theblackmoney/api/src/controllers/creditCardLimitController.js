import { calculateCreditCardLimit } from "../models/creditCardLimitModel.js";
import { readJsonBody } from "../http/readJsonBody.js";
import { sendJson } from "../views/jsonView.js";

export async function createCreditCardLimit(request, response) {
  const body = await readJsonBody(request);
  const result = calculateCreditCardLimit(body);

  if (!result.ok) {
    return sendJson(response, result.statusCode, {
      error: result.error,
      fields: result.fields
    });
  }

  return sendJson(response, 201, {
    creditCardLimit: result.creditCardLimit
  });
}
