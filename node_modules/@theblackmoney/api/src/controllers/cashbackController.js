import { applyCommunityCashback } from "../models/cashbackModel.js";
import { readJsonBody } from "../http/readJsonBody.js";
import { sendJson } from "../views/jsonView.js";

export async function createCashback(request, response) {
  const body = await readJsonBody(request);
  const result = applyCommunityCashback(body);

  if (!result.ok) {
    return sendJson(response, result.statusCode, {
      error: result.error,
      fields: result.fields
    });
  }

  return sendJson(response, 201, {
    transaction: result.transaction,
    cashback: result.cashback,
    invoiceDiscount: result.invoiceDiscount
  });
}
