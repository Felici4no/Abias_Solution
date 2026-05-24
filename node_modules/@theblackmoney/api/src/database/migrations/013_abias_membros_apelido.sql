-- =========================================================
-- MIGRATION 013: Adiciona coluna apelido em abias_membros
-- Separação entre nome completo (registro) e como o membro
-- prefere ser chamado (exibição no app)
-- =========================================================

ALTER TABLE abias_membros
  ADD COLUMN IF NOT EXISTS apelido VARCHAR(100);

-- Para os membros seed, usa o primeiro nome como apelido padrão
UPDATE abias_membros
SET apelido = SPLIT_PART(nome, ' ', 1)
WHERE apelido IS NULL;
