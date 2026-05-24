-- =========================================================
-- MIGRATION 006: Tabela de usuários autenticados da Abias
-- =========================================================

CREATE TABLE IF NOT EXISTS abias_usuarios (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email       VARCHAR(255) NOT NULL,
    senha_hash  TEXT NOT NULL,
    role        VARCHAR(20) NOT NULL DEFAULT 'membro'
                  CHECK (role IN ('membro', 'gestao')),
    nome        VARCHAR(150),
    membro_id   UUID REFERENCES abias_membros(id) ON DELETE SET NULL,
    ativo       BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em   TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT abias_usuarios_email_unique UNIQUE (email)
);

CREATE INDEX IF NOT EXISTS idx_abias_usuarios_email    ON abias_usuarios(email);
CREATE INDEX IF NOT EXISTS idx_abias_usuarios_role     ON abias_usuarios(role);
CREATE INDEX IF NOT EXISTS idx_abias_usuarios_membro   ON abias_usuarios(membro_id);

-- Conta de gestão padrão (senha: Abias@2026)
-- Hashing via pgcrypto bcrypt — compatível com verificação no Node.js
INSERT INTO abias_usuarios (email, senha_hash, role, nome)
VALUES (
    'gestao@abias.com.br',
    crypt('Abias@2026', gen_salt('bf', 10)),
    'gestao',
    'Gestão Abias'
)
ON CONFLICT (email) DO NOTHING;
