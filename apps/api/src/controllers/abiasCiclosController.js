import { readJsonBody } from "../http/readJsonBody.js";
import {
  atualizarEstado,
  createCiclo,
  findCicloAtivoPorMembro,
  findCicloById,
  registrarAval,
  registrarConfirmacaoOficina,
  registrarEvidencia
} from "../models/abiasCiclosModel.js";
import { sendJson } from "../views/jsonView.js";

export async function createAbiasCiclo(request, response) {
  const body = await readJsonBody(request);
  const result = await createCiclo(body);

  if (!result.ok) {
    return sendJson(response, result.statusCode, { error: result.error, fields: result.fields });
  }

  return sendJson(response, 201, { ciclo: result.ciclo, reputacao: result.reputacao, fundo: result.fundo });
}

export async function getAbiasCicloAtivo(request, response) {
  const requestUrl = new URL(request.url, "http://localhost");
  const membroId = requestUrl.searchParams.get("membroId");

  if (!membroId) return sendJson(response, 400, { error: "membroId é obrigatório" });

  const ciclo = await findCicloAtivoPorMembro(membroId);
  return sendJson(response, 200, { ciclo: ciclo ?? null });
}

export async function getAbiasCiclo(request, response) {
  const id = request.params?.id;
  if (!id) return sendJson(response, 400, { error: "ID obrigatório" });

  const ciclo = await findCicloById(id);
  if (!ciclo) return sendJson(response, 404, { error: "Ciclo não encontrado" });

  return sendJson(response, 200, { ciclo });
}

export async function updateAbiasCicloEstado(request, response) {
  const cicloId = request.params?.id;
  if (!cicloId) return sendJson(response, 400, { error: "ID obrigatório" });

  const body = await readJsonBody(request);
  const result = await atualizarEstado(cicloId, body.estado, body.justificativa);

  if (!result.ok) {
    return sendJson(response, result.statusCode, { error: result.error });
  }

  return sendJson(response, 200, { ciclo: result.ciclo, reputacao: result.reputacao, fundo: result.fundo });
}

export async function createAbiasCicloAval(request, response) {
  const cicloId = request.params?.id;
  if (!cicloId) return sendJson(response, 400, { error: "ID obrigatório" });

  const body = await readJsonBody(request);
  const result = await registrarAval(cicloId, body.avaliadoPor, body.comentario);

  if (!result.ok) {
    return sendJson(response, result.statusCode, { error: result.error });
  }

  return sendJson(response, 200, { ciclo: result.ciclo, reputacao: result.reputacao, fundo: result.fundo });
}

export async function createAbiasCicloEvidencia(request, response) {
  const cicloId = request.params?.id;
  if (!cicloId) return sendJson(response, 400, { error: "ID obrigatório" });

  const body = await readJsonBody(request);
  const result = await registrarEvidencia(cicloId, body.arquivo, body.observacao, body.tipo);

  if (!result.ok) {
    return sendJson(response, result.statusCode, { error: result.error });
  }

  return sendJson(response, 200, { ciclo: result.ciclo, reputacao: result.reputacao, fundo: result.fundo });
}

export async function createAbiasCicloConfirmacao(request, response) {
  const cicloId = request.params?.id;
  if (!cicloId) return sendJson(response, 400, { error: "ID obrigatório" });

  const body = await readJsonBody(request);
  const result = await registrarConfirmacaoOficina(cicloId, body.tipo);

  if (!result.ok) {
    return sendJson(response, result.statusCode, { error: result.error });
  }

  return sendJson(response, 200, { ciclo: result.ciclo, reputacao: result.reputacao, fundo: result.fundo });
}
