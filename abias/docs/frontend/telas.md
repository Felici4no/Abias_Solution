---
sidebar_position: 2
title: Telas
---

# Telas

## LoginScreen

**Arquivo:** `views/screens/LoginScreen.jsx`

Tela inicial exibida quando nenhum usuário está autenticado. Oferece três perfis de entrada:

- **Membro** — entregador que usa os produtos financeiros
- **Oficina** — parceira que confirma orçamentos e serviços
- **Gestão** — administrador com visão completa da plataforma

Ao escolher um perfil, chama `handleLogin(role, usuario)` no controller e persiste `abias_login_role` e `abias_usuario` no `localStorage`.

---

## OnboardingScreen

**Arquivo:** `views/screens/OnboardingScreen.jsx`

Fluxo de boas-vindas para membros novos, controlado pelo estado `onboardingStep`:

| Step | Descrição |
|------|-----------|
| `splash` | Tela de abertura com identidade visual da Abias |
| `cadastro` | Formulário de cadastro do membro (nome, telefone, região, raça, ferramenta, tempo de atuação) |

Ao submeter o formulário, chama `handleCadastro` que faz `POST /abias/membros` e avança para o app principal.

---

## HomeScreen (Início)

**Arquivo:** `views/screens/HomeScreen.jsx`

Dashboard principal do membro. Exibe:

- **Saldo do fundo comunitário** (`fundo`)
- **Reputação atual** (`reputacao`) com barra de progresso
- **Status do ciclo ativo** (`currentStatus`)
- **Produtos disponíveis** — cartão Abias e empréstimo produtivo
- Botão de acesso rápido à solicitação de crédito

---

## ReputacaoScreen (Reputação)

**Arquivo:** `views/screens/ReputacaoScreen.jsx`

Exibe o score de reputação comunitária do membro com:

- Sparkline de evolução histórica (derivada dos dados `sparkYs`)
- Classificação (BÁSICO → EXCELENTE)
- Dados operacionais do iFood: entregas, dias ativos, ganho médio semanal, taxa de cancelamento
- Ranking percentil na rede (`topPct`)
- Botão para solicitar **análise pela IA** (`handlePedirAnalise`)
- Exibição do parecer da IA com fatores positivos e pontos de atenção

---

## CreditoScreen (Crédito)

**Arquivo:** `views/screens/CreditoScreen.jsx`

Tela de acompanhamento do ciclo de crédito. O conteúdo muda conforme o estado do ciclo:

| Estado | O que o membro vê |
|--------|-------------------|
| `draft` | Formulário de solicitação (valor, finalidade, oficina, prazo, urgência, descrição) |
| `community_validation` | Resumo do plano, aguardando avais |
| `partner_quote` | Avais aprovados, aguardando confirmação da oficina |
| `under_review` | Em análise pela gestão |
| `evidence_pending` | Aprovado — solicita upload da evidência (foto/recibo) |
| `evidence_review` | Evidência enviada, aguardando validação |
| `validated` | Serviço validado |
| `completed` | Ciclo encerrado com sucesso |
| `rejected` / `needs_revision` | Recusado ou em revisão com justificativa |

---

## RedeScreen (Rede)

**Arquivo:** `views/screens/RedeScreen.jsx`

Visão da rede comunitária de pares. Exibe os avaliadores (`marcos` e `aline`) e o status dos seus avais no ciclo ativo.

---

## PerfilScreen (Perfil)

**Arquivo:** `views/screens/PerfilScreen.jsx`

Informações do membro autenticado:

- Nome, apelido, região, ferramenta, tempo de atuação
- Histórico de ciclos
- Botão de **Sair** (`handleLogout`)
- Botão **Resetar Demo** (`handleResetDemo`) — limpa todo o `localStorage` e reinicia o app

---

## OficinaScreen

**Arquivo:** `views/screens/OficinaScreen.jsx`

Visão exclusiva do perfil **Oficina**. Permite:

- Ver ciclos com orçamento pendente
- Confirmar orçamento (`handleOficinaConfirmarOrcamento`)
- Confirmar execução do serviço (`handleOficinaConfirmarServico`)

---

## GestaoScreen

**Arquivo:** `views/screens/GestaoScreen.jsx`

Painel administrativo para o perfil **Gestão**. Exibe:

- Painel consolidado (total de membros, saldo do fundo, ciclos em andamento)
- Lista de ciclos pendentes de aprovação
- Ações por ciclo: aprovar, pedir revisão (com justificativa), recusar (com justificativa)
- Parecer completo da IA para cada solicitação

---

## Componentes compartilhados

### BottomNav

**Arquivo:** `views/components/BottomNav.jsx`

Barra de navegação inferior fixa com 5 abas. Destaca a aba ativa via `activeIndex`. Ao clicar, chama `setActiveTab(tabId)` no controller.

### AreaOperacional

**Arquivo:** `views/components/AreaOperacional.jsx`

Painel lateral deslizante com os dados operacionais completos do iFood (`dadosOp`, `rankingOp`). Acessado pelo botão de sino no header.
