# Back-end Tasks

## Status

- [x] Task 1: Criar estrutura inicial do back-end em `apps/api` usando MVC.
- [x] Task 2: Definir entidades centrais do dominio: entregador, conta conectada, score operacional, produto financeiro, transacao, parceiro local e cashback.
- [x] Task 3: Implementar cadastro inicial de entregadores e validacao de dados.
- [x] Task 4: Criar fluxo mockado de conexao com plataformas de entrega para simular dados do iFood/99.
- [x] Task 5: Construir motor inicial de score operacional com regras transparentes e versionadas.
- [x] Task 6: Criar modulo de limite dinamico para cartao de credito.
- [x] Task 7: Criar modulo de pre-aprovacao de emprestimos com parametros de risco.
- [ ] Task 8: Implementar cashback comunitario aplicado como desconto na proxima fatura.
- [ ] Task 9: Adicionar persistencia com banco de dados e migrations.
- [ ] Task 10: Adicionar autenticacao, autorizacao e protecao de rotas.
- [ ] Task 11: Criar testes automatizados para regras de score, credito e cashback.
- [ ] Task 12: Preparar observabilidade basica, logs estruturados e documentacao de API.

## Task 1 Entregue

A primeira task criou a base do projeto, separando a API em MVC:

- `models`: representa dados e contratos internos.
- `controllers`: recebe a requisicao e coordena a resposta.
- `routes`: mapeia rotas HTTP para controllers.
- `views`: padroniza a saida JSON.

As proximas tasks devem evoluir essa base sem misturar regra de negocio diretamente nas rotas.

## Task 2 Entregue

A segunda task definiu os contratos iniciais das entidades centrais do dominio:

- `courier`: entregador cadastrado na plataforma.
- `connectedAccount`: conta conectada de plataformas como iFood e 99.
- `operationalScore`: score operacional dinamico do entregador.
- `financialProduct`: cartao de credito ou emprestimo pessoal.
- `transaction`: movimentacao financeira feita dentro do ecossistema.
- `localPartner`: comercio parceiro para cashback comunitario.
- `cashback`: beneficio aplicado como desconto em fatura.

Essas entidades ainda nao possuem persistencia em banco. Elas funcionam como mapa inicial do dominio para orientar as proximas implementacoes.

## Task 3 Entregue

A terceira task implementou o cadastro inicial de entregadores:

- `POST /couriers`: cria um entregador com status `pending_onboarding`.
- Validacao de `fullName`, `document`, `phone`, `email`, `city` e `state`.
- Normalizacao basica de texto, CPF/documento, telefone, e-mail e UF.
- Bloqueio de cadastro duplicado pelo documento enquanto a API estiver em execucao.

Nesta etapa os dados ficam apenas em memoria. A persistencia definitiva em banco continua reservada para a Task 9.

## Task 4 Entregue

A quarta task implementou o fluxo mockado de conexao com plataformas de entrega:

- `POST /delivery-platform-connections/mock`: conecta um entregador cadastrado a um provider mockado.
- Providers aceitos: `ifood` e `99`.
- Validacao de `courierId` e `provider`.
- Verificacao de existencia do entregador antes da conexao.
- Bloqueio de provider duplicado para o mesmo entregador enquanto a API estiver em execucao.
- Retorno de `connectedAccount` e `operationalSnapshot` com dados simulados de atividade.

O snapshot operacional inclui entregas nos ultimos 30 dias, dias ativos, ganhos medios semanais, avaliacao media, tempo de plataforma e taxa de cancelamento. Esses dados serao usados como entrada para o motor de score da Task 5.

## Task 5 Entregue

A quinta task implementou o motor inicial de score operacional:

- `POST /operational-scores/calculate`: calcula o score de um entregador cadastrado.
- Exige pelo menos uma conta de entrega conectada pelo fluxo mockado.
- Usa a versao `operational-score-v1` para versionar a regra.
- Retorna score de 0 a 1000, faixa de risco e breakdown dos criterios.
- Mantem os resultados em memoria ate a chegada da persistencia definitiva.

Os pesos iniciais sao transparentes:

- Recorrencia de atividade: 250 pontos.
- Volume de entregas: 200 pontos.
- Previsibilidade de ganhos: 200 pontos.
- Reputacao: 150 pontos.
- Tempo de plataforma: 100 pontos.
- Comportamento de cancelamento: 100 pontos.

Esse motor ainda e baseado em regras explicaveis. Ele prepara o terreno para evoluir depois para modelos estatisticos ou IA com auditoria de risco.

## Task 6 Entregue

A sexta task implementou o modulo de limite dinamico para cartao de credito:

- `POST /credit-card-limits/calculate`: calcula o limite inicial do cartao.
- Exige score operacional previamente calculado.
- Usa a politica versionada `credit-card-limit-v1`.
- Calcula limite com base em score, faixa de risco e renda mensal estimada.
- Aplica guardrails de limite minimo e maximo para controlar exposicao.

O modulo retorna `limitAmount`, `status`, `policyVersion`, score usado e breakdown explicavel da decisao.

## Task 7 Entregue

A setima task implementou a pre-aprovacao de emprestimos pessoais:

- `POST /loan-pre-approvals/calculate`: calcula pre-aprovacao de emprestimo.
- Exige score operacional previamente calculado.
- Usa a politica versionada `personal-loan-pre-approval-v1`.
- Define valor aprovado, prazo, taxa mensal e parcela estimada.
- Rejeita automaticamente scores abaixo do minimo definido pela politica.

O modulo retorna `approvedAmount`, `termMonths`, `monthlyInterestRate`, `estimatedInstallment`, `status` e breakdown com criterios de risco e capacidade de pagamento.
