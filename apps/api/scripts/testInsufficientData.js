import { loadEnv } from '../src/config/env.js'
import { query } from '../src/database/postgresDatabase.js'
import { gerarParecer } from '../src/models/abiasAiModel.js'

loadEnv()

async function main() {
  try {
    const telefone = `1199${Math.floor(1000000 + Math.random() * 8999999)}`
    const nome = 'Teste Sem Dados'

    const insert = await query(`INSERT INTO abias_membros (nome, telefone, regiao, tempo_atuacao, ferramenta, raca)
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING id`, [
      nome,
      telefone,
      'Zona Leste, São Paulo',
      '1 ano',
      'Moto',
      'Preto'
    ])

    const membroId = insert.rows[0].id
    const result = await gerarParecer(membroId)

    console.log('Resultado gerarParecer:', JSON.stringify(result, null, 2))
  } catch (err) {
    console.error('Erro:', err.message)
  }
}

main().then(() => process.exit(0))
