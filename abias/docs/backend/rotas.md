---
sidebar_position: 2
title: Rotas da API
---

# Rotas da API

Todas as rotas são registradas no arquivo `apps/api/src/routes/index.js` como um array de objetos. Cada objeto define o método HTTP, o path, o controller handler e um flag `public` opcional. Quando `public: true` está ausente, a rota exige o header `Authorization: Bearer <token>` para ser acessada.

No MVP, todas as rotas Abias são públicas para facilitar a demonstração. As rotas legadas (couriers, scores, cartão) exigem token.

---

## Saúde e infraestrutura

Três rotas utilitárias que não fazem parte do domínio de negócio, mas são úteis para monitoramento e debugging:

| Método | Path | Descrição |
|--------|------|-----------|
| `GET` | `/health` | Retorna o status da API e o estado da conexão com o banco |
| `GET` | `/metrics` | Expõe contadores de requisições HTTP agrupados por rota e status code |
| `GET` | `/domain/entities` | Lista as entidades de domínio disponíveis no sistema |

---

## Membros (`/abias/membros`)

O membro é a entidade central da plataforma. Um membro é um entregador cadastrado na Abias, com seus dados pessoais, dados operacionais do iFood e seu histórico de reputação.

| Método | Path | Descrição |
|--------|------|-----------|
| `POST` | `/abias/membros` | Cadastra um novo membro na plataforma |
| `GET` | `/abias/membros/:id` | Retorna dados completos do membro, incluindo dados operacionais do iFood |
| `GET` | `/abias/membros/:id/credito` | Retorna os limites e taxas de crédito calculados para o membro |
| `POST` | `/abias/membros/:id/avaliar` | Aciona a avaliação de crédito pela IA e grava o resultado no perfil do membro |

### Cadastrando um membro — `POST /abias/membros`

O cadastro de um membro é o ponto de entrada no sistema. Os dados coletados vão além do básico nome e telefone: eles capturam o contexto operacional do trabalhador — quanto tempo atua, qual é sua ferramenta de trabalho, em que região opera. A raça também é coletada intencionalmente, para que a plataforma possa monitorar se está cumprindo seu propósito de inclusão.

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

Se o telefone informado corresponder a um usuário já existente em `abias_usuarios`, o membro é automaticamente vinculado a esse usuário na criação.

---

## Ciclos de crédito (`/abias/ciclos`)

Um ciclo representa um empréstimo produtivo do início ao fim — desde a solicitação até a conclusão com evidência de execução. É o coração operacional da plataforma.

| Método | Path | Descrição |
|--------|------|-----------|
| `POST` | `/abias/ciclos` | Abre um novo ciclo de solicitação para um membro |
| `GET` | `/abias/ciclos/ativo?membroId=<id>` | Retorna o ciclo ativo mais recente do membro |
| `GET` | `/abias/ciclos/:id` | Retorna os dados completos de um ciclo específico |
| `PATCH` | `/abias/ciclos/:id/estado` | Avança ou altera o estado do ciclo no fluxo |
| `POST` | `/abias/ciclos/:id/avais` | Registra um aval comunitário (Marcos ou Aline) |
| `POST` | `/abias/ciclos/:id/evidencias` | Envia uma evidência de execução do serviço |
| `POST` | `/abias/ciclos/:id/confirmacoes` | A oficina parceira confirma orçamento ou execução do serviço |

### Máquina de estados do ciclo

O ciclo percorre uma sequência de estados bem definidos. Cada transição pode gerar efeitos colaterais — pontos de reputação para o membro ou aportes no fundo comunitário. O diagrama abaixo mostra o caminho feliz e os desvios possíveis:

```
draft
  └─► community_validation   (membro confirma o plano)
        └─► partner_quote    (ambos os avais aprovados → +10 reputação)
              └─► under_review  (oficina confirma orçamento → +15 reputação)
                    ├─► approved       (gestão aprova → fundo +R$ 34)
                    ├─► needs_revision (gestão pede revisão com justificativa)
                    └─► rejected       (gestão recusa → reputação −30)
                          └─► evidence_pending
                                └─► evidence_review  (evidência enviada → +20 reputação)
                                      └─► validated  (oficina confirma serviço → fundo +R$ 34)
                                            └─► completed  (+25 reputação)
```

### Avançando o estado — `PATCH /abias/ciclos/:id/estado`

```json
{ "estado": "community_validation" }
```

Para transições de recusa ou revisão, o campo `justificativa` deve ser incluído no corpo:

```json
{ "estado": "rejected", "justificativa": "Oficina indicada não é parceira credenciada." }
```

---

## Fundo comunitário

| Método | Path | Descrição |
|--------|------|-----------|
| `GET` | `/abias/fundo` | Retorna o saldo atual do fundo comunitário em reais |

O fundo começa com R$ 4.820 (capital inicial do MVP) e é capitalizado automaticamente a cada ciclo concluído. Dois aportes de R$ 34 ocorrem por ciclo: um quando a gestão aprova o empréstimo, e outro quando a oficina confirma que o serviço foi realizado.

---

## Gestão (painel administrativo)

As rotas de gestão alimentam o painel administrativo acessado pelo perfil **Gestão** na plataforma. Elas consolidam informações de múltiplas tabelas para dar à equipe Abias uma visão completa da operação.

| Método | Path | Descrição |
|--------|------|-----------|
| `GET` | `/abias/gestao/painel` | Resumo geral com total de membros, saldo do fundo e ciclos em andamento |
| `GET` | `/abias/gestao/ciclos-pendentes` | Lista todos os ciclos aguardando decisão de aprovação, revisão ou recusa |
| `GET` | `/abias/gestao/ai-analise/:id` | Retorna o parecer completo da IA para um ciclo específico |

---

## Autenticação de usuários

Rotas para gerenciamento de usuários na tabela `abias_usuarios`. Um usuário pode ser vinculado a um membro após o cadastro, criando uma relação entre a identidade de login e o perfil financeiro.

| Método | Path | Descrição |
|--------|------|-----------|
| `POST` | `/abias/auth/registrar` | Cria um novo usuário com email, senha e role |
| `POST` | `/abias/auth/login` | Autentica o usuário e retorna seus dados (incluindo `membro_id` se vinculado) |
| `PATCH` | `/abias/auth/usuarios/:id/membro` | Vincula um membro existente ao usuário autenticado |

### Autenticando — `POST /abias/auth/login`

```json
{ "email": "joao@abias.app", "senha": "joao123" }
```

A resposta inclui os dados do usuário com o campo `membro_id`, que o front-end usa para carregar o perfil financeiro completo após o login.

---

## Rotas legadas

Estas rotas existem de uma versão anterior do sistema (o "The Black Money" original) e foram mantidas para compatibilidade. Elas implementam um fluxo de score operacional e pré-aprovação de crédito mais simples, sem o ciclo comunitário.

| Método | Path | Descrição |
|--------|------|-----------|
| `POST` | `/couriers` | Cadastra um entregador no sistema legado |
| `POST` | `/delivery-platform-connections/mock` | Simula conexão com uma plataforma de entrega |
| `POST` | `/operational-scores/calculate` | Calcula score operacional a partir de dados brutos |
| `POST` | `/credit-card-limits/calculate` | Calcula limite de cartão com base no score |
| `POST` | `/loan-pre-approvals/calculate` | Gera uma pré-aprovação de empréstimo |
| `GET` | `/local-partners` | Lista os parceiros locais cadastrados na rede |
| `POST` | `/cashbacks/apply` | Aplica cashback a uma transação realizada em parceiro |
