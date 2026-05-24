import { avaliarEAplicar } from "../models/abiasAiModel.js";
import { sendJson } from "../views/jsonView.js";

export async function avaliarMembro(request, response) {
  const membroId = request.params?.id;
  if (!membroId) return sendJson(response, 400, { error: "ID do membro é obrigatório" });

  const result = await avaliarEAplicar(membroId);

  if (!result.ok) {
    return sendJson(response, result.statusCode ?? 500, { error: result.error });
  }

  return sendJson(response, 200, { membro: result.membro, parecer: result.parecer });
}
