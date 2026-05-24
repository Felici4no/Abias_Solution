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

Por enquanto a API expoe apenas um health check:

```text
GET /health
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
