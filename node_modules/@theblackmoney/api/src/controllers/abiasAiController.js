import { gerarParecerComFallback } from "../models/abiasAiModel.js";
import { sendJson } from "../views/jsonView.js";

export async function getAbiasParecerAi(request, response) {
  const membroId = request.params?.id;
  if (!membroId) return sendJson(response, 400, { error: "ID do membro é obrigatório" });

  const result = await gerarParecerComFallback(membroId);

  if (!result.ok) {
    return sendJson(response, result.statusCode, { error: result.error, raw: result.raw });
  }

  return sendJson(response, 200, result);
}
