---
sidebar_position: 1
title: Viabilidade da Solução
---

# Viabilidade da Solução

A Abias é financeiramente sustentável porque captura receita em cada passo do ciclo produtivo — sem depender de tarifas abusivas nem de capital externo para crescer.

---

## Modelo de Receita

Cada ciclo de empréstimo gera três fontes de receita simultâneas:

| Fonte | Quem paga | Taxa | Exemplo (R$ 850) |
|-------|-----------|------|-----------------|
| **Interchange** | Oficina parceira | 3% do valor | R$ 25,50 |
| **Originação** | Membro | 2% do valor | R$ 17,00 |
| **Juros** | Membro | Variável por prazo e reputação | R$ 17,85¹ |
| **Total por ciclo** | — | — | **R$ 60,35** |

> ¹ Exemplo com taxa de 2,5% a.m. (reputação ≥ 800) e prazo de 30 dias.

### Distribuição da receita

```
Receita total do ciclo
        │
        ├── 40% → Fundo Comunitário   (ex: R$ 24,14 por ciclo)
        └── 60% → Operações da Abias  (ex: R$ 36,21 por ciclo)
```

O **fundo comunitário** é capitalizado automaticamente a cada ciclo concluído, criando um mecanismo de auto-sustentação: quanto mais membros concluem ciclos, maior o fundo disponível para novos empréstimos.

---

## Produtos Financeiros

### Empréstimo Produtivo

Voltado para manutenção da ferramenta de trabalho (moto, equipamento, documentação). O crédito vai diretamente para a oficina parceira — o membro nunca recebe o dinheiro em mãos, eliminando o risco de desvio de finalidade.

| Faixa de Reputação | Limite | Taxa mensal |
|--------------------|--------|-------------|
| 0 | R$ 0 | — |
| 1 – 499 | R$ 400 | 7,0% |
| 500 – 599 | R$ 700 | 5,5% |
| 600 – 699 | R$ 1.200 | 4,5% |
| 700 – 799 | R$ 2.000 | 3,5% |
| 800 – 1000 | R$ 3.000 | 2,5% |

### Cartão Abias

Cartão de crédito rotativo para compras do dia a dia em território comunitário. Gera receita de interchange para a Abias nas transações.

| Faixa de Reputação | Limite | Taxa do rotativo |
|--------------------|--------|-----------------|
| 0 | R$ 0 | — |
| 1 – 499 | R$ 120 | 15,9% a.m. |
| 500 – 599 | R$ 250 | 13,9% a.m. |
| 600 – 699 | R$ 500 | 11,9% a.m. |
| 700 – 799 | R$ 900 | 9,9% a.m. |
| 800 – 1000 | R$ 1.500 | 7,9% a.m. |

> As taxas são menores que qualquer cartão de banco tradicional para este perfil de cliente — e ainda assim viáveis, pois o risco é avaliado com dados operacionais reais, não com score Serasa.

### Cashback Comunitário

R$ 2,00 de cashback por compra realizada em parceiros locais da rede, com teto de R$ 200,00. Incentiva o giro econômico dentro da própria comunidade.

---

## Fundo Comunitário

O fundo é o coração da operação. Ele garante liquidez para novos empréstimos e cresce automaticamente com cada ciclo concluído.

### Como o fundo é capitalizado

| Evento | Entrada no fundo |
|--------|-----------------|
| Empréstimo aprovado pela gestão | + R$ 34,00 |
| Oficina confirma execução do serviço | + R$ 34,00 |
| **Por ciclo concluído** | **+ R$ 68,00** |

> Saldo inicial do fundo para o MVP: **R$ 4.820,00** — suficiente para ~70 ciclos simultâneos no valor médio de R$ 850.

### Proteção contra inadimplência

O modelo reduz drasticamente o risco de calote por três razões:

1. **Crédito vinculado**: o dinheiro vai direto à oficina, não ao membro.
2. **Validação comunitária**: dois pares da rede avaliam o solicitante antes da aprovação.
3. **Penalidade de reputação**: ciclo recusado desconta 30 pontos — impactando diretamente o limite futuro.

---

## Escalabilidade

```
Fase 1 — MVP (Hackathon)
  50 membros ativos
  Fundo: R$ 4.820
  Receita estimada: R$ 3.000/mês

Fase 2 — Expansão piloto
  500 membros ativos (1 cidade)
  Fundo: R$ 50.000+
  Receita estimada: R$ 30.000/mês

Fase 3 — Multi-cidade
  5.000 membros ativos
  Fundo: R$ 500.000+
  Receita estimada: R$ 300.000/mês
```

A estrutura tecnológica já suporta escala: a API é stateless, o banco é PostgreSQL com pool de conexões, e a IA de análise de crédito (Groq + Gemini) opera por chamada sem custo fixo.

---

## Comparativo com o Mercado

| Produto | Taxa mensal | Limite típico | Critério de análise |
|---------|------------|---------------|---------------------|
| Cartão tradicional (perfil informal) | 18%–35% | R$ 300–500 | Score Serasa + renda formal |
| Crédito consignado app | 3%–6% | R$ 500–1.000 | Vínculo empregatício formal |
| Empréstimo Abias | **2,5%–7,0%** | **R$ 400–3.000** | **Dados operacionais + reputação comunitária** |

A Abias oferece crédito mais barato para quem os bancos consideram de alto risco — porque usa dados melhores para calcular esse risco.

---

## Por que funciona para os dois lados

**Para o membro:**
- Acesso a crédito produtivo sem precisar de score Serasa, conta em banco ou renda formal comprovada.
- Taxas menores conforme a reputação cresce — comportamento bom é recompensado.

**Para a Abias:**
- Receita diversificada (interchange + originação + juros) sem dependência de um único produto.
- Risco controlado por dados operacionais reais e validação comunitária.
- Fundo auto-capitalizado: o crescimento da base financia o crescimento do fundo.
