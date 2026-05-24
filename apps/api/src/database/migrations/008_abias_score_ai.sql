-- =========================================================
-- MIGRATION 008: Score começa em 0, colunas para parecer da IA
-- =========================================================

-- Novos membros iniciam sem crédito — precisam ter dados avaliados
ALTER TABLE abias_membros ALTER COLUMN reputacao SET DEFAULT 0;

-- Armazena o parecer completo da IA (evita re-chamar a cada request)
ALTER TABLE abias_membros ADD COLUMN IF NOT EXISTS ai_parecer JSONB DEFAULT NULL;
ALTER TABLE abias_membros ADD COLUMN IF NOT EXISTS avaliado_em TIMESTAMP DEFAULT NULL;
