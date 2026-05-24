import { registerCourier } from "../models/courierRegistrationModel.js";
import { readJsonBody } from "../http/readJsonBody.js";
import { sendJson } from "../views/jsonView.js";

export async function createCourier(request, response) {
  const body = await readJsonBody(request);
  const result = registerCourier(body);

  if (!result.ok) {
    return sendJson(response, result.statusCode, {
      error: result.error,
      fields: result.fields
    });
  }

  return sendJson(response, 201, {
    courier: result.courier
  });
}
