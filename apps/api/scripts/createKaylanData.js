import { loadEnv } from '../src/config/env.js'
import { query } from '../src/database/postgresDatabase.js'

loadEnv()

async function main(){
  try{
    // 1) Criar novo usuario Kaylan
    const email = 'kaylan.moura@entregador.app'
    const telefone = '11987654322'
    const cpf = '11122233344'

    // Tentar inserir usuário; se já existir (por telefone/email/cpf) usa o existente
    let user = null
    try {
      // gerar cpf único com 11 dígitos
      let uniqueCpf = null
      for (let i = 0; i < 10; i++) {
        const candidate = String(Math.floor(10000000000 + Math.random() * 89999999999))
        const exists = await query(`SELECT 1 FROM usuarios WHERE cpf = $1 LIMIT 1`, [candidate])
        if (!exists.rows.length) { uniqueCpf = candidate; break }
      }
      if (!uniqueCpf) throw new Error('Não foi possível gerar CPF único')
      const insertUser = await query(`INSERT INTO usuarios (nome, email, telefone, cpf, senha_hash, data_nascimento, score_atual, status_conta)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`, [
        'Kaylan Moura', email, telefone, uniqueCpf, '$2b$10$placeholderhashforlocal', '1995-06-10', 650, 'ATIVA'
      ])
      user = insertUser.rows[0]
      console.log('Usuario criado:', JSON.stringify(user, null, 2))
    } catch (e) {
      console.log('Não foi possível criar usuário (talvez já exista). Procurando por telefone/email...')
      const find = await query(`SELECT * FROM usuarios WHERE telefone = $1 OR email = $2 LIMIT 1`, [telefone, email])
      if (find.rows.length) {
        user = find.rows[0]
        console.log('Usuario existente encontrado:', JSON.stringify(user, null, 2))
      } else {
        throw e
      }
    }

    // 2) Atualizar abias_membros do Kay (nome 'Kay') para usar novo telefone (vincula membro ao usuario)
    const upd = await query(`UPDATE abias_membros SET telefone = $1 WHERE lower(nome) LIKE $2 RETURNING *`, [telefone, '%kay%'])
    console.log('Membros atualizados:', JSON.stringify(upd.rows, null, 2))

    // 3) Inserir registro ifood_dados_operacionais realista para o novo usuario
    const now = new Date()
    const periodoFim = new Date()
    const periodoInicio = new Date()
    periodoInicio.setDate(periodoFim.getDate() - 90)

    const insertIfood = await query(`INSERT INTO ifood_dados_operacionais (
      usuario_id, ifood_entregador_id, ifood_conta_id, periodo_inicio, periodo_fim,
      entregas_realizadas, dias_ativos, ganhos_brutos, ganhos_liquidos, ganho_medio_semanal,
      avaliacao_media, cancelamentos, taxa_cancelamento, tempo_plataforma_dias, ultima_entrega_em, payload_bruto
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16) RETURNING *`, [
      user.id,
      'IFD-ENT-KAY001',
      'IFD-ACC-KAY001',
      periodoInicio.toISOString().slice(0,10),
      periodoFim.toISOString().slice(0,10),
      420, // entregas
      65,  // dias ativos
      '2100.00', // ganhos brutos
      '1785.00', // ganhos liquidos
      '180.00', // ganho medio semanal
      '4.65', // avaliacao_media
      8, // cancelamentos
      '0.0190', // taxa
      365, // tempo plataforma
      now.toISOString(),
      JSON.stringify({ nivel: 'PRATA', modalidade: 'moto', bonus_periodo: 80, metas_batidas: 1, regiao_principal: 'Zona Leste' })
    ])

    console.log('Ifood criado:', JSON.stringify(insertIfood.rows[0], null, 2))

  }catch(err){
    console.error('Erro:', err.message)
    console.error(err)
  }
}

main().then(()=>process.exit(0))
