import { readJsonBody } from "../http/readJsonBody.js";
import { findAbiasMembro, findAbiasMembroComDados, registerAbiasMembro } from "../models/abiasMembrosModel.js";
import { getMembroLimites } from "../models/abiasGestaoModel.js";
import { sendJson } from "../views/jsonView.js";

export async function createAbiasMembro(request, response) {
  const body = await readJsonBody(request);
  const result = await registerAbiasMembro(body);

  if (!result.ok) {
    return sendJson(response, result.statusCode, { error: result.error, fields: result.fields });
  }

  return sendJson(response, 201, { membro: result.membro });
}

export async function getAbiasMembro(request, response) {
  const id = request.params?.id;
  if (!id) return sendJson(response, 400, { error: "ID obrigatório" });

  const membro = await findAbiasMembroComDados(id);
  if (!membro) return sendJson(response, 404, { error: "Membro não encontrado" });

  return sendJson(response, 200, { membro });
}

export async function getAbiasMembroCredito(request, response) {
  const id = request.params?.id;
  if (!id) return sendJson(response, 400, { error: "ID obrigatório" });

  const credito = await getMembroLimites(id);
  if (!credito) return sendJson(response, 404, { error: "Membro não encontrado" });

  return sendJson(response, 200, { credito });
}
