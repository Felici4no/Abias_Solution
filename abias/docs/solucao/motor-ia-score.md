---
sidebar_position: 2
title: Motor de IA e Score Dinâmico
description: Detalhamento técnico do modelo de risco comportamental do Abias, variáveis de entrada e fórmula de cálculo do Score Operacional.
---

# Motor de IA e Score Dinâmico

O núcleo tecnológico do **Abias** é o seu **Motor de Risco Comportamental** — um algoritmo que substitui a análise retrospectiva dos birôs de crédito por uma avaliação preditiva baseada na atividade real e atual do entregador.

Enquanto o Serasa olha para o passado (dívidas antigas, inadimplências, ausência de histórico formal), o motor do Abias olha para o presente: quantos dias o trabalhador saiu para as ruas essa semana, quanto ele faturou, como os clientes avaliaram o serviço. São dados que já existem nas plataformas e que nunca foram usados para acessar crédito — até agora.

---

## Variáveis de entrada

Ao realizar o vínculo de conta com as plataformas parceiras via Open API, o motor ingere e processa três blocos de dados operacionais:

**Bloco 1 — Volume e Consistência (Liquidez)**
- Faturamento bruto diário
- Média de repasses semanais
- Frequência de dias ativos por mês

Esse bloco mede se o entregador tem renda real e recorrente. Um trabalhador que está nas ruas 5 dias por semana há 2 anos tem um perfil de liquidez muito mais confiável do que qualquer score de bureau poderia capturar.

**Bloco 2 — Eficiência e Qualidade (Comportamento)**
- Taxa de aceitação de corridas
- Taxa de cancelamento
- Nota média de avaliação pelos clientes

Esse bloco captura o comportamento profissional. Uma nota média alta ao longo do tempo, com baixa taxa de cancelamento, indica disciplina e compromisso — atributos diretamente correlacionados com boa gestão financeira.

**Bloco 3 — Resiliência e Histórico (Estabilidade)**
- Média de horas logadas ativamente por dia
- Tempo total de cadastro ativo na plataforma

Esse bloco mede seniority. Um entregador com 3 anos de plataforma que nunca sumiu por mais de uma semana demonstrou resiliência financeira na prática — passou por pandemia, alta da gasolina, baixa sazonal — e seguiu rodando.

---

## O Score Dinâmico Operacional

O score final varia de **0 a 1000 pontos** e é calculado com os seguintes pesos, calibrados para refletir o que realmente importa para a capacidade de pagamento do trabalhador:

| Fator | Peso |
|-------|------|
| Consistência de dias ativos | 30% |
| Ganho médio semanal | 25% |
| Avaliação média calibrada por região | 20% |
| Taxa de conclusão de entregas | 15% |
| Volume total de entregas | 10% |

O score é **atualizado automaticamente a cada 7 dias**. Se o entregador aumenta seu ritmo ou melhora suas avaliações, o score sobe imediatamente — e o limite de crédito acompanha na mesma semana. Não há burocracia de revisão manual, não há espera semestral.

---

## Mitigação do racismo algorítmico

Diferente dos modelos tradicionais do mercado brasileiro, que frequentemente usam o CEP residencial como variável de risco — penalizando sistematicamente moradores de bairros periféricos — o motor do Abias **exclui variáveis socioeconômicas e geográficas** do cálculo.

O algoritmo foca exclusivamente em dados de entrega e faturamento. Um entregador que mora na Zona Leste e outro que mora em Pinheiros, com o mesmo histórico operacional, recebem o mesmo score.

Além disso, a avaliação média é **calibrada por região**: uma nota 4.6 em um bairro onde a média da plataforma é 4.5 é tratada de forma diferente de uma nota 4.6 em um bairro onde a média é 4.9. Isso corrige o viés geográfico de avaliação que beneficia sistematicamente regiões com perfil socioeconômico mais alto.

---

## Base técnica e referências

- **Framework de Dados Alternativos:** Alinhado às diretrizes de Open Finance do Banco Central do Brasil
- **Mitigação de Viés em Machine Learning:** Baseado nos princípios de *Algorithmic Fairness* aplicados ao gerenciamento de risco de crédito contemporâneo
