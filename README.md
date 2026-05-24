# The Black Money

Back-end inicial para uma plataforma financeira voltada a entregadores de aplicativos, com score operacional, produtos de credito, emprestimos e cashback comunitario.

## Estrutura

```text
apps/
  api/
    src/
      controllers/
      models/
      routes/
      views/
      app.js
      server.js
docs/
  tasks.md
```

## Como executar

```bash
npm run dev -w apps/api
```

## Autenticacao local

As rotas de negocio exigem Bearer token. Em desenvolvimento, sem `API_AUTH_TOKEN`, use:

```text
Authorization: Bearer dev-token
```

Por enquanto a API expoe apenas um health check:

```text
GET /health
```

Metricas basicas:

```text
GET /metrics
```

E tambem expoe os contratos iniciais das entidades de dominio:

```text
GET /domain/entities
```

Cadastro inicial de entregadores:

```text
POST /couriers
```

Payload esperado:

```json
{
  "fullName": "Maria Silva",
  "document": "12345678901",
  "phone": "11999999999",
  "email": "maria@example.com",
  "city": "Sao Paulo",
  "state": "SP"
}
```

Conexao mockada com plataforma de entrega:

```text
POST /delivery-platform-connections/mock
```

Payload esperado:

```json
{
  "courierId": "uuid-do-entregador",
  "provider": "ifood"
}
```

Providers aceitos nesta etapa: `ifood` e `99`.

Calculo inicial do score operacional:

```text
POST /operational-scores/calculate
```

Payload esperado:

```json
{
  "courierId": "uuid-do-entregador"
}
```

Antes de calcular o score, o entregador precisa ter pelo menos uma conta conectada pelo fluxo mockado.

Calculo de limite dinamico para cartao:

```text
POST /credit-card-limits/calculate
```

Pre-aprovacao de emprestimo pessoal:

```text
POST /loan-pre-approvals/calculate
```

Payload esperado para ambos:

```json
{
  "courierId": "uuid-do-entregador"
}
```

Antes desses calculos, o entregador precisa ter um score operacional calculado.

Parceiros locais para cashback:

```text
GET /local-partners
```

Aplicacao de cashback comunitario na proxima fatura:

```text
POST /cashbacks/apply
```

Payload esperado:

```json
{
  "courierId": "uuid-do-entregador",
  "localPartnerId": "partner-mercado-quilombo",
  "amount": 120.5,
  "invoiceId": "invoice-2026-05"
}
```

## Persistencia

Nesta etapa a API usa um banco local em JSON em `apps/api/data/local-db.json`, ignorado pelo Git. As migrations SQL iniciais ficam em:

```text
apps/api/src/database/migrations
```

## Testes

```bash
npm test
```

## Documentacao

A referencia basica de rotas fica em `docs/api.md`.
