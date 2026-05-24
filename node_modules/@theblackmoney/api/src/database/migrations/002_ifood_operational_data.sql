CREATE TABLE IF NOT EXISTS ifood_dados_operacionais (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    usuario_id UUID NOT NULL,

    ifood_entregador_id VARCHAR(120) NOT NULL,
    ifood_conta_id VARCHAR(120),

    periodo_inicio DATE NOT NULL,
    periodo_fim DATE NOT NULL,

    entregas_realizadas INTEGER NOT NULL DEFAULT 0,
    dias_ativos INTEGER NOT NULL DEFAULT 0,

    ganhos_brutos NUMERIC(15,2) NOT NULL DEFAULT 0,
    ganhos_liquidos NUMERIC(15,2) NOT NULL DEFAULT 0,
    ganho_medio_semanal NUMERIC(15,2) NOT NULL DEFAULT 0,

    avaliacao_media NUMERIC(3,2),
    cancelamentos INTEGER NOT NULL DEFAULT 0,
    taxa_cancelamento NUMERIC(5,4) NOT NULL DEFAULT 0,

    tempo_plataforma_dias INTEGER NOT NULL DEFAULT 0,
    ultima_entrega_em TIMESTAMP,

    payload_bruto JSONB NOT NULL DEFAULT '{}'::jsonb,

    sincronizado_em TIMESTAMP NOT NULL DEFAULT NOW(),
    criado_em TIMESTAMP NOT NULL DEFAULT NOW(),

    CONSTRAINT fk_ifood_dados_usuario
        FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id),

    CONSTRAINT chk_ifood_periodo
        CHECK (periodo_fim >= periodo_inicio),

    CONSTRAINT chk_ifood_entregas
        CHECK (entregas_realizadas >= 0),

    CONSTRAINT chk_ifood_dias_ativos
        CHECK (dias_ativos >= 0),

    CONSTRAINT chk_ifood_ganhos_brutos
        CHECK (ganhos_brutos >= 0),

    CONSTRAINT chk_ifood_ganhos_liquidos
        CHECK (ganhos_liquidos >= 0),

    CONSTRAINT chk_ifood_avaliacao
        CHECK (avaliacao_media IS NULL OR avaliacao_media BETWEEN 0 AND 5),

    CONSTRAINT chk_ifood_cancelamentos
        CHECK (cancelamentos >= 0),

    CONSTRAINT chk_ifood_taxa_cancelamento
        CHECK (taxa_cancelamento BETWEEN 0 AND 1),

    CONSTRAINT chk_ifood_tempo_plataforma
        CHECK (tempo_plataforma_dias >= 0),

    CONSTRAINT uq_ifood_usuario_periodo
        UNIQUE (usuario_id, ifood_entregador_id, periodo_inicio, periodo_fim)
);

CREATE INDEX IF NOT EXISTS idx_ifood_dados_usuario
ON ifood_dados_operacionais(usuario_id);

CREATE INDEX IF NOT EXISTS idx_ifood_dados_entregador
ON ifood_dados_operacionais(ifood_entregador_id);

CREATE INDEX IF NOT EXISTS idx_ifood_dados_periodo
ON ifood_dados_operacionais(periodo_inicio, periodo_fim);

CREATE INDEX IF NOT EXISTS idx_ifood_dados_sincronizado
ON ifood_dados_operacionais(sincronizado_em DESC);

CREATE INDEX IF NOT EXISTS idx_ifood_dados_payload
ON ifood_dados_operacionais
USING GIN (payload_bruto);
