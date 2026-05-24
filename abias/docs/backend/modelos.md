---
sidebar_position: 3
title: Models e Banco de Dados
---

# Models e Banco de Dados

Os models ficam em `apps/api/src/models/` e são o núcleo do sistema. Eles encapsulam toda a lógica de negócio e todas as interações com o PostgreSQL. Controllers não conhecem SQL — eles apenas chamam funções dos models e repassam os resultados.

As queries são escritas em SQL puro. Não há ORM. Isso foi uma escolha deliberada: para um sistema financeiro, saber exatamente o que está sendo executado no banco é mais importante do que a conveniência de um ORM.

---

## abiasMembrosModel

Gerencia a tabela `abias_membros`. É o ponto de entrada de todos os entregadores que se cadastram na plataforma.

| Função | Descrição |
|--------|-----------|
| `registerAbiasMembro(payload)` | Insere novo membro, valida que nome e telefone estão presentes, e tenta vincular ao `usuario_id` correspondente pelo telefone normalizado |
| `findAbiasMembro(id)` | Busca membro por id com os campos básicos |
| `findAbiasMembroComDados(id)` | Busca membro + dados iFood (`ifood_dados_operacionais`) + ranking (`score_operacional`) em uma única query com `LEFT JOIN LATERAL` |
| `updateAbiasMembroReputacao(id, delta)` | Soma `delta` à reputação do membro, com proteção para nunca ir abaixo de zero |
| `aplicarAvaliacaoAoMembro(id, score, parecer)` | Grava o score e o JSON do parecer da IA, atualiza o campo `avaliado_em` |

A função `findAbiasMembroComDados` é a mais complexa e a mais usada. Ela faz um join lateral para buscar os dados operacionais do iFood em uma única roundtrip ao banco, evitando múltiplas queries para montar o perfil completo do membro.

### Estrutura do objeto Membro

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
  "aiParecer": { "score": 720, "recomendacao": "APROVAR", "..." : "..." },
  "avaliadoEm": "2025-05-20T12:00:00Z",
  "criadoEm": "2025-03-10T09:30:00Z"
}
```

---

## abiasCiclosModel

Gerencia a tabela `abias_ciclos` e o saldo da tabela `abias_fundo`. É o model mais complexo do sistema, porque ele orquestra não apenas a persistência dos dados do ciclo, mas todos os efeitos colaterais de cada transição de estado.

| Função | Descrição |
|--------|-----------|
| `getFundoSaldo()` | Retorna o saldo atual da tabela `abias_fundo` (padrão inicial: R$ 4.820) |
| `adjustFundo(delta)` | Soma ou subtrai do saldo do fundo |
| `createCiclo(payload)` | Valida campos obrigatórios e insere novo ciclo no estado `draft` |
| `findCicloById(id)` | Busca ciclo por id |
| `findCicloAtivoPorMembro(membroId)` | Retorna o ciclo mais recente que não esteja `completed` ou `rejected` |
| `atualizarEstado(cicloId, novoEstado, justificativa)` | Aplica a transição de estado com todos os efeitos colaterais (reputação e fundo) |
| `registrarAval(cicloId, avaliadoPor, comentario)` | Adiciona aval de `marcos` ou `aline`; quando ambos aprovam, avança para `partner_quote` |
| `registrarEvidencia(cicloId, arquivo, observacao, tipo)` | Salva a evidência e avança para `evidence_review`, somando +20 de reputação |
| `registrarConfirmacaoOficina(cicloId, tipo)` | Para tipo `"orcamento"`: avança para `under_review` (+15 rep); para tipo `"servico"`: avança para `validated` com aporte de R$ 34 no fundo |

### Efeitos de reputação e fundo por evento

Cada ação significativa no ciclo tem consequências mensuráveis para o membro. A reputação sobe quando o comportamento é bom e desce quando o ciclo não se sustenta. Esses valores foram calibrados para que um ciclo completo do zero some aproximadamente 70 pontos — suficiente para mover um membro entre faixas de crédito ao longo de alguns ciclos.

| Evento | Reputação | Fundo |
|--------|-----------|-------|
| Ambos os avais aprovados | +10 | — |
| Oficina confirma orçamento | +15 | — |
| Empréstimo aprovado pela gestão | — | +R$ 34 |
| Evidência enviada pelo membro | +20 | — |
| Oficina confirma execução do serviço | — | +R$ 34 |
| Ciclo concluído | +25 | — |
| Ciclo recusado pela gestão | −30 | — |

---

## abiasAuthModel

Gerencia a tabela `abias_usuarios`. A senha nunca é armazenada em texto puro — o modelo usa a função `crypt()` do módulo `pgcrypto` do PostgreSQL para fazer o hashing com bcrypt diretamente no banco, sem passar pela aplicação.

| Função | Descrição |
|--------|-----------|
| `criarUsuario({ email, senha, role, nome })` | Insere usuário usando `crypt($senha, gen_salt('bf', 10))` para hash bcrypt |
| `autenticarUsuario({ email, senha })` | Autentica com `crypt($senha, senha_hash) = senha_hash` — a comparação ocorre inteiramente no PostgreSQL |
| `vincularMembro(usuarioId, membroId)` | Atualiza `membro_id` no usuário e tenta vincular o lado inverso (`abias_membros.usuario_id`) pelo telefone normalizado |
| `buscarUsuarioPorEmail(email)` | Busca pelo email normalizado (lowercase, sem espaços) |

A vinculação entre usuário e membro pode acontecer em dois momentos: no cadastro do membro (se o telefone já tem um usuário associado) ou via a rota `PATCH /abias/auth/usuarios/:id/membro` após o login. Isso permite que o fluxo de onboarding seja flexível, independente de qual cadastro acontece primeiro.

---

## abiasGestaoModel

Consolida as informações para o painel administrativo. É o model que a equipe Abias usa para tomar decisões de aprovação.

| Função | Descrição |
|--------|-----------|
| `getPainelGestao()` | Retorna todos os membros com dados iFood, ciclos ativos e a recomendação da IA |
| `getMembroLimites(membroId)` | Calcula os limites de crédito disponíveis para um membro específico |
| `getCiclosPendentes()` | Retorna todos os ciclos em estado `under_review`, prontos para decisão |

### Como os limites são calculados

O cálculo de limites em `calcLimites(ifood)` usa os dados operacionais do iFood como base, mas aplica múltiplos modificadores que refletem a visão de equidade da plataforma:

**Para o cartão:**
- Base = ganho semanal médio × 2
- Modificadores positivos por avaliação média alta, consistência de dias ativos e seniority na plataforma
- Modificadores negativos por taxa de cancelamento elevada
- Teto: R$ 2.000

**Para o empréstimo produtivo:**
- Base = ganho semanal médio × 6
- Gates de acesso: mínimo de 90 dias na plataforma, score Abias ≥ 300, avaliação média ≥ 3.8
- Modificadores por score, avaliação, seniority e volume de entregas
- Teto: R$ 5.000

---

## abiasAiModel

É o model mais estratégico da plataforma. Ele orquestra a análise de crédito feita pela IA, desde a coleta de dados até a gravação do resultado no perfil do membro.

### Fluxo de chamada

```
avaliarEAplicar(membroId)
  └─► gerarParecerComFallback(membroId)
        └─► gerarParecer(membroId)
              ├─► buscarContextoMembro()   — query complexa com dados iFood + histórico de ciclos
              ├─► montarPrompt()           — prompt com dados operacionais e critérios de equidade
              └─► callAI(prompt)
                    ├─► callGroq()    (primário: llama-3.3-70b-versatile via Groq)
                    └─► callGemini()  (fallback: gemini-2.0-flash-lite)
  └─► aplicarAvaliacaoAoMembro()  — grava score e parecer no banco
```

A escolha do Groq como primário e Gemini como fallback foi intencional: o modelo llama-3.3-70b tem melhor desempenho para raciocínio numérico e análises estruturadas. O Gemini entra quando a cota do Groq é atingida ou quando a chamada falha por qualquer motivo.

### O prompt e os critérios de equidade

O prompt enviado para a IA não é apenas técnico. Ele carrega uma instrução explícita sobre os vieses sistêmicos que afetam trabalhadores negros e periféricos:

- Avaliações das plataformas têm **viés racial documentado** — nota baixa não significa mau desempenho.
- Trabalhadores em zonas periféricas ganham menos por km porque os pedidos têm menor valor médio — renda menor não equivale a menos esforço.
- Taxa de cancelamento elevada pode refletir problemas mecânicos recorrentes — exatamente o que o crédito produtivo da Abias existe para resolver.
- **Reputação comunitária** (avais de pares, ciclos concluídos) vale mais do que score de plataforma.

Esses critérios garantem que a IA não reproduza os mesmos preconceitos dos sistemas financeiros tradicionais.

### Pesos do score (0–1000)

| Fator | Peso |
|-------|------|
| Consistência de dias ativos | 30% |
| Ganho médio semanal | 25% |
| Avaliação média calibrada por região | 20% |
| Taxa de conclusão de entregas | 15% |
| Volume de entregas | 10% |

### Estrutura da resposta da IA

```json
{
  "score": 720,
  "recomendacao": "APROVAR",
  "limiteCartao": {
    "valor": 900,
    "disponivel": true,
    "justificativa": "Consistência de 85% nos últimos 90 dias e avaliação acima da média regional."
  },
  "limiteEmprestimo": {
    "valor": 2000,
    "disponivel": true,
    "justificativa": "Ganho semanal estável e histórico sem ciclos rejeitados."
  },
  "analise": "Trabalhador com perfil sólido de consistência operacional...",
  "fatoresPositivos": ["Alta consistência de dias ativos", "Avaliação acima da média regional"],
  "pontosAtencao": ["Taxa de cancelamento ligeiramente acima do ideal"],
  "consideracaoEquidade": "Membro opera na Zona Leste, onde a avaliação média da plataforma é historicamente menor. Score foi calibrado considerando esse contexto.",
  "motivoNegacao": null
}
```

O campo `recomendacao` pode ser: `APROVAR`, `ANALISAR`, `REVISAR` ou `NEGAR`. A decisão final, porém, é sempre da equipe de gestão — a IA informa, mas não decide.
