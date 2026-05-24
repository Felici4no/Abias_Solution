---
sidebar_position: 1
title: Motor de IA e Score Dinâmico
description: "Detalhamento técnico do modelo de risco comportamental do Abias, variáveis de entrada e fórmula de cálculo do Score Operacional."
---

# Motor de IA e Score Dinâmico

O núcleo tecnológico do **Abias** é o seu **Motor de Risco Comportamental**, um algoritmo proprietário de aprendizado de máquina que substitui a análise retrospectiva dos birôs de crédito por uma avaliação preditiva em tempo real da atividade do entregador.

---

## 1. Variáveis de Entrada (Ingestão de Dados)

Ao realizar o vínculo de conta com as plataformas parceiras via Open API, o motor do Abias ingere e processa as seguintes variáveis operacionais, divididas em três blocos de dados:

1. **Volume e Consistência (Liquidez):** Faturamento bruto diário, média de repasses semanais e frequência de dias ativos na rua por mês.
2. **Eficiência e Qualidade (Comportamento):** Taxa de aceitação de corridas, taxa de cancelamento e nota média de avaliação atribuída pelos clientes e estabelecimentos.
3. **Resiliência e Tempo de Tela (Estabilidade):** Média de horas logadas ativamente por dia e tempo total de histórico do cadastro do entregador na plataforma.

## 2. A Fórmula do Score Dinâmico Operacional

Para garantir a mitigação do risco de crédito sem perpetuar os vieses geográficos ou de histórico passados abordados na nossa [seção de Problemática](../problematica/exclusao-e-vies.md), o cálculo do Score Abias confere pesos matemáticos estritamente associados à produtividade presente.

FORMULA

O score final varia de **0 a 1000 pontos**, atualizando-se de forma automática a cada **7 dias**. Caso o entregador aumente suas entregas ou melhore suas avaliações, seu score sobe imediatamente, refletindo em aumento de limite na mesma semana.

## 3. Mitigação do Racismo Algorítmico

Diferente dos modelos tradicionais do mercado brasileiro que usam o CEP residencial como variável de risco (penalizando moradores de bairros periféricos), o motor do Abias **omite variáveis socioeconômicas e geográficas** de sua esteira de cálculo de risco. O algoritmo foca exclusivamente em dados de entrega e faturamento do trabalhador, promovendo uma análise limpa, justa e blindada contra vieses históricos.

---

## Referências e Validações Científicas
* **Framework de Dados Alternativos:** Alinhado às diretrizes de Open Finance do *Banco Central do Brasil*.
* **Mitigação de Viés em Machine Learning:** Baseado nos princípios de *Algorithmic Fairness (Justiça Algorítmica)* aplicados ao gerenciamento de risco de crédito contemporâneo.