import { query } from "../database/postgresDatabase.js";

function rowToMembro(row) {
  return {
    id: row.id,
    nome: row.nome,
    telefone: row.telefone,
    regiao: row.regiao || "",
    tempo: row.tempo_atuacao || "",
    ferramenta: row.ferramenta,
    raca: row.raca || "",
    reputacao: row.reputacao,
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

  const result = await query(
    `INSERT INTO abias_membros (nome, telefone, regiao, tempo_atuacao, ferramenta, raca)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
    [
      nome,
      telefone,
      String(payload.regiao || "").trim() || null,
      String(payload.tempo || "").trim() || null,
      String(payload.ferramenta || "Moto").trim(),
      String(payload.raca || "").trim() || null
    ]
  );

  return { ok: true, membro: rowToMembro(result.rows[0]) };
}

export async function findAbiasMembro(id) {
  const result = await query(`SELECT * FROM abias_membros WHERE id = $1`, [id]);
  return result.rows.length > 0 ? rowToMembro(result.rows[0]) : null;
}

export async function updateAbiasMembroReputacao(id, delta) {
  const result = await query(
    `UPDATE abias_membros SET reputacao = GREATEST(0, reputacao + $1) WHERE id = $2 RETURNING *`,
    [delta, id]
  );
  return result.rows.length > 0 ? rowToMembro(result.rows[0]) : null;
}
