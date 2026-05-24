-- =========================================================
-- MIGRATION 011: Relação lógica e concreta entre membros e usuários
-- Adiciona chave estrangeira usuario_id na tabela abias_membros
-- =========================================================

-- 1. Adiciona a coluna com a constraint de chave estrangeira
ALTER TABLE abias_membros
  ADD COLUMN IF NOT EXISTS usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL;

-- 2. Atualização retrospectiva: vincula membros existentes aos seus usuários bancários
UPDATE abias_membros m
SET usuario_id = u.id
FROM usuarios u
WHERE REGEXP_REPLACE(m.telefone, '[^0-9]', '', 'g') = u.telefone;

-- 3. Cria índice de alta performance para acelerar as junções (JOINs) por usuario_id
CREATE INDEX IF NOT EXISTS idx_abias_membros_usuario_id
ON abias_membros(usuario_id);
