-- =========================================================
-- MIGRATION 003: Tabelas específicas da plataforma Abias
-- =========================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =========================================================
-- ENUM: estados do ciclo de crédito produtivo
-- =========================================================

CREATE TYPE ciclo_estado_enum AS ENUM (
    'draft',
    'submitted',
    'community_validation',
    'partner_quote',
    'under_review',
    'approved',
    'evidence_pending',
    'evidence_review',
    'validated',
    'completed',
    'needs_revision',
    'rejected'
);

-- =========================================================
-- ABIAS_MEMBROS
-- Trabalhadores cadastrados na plataforma (motoboys, ciclistas, etc.)
-- Separado da tabela usuarios pois não requer CPF/email no onboarding
-- =========================================================

CREATE TABLE IF NOT EXISTS abias_membros (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    nome VARCHAR(150) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    regiao VARCHAR(255),
    tempo_atuacao VARCHAR(100),

    -- 'Moto' | 'Bicicleta' | 'Outro'
    ferramenta VARCHAR(50) NOT NULL DEFAULT 'Moto',

    -- Autodeclaração racial (opcional)
    raca VARCHAR(50),

    -- Reputação de Jornada (0–1000), inicia em 720
    reputacao INTEGER NOT NULL DEFAULT 720,

    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_abias_reputacao CHECK (reputacao >= 0)
);

CREATE INDEX idx_abias_membros_telefone ON abias_membros(telefone);
CREATE INDEX idx_abias_membros_reputacao ON abias_membros(reputacao DESC);

-- =========================================================
-- ABIAS_CICLOS
-- Ciclo completo de crédito produtivo (solicitação → conclusão)
-- =========================================================

CREATE TABLE IF NOT EXISTS abias_ciclos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    membro_id UUID NOT NULL,

    -- Dados da solicitação
    valor NUMERIC(15,2) NOT NULL,
    finalidade VARCHAR(255) NOT NULL,
    prazo_dias INTEGER NOT NULL,
    oficina_parceira VARCHAR(255) NOT NULL,
    urgencia VARCHAR(50) NOT NULL,
    descricao TEXT,

    -- Máquina de estados
    estado ciclo_estado_enum NOT NULL DEFAULT 'submitted',

    -- Avais comunitários (JSON)
    -- { marcos: 'pending'|'approved', marcosComment: '', aline: 'pending'|'approved', alineComment: '' }
    avais JSONB NOT NULL DEFAULT '{"marcos":"pending","marcosComment":"","aline":"pending","alineComment":""}',

    -- Evidências de uso (JSON)
    -- { file: '', obs: '', status: 'pending'|'sent', type: '' }
    evidencia JSONB NOT NULL DEFAULT '{"file":"","obs":"","status":"pending","type":""}',

    -- Confirmações da oficina parceira (JSON)
    -- { quoteConfirmed: false, serviceConfirmed: false, note: '' }
    oficina_confirmacao JSONB NOT NULL DEFAULT '{"quoteConfirmed":false,"serviceConfirmed":false,"note":""}',

    -- Justificativa de revisão ou recusa (gestão)
    justificativa TEXT,

    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    atualizado_em TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_ciclo_membro
        FOREIGN KEY (membro_id) REFERENCES abias_membros(id),

    CONSTRAINT chk_ciclo_valor CHECK (valor > 0),
    CONSTRAINT chk_ciclo_prazo CHECK (prazo_dias > 0)
);

CREATE INDEX idx_abias_ciclos_membro  ON abias_ciclos(membro_id);
CREATE INDEX idx_abias_ciclos_estado  ON abias_ciclos(estado);
CREATE INDEX idx_abias_ciclos_data    ON abias_ciclos(criado_em DESC);

-- =========================================================
-- ABIAS_FUNDO
-- Reserva comunitária piloto (singleton)
-- =========================================================

CREATE TABLE IF NOT EXISTS abias_fundo (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    saldo NUMERIC(15,2) NOT NULL DEFAULT 4820.00,
    atualizado_em TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT chk_fundo_saldo CHECK (saldo >= 0)
);

-- Insere o saldo inicial apenas se a tabela estiver vazia
INSERT INTO abias_fundo (saldo)
SELECT 4820.00
WHERE NOT EXISTS (SELECT 1 FROM abias_fundo);

-- =========================================================
-- ABIAS_PARCEIROS_LOCAIS
-- Oficinas e comércios credenciados
-- =========================================================

CREATE TABLE IF NOT EXISTS abias_parceiros_locais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome VARCHAR(255) NOT NULL,
    tipo_servico VARCHAR(255) NOT NULL,
    regiao VARCHAR(255) NOT NULL,
    ativo BOOLEAN NOT NULL DEFAULT TRUE,
    criado_em TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_abias_parceiros_regiao ON abias_parceiros_locais(regiao);
CREATE INDEX idx_abias_parceiros_ativo  ON abias_parceiros_locais(ativo);

-- Seed dos parceiros iniciais
INSERT INTO abias_parceiros_locais (nome, tipo_servico, regiao) VALUES
    ('Oficina JN',           'Serviço Mecânico e Reparos',  'Zona Leste'),
    ('Motopeças Silva',      'Venda de Peças e Acessórios', 'Zona Leste'),
    ('Borracharia do Ponto', 'Reparo e Venda de Pneus',     'Zona Leste');
