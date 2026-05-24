import { connectDeliveryPlatformAccount } from "../models/deliveryPlatformConnectionModel.js";
import { readJsonBody } from "../http/readJsonBody.js";
import { sendJson } from "../views/jsonView.js";

export async function createDeliveryPlatformConnection(request, response) {
  const body = await readJsonBody(request);
  const result = connectDeliveryPlatformAccount(body);

  if (!result.ok) {
    return sendJson(response, result.statusCode, {
      error: result.error,
      fields: result.fields
    });
  }

  return sendJson(response, 201, {
    connectedAccount: result.connectedAccount,
    operationalSnapshot: result.operationalSnapshot
  });
}
