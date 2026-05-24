import { loadEnv } from '../src/config/env.js'
import { query } from '../src/database/postgresDatabase.js'

loadEnv()

async function main(){
  try{
    // procurar membro Kay (nome parecido)
    const mres = await query(`SELECT id, nome, telefone FROM abias_membros WHERE lower(nome) LIKE $1 ORDER BY criado_em DESC LIMIT 5`, ['%kay%'])
    console.log('Membros encontrados:', JSON.stringify(mres.rows, null, 2))
    if(!mres.rows.length) return

    for(const m of mres.rows){
      const telNorm = (m.telefone || '').replace(/[^0-9]/g, '')
      console.log('Procurando usuario com telefone normalizado:', telNorm)
      const ures = await query(`SELECT * FROM usuarios WHERE telefone = $1 LIMIT 1`, [telNorm])
      if(!ures.rows.length){
        console.log('Nenhum usuario vinculado ao membro', m.id)
        continue
      }
      const user = ures.rows[0]
      console.log('Usuario encontrado:', JSON.stringify(user, null, 2))
      const ifood = await query(`SELECT * FROM ifood_dados_operacionais WHERE usuario_id = $1 ORDER BY periodo_fim DESC LIMIT 10`, [user.id])
      console.log('ifood rows:', JSON.stringify(ifood.rows, null, 2))
    }
  }catch(err){
    console.error('Erro:', err.message)
  }
}

main().then(()=>process.exit(0))
