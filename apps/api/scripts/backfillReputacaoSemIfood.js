import { loadEnv } from '../src/config/env.js'
import { query } from '../src/database/postgresDatabase.js'

loadEnv()

async function main() {
  try {
    const before = await query(`
      SELECT COUNT(*)::int AS total
      FROM abias_membros m
      LEFT JOIN usuarios u ON m.usuario_id = u.id
      LEFT JOIN ifood_dados_operacionais i ON i.usuario_id = u.id
      WHERE i.usuario_id IS NULL AND m.reputacao <> 0
    `)

    console.log('Membros sem iFood com reputacao != 0:', before.rows[0].total)

    const update = await query(`
      UPDATE abias_membros m
      SET reputacao = 0
      WHERE m.reputacao <> 0
        AND (
          m.usuario_id IS NULL
          OR NOT EXISTS (
            SELECT 1
            FROM ifood_dados_operacionais i
            WHERE i.usuario_id = m.usuario_id
          )
        )
      RETURNING m.id, m.nome, m.reputacao
    `)

    console.log('Atualizados:', update.rows.length)

    const after = await query(`
      SELECT COUNT(*)::int AS total
      FROM abias_membros m
      LEFT JOIN usuarios u ON m.usuario_id = u.id
      LEFT JOIN ifood_dados_operacionais i ON i.usuario_id = u.id
      WHERE i.usuario_id IS NULL AND m.reputacao <> 0
    `)

    console.log('Restantes sem iFood com reputacao != 0:', after.rows[0].total)
  } catch (err) {
    console.error('Erro:', err.message)
  }
}

main().then(() => process.exit(0))
