import { query } from "../database/postgresDatabase.js";

// =========================================================
// CÁLCULO DE LIMITES — isolado por tipo de crédito
// =========================================================

function calcLimites(ifood) {
  if (!ifood) return { cartao: null, emprestimo: null };

  const {
    ganhoMedioSemanal,
    avaliacaoMedia,
    taxaCancelamento,
    tempoPlatformaDias,
    scoreIfood,
    entregasRealizadas,
    diasAtivos
  } = ifood;

  // --- CARTÃO DE CRÉDITO ---
  // Reflete capacidade de consumo recorrente. Foco: consistência diária, avaliação e histórico.
  // Teto menor (R$2.000) — rotativo, requer disciplina de pagamento.

  const baseCartao = ganhoMedioSemanal * 2; // 2 semanas de renda = exposição curta

  const ratingMultCartao =
    avaliacaoMedia >= 4.8 ? 1.30
    : avaliacaoMedia >= 4.5 ? 1.15
    : avaliacaoMedia >= 4.0 ? 1.00
    : 0.85; // avaliação ruim penaliza acesso

  const consistenciaBonus = (diasAtivos / 90) * 0.15; // até +0.15 por dias ativos

  const cancelamentoPenalty =
    taxaCancelamento > 0.08 ? -0.20
    : taxaCancelamento > 0.05 ? -0.10
    : 0.00;

  const senioridadeMultCartao =
    tempoPlatformaDias >= 730 ? 1.20
    : tempoPlatformaDias >= 365 ? 1.10
    : tempoPlatformaDias >= 180 ? 1.00
    : 0.90; // menos de 180 dias = ainda provando consistência

  const rawCartao = baseCartao
    * (ratingMultCartao + consistenciaBonus + cancelamentoPenalty)
    * senioridadeMultCartao;

  const limiteCartao = Math.max(200, Math.min(2000, Math.round(rawCartao / 10) * 10));
  const cartaoDisponivel = tempoPlatformaDias >= 30;

  // --- EMPRÉSTIMO PRODUTIVO ---
  // Reflete capacidade de assumir dívida de maior volume.
  // Foco: score operacional, seniority, volume de entregas.
  // Teto maior (R$5.000) — porém com portões de acesso mais rígidos.

  const empMotivoNegado =
    tempoPlatformaDias < 90 ? "Mínimo 90 dias na plataforma"
    : scoreIfood < 300 ? "Score mínimo de 300 não atingido"
    : avaliacaoMedia < 3.8 ? "Avaliação abaixo do mínimo (3.8)"
    : null;

  if (empMotivoNegado) {
    return {
      cartao: { valor: limiteCartao, disponivel: cartaoDisponivel },
      emprestimo: { valor: 0, disponivel: false, motivo: empMotivoNegado }
    };
  }

  const baseEmprestimo = ganhoMedioSemanal * 6; // 6 semanas de renda = exposição média

  const scoreMultEmprestimo =
    scoreIfood >= 800 ? 1.50
    : scoreIfood >= 700 ? 1.30
    : scoreIfood >= 600 ? 1.10
    : scoreIfood >= 500 ? 1.00
    : scoreIfood >= 400 ? 0.85
    : 0.70;

  // Avaliação como portão de qualidade (não de volume)
  const ratingGateEmprestimo =
    avaliacaoMedia < 4.0 ? 0.80
    : avaliacaoMedia < 4.5 ? 0.95
    : 1.00;

  const senioridadeMultEmprestimo =
    tempoPlatformaDias > 730 ? 1.30
    : tempoPlatformaDias > 365 ? 1.15
    : tempoPlatformaDias > 180 ? 1.05
    : 1.00;

  // Volume alto de entregas = maior capacidade de repagamento
  const volumeBonus = entregasRealizadas > 600 ? 1.10 : 1.00;

  const rawEmprestimo = baseEmprestimo
    * scoreMultEmprestimo
    * ratingGateEmprestimo
    * senioridadeMultEmprestimo
    * volumeBonus;

  const limiteEmprestimo = Math.max(300, Math.min(5000, Math.round(rawEmprestimo / 10) * 10));

  return {
    cartao: {
      valor: limiteCartao,
      disponivel: cartaoDisponivel
    },
    emprestimo: {
      valor: limiteEmprestimo,
      disponivel: true
    }
  };
}

function calcRecomendacao(scoreIfood) {
  if (scoreIfood === null || scoreIfood === undefined) return "SEM_DADOS";
  if (scoreIfood >= 700) return "APROVAR";
  if (scoreIfood >= 500) return "ANALISAR";
  return "REVISAR";
}

// =========================================================
// QUERIES
// =========================================================

const JOIN_IFOOD = `
  FROM abias_membros m
  LEFT JOIN usuarios u
    ON m.usuario_id = u.id
  LEFT JOIN LATERAL (
    SELECT * FROM ifood_dados_operacionais
    WHERE usuario_id = u.id
    ORDER BY periodo_fim DESC
    LIMIT 1
  ) i ON u.id IS NOT NULL
  LEFT JOIN score_operacional s ON s.usuario_id = u.id
  LEFT JOIN contas c2 ON c2.usuario_id = u.id
`;

function rowToIfood(row) {
  if (!row.usuario_id) return null;
  return {
    entregasRealizadas: row.entregas_realizadas,
    diasAtivos: row.dias_ativos,
    ganhosBrutos: Number(row.ganhos_brutos),
    ganhoMedioSemanal: Number(row.ganho_medio_semanal),
    avaliacaoMedia: Number(row.avaliacao_media),
    taxaCancelamento: Number(row.taxa_cancelamento),
    tempoPlatformaDias: row.tempo_plataforma_dias,
    scoreIfood: row.score_ifood,
    classificacao: row.classificacao_ifood
  };
}

export async function getPainelGestao() {
  const result = await query(`
    SELECT
      m.id            AS membro_id,
      m.nome,
      m.telefone,
      m.reputacao,
      m.ferramenta,

      u.id            AS usuario_id,
      i.entregas_realizadas,
      i.dias_ativos,
      i.ganhos_brutos,
      i.ganho_medio_semanal,
      i.avaliacao_media,
      i.taxa_cancelamento,
      i.tempo_plataforma_dias,
      s.pontuacao     AS score_ifood,
      s.classificacao AS classificacao_ifood,

      ciclo.id        AS ciclo_id,
      ciclo.valor     AS ciclo_valor,
      ciclo.finalidade AS ciclo_finalidade,
      ciclo.estado    AS ciclo_estado,
      ciclo.urgencia  AS ciclo_urgencia

    ${JOIN_IFOOD}

    LEFT JOIN LATERAL (
      SELECT id, valor, finalidade, estado, urgencia
      FROM abias_ciclos
      WHERE membro_id = m.id
        AND estado NOT IN ('completed', 'rejected')
      ORDER BY criado_em DESC
      LIMIT 1
    ) ciclo ON true

    ORDER BY COALESCE(s.pontuacao, m.reputacao) DESC
  `);

  return result.rows.map((row) => {
    const ifood = rowToIfood(row);
    const limites = calcLimites(ifood);
    return {
      membroId: row.membro_id,
      nome: row.nome,
      telefone: row.telefone,
      reputacao: row.reputacao,
      ferramenta: row.ferramenta,
      ifood,
      recomendacao: calcRecomendacao(row.score_ifood),
      limites,
      cicloAtivo: row.ciclo_id
        ? {
            id: row.ciclo_id,
            valor: Number(row.ciclo_valor),
            finalidade: row.ciclo_finalidade,
            estado: row.ciclo_estado,
            urgencia: row.ciclo_urgencia
          }
        : null
    };
  });
}

export async function getMembroLimites(membroId) {
  const result = await query(`
    SELECT
      m.id            AS membro_id,
      m.nome,
      m.reputacao,
      m.ferramenta,
      m.regiao,
      m.tempo_atuacao,

      u.id            AS usuario_id,
      i.entregas_realizadas,
      i.dias_ativos,
      i.ganhos_brutos,
      i.ganho_medio_semanal,
      i.avaliacao_media,
      i.taxa_cancelamento,
      i.tempo_plataforma_dias,
      s.pontuacao     AS score_ifood,
      s.classificacao AS classificacao_ifood,
      s.percentual_ranking

    ${JOIN_IFOOD}
    WHERE m.id = $1
  `, [membroId]);

  if (!result.rows[0]) return null;

  const row = result.rows[0];
  const ifood = rowToIfood(row);
  const limites = calcLimites(ifood);

  return {
    membroId: row.membro_id,
    nome: row.nome,
    reputacao: row.reputacao,
    ferramenta: row.ferramenta,
    regiao: row.regiao,
    tempoAtuacao: row.tempo_atuacao,
    scoreIfood: row.score_ifood,
    classificacaoIfood: row.classificacao_ifood,
    percentualRanking: row.percentual_ranking,
    ifood,
    limites,
    recomendacao: calcRecomendacao(row.score_ifood)
  };
}

export async function getCiclosPendentes() {
  const result = await query(`
    SELECT
      c.id            AS ciclo_id,
      c.valor,
      c.finalidade,
      c.estado,
      c.urgencia,
      c.descricao,
      c.prazo_dias,
      c.avais,
      c.criado_em,

      m.id            AS membro_id,
      m.nome,
      m.reputacao,
      m.ferramenta,

      u.id            AS usuario_id,
      i.entregas_realizadas,
      i.dias_ativos,
      i.ganhos_brutos,
      i.ganho_medio_semanal,
      i.avaliacao_media,
      i.taxa_cancelamento,
      i.tempo_plataforma_dias,
      s.pontuacao     AS score_ifood,
      s.classificacao AS classificacao_ifood

    FROM abias_ciclos c
    JOIN abias_membros m ON m.id = c.membro_id

    LEFT JOIN usuarios u
      ON m.usuario_id = u.id
    LEFT JOIN LATERAL (
      SELECT * FROM ifood_dados_operacionais
      WHERE usuario_id = u.id
      ORDER BY periodo_fim DESC
      LIMIT 1
    ) i ON u.id IS NOT NULL
    LEFT JOIN score_operacional s ON s.usuario_id = u.id

    WHERE c.estado = 'under_review'
    ORDER BY COALESCE(s.pontuacao, 0) DESC NULLS LAST, c.criado_em ASC
  `);

  return result.rows.map((row) => {
    const ifood = rowToIfood(row);
    const limites = calcLimites(ifood);
    return {
      cicloId: row.ciclo_id,
      valor: Number(row.valor),
      finalidade: row.finalidade,
      estado: row.estado,
      urgencia: row.urgencia,
      descricao: row.descricao || "",
      prazoDias: row.prazo_dias,
      avais: row.avais,
      criadoEm: row.criado_em,
      membro: {
        id: row.membro_id,
        nome: row.nome,
        reputacao: row.reputacao,
        ferramenta: row.ferramenta
      },
      ifood,
      recomendacao: calcRecomendacao(row.score_ifood),
      limites
    };
  });
}
