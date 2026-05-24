-- =========================================================
-- MIGRATION 012: Usuários vinculados com dados do iFood
-- 1. Marca seeds avaliados (reputacao > 0 mas avaliado_em NULL)
-- 2. Adiciona ai_parecer demo para o membro principal (Carlos)
-- 3. Adiciona Maria Vitória como abias_membro + abias_usuario
-- 4. Garante que todos os seeds têm usuario_id preenchido
-- =========================================================

-- ─────────────────────────────────────────────────────────
-- 1. Marca os 5 membros seed como já avaliados
--    (reputacao foi definida manualmente no seed 005 —
--     avaliado_em faltava, causando estado inconsistente no frontend)
-- ─────────────────────────────────────────────────────────
UPDATE abias_membros
SET avaliado_em = '2026-05-01 00:00:00'
WHERE reputacao > 0
  AND avaliado_em IS NULL
  AND ai_parecer IS NULL;

-- ─────────────────────────────────────────────────────────
-- 2. ai_parecer demo para Carlos Augusto (membro principal do demo)
-- ─────────────────────────────────────────────────────────
UPDATE abias_membros
SET ai_parecer = '{
  "score": 820,
  "recomendacao": "APROVAR",
  "limiteCartao": {
    "valor": 1800,
    "disponivel": true,
    "justificativa": "Histórico sólido de 3 anos com nível OURO justifica limite alto."
  },
  "limiteEmprestimo": {
    "valor": 4200,
    "disponivel": true,
    "justificativa": "Performance excepcional: 847 entregas, avaliação 4.85, seniority alto."
  },
  "analise": "Carlos apresenta perfil operacional exemplar com 82 dias ativos nos últimos 90, avaliação 4.85 e nível OURO na plataforma. Entregador da Zona Leste com 3 anos de consistência comprovada — exatamente o perfil que o sistema financeiro tradicional subestima pela renda variável.",
  "fatoresPositivos": [
    "82 dias ativos de 90 — consistência máxima",
    "Avaliação 4.85 — topo da plataforma",
    "3 anos de seniority com nível OURO",
    "847 entregas no período — volume robusto"
  ],
  "pontosAtencao": [
    "Taxa de cancelamento 1.97% — saudável, continuar monitorando"
  ],
  "consideracaoEquidade": "Score bancário tradicional penalizaria Carlos por renda variável e sem histórico de crédito formal. A Abias enxerga o que o sistema ignora: trabalhador comprometido, rota consolidada na Zona Leste, capacidade de repagamento comprovada pelos ganhos semanais de R$246.",
  "motivoNegacao": null
}'::jsonb
WHERE id = 'b1000000-0000-0000-0000-000000000001'
  AND ai_parecer IS NULL;

-- ─────────────────────────────────────────────────────────
-- 3. ai_parecer demo para Jefferson Lima (membro secundário)
-- ─────────────────────────────────────────────────────────
UPDATE abias_membros
SET ai_parecer = '{
  "score": 710,
  "recomendacao": "APROVAR",
  "limiteCartao": {
    "valor": 1400,
    "disponivel": true,
    "justificativa": "2 anos de plataforma e nível OURO conferem acesso ao cartão com bom limite."
  },
  "limiteEmprestimo": {
    "valor": 2800,
    "disponivel": true,
    "justificativa": "Score 710 e ganho semanal de R$221 suportam empréstimo para manutenção."
  },
  "analise": "Jefferson é um entregador consolidado com 2 anos na plataforma e 731 entregas em 90 dias. Avaliação 4.76 e taxa de cancelamento de apenas 2% demonstram profissionalismo. Perfil apto para crédito produtivo de manutenção de ferramenta.",
  "fatoresPositivos": [
    "78 dias ativos de 90 — alta consistência",
    "Avaliação 4.76 acima da média",
    "2 anos de plataforma consolidados",
    "Nível OURO — comprometimento comprovado"
  ],
  "pontosAtencao": [
    "Ganho médio levemente abaixo de Carlos — revisar prazo de pagamento"
  ],
  "consideracaoEquidade": "Um entregador com 2 anos de experiência e 731 entregas em 90 dias não deveria ter dificuldade de crédito. A Abias reconhece a jornada periférica que o banco tradicional não lê.",
  "motivoNegacao": null
}'::jsonb
WHERE id = 'b5000000-0000-0000-0000-000000000005'
  AND ai_parecer IS NULL;

-- ─────────────────────────────────────────────────────────
-- 4. Garante usuario_id correto nos 5 seeds
--    (migration 011 já fez isso, mas garante idempotência)
-- ─────────────────────────────────────────────────────────
UPDATE abias_membros m
SET usuario_id = u.id
FROM usuarios u
WHERE REGEXP_REPLACE(m.telefone, '[^0-9]', '', 'g') = u.telefone
  AND m.usuario_id IS NULL;

-- ─────────────────────────────────────────────────────────
-- 5. Adiciona Maria Vitória como abias_membro
--    (ela já existe em usuarios + ifood_dados_operacionais via seed 009)
-- ─────────────────────────────────────────────────────────
INSERT INTO abias_membros (nome, telefone, regiao, tempo_atuacao, ferramenta, raca, usuario_id, reputacao)
SELECT
  'Maria Vitória Santos',
  '11987654321',
  'Zona Norte, São Paulo',
  '14 meses',
  'Moto',
  'Preta',
  u.id,
  0
FROM usuarios u
WHERE u.telefone = '11987654321'
ON CONFLICT DO NOTHING;

-- ─────────────────────────────────────────────────────────
-- 6. Adiciona Maria Vitória como abias_usuario (pode fazer login)
--    Senha: Abias@2026
-- ─────────────────────────────────────────────────────────
INSERT INTO abias_usuarios (email, senha_hash, role, nome, membro_id)
SELECT
  'mariavitoria@abias.com.br',
  crypt('Abias@2026', gen_salt('bf', 10)),
  'membro',
  'Maria Vitória Santos',
  m.id
FROM abias_membros m
WHERE m.telefone = '11987654321'
ON CONFLICT (email) DO NOTHING;
