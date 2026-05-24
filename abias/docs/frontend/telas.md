---
sidebar_position: 2
title: Telas
---

# Telas

O app tem três contextos de uso distintos, cada um com seu próprio conjunto de telas: o **membro** (o entregador que usa os produtos financeiros), a **oficina** (a parceira que confirma serviços) e a **gestão** (a equipe administrativa da Abias). Cada perfil vê uma interface diferente após o login.

---

## LoginScreen

**Arquivo:** `views/screens/LoginScreen.jsx`

A tela de entrada da aplicação. Ela não exige email e senha logo de cara — ela pergunta primeiro quem é o usuário. Três perfis são oferecidos:

- **Membro** — o entregador que usa os produtos financeiros da plataforma
- **Oficina** — a parceira que confirma orçamentos e valida execuções de serviço
- **Gestão** — o administrador com visão completa de toda a operação

Para os perfis de demonstração (Oficina e Gestão), clicar no cartão já autentica diretamente, sem credenciais. Para o perfil Membro, um formulário de login é exibido solicitando email e senha.

Ao autenticar, o handler `handleLogin(role, usuario)` é chamado no controller, que persiste o role e os dados do usuário no `localStorage` e atualiza o estado da aplicação.

---

## OnboardingScreen

**Arquivo:** `views/screens/OnboardingScreen.jsx`

Exibida quando o usuário está autenticado como membro, mas ainda não tem um perfil de membro cadastrado. O fluxo é controlado pelo estado `onboardingStep` e tem dois momentos:

**Splash** — Uma tela de abertura com a identidade visual da Abias, apresentando a plataforma ao novo trabalhador antes de pedir qualquer dado.

**Cadastro** — O formulário de cadastro coleta as informações que a plataforma precisa para construir o perfil financeiro do membro:

| Campo | Por que é coletado |
|-------|-------------------|
| Nome e apelido | Identificação pessoal e humanização da experiência |
| Telefone | Vinculação com a conta de usuário |
| Região de atuação | Contexto para calibrar a análise de crédito por zona geográfica |
| Raça | Monitoramento de inclusão e calibração anti-viés da IA |
| Ferramenta de trabalho | Entender o ativo que precisa de crédito produtivo |
| Tempo de atuação | Seniority como fator de confiança |
| Aceite de termos | Conformidade |

Ao submeter, o handler `handleCadastro` faz `POST /abias/membros` e avança para o app principal.

---

## HomeScreen (Início)

**Arquivo:** `views/screens/HomeScreen.jsx`

O dashboard principal do membro. É a primeira tela que aparece após o onboarding e funciona como visão geral da situação financeira e operacional do trabalhador.

A tela exibe quatro blocos de informação principais:

**Fundo comunitário** — O saldo atual do fundo, que representa a liquidez disponível para novos empréstimos. Ver o fundo crescendo é parte da experiência de pertencimento à rede.

**Reputação** — O score atual do membro com uma barra de progresso visual. Quanto mais alta a reputação, melhores os produtos disponíveis.

**Status do ciclo ativo** — Se o membro tem um ciclo em andamento, seu estado atual é exibido aqui com uma descrição do que está acontecendo e do que precisa ser feito.

**Produtos disponíveis** — Os dois produtos financeiros que o membro pode acessar com base na sua reputação atual: o Cartão Abias (com limite e taxa de rotativo) e o Empréstimo Produtivo (com limite e taxa mensal). Há um botão de acesso rápido para iniciar uma solicitação de crédito.

---

## ReputacaoScreen (Reputação)

**Arquivo:** `views/screens/ReputacaoScreen.jsx`

A tela mais rica em informação do app. É aqui que o membro entende de onde vem sua reputação e o que pode fazer para melhorá-la.

**Classificação e progresso** — O score de reputação é classificado em faixas (BÁSICO → REGULAR → BOM → ÓTIMO → EXCELENTE) com uma barra de progresso até a próxima faixa.

**Sparkline de evolução** — Um gráfico de linha com os últimos 10 pontos de dados mostrando a trajetória da reputação ao longo do tempo.

**Dados operacionais do iFood** — Quatro métricas chave exibidas como cards: total de entregas realizadas, dias ativos nos últimos 90 dias, ganho médio semanal e taxa de cancelamento. Esses dados são os mesmos que a IA usa na análise de crédito.

**Ranking percentil** — Posição do membro na rede (`topPct`), exibida como "Top X% da rede". Cria senso de pertencimento e referência para o membro entender onde está em relação aos pares.

**Análise pela IA** — Um botão que aciona `handlePedirAnalise()`, que chama `POST /abias/membros/:id/avaliar`. Enquanto a análise é processada, um indicador de loading é exibido. Após a conclusão, o parecer completo aparece: score calculado, fatores positivos, pontos de atenção e a consideração de equidade feita pela IA.

---

## CreditoScreen (Crédito)

**Arquivo:** `views/screens/CreditoScreen.jsx`

A tela de acompanhamento do ciclo de crédito. Ela não tem um conteúdo fixo — o que o membro vê depende completamente do estado atual do ciclo. É essencialmente uma máquina de estados visual.

| Estado do ciclo | O que o membro vê |
|-----------------|-------------------|
| `draft` (sem ciclo) | Formulário de solicitação: valor, finalidade, oficina parceira, prazo, urgência e descrição do problema |
| `community_validation` | Resumo do plano submetido e status de aguardo dos avais dos pares (Marcos e Aline) |
| `partner_quote` | Confirmação de que ambos os avais foram aprovados (+10 rep) e aguardo da cotação da oficina |
| `under_review` | Aviso de que o pedido está em análise pela equipe Abias |
| `approved` / `evidence_pending` | Aprovação confirmada. Convite para enviar foto ou recibo da execução do serviço |
| `evidence_review` | Evidência enviada (+20 rep). Aguardando validação da oficina |
| `validated` | Serviço confirmado pela oficina. Aguardando conclusão |
| `completed` | Ciclo encerrado com sucesso (+25 rep). Resumo financeiro do ciclo |
| `rejected` | Recusado, com a justificativa da gestão exibida |
| `needs_revision` | Em revisão, com a justificativa e opção de ajustar e reenviar |

O formulário de solicitação exibe em tempo real os cálculos financeiros do empréstimo conforme o membro preenche o valor e o prazo: taxa de originação (2%), juros, total a pagar, valor por parcela e o quanto a oficina vai receber (descontado o interchange de 3%).

---

## RedeScreen (Rede)

**Arquivo:** `views/screens/RedeScreen.jsx`

A tela de rede comunitária. Exibe os avaliadores do ciclo ativo — os membros de confiança Marcos e Aline — com o status atual dos seus avais (`pendente` ou `aprovado`) e eventuais comentários.

É uma tela simples mas conceitualmente importante: ela torna visível o componente humano da avaliação de crédito. Não é apenas um algoritmo que decide o acesso ao crédito — são pessoas da mesma rede que validam o pedido.

---

## PerfilScreen (Perfil)

**Arquivo:** `views/screens/PerfilScreen.jsx`

Informações pessoais e histórico do membro autenticado. Exibe nome, apelido, região, ferramenta, tempo de atuação e o histórico de ciclos anteriores.

Dois botões de ação ficam disponíveis:

- **Sair** — chama `handleLogout()`, limpa o estado de autenticação e redireciona para o login.
- **Resetar Demo** — chama `handleResetDemo()`, que limpa todo o `localStorage` e reinicia o app do zero. Útil para demonstrações onde se quer mostrar o fluxo completo novamente.

---

## OficinaScreen

**Arquivo:** `views/screens/OficinaScreen.jsx`

Tela exclusiva do perfil **Oficina**. A oficina parceira não enxerga membros, reputação ou fundo — ela tem uma visão focada no que precisa da sua ação.

A tela lista os ciclos com confirmação pendente (estado `partner_quote`) e oferece dois botões de ação para cada um:

- **Confirmar orçamento** — chama `handleOficinaConfirmarOrcamento()`, que envia `POST /abias/ciclos/:id/confirmacoes` com `tipo: "orcamento"`. O ciclo avança para `under_review` e o membro ganha +15 de reputação.
- **Confirmar serviço realizado** — chama `handleOficinaConfirmarServico()`, que envia `POST /abias/ciclos/:id/confirmacoes` com `tipo: "servico"`. O ciclo avança para `validated` e o fundo recebe +R$ 34.

---

## GestaoScreen

**Arquivo:** `views/screens/GestaoScreen.jsx`

O painel de controle da equipe Abias. É a tela com maior densidade de informação da plataforma, projetada para que a gestão tome decisões rápidas e bem informadas.

**Painel consolidado** — Três métricas de alto nível: total de membros ativos, saldo atual do fundo comunitário e quantidade de ciclos em andamento.

**Lista de ciclos pendentes** — Todos os ciclos em estado `under_review`, ordenados por data. Para cada um, a gestão vê os dados do membro, o valor solicitado, a finalidade e o prazo.

**Parecer da IA** — O parecer completo gerado pela análise de crédito: score, recomendação, fatores positivos, pontos de atenção e a consideração de equidade.

**Ações disponíveis** — Três botões para cada ciclo:
- **Aprovar** — `handleGestaoAprovar()` → ciclo vai para `evidence_pending`, fundo recebe +R$ 34
- **Pedir revisão** — `handleGestaoPedirRevisao()` → ciclo vai para `needs_revision` com a justificativa digitada
- **Recusar** — `handleGestaoRecusar()` → ciclo vai para `rejected`, membro perde 30 pontos de reputação

---

## Componentes compartilhados

### BottomNav

**Arquivo:** `views/components/BottomNav.jsx`

A barra de navegação inferior fixa, visível em todas as telas do perfil membro. Exibe 5 ícones correspondentes às abas disponíveis. A aba ativa é destacada visualmente via `activeIndex`. Ao clicar em qualquer aba, `setActiveTab(tabId)` é chamado no controller.

### AreaOperacional

**Arquivo:** `views/components/AreaOperacional.jsx`

Um painel lateral deslizante ativado pelo ícone de sino no header. Exibe os dados operacionais completos do iFood do membro: `dadosOp` (entregas, dias ativos, ganhos brutos, ganho médio semanal, avaliação média, taxa de cancelamento, tempo na plataforma) e `rankingOp` (pontuação, classificação e percentil no ranking). Útil para o membro acompanhar o que a plataforma enxerga do seu desempenho operacional.
