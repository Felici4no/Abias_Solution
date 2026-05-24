import { loadEnv } from '../src/config/env.js'
import { query } from '../src/database/postgresDatabase.js'

loadEnv()

async function main(){
  try{
    const res = await query(`SELECT id, nome, telefone, regiao, reputacao, criado_em FROM abias_membros ORDER BY criado_em DESC LIMIT 30`)
    console.log('Últimos membros:', JSON.stringify(res.rows, null, 2))
  }catch(err){
    console.error('Erro:', err.message)
  }
}

main().then(()=>process.exit(0))
