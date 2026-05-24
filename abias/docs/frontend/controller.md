---
sidebar_position: 3
title: Controller (useAppController)
---

# Controller — useAppController

**Arquivo:** `mobile/src/controllers/useAppController.js`

Hook React central da aplicação. Concentra **todo o estado** e **todos os handlers** de ação. As telas recebem o resultado desse hook via prop `ctrl` e não gerenciam estado próprio.

## Estados principais

### Autenticação e perfil

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `loginRole` | `string \| null` | Perfil autenticado: `'membro'`, `'oficina'` ou `'gestao'` |
| `loginUsuario` | `object \| null` | Dados do usuário do banco (`id`, `nome`, `email`, `role`, `membro_id`) |
| `profileMode` | `string` | Modo de visualização atual (coincide com `loginRole`) |

### Membro

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `membroId` | `string \| null` | UUID do membro ativo (persistido em `localStorage`) |
| `membro` | `object \| null` | Dados completos do membro (incluindo dados iFood) |
| `reputacao` | `number` | Score de reputação (0–1000) |
| `parecerAi` | `object \| null` | Parecer da IA após avaliação |
| `analisandoIA` | `boolean` | Flag de carregamento da análise IA |
| `aiError` | `string \| null` | Mensagem de erro da análise IA |

### Ciclo de crédito

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `cicloId` | `string \| null` | UUID do ciclo ativo |
| `cicloEstado` | `string` | Estado atual do ciclo (ex: `'draft'`, `'approved'`) |
| `solicitacao` | `object \| null` | Dados da solicitação (valor, finalidade, oficina, prazo…) |
| `avaliacoes` | `object` | Avais de marcos e aline (`pending` / `approved`) |
| `evidencia` | `object` | Evidência de execução (arquivo, observação, status, tipo) |
| `oficinaConfirmacao` | `object` | Confirmações da oficina (`quoteConfirmed`, `serviceConfirmed`) |
| `gestaoJustificativa` | `string` | Justificativa preenchida pela gestão |
| `fundo` | `number` | Saldo atual do fundo comunitário em R$ |

### Navegação

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `activeTab` | `string` | Aba ativa: `inicio`, `reputacao`, `credito`, `rede`, `perfil` |
| `onboardingStep` | `string` | Passo do onboarding: `splash` ou `cadastro` |
| `showAreaOperacional` | `boolean` | Exibe/oculta o painel de dados operacionais |

## Valores derivados (calculados no hook)

### Produtos financeiros

| Valor | Descrição |
|-------|-----------|
| `limiteCreditoCartao` | Limite do cartão Abias por faixa de reputação (R$ 0–1500) |
| `taxaRotativoCartao` | Taxa mensal do rotativo do cartão (7,9%–15,9%) |
| `limiteEmprestimo` | Limite do empréstimo produtivo por faixa (R$ 0–3000) |
| `taxaMensalJuros` | Taxa mensal do empréstimo (2,5%–7,0%) |
| `cashbackSaldo` | Saldo de cashback acumulado (R$) |

### Cálculo do empréstimo ativo

| Valor | Descrição |
|-------|-----------|
| `valorOriginacao` | 2% do valor (taxa de originação) |
| `valorJuros` | Juros proporcionais ao prazo |
| `totalMembro` | Valor total a pagar pelo membro |
| `parcelasValor` | Valor de cada parcela (R$) |
| `numParcelas` | Número de parcelas (1, 2, 4 ou 6 conforme prazo) |
| `valorLiberadoOficina` | Valor que a oficina recebe (descontado 3% interchange) |

### Dados operacionais iFood

| Valor | Descrição |
|-------|-----------|
| `dadosOp` | Dados brutos: entregas, dias ativos, ganhos, cancelamentos |
| `rankingOp` | Score iFood, classificação e percentil |
| `consistenciaRota` | % de dias ativos nos últimos 90 dias |
| `entregasPorDia` | Média de entregas por dia ativo |
| `topPct` | Percentil no ranking (ex: Top 15%) |
| `sparkYs` | Array de 10 pontos para o sparkline de reputação |

## Handlers principais

| Handler | Rota chamada | Descrição |
|---------|-------------|-----------|
| `handleLogin(role, usuario)` | — | Atualiza estado de auth e localStorage |
| `handleLogout()` | — | Limpa estado de auth e localStorage |
| `handleCadastro(e)` | `POST /abias/membros` | Cadastra novo membro |
| `handleSolicitacaoSubmit(e)` | `POST /abias/ciclos` | Abre novo ciclo de crédito |
| `handleConfirmarPlano()` | `PATCH /abias/ciclos/:id/estado` | Avança para `community_validation` |
| `handleMarcosAval()` | `POST /abias/ciclos/:id/avais` | Registra aval do Marcos |
| `handleAlineAval()` | `POST /abias/ciclos/:id/avais` | Registra aval da Aline |
| `handleOficinaConfirmarOrcamento()` | `POST /abias/ciclos/:id/confirmacoes` | Confirma orçamento |
| `handleGestaoAprovar()` | `PATCH /abias/ciclos/:id/estado` | Aprova o ciclo |
| `handleGestaoPedirRevisao()` | `PATCH /abias/ciclos/:id/estado` | Solicita revisão com justificativa |
| `handleGestaoRecusar()` | `PATCH /abias/ciclos/:id/estado` | Recusa o ciclo com justificativa |
| `handleEnviarEvidencia()` | `POST /abias/ciclos/:id/evidencias` | Envia evidência de execução |
| `handleOficinaConfirmarServico()` | `POST /abias/ciclos/:id/confirmacoes` | Confirma execução do serviço |
| `handleGestaoConcluirCiclo()` | `PATCH /abias/ciclos/:id/estado` | Conclui o ciclo |
| `handlePedirAnalise()` | `POST /abias/membros/:id/avaliar` | Solicita avaliação da IA |
| `handleNovoCiclo()` | — | Reseta estado do ciclo para nova solicitação |
| `handleResetDemo()` | — | Limpa localStorage e reinicia o app para demo |

## Inicialização

Na montagem do hook, se `membroId` estiver no `localStorage`, são feitas três chamadas sequenciais:

1. `GET /abias/membros/:id` — carrega dados do membro
2. `GET /abias/ciclos/ativo?membroId=:id` — carrega ciclo ativo
3. `GET /abias/fundo` — carrega saldo do fundo

Se qualquer chamada falhar (ex: membro deletado), o `localStorage` é limpo e o app volta para o estado inicial.
