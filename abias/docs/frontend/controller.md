---
sidebar_position: 3
title: Controller (useAppController)
---

# Controller — useAppController

**Arquivo:** `mobile/src/controllers/useAppController.js`

O `useAppController` é o coração do front-end. É um hook React que concentra **todo o estado da aplicação** e **todos os handlers de ação**. Nenhuma tela gerencia estado próprio — cada uma recebe o resultado desse hook via prop `ctrl` e age como uma view pura.

Essa centralização foi uma escolha de arquitetura: com um único hook gerenciando tudo, é fácil entender o estado global da aplicação em qualquer momento, rastrear de onde vêm os dados que uma tela exibe, e adicionar novos handlers sem criar dependências espalhadas pelo código.

O hook tem aproximadamente 400 linhas e pode ser dividido em cinco grandes blocos: autenticação, cadastro, produtos financeiros, ciclo de crédito, e IA.

---

## Autenticação e perfil

Três estados controlam quem está usando o app e como ele deve se comportar:

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `loginRole` | `string \| null` | Perfil autenticado: `'membro'`, `'oficina'` ou `'gestao'` |
| `loginUsuario` | `object \| null` | Dados do usuário do banco (id, nome, email, role, membro_id) |
| `profileMode` | `string` | Modo de visualização atual — coincide com `loginRole` |

Na montagem, o hook lê o `localStorage` para restaurar a sessão anterior. Se `abias_membro_id` estiver presente, três chamadas são feitas em sequência para hidratar o estado:

1. `GET /abias/membros/:id` — dados completos do membro com dados iFood
2. `GET /abias/ciclos/ativo?membroId=:id` — ciclo ativo (se houver)
3. `GET /abias/fundo` — saldo atual do fundo comunitário

Se qualquer uma dessas chamadas falhar (por exemplo, se o membro foi removido do banco), o `localStorage` é limpo e o app retorna para a tela de login — prevenindo estados inconsistentes onde o app tenta operar com um id que não existe mais.

---

## Estados do membro

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `membroId` | `string \| null` | UUID do membro ativo, persistido em `localStorage` |
| `membro` | `object \| null` | Dados completos do membro, incluindo dados iFood |
| `reputacao` | `number` | Score de reputação atual (0–1000) |
| `fundo` | `number` | Saldo atual do fundo comunitário em reais |

---

## Produtos financeiros (valores derivados)

O hook calcula automaticamente os produtos financeiros disponíveis para o membro com base na sua reputação atual. Esses cálculos são puramente derivados — sempre que `reputacao` muda, os produtos são recalculados.

### Cartão Abias

| Valor | Descrição |
|-------|-----------|
| `limiteCreditoCartao` | Limite do cartão por faixa de reputação (R$ 0 a R$ 1.500) |
| `taxaRotativoCartao` | Taxa mensal do rotativo (7,9% a 15,9%) |
| `cashbackSaldo` | Saldo de cashback acumulado (R$) |

### Empréstimo Produtivo

| Valor | Descrição |
|-------|-----------|
| `limiteEmprestimo` | Limite do empréstimo por faixa de reputação (R$ 0 a R$ 3.000) |
| `taxaMensalJuros` | Taxa mensal do empréstimo (2,5% a 7,0%) |

### Cálculos do empréstimo ativo

Quando o membro está preenchendo uma solicitação, o hook recalcula em tempo real os detalhes financeiros do empréstimo conforme o valor e o prazo são alterados:

| Valor | Descrição |
|-------|-----------|
| `valorOriginacao` | 2% do valor — taxa de originação cobrada pelo serviço |
| `valorJuros` | Juros mensais proporcionais ao prazo selecionado |
| `totalMembro` | Total que o membro vai pagar (valor + originação + juros) |
| `parcelasValor` | Valor de cada parcela |
| `numParcelas` | 1, 2, 4 ou 6 parcelas conforme o prazo |
| `valorLiberadoOficina` | Valor que a oficina recebe (97% do valor — desconto de 3% de interchange) |

Esses valores aparecem ao vivo no formulário da `CreditoScreen`, permitindo que o membro veja exatamente o custo do empréstimo antes de confirmar a solicitação.

---

## Estados do ciclo de crédito

O ciclo é o objeto mais complexo do estado. Ele não é apenas um ID — é um conjunto de estados que representa toda a jornada do empréstimo.

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `cicloId` | `string \| null` | UUID do ciclo ativo |
| `cicloEstado` | `string` | Estado atual: `draft`, `community_validation`, `partner_quote`, `under_review`, `approved`, `evidence_pending`, `evidence_review`, `validated`, `completed`, `rejected`, `needs_revision` |
| `solicitacao` | `object \| null` | Dados da solicitação: valor, finalidade, prazo, oficina, urgência, descrição |
| `avaliacoes` | `object` | Avais de Marcos e Aline (`pending` ou `approved`, com comentários) |
| `evidencia` | `object` | Evidência de execução (arquivo, observação, status, tipo) |
| `oficinaConfirmacao` | `object` | Confirmações da oficina (`quoteConfirmed`, `serviceConfirmed`) |
| `gestaoJustificativa` | `string` | Justificativa digitada pela gestão para revisão ou recusa |

A sincronização desse estado com a resposta da API é feita pela função `syncCicloToState` do `cicloHelper.js`, que transforma o objeto retornado pela API nas múltiplas partes do estado React.

---

## Dados operacionais iFood (valores derivados)

Quando os dados do membro são carregados, o hook extrai e calcula as métricas operacionais que aparecem na `ReputacaoScreen` e no painel `AreaOperacional`:

| Valor | Descrição |
|-------|-----------|
| `dadosOp` | Objeto com entregas realizadas, dias ativos, ganhos brutos, ganho médio semanal, avaliação média e taxa de cancelamento |
| `rankingOp` | Score iFood, classificação textual e percentil no ranking |
| `consistenciaRota` | Porcentagem de dias ativos nos últimos 90 dias |
| `entregasPorDia` | Média de entregas por dia ativo |
| `topPct` | Posição percentil exibida como "Top X% da rede" |
| `sparkYs` | Array de 10 pontos derivado da reputação para renderizar o gráfico sparkline |

---

## Estados da IA

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `parecerAi` | `object \| null` | Resultado completo da análise (score, recomendação, fatores, equidade) |
| `analisandoIA` | `boolean` | Flag de carregamento enquanto a IA processa |
| `aiError` | `string \| null` | Mensagem de erro se a análise falhar |
| `foiAvaliado` | `boolean` | Se o membro já tem um parecer gravado |
| `foiNegado` | `boolean` | Se a recomendação da IA foi `NEGAR` |
| `motivoNegacao` | `string \| null` | Justificativa da negação, se houver |

---

## Handlers — tabela completa

Todos os handlers seguem o mesmo padrão: fazem uma chamada à API, atualizam o estado com o resultado e tratam erros. Nenhuma tela conhece as URLs da API — elas apenas chamam o handler pelo nome.

| Handler | Rota chamada | Efeito |
|---------|-------------|--------|
| `handleLogin(role, usuario)` | — | Atualiza estado de auth e persiste no localStorage |
| `handleLogout()` | — | Limpa estado de auth e localStorage |
| `handleCadastro(e)` | `POST /abias/membros` | Cadastra novo membro e avança para o app |
| `handleSolicitacaoSubmit(e)` | `POST /abias/ciclos` | Abre novo ciclo de crédito |
| `handleConfirmarPlano()` | `PATCH /abias/ciclos/:id/estado` | Avança para `community_validation` |
| `handleMarcosAval()` | `POST /abias/ciclos/:id/avais` | Registra aval do Marcos |
| `handleAlineAval()` | `POST /abias/ciclos/:id/avais` | Registra aval da Aline |
| `handleOficinaConfirmarOrcamento()` | `POST /abias/ciclos/:id/confirmacoes` | Oficina confirma orçamento → `under_review` |
| `handleGestaoAprovar()` | `PATCH /abias/ciclos/:id/estado` | Gestão aprova → `evidence_pending` |
| `handleGestaoPedirRevisao()` | `PATCH /abias/ciclos/:id/estado` | Gestão pede revisão → `needs_revision` |
| `handleGestaoRecusar()` | `PATCH /abias/ciclos/:id/estado` | Gestão recusa → `rejected` |
| `handleEnviarEvidencia()` | `POST /abias/ciclos/:id/evidencias` | Membro envia evidência → `evidence_review` |
| `handleOficinaConfirmarServico()` | `POST /abias/ciclos/:id/confirmacoes` | Oficina confirma serviço → `validated` |
| `handleGestaoConcluirCiclo()` | `PATCH /abias/ciclos/:id/estado` | Gestão conclui → `completed` |
| `handlePedirAnalise()` | `POST /abias/membros/:id/avaliar` | Aciona análise da IA e grava resultado |
| `handleNovoCiclo()` | — | Reseta estado do ciclo para uma nova solicitação |
| `handleResetDemo()` | — | Limpa localStorage e reinicia o app para demonstração |

---

## Navegação

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `activeTab` | `string` | Aba ativa: `inicio`, `reputacao`, `credito`, `rede`, `perfil` |
| `onboardingStep` | `string` | Passo do onboarding: `splash` ou `cadastro` |
| `showAreaOperacional` | `boolean` | Controla a visibilidade do painel lateral de dados operacionais |
