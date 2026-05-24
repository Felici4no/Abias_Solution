---
sidebar_position: 1
title: Introdução
slug: /
---

# Abias — Crédito produtivo para quem move a cidade

A Abias nasceu de uma pergunta simples: por que um entregador que trabalha dez horas por dia, seis dias por semana, não consegue um empréstimo de R$ 800 para consertar a moto que é o seu único instrumento de trabalho?

A resposta não é falta de capacidade de pagamento. É falta de visibilidade. Os bancos tradicionais enxergam esse trabalhador como "informal", "sem renda comprovável", "de alto risco". O score da Serasa não captura consistência de entrega, nem lealdade de clientes, nem a reputação construída dentro da comunidade ao longo de anos. Enxerga apenas a ausência de carteira assinada.

A Abias resolve isso com uma mudança de perspectiva: em vez de perguntar "esse trabalhador tem emprego formal?", ela pergunta "esse trabalhador é confiável dentro da sua rede?". E usa dados reais — operacionais, comunitários e comportamentais — para responder essa pergunta com precisão.

---

## O que é a Abias

A Abias é uma plataforma de crédito produtivo comunitário voltada para entregadores de aplicativo, com foco em trabalhadores negros e periféricos. Ela oferece dois produtos financeiros principais:

- **Empréstimo produtivo**: crédito para manutenção da ferramenta de trabalho (moto, bicicleta, equipamentos). O dinheiro vai diretamente para a oficina parceira, eliminando o risco de desvio de finalidade e garantindo que o ciclo seja genuinamente produtivo.
- **Cartão Abias**: cartão de crédito rotativo para uso em parceiros locais da rede comunitária, com cashback em cada compra.

Ambos os produtos têm suas taxas e limites determinados por um único fator: a **reputação** do membro dentro da rede Abias. Quanto mais o trabalhador usa a plataforma, conclui ciclos, e é avaliado positivamente pelos pares, maior seu limite e menor sua taxa.

---

## Como funciona na prática

O fluxo central da plataforma é o **ciclo de crédito**. Quando um membro precisa de crédito, ele abre um ciclo descrevendo o que precisa: conserto da moto, troca de pneu, regularização de documentação. A partir daí, o pedido passa por uma série de validações antes do dinheiro sair do fundo:

1. **Planejamento**: o membro descreve a necessidade, indica a oficina e o valor estimado.
2. **Validação comunitária**: dois pares da rede — membros de confiança chamados Marcos e Aline — avaliam o pedido e emitem seus avais.
3. **Cotação da oficina**: a oficina parceira confirma o orçamento diretamente na plataforma.
4. **Aprovação pela gestão**: a equipe Abias revisa o ciclo com apoio de uma análise de IA e toma a decisão final.
5. **Execução e evidência**: o membro executa o serviço e envia uma foto ou recibo como comprovante.
6. **Validação final**: a oficina confirma que o serviço foi realizado. O ciclo é concluído, o membro ganha reputação, e o fundo comunitário é reabastecido.

Cada etapa que o membro conclui com sucesso adiciona pontos à sua reputação. Cada ciclo encerrado fortalece o fundo. O sistema é projetado para que bom comportamento seja recompensado de forma tangível — não apenas em reputação abstrata, mas em limites maiores e taxas menores no próximo ciclo.

---

## A inteligência por trás da análise de crédito

A plataforma usa uma IA (Groq com modelo llama-3.3-70b, com fallback para o Gemini da Google) para analisar os dados operacionais do membro antes de qualquer decisão de crédito. Mas essa IA foi instruída com um cuidado específico: ela conhece os vieses sistêmicos que afetam trabalhadores negros e periféricos.

O prompt de análise é explícito sobre isso. Nota baixa nas plataformas de entrega não significa mau desempenho — pode significar que o trabalhador atua em áreas onde os clientes avaliam pior. Ganho semanal menor não significa menos esforço — pode significar que o trabalhador cobre zonas com menor densidade de pedidos. A IA é treinada para separar o sinal do ruído e dar peso à reputação comunitária, que é o ativo mais relevante para esse perfil de crédito.

---

## Estrutura técnica do projeto

O projeto é um monorepo com dois serviços principais:

| Serviço | Tecnologia | Localização |
|---------|------------|-------------|
| API (back-end) | Node.js puro, PostgreSQL | `apps/api/` |
| App (front-end) | React + Vite (PWA) | `mobile/` |
| Documentação | Docusaurus | `abias/` |

Para rodar o projeto completo localmente:

```bash
# Na raiz do monorepo
npm install
npm run dev
```

O front-end sobe em `http://localhost:5173` e a API em `http://localhost:3000`. O Vite faz proxy automático das chamadas `/api/*` para a API.

### Credenciais de demonstração

| Perfil | Email | Senha | Reputação |
|--------|-------|-------|-----------|
| Membro (experiente) | `joao@abias.app` | `joao123` | 720 |
| Membro (novo) | `carlos@abias.app` | `carlos123` | 0 |
| Oficina | — | — | — |
| Gestão | — | — | — |

Os perfis de oficina e gestão podem ser acessados diretamente na tela de login, sem necessidade de credenciais, para fins de demonstração.

---

## Navegando nesta documentação

Esta documentação está organizada em quatro seções:

- **Back-end** — Arquitetura da API, rotas disponíveis, modelos de dados e integração com IA.
- **Front-end** — Estrutura do PWA, telas por perfil, e o hook central que orquestra toda a aplicação.
- **Viabilidade** — Modelo de receita, produtos financeiros, fundo comunitário e projeções de escala.

Cada seção foi escrita para ser lida de forma linear, do geral para o específico. Se você está entrando no projeto pela primeira vez, a sequência recomendada é: Introdução → Back-end Visão Geral → Rotas → Modelos → Front-end Visão Geral → Telas → Controller → Viabilidade.
