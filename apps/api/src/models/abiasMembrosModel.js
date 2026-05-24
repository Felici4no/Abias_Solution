import { query } from "../database/postgresDatabase.js";

function rowToMembro(row) {
  return {
    id: row.id,
    nome: row.nome,
    apelido: row.apelido || null,
    telefone: row.telefone,
    regiao: row.regiao || "",
    tempo: row.tempo_atuacao || "",
    ferramenta: row.ferramenta,
    raca: row.raca || "",
    reputacao: row.reputacao,
    totalCiclos: Number(row.total_ciclos ?? 0),
    cashbackSaldo: Number(row.cashback_saldo ?? 0),
    aiParecer: row.ai_parecer || null,
    avaliadoEm: row.avaliado_em || null,
    criadoEm: row.criado_em
  };
}

export async function registerAbiasMembro(payload) {
  if (!payload || typeof payload !== "object") {
    return { ok: false, statusCode: 400, error: "Dados inválidos", fields: { body: "Body deve ser JSON válido" } };
  }

  const fields = {};
  const nome = String(payload.nome || "").trim();
  const telefone = String(payload.telefone || "").trim();

  if (nome.length < 2) fields.nome = "Nome é obrigatório";
  if (telefone.length < 8) fields.telefone = "Telefone é obrigatório";

  if (Object.keys(fields).length > 0) {
    return { ok: false, statusCode: 400, error: "Dados inválidos", fields };
  }

  const cleanPhone = telefone.replace(/\D/g, "");
  const userResult = await query(
    "SELECT id FROM usuarios WHERE REGEXP_REPLACE(telefone, '[^0-9]', '', 'g') = $1",
    [cleanPhone]
  );
  const usuarioId = userResult.rows[0]?.id || null;

  const apelido = String(payload.apelido || "").trim() || nome.split(" ")[0];

  const result = await query(
    `INSERT INTO abias_membros (nome, apelido, telefone, regiao, tempo_atuacao, ferramenta, raca, usuario_id, reputacao)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
    [
      nome,
      apelido,
      telefone,
      String(payload.regiao || "").trim() || null,
      String(payload.tempo || "").trim() || null,
      String(payload.ferramenta || "Moto").trim(),
      String(payload.raca || "").trim() || null,
      usuarioId,
      0
    ]
  );

  return { ok: true, membro: rowToMembro(result.rows[0]) };
}

export async function findAbiasMembro(id) {
  const result = await query(`SELECT * FROM abias_membros WHERE id = $1`, [id]);
  return result.rows.length > 0 ? rowToMembro(result.rows[0]) : null;
}

// Retorna o membro com todos os dados operacionais do iFood e score ranking
export async function findAbiasMembroComDados(id) {
  const result = await query(`
    SELECT
      m.id, m.nome, m.telefone, m.regiao,
      m.tempo_atuacao, m.ferramenta, m.raca, m.reputacao,
      m.cashback_saldo, m.ai_parecer, m.avaliado_em, m.criado_em,

      c.total_ciclos,

      i.entregas_realizadas,
      i.dias_ativos,
      i.ganhos_brutos,
      i.ganhos_liquidos,
      i.ganho_medio_semanal,
      i.avaliacao_media,
      i.cancelamentos,
      i.taxa_cancelamento,
      i.tempo_plataforma_dias,
      i.payload_bruto,
      i.periodo_inicio,
      i.periodo_fim,

      s.pontuacao          AS score_operacional,
      s.classificacao      AS classificacao_operacional,
      s.percentual_ranking

    FROM abias_membros m
    LEFT JOIN usuarios u
      ON m.usuario_id = u.id
    LEFT JOIN LATERAL (
      SELECT COUNT(*)::int AS total_ciclos
      FROM abias_ciclos c
      WHERE c.membro_id = m.id
    ) c ON TRUE
    LEFT JOIN LATERAL (
      SELECT * FROM ifood_dados_operacionais
      WHERE usuario_id = u.id ORDER BY periodo_fim DESC LIMIT 1
    ) i ON u.id IS NOT NULL
    LEFT JOIN score_operacional s ON s.usuario_id = u.id
    WHERE m.id = $1
  `, [id]);

  if (!result.rows.length) return null;
  const row = result.rows[0];

  const membro = rowToMembro(row);

  membro.dadosOperacionais = row.entregas_realizadas != null ? {
    entregasRealizadas:  row.entregas_realizadas,
    diasAtivos:          row.dias_ativos,
    ganhosBrutos:        Number(row.ganhos_brutos),
    ganhosLiquidos:      Number(row.ganhos_liquidos),
    ganhoMedioSemanal:   Number(row.ganho_medio_semanal),
    avaliacaoMedia:      Number(row.avaliacao_media),
    cancelamentos:       row.cancelamentos,
    taxaCancelamento:    Number(row.taxa_cancelamento),
    tempoPlatformaDias:  row.tempo_plataforma_dias,
    nivel:               row.payload_bruto?.nivel || null,
    metasBatidas:        row.payload_bruto?.metas_batidas ?? null,
    bonusPeriodo:        Number(row.payload_bruto?.bonus_periodo || 0),
    periodoInicio:       row.periodo_inicio,
    periodoFim:          row.periodo_fim,
  } : null;

  membro.rankingOperacional = row.score_operacional != null ? {
    pontuacao:       row.score_operacional,
    classificacao:   row.classificacao_operacional,
    percentilRanking: Number(row.percentual_ranking),
  } : null;

  return membro;
}

export async function updateAbiasMembroReputacao(id, delta) {
  const result = await query(
    `UPDATE abias_membros SET reputacao = GREATEST(0, reputacao + $1) WHERE id = $2 RETURNING *`,
    [delta, id]
  );
  return result.rows.length > 0 ? rowToMembro(result.rows[0]) : null;
}

export async function aplicarAvaliacaoAoMembro(id, score, parecer) {
  const result = await query(
    `UPDATE abias_membros
     SET reputacao = $1, ai_parecer = $2, avaliado_em = NOW()
     WHERE id = $3 RETURNING *`,
    [score, JSON.stringify(parecer), id]
  );
  return result.rows.length > 0 ? rowToMembro(result.rows[0]) : null;
}
