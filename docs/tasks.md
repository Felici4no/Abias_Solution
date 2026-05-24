# Back-end Tasks

## Status

- [x] Task 1: Criar estrutura inicial do back-end em `apps/api` usando MVC.
- [x] Task 2: Definir entidades centrais do dominio: entregador, conta conectada, score operacional, produto financeiro, transacao, parceiro local e cashback.
- [ ] Task 3: Implementar cadastro inicial de entregadores e validacao de dados.
- [ ] Task 4: Criar fluxo mockado de conexao com plataformas de entrega para simular dados do iFood/99.
- [ ] Task 5: Construir motor inicial de score operacional com regras transparentes e versionadas.
- [ ] Task 6: Criar modulo de limite dinamico para cartao de credito.
- [ ] Task 7: Criar modulo de pre-aprovacao de emprestimos com parametros de risco.
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
