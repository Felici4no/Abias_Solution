-- =========================================================
-- MIGRATION 010: Cashback acumulado por membro
-- Valor cresce R$ 2,00 por compra em território comunitário
-- Teto: R$ 200,00 — novo membro começa com R$ 0,00
-- =========================================================

ALTER TABLE abias_membros
  ADD COLUMN IF NOT EXISTS cashback_saldo NUMERIC(10,2) NOT NULL DEFAULT 0.00;

ALTER TABLE abias_membros
  ADD CONSTRAINT chk_cashback_saldo CHECK (cashback_saldo >= 0);
