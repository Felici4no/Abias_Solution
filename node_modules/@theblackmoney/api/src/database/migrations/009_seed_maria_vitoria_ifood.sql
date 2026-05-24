-- =========================================================
-- SEED 009: Maria Vitória — dados operacionais iFood
-- Telefone padrão do cadastro: (11) 98765-4321 → 11987654321
-- Perfil forte para passar na análise de crédito da IA
-- =========================================================

-- Garante entrada na tabela usuarios (JOIN bridge para iFood)
INSERT INTO usuarios (
  nome, email, telefone, cpf,
  senha_hash, data_nascimento, score_atual, status_conta
) VALUES (
  'Maria Vitória Santos',
  'mariavitoria.santos@entregador.app',
  '11987654321',
  '77766655544',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHi6',
  '2001-03-12',
  740,
  'ATIVA'
)
ON CONFLICT (telefone) DO NOTHING;

-- Dados operacionais iFood — perfil sólido (Zona Norte, moto, 14 meses)
INSERT INTO ifood_dados_operacionais (
  usuario_id,
  ifood_entregador_id,
  ifood_conta_id,
  periodo_inicio,
  periodo_fim,
  entregas_realizadas,
  dias_ativos,
  ganhos_brutos,
  ganhos_liquidos,
  ganho_medio_semanal,
  avaliacao_media,
  cancelamentos,
  taxa_cancelamento,
  tempo_plataforma_dias,
  ultima_entrega_em,
  payload_bruto
)
SELECT
  u.id,
  'IFD-ENT-MV000001',
  'IFD-ACC-MV000001',
  '2026-02-23',
  '2026-05-24',
  580,
  75,
  2760.00,
  2346.00,
  210.00,
  4.78,
  12,
  0.0203,
  420,
  '2026-05-24 14:20:00',
  '{"regiao_principal":"Zona Norte","modalidade":"moto","nivel":"OURO","metas_batidas":2,"bonus_periodo":130.00}'
FROM usuarios u
WHERE u.telefone = '11987654321'
ON CONFLICT (usuario_id, ifood_entregador_id, periodo_inicio, periodo_fim) DO NOTHING;

-- Score operacional calculado com os dados acima
INSERT INTO score_operacional (usuario_id, pontuacao, classificacao, percentual_ranking)
SELECT u.id, 740, 'BOM', 85.00
FROM usuarios u
WHERE u.telefone = '11987654321'
ON CONFLICT DO NOTHING;

-- Conta (necessária para empréstimos)
INSERT INTO contas (usuario_id, saldo, limite_credito, agencia, numero_conta, status)
SELECT u.id, 65.00, 840.00, '0001', '00200001-0', 'ATIVA'
FROM usuarios u
WHERE u.telefone = '11987654321'
ON CONFLICT (usuario_id) DO NOTHING;
