import { query } from '../database/postgresDatabase.js'

export async function criarUsuario({ email, senha, role, nome }) {
  const result = await query(
    `INSERT INTO abias_usuarios (email, senha_hash, role, nome)
     VALUES ($1, crypt($2, gen_salt('bf', 10)), $3, $4)
     RETURNING id, email, role, nome, membro_id, ativo`,
    [email.toLowerCase().trim(), senha, role, nome ?? null]
  )
  return result.rows[0]
}

export async function autenticarUsuario({ email, senha }) {
  const result = await query(
    `SELECT id, email, role, nome, membro_id, ativo
     FROM abias_usuarios
     WHERE email = $1
       AND crypt($2, senha_hash) = senha_hash
       AND ativo = TRUE`,
    [email.toLowerCase().trim(), senha]
  )
  return result.rows[0] ?? null
}

export async function vincularMembro(usuarioId, membroId) {
  const result = await query(
    `UPDATE abias_usuarios
     SET membro_id = $2
     WHERE id = $1
     RETURNING id, email, role, nome, membro_id`,
    [usuarioId, membroId]
  )
  const usuario = result.rows[0] ?? null
  if (!usuario) return null

  // Tenta vincular o membro ao usuario bancario usando o email como ponte
  await query(
    `UPDATE abias_membros m
     SET usuario_id = u.id
     FROM usuarios u
     WHERE m.id = $1
       AND u.email = $2`,
    [membroId, usuario.email]
  )

  return usuario
}

export async function buscarUsuarioPorEmail(email) {
  const result = await query(
    `SELECT id, email, role, nome, membro_id, ativo
     FROM abias_usuarios WHERE email = $1`,
    [email.toLowerCase().trim()]
  )
  return result.rows[0] ?? null
}
