import { loadEnv } from "../config/env.js";
import { query } from "../database/postgresDatabase.js";

// =========================================================
// PARECER IA — Gemini analisa o perfil completo do membro
// e emite recomendação de crédito com critérios de equidade
// =========================================================

async function getGeminiClient() {
  loadEnv();
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY não configurada");
  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  const genai = new GoogleGenerativeAI(apiKey);
  return genai.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
}

async function buscarContextoMembro(membroId) {
  const result = await query(`
    SELECT
      m.id, m.nome, m.telefone, m.regiao,
      m.tempo_atuacao, m.ferramenta, m.raca, m.reputacao,

      u.id                  AS usuario_id,
      i.entregas_realizadas,
      i.dias_ativos,
      i.ganhos_brutos,
      i.ganho_medio_semanal,
      i.avaliacao_media,
      i.cancelamentos,
      i.taxa_cancelamento,
      i.tempo_plataforma_dias,
      i.payload_bruto,
      s.pontuacao           AS score_ifood,
      s.classificacao       AS classificacao_ifood,
      s.percentual_ranking,

      COUNT(c.id)           AS total_ciclos,
      COUNT(c.id) FILTER (WHERE c.estado = 'completed')   AS ciclos_concluidos,
      COUNT(c.id) FILTER (WHERE c.estado = 'rejected')    AS ciclos_recusados,
      COALESCE(
        jsonb_agg(jsonb_build_object(
          'estado', c.estado,
          'valor', c.valor,
          'finalidade', c.finalidade,
          'criado_em', c.criado_em
        )) FILTER (WHERE c.id IS NOT NULL),
        '[]'::jsonb
      ) AS historico_ciclos

    FROM abias_membros m
    LEFT JOIN usuarios u
      ON REGEXP_REPLACE(m.telefone, '[^0-9]', '', 'g') = u.telefone
    LEFT JOIN LATERAL (
      SELECT * FROM ifood_dados_operacionais
      WHERE usuario_id = u.id ORDER BY periodo_fim DESC LIMIT 1
    ) i ON u.id IS NOT NULL
    LEFT JOIN score_operacional s ON s.usuario_id = u.id
    LEFT JOIN abias_ciclos c ON c.membro_id = m.id

    WHERE m.id = $1
    GROUP BY m.id, u.id, i.entregas_realizadas, i.dias_ativos,
             i.ganhos_brutos, i.ganho_medio_semanal, i.avaliacao_media,
             i.cancelamentos, i.taxa_cancelamento, i.tempo_plataforma_dias,
             i.payload_bruto, s.pontuacao, s.classificacao, s.percentual_ranking
  `, [membroId]);

  return result.rows[0] || null;
}

function montarPrompt(ctx) {
  const temIfood = Boolean(ctx.usuario_id);
  const payload = ctx.payload_bruto || {};

  return `
Você é um analista de crédito da Abias, plataforma de crédito produtivo comunitário para entregadores negros e periféricos.

Sua missão é DIFERENTE de um banco tradicional. Você avalia pessoas que o sistema financeiro tradicional ignora — não por serem mau pagadores, mas porque o score tradicional não sabe ler jornadas periféricas.

PRINCÍPIOS QUE VOCÊ DEVE SEGUIR:
- Avaliações de plataformas como iFood têm viés racial documentado: notas baixas não indicam necessariamente mau desempenho
- Trabalhadores em zonas periféricas ganham menos por km e por entrega que zonas centrais: renda menor não indica menos esforço
- Taxa de cancelamento pode refletir glitches da plataforma, segurança da rota ou problemas mecânicos — o próprio problema que a Abias resolve
- Reputação comunitária (avais de pares, ciclos concluídos na Abias) vale mais do que score de plataforma como sinal de confiança
- O objetivo do crédito é PRODUTIVO: manter a ferramenta de trabalho funcionando, não consumo livre

DADOS DO MEMBRO:
Nome: ${ctx.nome}
Ferramenta: ${ctx.ferramenta}
Região: ${ctx.regiao || "não informada"}
Tempo como entregador: ${ctx.tempo_atuacao || "não informado"}
Autodeclaração racial: ${ctx.raca || "não informada"}
Reputação Abias (0-1000): ${ctx.reputacao}

HISTÓRICO NA ABIAS:
Total de ciclos: ${ctx.total_ciclos}
Ciclos concluídos com sucesso: ${ctx.ciclos_concluidos}
Ciclos recusados: ${ctx.ciclos_recusados}
Histórico: ${JSON.stringify(ctx.historico_ciclos, null, 2)}

${temIfood ? `
DADOS OPERACIONAIS IFOOD (últimos 90 dias):
Entregas realizadas: ${ctx.entregas_realizadas}
Dias ativos: ${ctx.dias_ativos} de 90
Ganhos brutos: R$ ${ctx.ganhos_brutos}
Ganho médio semanal: R$ ${Number(ctx.ganho_medio_semanal).toFixed(2)}
Avaliação média: ${ctx.avaliacao_media} / 5.0
Cancelamentos: ${ctx.cancelamentos} (${(Number(ctx.taxa_cancelamento) * 100).toFixed(1)}%)
Tempo na plataforma: ${ctx.tempo_plataforma_dias} dias
Score operacional iFood: ${ctx.score_ifood} / 1000 (classificação: ${ctx.classificacao_ifood})
Percentil no ranking: ${ctx.percentual_ranking}%
Nível: ${payload.nivel || "não informado"} | Metas batidas no período: ${payload.metas_batidas ?? "?"}
` : `
DADOS OPERACIONAIS IFOOD: Não disponíveis — analise com base nos dados da Abias e declare isso como limitação.
`}

TAREFA:
Com base nesses dados e nos princípios acima, emita um parecer de crédito.

Responda SOMENTE com um JSON válido, sem markdown, sem explicação fora do JSON, exatamente neste formato:

{
  "recomendacao": "APROVAR" | "ANALISAR" | "REVISAR" | "NEGAR",
  "limiteCartao": {
    "valor": <número inteiro em reais, 0 se não recomendado>,
    "disponivel": <true | false>,
    "justificativa": "<1-2 frases diretas>"
  },
  "limiteEmprestimo": {
    "valor": <número inteiro em reais, 0 se não recomendado>,
    "disponivel": <true | false>,
    "justificativa": "<1-2 frases diretas>"
  },
  "analise": "<3-5 frases: leitura humana do perfil, considerando equidade e contexto periférico>",
  "fatoresPositivos": ["<fator>", "<fator>"],
  "pontosAtencao": ["<ponto>"],
  "consideracaoEquidade": "<1-2 frases sobre o que o score tradicional ignoraria nesse perfil e o que a Abias enxerga>"
}
`.trim();
}

export async function gerarParecer(membroId) {
  const ctx = await buscarContextoMembro(membroId);
  if (!ctx) return { ok: false, statusCode: 404, error: "Membro não encontrado" };

  const model = await getGeminiClient();
  const prompt = montarPrompt(ctx);

  const result = await model.generateContent(prompt);
  const text = result.response.text().trim();

  // Remove possível markdown residual (```json ... ```)
  const clean = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  let parecer;
  try {
    parecer = JSON.parse(clean);
  } catch {
    return { ok: false, statusCode: 500, error: "Resposta da IA não pôde ser interpretada", raw: clean };
  }

  return {
    ok: true,
    membro: { id: ctx.id, nome: ctx.nome, reputacao: ctx.reputacao },
    parecer
  };
}

export async function gerarParecerComFallback(membroId) {
  try {
    return await gerarParecer(membroId);
  } catch (err) {
    const isQuota = err.message?.includes("429") || err.message?.includes("quota");
    return {
      ok: false,
      statusCode: isQuota ? 503 : 500,
      error: isQuota
        ? "Serviço de IA temporariamente indisponível (cota da chave Gemini esgotada ou não configurada)"
        : err.message
    };
  }
}
