---
sidebar_position: 1
title: Visão Geral
---

# Back-end — Visão Geral

A API da Abias foi construída em **Node.js puro**, sem frameworks como Express ou Fastify. Essa escolha não é acidente: em um hackathon com restrições de tempo, frameworks adicionam convenções e abstrações que precisam ser aprendidas e configuradas. Node.js HTTP nativo é previsível, explícito e não tem surpresas. Cada rota, cada middleware, cada decisão de roteamento está visível no código — sem mágica.

A estrutura segue o padrão **MVC** (Model-View-Controller), adaptado para uma API REST. A "view" aqui não é HTML, mas sim as respostas JSON padronizadas pelo `jsonView.js`. Controllers recebem a requisição, extraem parâmetros e delegam para os models. Models contêm toda a lógica de negócio e as queries ao banco.

---

## Estrutura de pastas

```
apps/api/src/
├── app.js                   # Servidor HTTP + roteador central
├── server.js                # Entry point — inicializa o servidor
├── routes/index.js          # Registro de todas as rotas
├── controllers/             # Leitura de params/body e delegação para models
├── models/                  # Regras de negócio e acesso ao PostgreSQL
│   └── entities/            # Entidades de domínio auxiliares
├── auth/authModel.js        # Verificação de Bearer token
├── database/
│   ├── postgresDatabase.js  # Pool de conexão com PostgreSQL
│   ├── localDatabase.js     # Banco em memória para testes e desenvolvimento
│   └── runMigrations.js     # Execução automática de migrations na inicialização
├── observability/
│   ├── logger.js            # Logs estruturados em formato JSON
│   └── metricsModel.js      # Contadores de métricas HTTP por rota e status
├── http/readJsonBody.js     # Parse do corpo JSON da requisição
├── views/jsonView.js        # Helper para respostas JSON padronizadas
└── config/env.js            # Carregamento de variáveis de ambiente
```

---

## O ciclo de vida de uma requisição

Para entender como a API funciona, o melhor caminho é seguir o que acontece entre o momento em que uma chamada HTTP chega e o momento em que a resposta é enviada.

Tudo começa em `app.js`, na função `createApp()`. Ela cria um servidor HTTP Node.js que intercepta cada requisição e a processa em etapas:

**1. Identificação e CORS**

O servidor gera um `requestId` único (via UUID, ou reutilizando o header `x-request-id` se presente). Isso permite rastrear logs de uma mesma requisição de ponta a ponta. Em seguida, aplica os headers de CORS abertos — necessário para que o front-end em desenvolvimento consiga chamar a API sem bloqueios de browser.

**2. Roteamento**

A função `matchRoute()` percorre a lista de rotas registradas em `routes/index.js` e encontra aquela que bate com o método HTTP e o pathname da requisição. O roteador suporta parâmetros dinâmicos no estilo `:id`, e extrai esses valores para que o controller possa acessá-los via `req.params`.

**3. Autorização**

Se a rota não está marcada como `public: true`, o servidor verifica o header `Authorization: Bearer <token>` antes de passar a requisição para o controller. A lógica é simples e intencional: um token fixo comparado contra a variável de ambiente `API_AUTH_TOKEN`. Para o MVP, isso é suficiente — a autenticação real dos usuários Abias é gerenciada por uma camada separada no `abiasAuthModel`.

**4. Execução do controller e resposta**

O controller é chamado de forma assíncrona. Se ele lançar um erro, o servidor captura no bloco `try/catch` e envia uma resposta 500 com a mensagem de erro. Se tudo correr bem, o `jsonView.sendJson()` formata e envia a resposta.

**5. Observabilidade**

No bloco `finally`, independente do resultado, dois registros são feitos: um log JSON via `logger.js` com `requestId`, método, path, status code e tempo de execução em milissegundos; e uma métrica incrementada em `metricsModel.js`, que é exposta no endpoint `GET /metrics`.

O fluxo completo fica assim:

```
Cliente HTTP
    │
    ▼
app.js — createApp()
    │  1. Gera requestId e aplica CORS
    │  2. Faz match de rota (método + path com suporte a :param)
    │  3. Verifica Bearer token (se rota não for public)
    │
    ▼
Controller  (ex: abiasMembrosController.js)
    │  Lê params / query string / body
    │  Valida formato básico dos dados recebidos
    │
    ▼
Model  (ex: abiasMembrosModel.js)
    │  Aplica regras de negócio
    │  Executa queries no PostgreSQL
    │
    ▼
jsonView.sendJson  →  resposta JSON ao cliente
```

---

## Banco de dados

A API usa **PostgreSQL** em produção, com um pool de conexões gerenciado por `postgresDatabase.js`. As queries são escritas em SQL puro, sem ORM. Essa escolha permite controle total sobre o que é executado no banco — importante para um sistema financeiro onde a exatidão das transações importa.

Para desenvolvimento local sem um banco real, existe `localDatabase.js`: um banco em memória que implementa a mesma interface do PostgreSQL e permite rodar a API sem nenhuma configuração adicional. As migrations ficam em `database/runMigrations.js` e são executadas automaticamente na inicialização da API.

---

## Autenticação

A autenticação da API funciona em duas camadas independentes:

A primeira é o **Bearer token da API** — um mecanismo simples que protege as rotas privadas de chamadas externas não autorizadas. O token é configurado via variável de ambiente `API_AUTH_TOKEN` (padrão `dev-token` em desenvolvimento).

A segunda é a **autenticação de usuários Abias**, gerenciada pelo `abiasAuthModel`. Ela cria e autentica usuários na tabela `abias_usuarios`, usando `bcrypt` via a extensão `pgcrypto` do PostgreSQL. No MVP, as rotas Abias são marcadas como públicas para simplificar o fluxo de demonstração.

---

## Observabilidade

Toda requisição gera automaticamente dois registros ao ser concluída, independente de sucesso ou erro:

- **Log estruturado** via `logger.js`: um objeto JSON com `requestId`, método HTTP, path, status code e duração em milissegundos. Ideal para debugging e rastreamento de problemas em produção.
- **Métrica** via `metricsModel.js`: contador por combinação de método + path + status code, exposto no endpoint `GET /metrics` para monitoramento.
