import { calculateLoanPreApproval } from "../models/loanPreApprovalModel.js";
import { readJsonBody } from "../http/readJsonBody.js";
import { sendJson } from "../views/jsonView.js";

export async function createLoanPreApproval(request, response) {
  const body = await readJsonBody(request);
  const result = calculateLoanPreApproval(body);

  if (!result.ok) {
    return sendJson(response, result.statusCode, {
      error: result.error,
      fields: result.fields
    });
  }

  return sendJson(response, 201, {
    loanPreApproval: result.loanPreApproval
  });
}
