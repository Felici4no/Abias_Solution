import { getCiclosPendentes, getPainelGestao } from "../models/abiasGestaoModel.js";
import { sendJson } from "../views/jsonView.js";

export async function getAbiasPainelGestao(_request, response) {
  const membros = await getPainelGestao();
  return sendJson(response, 200, { membros });
}

export async function getAbiasCiclosPendentes(_request, response) {
  const ciclos = await getCiclosPendentes();
  return sendJson(response, 200, { ciclos });
}
