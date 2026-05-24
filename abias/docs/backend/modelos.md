---
sidebar_position: 3
title: Models e Banco de Dados
---

# Models e Banco de Dados

Os models ficam em `apps/api/src/models/` e encapsulam toda a lógica de negócio e acesso ao PostgreSQL.

## abiasMembrosModel

Gerencia a tabela `abias_membros`.

| Função | Descrição |
|--------|-----------|
| `registerAbiasMembro(payload)` | Insere novo membro, valida nome e telefone mínimos, tenta vincular ao `usuario_id` pelo telefone normalizado |
| `findAbiasMembro(id)` | Busca membro por id (campos básicos) |
| `findAbiasMembroComDados(id)` | Busca membro + dados iFood (`ifood_dados_operacionais`) + ranking (`score_operacional`) em uma única query com `LEFT JOIN LATERAL` |
| `updateAbiasMembroReputacao(id, delta)` | Soma `delta` à reputação do membro (nunca vai abaixo de 0) |
| `aplicarAvaliacaoAoMembro(id, score, parecer)` | Grava score e JSON do parecer da IA, atualiza `avaliado_em` |

### Entidade Membro

```json
{
  "id": "uuid",
  "nome": "João Silva",
  "apelido": "João",
  "telefone": "11999998888",
  "regiao": "Zona Leste",
  "tempo": "3 anos",
  "ferramenta": "Moto",
  "raca": "Preto",
  "reputacao": 650,
  "totalCiclos": 2,
  "cashbackSaldo": 12.00,
  "aiParecer": { ... },
  "avaliadoEm": "2025-05-20T12:00:00Z",
  "criadoEm": "2025-03-10T09:30:00Z"
}
```

---

## abiasCiclosModel

Gerencia a tabela `abias_ciclos` e o saldo do `abias_fundo`.

| Função | Descrição |
|--------|-----------|
| `createCiclo(payload)` | Valida campos obrigatórios e insere novo ciclo no estado `draft` |
| `findCicloById(id)` | Busca ciclo por id |
| `findCicloAtivoPorMembro(membroId)` | Retorna o ciclo mais recente que não esteja `completed` ou `rejected` |
| `atualizarEstado(cicloId, novoEstado, justificativa)` | Aplica transição de estado com efeitos colaterais (reputação e fundo) |
| `registrarAval(cicloId, avaliadoPor, comentario)` | Adiciona aval de `marcos` ou `aline`; quando ambos aprovam avança para `partner_quote` |
| `registrarEvidencia(cicloId, arquivo, observacao, tipo)` | Salva evidência e avança para `evidence_review` (+20 reputação) |
| `registrarConfirmacaoOficina(cicloId, tipo)` | `"orcamento"` → `under_review` (+15 rep); `"servico"` → `validated` (fundo +R$34) |

### Efeitos de reputação por evento

| Evento | Delta reputação | Delta fundo |
|--------|----------------|-------------|
| Ambos avais aprovados | +10 | — |
| Oficina confirma orçamento | +15 | — |
| Empréstimo aprovado | — | +R$ 34 |
| Evidência enviada | +20 | — |
| Oficina confirma serviço | — | +R$ 34 |
| Ciclo concluído | +25 | — |
| Ciclo recusado | −30 | — |

---

## abiasAuthModel

Gerencia a tabela `abias_usuarios` com senha usando `bcrypt` do PostgreSQL (`pgcrypto`).

| Função | Descrição |
|--------|-----------|
| `criarUsuario({ email, senha, role, nome })` | Insere usuário com `crypt($senha, gen_salt('bf', 10))` |
| `autenticarUsuario({ email, senha })` | Consulta com `crypt($senha, senha_hash) = senha_hash` |
| `vincularMembro(usuarioId, membroId)` | Atualiza `membro_id` no usuário e tenta vincular o lado inverso (`abias_membros.usuario_id`) pelo telefone normalizado |
| `buscarUsuarioPorEmail(email)` | Busca pelo email normalizado (lowercase, sem espaços) |

---

## abiasAiModel

Orquestra a avaliação de crédito via IA.

### Fluxo de chamada

```
avaliarEAplicar(membroId)
  └─► gerarParecerComFallback(membroId)
        └─► gerarParecer(membroId)
              ├─► buscarContextoMembro()   — query complexa com dados iFood + histórico
              ├─► montarPrompt()           — prompt com critérios de equidade
              └─► callAI(prompt)
                    ├─► callGroq()   (primário: llama-3.3-70b via Groq)
                    └─► callGemini() (fallback: gemini-2.0-flash-lite)
  └─► aplicarAvaliacaoAoMembro()  — grava score e parecer no banco
```

### Critérios de equidade no prompt

A IA é instruída a considerar:

- Avaliações das plataformas têm **viés racial documentado** — nota baixa ≠ mau desempenho.
- Trabalhadores em zonas periféricas ganham menos por km — renda menor ≠ menos esforço.
- Taxa de cancelamento pode refletir problemas mecânicos, exatamente o que o crédito produtivo resolve.
- Reputação comunitária (avais de pares, ciclos Abias) vale mais que score de plataforma.

### Pesos do score (0–1000)

| Fator | Peso |
|-------|------|
| Consistência de dias ativos | 30% |
| Ganho médio semanal | 25% |
| Avaliação média calibrada por região | 20% |
| Taxa de conclusão de entregas | 15% |
| Volume de entregas | 10% |

### Resposta da IA

```json
{
  "score": 720,
  "recomendacao": "APROVAR",
  "limiteCartao": { "valor": 900, "disponivel": true, "justificativa": "..." },
  "limiteEmprestimo": { "valor": 2000, "disponivel": true, "justificativa": "..." },
  "analise": "...",
  "fatoresPositivos": ["..."],
  "pontosAtencao": ["..."],
  "consideracaoEquidade": "...",
  "motivoNegacao": null
}
```
