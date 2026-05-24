-- =========================================================
-- SEED 007: Contas abias_usuarios para os membros seed
-- Vincula abias_usuarios.membro_id → abias_membros.id
-- Senha padrão: Abias@2026
-- =========================================================

INSERT INTO abias_usuarios (email, senha_hash, role, nome, membro_id) VALUES
(
  'carlos@abias.com.br',
  crypt('Abias@2026', gen_salt('bf', 10)),
  'membro',
  'Carlos Augusto Nascimento',
  'b1000000-0000-0000-0000-000000000001'
),
(
  'regiane@abias.com.br',
  crypt('Abias@2026', gen_salt('bf', 10)),
  'membro',
  'Regiane Ferreira dos Santos',
  'b2000000-0000-0000-0000-000000000002'
),
(
  'marcos@abias.com.br',
  crypt('Abias@2026', gen_salt('bf', 10)),
  'membro',
  'Marcos Vinícius Almeida',
  'b3000000-0000-0000-0000-000000000003'
),
(
  'aline@abias.com.br',
  crypt('Abias@2026', gen_salt('bf', 10)),
  'membro',
  'Aline Cristina Souza',
  'b4000000-0000-0000-0000-000000000004'
),
(
  'jefferson@abias.com.br',
  crypt('Abias@2026', gen_salt('bf', 10)),
  'membro',
  'Jefferson Lima Barbosa',
  'b5000000-0000-0000-0000-000000000005'
)
ON CONFLICT (email) DO NOTHING;
