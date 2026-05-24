---
sidebar_position: 1
title: Visão Geral
---

# Back-end — Visão Geral

O back-end da Abias é uma API HTTP escrita em **Node.js puro** (sem framework), organizada no padrão **MVC** e hospedada em `apps/api/`.

## Estrutura de pastas

```
apps/api/src/
├── app.js                   # Servidor HTTP + roteador central
├── server.js                # Entry point (inicializa o servidor)
├── routes/index.js          # Registro de todas as rotas
├── controllers/             # Recebem a requisição e chamam os models
├── models/                  # Regras de negócio e acesso ao banco
│   └── entities/            # Entidades de domínio auxiliares
├── auth/authModel.js        # Verificação de Bearer token
├── database/
│   ├── postgresDatabase.js  # Pool de conexão com PostgreSQL
│   ├── localDatabase.js     # Banco em memória para testes/dev
│   └── runMigrations.js     # Execução de migrations SQL
├── observability/
│   ├── logger.js            # Logs estruturados (JSON)
│   └── metricsModel.js      # Contadores de métricas HTTP
├── http/readJsonBody.js     # Parse do body JSON da requisição
├── views/jsonView.js        # Helper para resposta JSON padronizada
└── config/env.js            # Carregamento de variáveis de ambiente
```

## Como a requisição é processada

```
Cliente HTTP
    │
    ▼
app.js  (createApp)
    │  1. Gera requestId e aplica CORS
    │  2. Faz match de rota (método + path, suporta :param)
    │  3. Verifica autorização via Bearer token (se rota não for public)
    │
    ▼
Controller  (ex: abiasMembrosController.js)
    │  Lê params/query/body, valida formato básico
    │
    ▼
Model  (ex: abiasMembrosModel.js)
    │  Regras de negócio + queries ao PostgreSQL
    │
    ▼
jsonView.sendJson  →  resposta JSON ao cliente
```

## Banco de dados

- **PostgreSQL** em produção — pool de conexão gerenciado por `postgresDatabase.js`.
- **Banco local em memória** (`localDatabase.js`) disponível para desenvolvimento sem banco real.
- Migrations ficam em `database/runMigrations.js` e são executadas na inicialização.

## Autenticação

Rotas protegidas exigem o header `Authorization: Bearer <token>`. O `authModel.js` verifica o token antes do controller ser acionado. Rotas marcadas com `public: true` no registro não passam por essa checagem.

## Observabilidade

Cada requisição gera dois registros automáticos ao final:

- **Log JSON** via `logger.js` com `requestId`, método, path, status e tempo em ms.
- **Métrica** via `metricsModel.js` exposta no endpoint `GET /metrics`.
