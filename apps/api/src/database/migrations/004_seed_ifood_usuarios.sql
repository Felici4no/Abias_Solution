-- =========================================================
-- SEED 004: Usuários entregadores + dados operacionais iFood
-- Perfis variados para demonstrar análise de crédito
-- =========================================================

-- =========================================================
-- USUÁRIOS (motoboys reais da Zona Leste / SP)
-- senha_hash = bcrypt("Abias@2026")
-- =========================================================

INSERT INTO usuarios (id, nome, email, telefone, cpf, senha_hash, data_nascimento, score_atual, status_conta) VALUES
(
  'a1000000-0000-0000-0000-000000000001',
  'Carlos Augusto Nascimento',
  'carlos.augusto@entregador.app',
  '11940010001',
  '12345678901',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHi6',
  '1990-03-15',
  820,
  'ATIVA'
),
(
  'a2000000-0000-0000-0000-000000000002',
  'Regiane Ferreira dos Santos',
  'regiane.ferreira@entregador.app',
  '11940010002',
  '98765432109',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHi6',
  '1995-07-22',
  640,
  'ATIVA'
),
(
  'a3000000-0000-0000-0000-000000000003',
  'Marcos Vinícius Almeida',
  'marcos.vinicius@entregador.app',
  '11940010003',
  '11122233344',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHi6',
  '1998-11-08',
  480,
  'ATIVA'
),
(
  'a4000000-0000-0000-0000-000000000004',
  'Aline Cristina Souza',
  'aline.souza@entregador.app',
  '11940010004',
  '55566677788',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHi6',
  '2000-04-30',
  310,
  'ATIVA'
),
(
  'a5000000-0000-0000-0000-000000000005',
  'Jefferson Lima Barbosa',
  'jefferson.lima@entregador.app',
  '11940010005',
  '44433322211',
  '$2b$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lHi6',
  '1993-09-17',
  710,
  'ATIVA'
)
ON CONFLICT (cpf) DO NOTHING;

-- =========================================================
-- DADOS OPERACIONAIS IFOOD
-- Período: últimos 90 dias (2026-02-23 → 2026-05-24)
-- =========================================================

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
) VALUES

-- Carlos: veterano 3 anos, alta performance, moto quebrada (pneu + freio)
(
  'a1000000-0000-0000-0000-000000000001',
  'IFD-ENT-00100001',
  'IFD-ACC-00100001',
  '2026-02-23',
  '2026-05-24',
  847,
  82,
  3240.00,
  2754.00,
  246.15,
  4.85,
  17,
  0.0197,
  1095,
  '2026-05-23 21:40:00',
  '{"regiao_principal":"Zona Leste","modalidade":"moto","nivel":"OURO","metas_batidas":3,"bonus_periodo":180.00}'
),

-- Regiane: 18 meses, bom histórico, bicicleta com problema no câmbio
(
  'a2000000-0000-0000-0000-000000000002',
  'IFD-ENT-00100002',
  'IFD-ACC-00100002',
  '2026-02-23',
  '2026-05-24',
  620,
  74,
  2380.00,
  2023.00,
  180.77,
  4.72,
  19,
  0.0299,
  540,
  '2026-05-24 12:15:00',
  '{"regiao_principal":"Zona Leste","modalidade":"bicicleta","nivel":"PRATA","metas_batidas":2,"bonus_periodo":80.00}'
),

-- Marcos: 8 meses, perfil médio, moto com problema elétrico
(
  'a3000000-0000-0000-0000-000000000003',
  'IFD-ENT-00100003',
  'IFD-ACC-00100003',
  '2026-02-23',
  '2026-05-24',
  412,
  65,
  1790.00,
  1521.50,
  136.15,
  4.51,
  22,
  0.0507,
  240,
  '2026-05-22 19:30:00',
  '{"regiao_principal":"Zona Leste","modalidade":"moto","nivel":"BRONZE","metas_batidas":1,"bonus_periodo":0.00}'
),

-- Aline: 6 meses, iniciante, bicicleta com pneu furado recorrente
(
  'a4000000-0000-0000-0000-000000000004',
  'IFD-ENT-00100004',
  'IFD-ACC-00100004',
  '2026-02-23',
  '2026-05-24',
  273,
  55,
  1150.00,
  977.50,
  87.31,
  4.38,
  20,
  0.0683,
  180,
  '2026-05-20 18:00:00',
  '{"regiao_principal":"Zona Leste","modalidade":"bicicleta","nivel":"BRONZE","metas_batidas":0,"bonus_periodo":0.00}'
),

-- Jefferson: 2 anos, sólido, moto precisa de revisão geral
(
  'a5000000-0000-0000-0000-000000000005',
  'IFD-ENT-00100005',
  'IFD-ACC-00100005',
  '2026-02-23',
  '2026-05-24',
  731,
  78,
  2910.00,
  2473.50,
  220.77,
  4.76,
  15,
  0.0201,
  730,
  '2026-05-24 10:50:00',
  '{"regiao_principal":"Zona Leste","modalidade":"moto","nivel":"OURO","metas_batidas":2,"bonus_periodo":120.00}'
)
ON CONFLICT (usuario_id, ifood_entregador_id, periodo_inicio, periodo_fim) DO NOTHING;

-- =========================================================
-- SCORE OPERACIONAL baseado nos dados iFood
-- Fórmula: base 500 + (dias_ativos * 2) + (avaliacao * 40)
--          - (taxa_cancelamento * 1000) + bônus seniority
-- =========================================================

INSERT INTO score_operacional (usuario_id, pontuacao, classificacao, percentual_ranking) VALUES
('a1000000-0000-0000-0000-000000000001', 820, 'EXCELENTE',  94.00),
('a2000000-0000-0000-0000-000000000002', 640, 'BOM',        71.00),
('a3000000-0000-0000-0000-000000000003', 480, 'REGULAR',    47.00),
('a4000000-0000-0000-0000-000000000004', 310, 'BASICO',     22.00),
('a5000000-0000-0000-0000-000000000005', 710, 'BOM',        82.00)
ON CONFLICT DO NOTHING;

-- =========================================================
-- CONTAS (necessário para empréstimos futuros)
-- limite_credito baseado em ganho_medio_semanal * 4
-- =========================================================

INSERT INTO contas (usuario_id, saldo, limite_credito, agencia, numero_conta, status) VALUES
('a1000000-0000-0000-0000-000000000001',  180.50,  985.00, '0001', '00100001-0', 'ATIVA'),
('a2000000-0000-0000-0000-000000000002',   92.30,  724.00, '0001', '00100002-0', 'ATIVA'),
('a3000000-0000-0000-0000-000000000003',   45.00,  545.00, '0001', '00100003-0', 'ATIVA'),
('a4000000-0000-0000-0000-000000000004',   12.80,  350.00, '0001', '00100004-0', 'ATIVA'),
('a5000000-0000-0000-0000-000000000005',  230.00,  885.00, '0001', '00100005-0', 'ATIVA')
ON CONFLICT (usuario_id) DO NOTHING;
