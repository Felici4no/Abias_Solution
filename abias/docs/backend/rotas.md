---
sidebar_position: 2
title: Rotas da API
---

# Rotas da API

Todas as rotas são registradas em `apps/api/src/routes/index.js`. As rotas Abias são públicas para o MVP (sem token obrigatório).

## Saúde e infraestrutura

| Método | Path | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Status da API |
| `GET` | `/metrics` | Métricas de requisições HTTP |
| `GET` | `/domain/entities` | Lista entidades de domínio disponíveis |

## Membros (`/abias/membros`)

| Método | Path | Descrição |
|--------|------|-----------|
| `POST` | `/abias/membros` | Cadastra um novo membro |
| `GET` | `/abias/membros/:id` | Retorna dados completos do membro (incluindo dados iFood) |
| `GET` | `/abias/membros/:id/credito` | Retorna limite e taxa de crédito calculados |
| `POST` | `/abias/membros/:id/avaliar` | Aciona avaliação de crédito pela IA |

### POST /abias/membros — Body

```json
{
  "nome": "João Silva",
  "apelido": "João",
  "telefone": "11999998888",
  "regiao": "Zona Leste",
  "tempo": "3 anos",
  "ferramenta": "Moto",
  "raca": "Preto"
}
```

## Ciclos de crédito (`/abias/ciclos`)

Um **ciclo** representa um empréstimo produtivo desde a solicitação até a conclusão.

| Método | Path | Descrição |
|--------|------|-----------|
| `POST` | `/abias/ciclos` | Abre novo ciclo de solicitação |
| `GET` | `/abias/ciclos/ativo?membroId=<id>` | Retorna o ciclo ativo do membro |
| `GET` | `/abias/ciclos/:id` | Retorna dados de um ciclo específico |
| `PATCH` | `/abias/ciclos/:id/estado` | Avança/altera o estado do ciclo |
| `POST` | `/abias/ciclos/:id/avais` | Registra aval comunitário (marcos ou aline) |
| `POST` | `/abias/ciclos/:id/evidencias` | Envia evidência de execução do serviço |
| `POST` | `/abias/ciclos/:id/confirmacoes` | Oficina confirma orçamento ou serviço |

### Estados do ciclo

```
draft
  └─► community_validation   (membro confirma o plano)
        └─► partner_quote    (ambos avais aprovados → +10 reputação)
              └─► under_review  (oficina confirma orçamento → +15 reputação)
                    └─► approved / needs_revision / rejected
                          └─► evidence_pending  (aprovado → fundo +R$34)
                                └─► evidence_review  (evidência enviada → +20 reputação)
                                      └─► validated  (oficina confirma serviço → fundo +R$34)
                                            └─► completed  (+25 reputação)
```

### PATCH /abias/ciclos/:id/estado — Body

```json
{ "estado": "community_validation" }
```

Para recusa ou revisão, inclua `"justificativa"`.

## Fundo comunitário

| Método | Path | Descrição |
|--------|------|-----------|
| `GET` | `/abias/fundo` | Retorna saldo atual do fundo |

## Gestão (painel administrativo)

| Método | Path | Descrição |
|--------|------|-----------|
| `GET` | `/abias/gestao/painel` | Resumo geral: membros, fundo, ciclos |
| `GET` | `/abias/gestao/ciclos-pendentes` | Lista ciclos aguardando decisão |
| `GET` | `/abias/gestao/ai-analise/:id` | Parecer da IA para um ciclo |

## Autenticação

| Método | Path | Descrição |
|--------|------|-----------|
| `POST` | `/abias/auth/registrar` | Cria usuário na tabela `abias_usuarios` |
| `POST` | `/abias/auth/login` | Autentica e retorna dados do usuário |
| `PATCH` | `/abias/auth/usuarios/:id/membro` | Vincula um membro a um usuário autenticado |

### POST /abias/auth/login — Body

```json
{ "email": "joao@email.com", "senha": "senha123" }
```

## Rotas legadas (score / cartão / parceiros)

| Método | Path | Descrição |
|--------|------|-----------|
| `POST` | `/couriers` | Cadastra entregador no sistema legado |
| `POST` | `/delivery-platform-connections/mock` | Simula conexão com plataforma de entrega |
| `POST` | `/operational-scores/calculate` | Calcula score operacional |
| `POST` | `/credit-card-limits/calculate` | Calcula limite de cartão |
| `POST` | `/loan-pre-approvals/calculate` | Pré-aprovação de empréstimo |
| `GET` | `/local-partners` | Lista parceiros locais |
| `POST` | `/cashbacks/apply` | Aplica cashback a uma transação |
