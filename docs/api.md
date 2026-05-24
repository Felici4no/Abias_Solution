# API Basica

## Autenticacao

Use Bearer token nas rotas de negocio:

```text
Authorization: Bearer dev-token
```

Em ambiente real, substitua o token via `API_AUTH_TOKEN`.

## Rotas Publicas

```text
GET /health
GET /domain/entities
GET /metrics
```

## Rotas Protegidas

```text
POST /couriers
POST /delivery-platform-connections/mock
POST /operational-scores/calculate
POST /credit-card-limits/calculate
POST /loan-pre-approvals/calculate
GET /local-partners
POST /cashbacks/apply
```

## Fluxo Principal

1. Cadastre o entregador em `POST /couriers`.
2. Conecte uma conta mockada em `POST /delivery-platform-connections/mock`.
3. Calcule o score em `POST /operational-scores/calculate`.
4. Calcule limite de cartao em `POST /credit-card-limits/calculate`.
5. Calcule pre-aprovacao de emprestimo em `POST /loan-pre-approvals/calculate`.
6. Liste parceiros em `GET /local-partners`.
7. Aplique cashback em `POST /cashbacks/apply`.

## Observabilidade

A API escreve logs estruturados em JSON para cada requisicao e expoe metricas agregadas em `GET /metrics`.
