import { loadEnv } from '../src/config/env.js'
import { query } from '../src/database/postgresDatabase.js'

loadEnv()

async function seed() {
  // ── 1. Membro com crédito (reputação alta, ciclo concluído) ─────────────────
  const { rows: [u1] } = await query(`
    INSERT INTO abias_usuarios (email, senha_hash, role, nome)
    VALUES ($1, crypt($2, gen_salt('bf', 10)), 'membro', $3)
    ON CONFLICT (email) DO UPDATE SET senha_hash = crypt($2, gen_salt('bf', 10))
    RETURNING *
  `, ['joao@abias.app', 'joao123', 'João Silva'])
  console.log('✅ Usuário com crédito criado:', u1.email)

  const { rows: [m1] } = await query(`
    INSERT INTO abias_membros (nome, apelido, telefone, regiao, tempo_atuacao, ferramenta, raca, reputacao)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    ON CONFLICT DO NOTHING
    RETURNING *
  `, ['João Silva','João','11988880001','Zona Leste','3 anos','Moto','Preto', 720])

  let membro1 = m1
  if (!membro1) {
    const { rows: [existing] } = await query(`SELECT * FROM abias_membros WHERE usuario_id = $1 LIMIT 1`, [u1.id])
    membro1 = existing
  }
  console.log('   membro_id:', membro1?.id, '| reputação:', membro1?.reputacao)

  await query(`UPDATE abias_usuarios SET membro_id = $1 WHERE id = $2`, [membro1?.id, u1.id])

  // ── 2. Membro inadimplente (ciclo rejeitado, reputação 0) ────────────────────
  const { rows: [u2] } = await query(`
    INSERT INTO abias_usuarios (email, senha_hash, role, nome)
    VALUES ($1, crypt($2, gen_salt('bf', 10)), 'membro', $3)
    ON CONFLICT (email) DO UPDATE SET senha_hash = crypt($2, gen_salt('bf', 10))
    RETURNING *
  `, ['carlos@abias.app', 'carlos123', 'Carlos Souza'])
  console.log('✅ Usuário inadimplente criado:', u2.email)

  const { rows: [m2] } = await query(`
    INSERT INTO abias_membros (nome, apelido, telefone, regiao, tempo_atuacao, ferramenta, raca, reputacao)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
    ON CONFLICT DO NOTHING
    RETURNING *
  `, ['Carlos Souza','Carlos','11988880002','Zona Norte','1 ano','Moto','Pardo', 0])

  let membro2 = m2
  if (!membro2) {
    const { rows: [existing] } = await query(`SELECT * FROM abias_membros WHERE usuario_id = $1 LIMIT 1`, [u2.id])
    membro2 = existing
  }
  console.log('   membro_id:', membro2?.id, '| reputação:', membro2?.reputacao)

  await query(`UPDATE abias_usuarios SET membro_id = $1 WHERE id = $2`, [membro2?.id, u2.id])

  // Criar ciclo rejeitado para Carlos (mostra inadimplência no app)
  if (membro2?.id) {
    await query(`
      INSERT INTO abias_ciclos (membro_id, valor, finalidade, prazo_dias, oficina_parceira, urgencia, descricao, estado, justificativa)
      VALUES ($1, 850, 'Pneu + Revisão', 30, 'Oficina JN', 'Alta',
              'Preciso trocar o pneu traseiro para continuar trabalhando.', 'rejected',
              'Histórico insuficiente para liberação. Recomendamos aguardar 30 dias e solicitar nova análise.')
      ON CONFLICT DO NOTHING
    `, [membro2.id])
    console.log('   ciclo rejeitado inserido')
  }

  console.log('\n──────────────────────────────────────────')
  console.log('ACESSOS DE DEMO')
  console.log('──────────────────────────────────────────')
  console.log('COM CRÉDITO')
  console.log('  Email  : joao@abias.app')
  console.log('  Senha  : joao123')
  console.log('  Reputação: 720  |  Limite empréstimo: R$ 2.000')
  console.log('')
  console.log('INADIMPLENTE')
  console.log('  Email  : carlos@abias.app')
  console.log('  Senha  : carlos123')
  console.log('  Reputação: 0    |  Ciclo anterior rejeitado')
  console.log('──────────────────────────────────────────')

  process.exit(0)
}

seed().catch(err => { console.error('Erro:', err.message); process.exit(1) })
