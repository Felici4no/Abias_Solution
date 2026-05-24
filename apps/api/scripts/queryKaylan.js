import { loadEnv } from '../src/config/env.js'
import { query } from '../src/database/postgresDatabase.js'

loadEnv()

async function main() {
  try {
    const name = '%kaylan%'
    const res = await query(`SELECT m.id, m.nome, m.telefone, m.regiao, m.reputacao, u.id as usuario_id
      FROM abias_membros m
      LEFT JOIN usuarios u
        ON REGEXP_REPLACE(m.telefone, '[^0-9]', '', 'g') = u.telefone
      WHERE lower(m.nome) LIKE $1`, [name])

    console.log('Membros encontrados:', JSON.stringify(res.rows, null, 2))

    if (!res.rows.length) {
      console.log('Nenhum membro com nome parecido com Kaylan encontrado.')
      return
    }

    for (const row of res.rows) {
      if (row.usuario_id) {
        const ifood = await query(`SELECT * FROM ifood_dados_operacionais WHERE usuario_id = $1 ORDER BY periodo_fim DESC LIMIT 1`, [row.usuario_id])
        console.log('ifood (usuario_id=', row.usuario_id, '):', JSON.stringify(ifood.rows, null, 2))
      } else {
        console.log('Membro sem usuario vinculado (não é possível buscar ifood sem usuario_id).')
      }
    }
  } catch (err) {
    console.error('Erro:', err.message)
    console.error(err)
  }
}

main().then(() => process.exit(0))
