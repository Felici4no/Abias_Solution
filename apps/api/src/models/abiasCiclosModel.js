import { query } from "../database/postgresDatabase.js";
import { findAbiasMembro, updateAbiasMembroReputacao } from "./abiasMembrosModel.js";

function rowToCiclo(row) {
  return {
    id: row.id,
    membroId: row.membro_id,
    valor: Number(row.valor),
    finalidade: row.finalidade,
    prazo: row.prazo_dias,
    oficina: row.oficina_parceira,
    urgencia: row.urgencia,
    descricao: row.descricao || "",
    estado: row.estado,
    avais: row.avais,
    evidencia: row.evidencia,
    oficinaConfirmacao: row.oficina_confirmacao,
    justificativa: row.justificativa || "",
    criadoEm: row.criado_em,
    atualizadoEm: row.atualizado_em
  };
}

// --- Fundo helpers ---

export async function getFundoSaldo() {
  const result = await query(`SELECT saldo FROM abias_fundo LIMIT 1`);
  return result.rows.length > 0 ? Number(result.rows[0].saldo) : 4820;
}

async function adjustFundo(delta) {
  const result = await query(
    `UPDATE abias_fundo SET saldo = GREATEST(0, saldo + $1), atualizado_em = NOW() RETURNING saldo`,
    [delta]
  );
  return Number(result.rows[0].saldo);
}

// --- Ciclo CRUD ---

export async function createCiclo(payload) {
  if (!payload || typeof payload !== "object") {
    return { ok: false, statusCode: 400, error: "Dados inválidos", fields: { body: "Body deve ser JSON válido" } };
  }

  const fields = {};
  if (!payload.membroId) fields.membroId = "Membro é obrigatório";
  if (!payload.valor || isNaN(Number(payload.valor))) fields.valor = "Valor é obrigatório";
  if (!payload.finalidade) fields.finalidade = "Finalidade é obrigatória";
  if (!payload.prazo) fields.prazo = "Prazo é obrigatório";
  if (!payload.oficina) fields.oficina = "Oficina é obrigatória";
  if (!payload.urgencia) fields.urgencia = "Urgência é obrigatória";

  if (Object.keys(fields).length > 0) {
    return { ok: false, statusCode: 400, error: "Dados inválidos", fields };
  }

  const membro = await findAbiasMembro(payload.membroId);
  if (!membro) return { ok: false, statusCode: 404, error: "Membro não encontrado" };

  const result = await query(
    `INSERT INTO abias_ciclos (membro_id, valor, finalidade, prazo_dias, oficina_parceira, urgencia, descricao)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
    [
      payload.membroId,
      Number(payload.valor),
      String(payload.finalidade),
      parseInt(payload.prazo, 10),
      String(payload.oficina),
      String(payload.urgencia),
      String(payload.descricao || "")
    ]
  );

  const ciclo = rowToCiclo(result.rows[0]);
  const fundo = await getFundoSaldo();
  return { ok: true, ciclo, reputacao: membro.reputacao, fundo };
}

export async function findCicloById(id) {
  const result = await query(`SELECT * FROM abias_ciclos WHERE id = $1`, [id]);
  return result.rows.length > 0 ? rowToCiclo(result.rows[0]) : null;
}

export async function findCicloAtivoPorMembro(membroId) {
  const result = await query(
    `SELECT * FROM abias_ciclos
     WHERE membro_id = $1 AND estado NOT IN ('completed', 'rejected')
     ORDER BY criado_em DESC LIMIT 1`,
    [membroId]
  );
  return result.rows.length > 0 ? rowToCiclo(result.rows[0]) : null;
}

// --- Transições de estado ---

export async function atualizarEstado(cicloId, novoEstado, justificativa) {
  const cicloResult = await query(`SELECT * FROM abias_ciclos WHERE id = $1`, [cicloId]);
  if (cicloResult.rows.length === 0) return { ok: false, statusCode: 404, error: "Ciclo não encontrado" };
  const ciclo = rowToCiclo(cicloResult.rows[0]);

  const membro = await findAbiasMembro(ciclo.membroId);
  if (!membro) return { ok: false, statusCode: 404, error: "Membro não encontrado" };

  let estadoFinal = novoEstado;
  let reputacaoDelta = 0;
  let fundoDelta = 0;

  if (novoEstado === "approved") {
    estadoFinal = "evidence_pending";
    fundoDelta = 34;
  } else if (novoEstado === "rejected") {
    if (!justificativa) return { ok: false, statusCode: 400, error: "Justificativa obrigatória para recusa" };
    reputacaoDelta = -30;
  } else if (novoEstado === "needs_revision") {
    if (!justificativa) return { ok: false, statusCode: 400, error: "Justificativa obrigatória para revisão" };
  } else if (novoEstado === "completed") {
    reputacaoDelta = 25;
  }

  const updated = await query(
    `UPDATE abias_ciclos SET estado = $1, justificativa = COALESCE($2, justificativa), atualizado_em = NOW()
     WHERE id = $3 RETURNING *`,
    [estadoFinal, justificativa || null, cicloId]
  );

  let reputacao = membro.reputacao;
  if (reputacaoDelta !== 0) {
    const membroAtualizado = await updateAbiasMembroReputacao(ciclo.membroId, reputacaoDelta);
    reputacao = membroAtualizado.reputacao;
  }

  let fundo = await getFundoSaldo();
  if (fundoDelta !== 0) {
    fundo = await adjustFundo(fundoDelta);
  }

  return { ok: true, ciclo: rowToCiclo(updated.rows[0]), reputacao, fundo };
}

// --- Avais comunitários ---

export async function registrarAval(cicloId, avaliadoPor, comentario) {
  const cicloResult = await query(`SELECT * FROM abias_ciclos WHERE id = $1`, [cicloId]);
  if (cicloResult.rows.length === 0) return { ok: false, statusCode: 404, error: "Ciclo não encontrado" };
  const ciclo = rowToCiclo(cicloResult.rows[0]);

  if (!["marcos", "aline"].includes(avaliadoPor)) {
    return { ok: false, statusCode: 400, error: "Avaliador inválido. Use 'marcos' ou 'aline'" };
  }

  const membro = await findAbiasMembro(ciclo.membroId);

  const novosAvais = { ...ciclo.avais };
  novosAvais[avaliadoPor] = "approved";
  novosAvais[`${avaliadoPor}Comment`] = String(comentario || "");

  let novoEstado = ciclo.estado;
  let reputacaoDelta = 0;

  if (novosAvais.marcos === "approved" && novosAvais.aline === "approved") {
    novoEstado = "partner_quote";
    reputacaoDelta = 10;
  }

  const updated = await query(
    `UPDATE abias_ciclos SET avais = $1, estado = $2, atualizado_em = NOW() WHERE id = $3 RETURNING *`,
    [JSON.stringify(novosAvais), novoEstado, cicloId]
  );

  let reputacao = membro.reputacao;
  if (reputacaoDelta !== 0) {
    const membroAtualizado = await updateAbiasMembroReputacao(ciclo.membroId, reputacaoDelta);
    reputacao = membroAtualizado.reputacao;
  }

  return { ok: true, ciclo: rowToCiclo(updated.rows[0]), reputacao, fundo: await getFundoSaldo() };
}

// --- Evidências ---

export async function registrarEvidencia(cicloId, arquivo, observacao, tipo) {
  const cicloResult = await query(`SELECT * FROM abias_ciclos WHERE id = $1`, [cicloId]);
  if (cicloResult.rows.length === 0) return { ok: false, statusCode: 404, error: "Ciclo não encontrado" };
  const ciclo = rowToCiclo(cicloResult.rows[0]);

  if (!arquivo) return { ok: false, statusCode: 400, error: "Arquivo é obrigatório" };

  const novaEvidencia = {
    file: String(arquivo),
    obs: String(observacao || ""),
    status: "sent",
    type: String(tipo || "")
  };

  const updated = await query(
    `UPDATE abias_ciclos SET evidencia = $1, estado = 'evidence_review', atualizado_em = NOW()
     WHERE id = $2 RETURNING *`,
    [JSON.stringify(novaEvidencia), cicloId]
  );

  const membroAtualizado = await updateAbiasMembroReputacao(ciclo.membroId, 20);

  return { ok: true, ciclo: rowToCiclo(updated.rows[0]), reputacao: membroAtualizado.reputacao, fundo: await getFundoSaldo() };
}

// --- Confirmações da oficina ---

export async function registrarConfirmacaoOficina(cicloId, tipo) {
  const cicloResult = await query(`SELECT * FROM abias_ciclos WHERE id = $1`, [cicloId]);
  if (cicloResult.rows.length === 0) return { ok: false, statusCode: 404, error: "Ciclo não encontrado" };
  const ciclo = rowToCiclo(cicloResult.rows[0]);

  const membro = await findAbiasMembro(ciclo.membroId);

  const novaConfirmacao = { ...ciclo.oficinaConfirmacao };
  let novoEstado = ciclo.estado;
  let reputacaoDelta = 0;
  let fundoDelta = 0;

  if (tipo === "orcamento") {
    novaConfirmacao.quoteConfirmed = true;
    novoEstado = "under_review";
    reputacaoDelta = 15;
  } else if (tipo === "servico") {
    novaConfirmacao.serviceConfirmed = true;
    novoEstado = "validated";
    fundoDelta = 34;
  } else {
    return { ok: false, statusCode: 400, error: "Tipo inválido. Use 'orcamento' ou 'servico'" };
  }

  const updated = await query(
    `UPDATE abias_ciclos SET oficina_confirmacao = $1, estado = $2, atualizado_em = NOW()
     WHERE id = $3 RETURNING *`,
    [JSON.stringify(novaConfirmacao), novoEstado, cicloId]
  );

  let reputacao = membro.reputacao;
  if (reputacaoDelta !== 0) {
    const membroAtualizado = await updateAbiasMembroReputacao(ciclo.membroId, reputacaoDelta);
    reputacao = membroAtualizado.reputacao;
  }

  let fundo = await getFundoSaldo();
  if (fundoDelta !== 0) {
    fundo = await adjustFundo(fundoDelta);
  }

  return { ok: true, ciclo: rowToCiclo(updated.rows[0]), reputacao, fundo };
}
