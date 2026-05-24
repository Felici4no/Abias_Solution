import { getFundoSaldo } from "../models/abiasCiclosModel.js";
import { sendJson } from "../views/jsonView.js";

export async function getAbiasFundo(_request, response) {
  const saldo = await getFundoSaldo();
  return sendJson(response, 200, { fundo: { saldo, meta: 8000 } });
}
