const fmt = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v)
const fmtPct = (v) => `${(v * 100).toFixed(1)}%`

export function CreditoScreen({ ctrl }) {
  const {
    cicloEstado, setCicloEstado, membro,
    currentAmount, currentFinalidade, currentOficina, currentPrazo, currentUrgencia,
    limiteCredito, taxaMensalJuros,
    valorOriginacao, valorJuros, totalMembro,
    parcelasValor, numParcelas,
    avaliacoes,
    foiNegado, motivoNegacao, parecerAi,
    inputAmount, setInputAmount, inputFinalidade, setInputFinalidade,
    inputPrazo, setInputPrazo, inputOficina, setInputOficina,
    inputUrgencia, setInputUrgencia, inputDescricao, setInputDescricao,
    handleSolicitacaoSubmit, handleConfirmarPlano,
    handleMarcosAval, handleAlineAval,
    handleNovoCiclo, getEstadoLabel
  } = ctrl

  if (cicloEstado === 'draft' && limiteCredito === 0) {
    if (foiNegado) return (
      <div style={{ padding: '24px 20px', paddingBottom: '24px' }}>
        <span style={{ fontSize: '0.55rem', fontWeight: 800, padding: '3px 10px', background: 'rgba(224,36,124,0.1)', border: '1px solid rgba(224,36,124,0.3)', borderRadius: '20px', color: 'var(--color-magenta)', letterSpacing: '0.1em' }}>CRÉDITO NEGADO</span>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em', marginTop: '10px', lineHeight: 1.1 }}>Análise<br />Concluída</h3>

        <div style={{ marginTop: '16px', background: 'rgba(224,36,124,0.06)', border: '1px solid rgba(224,36,124,0.2)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <i className="fa-solid fa-circle-xmark" style={{ color: 'var(--color-magenta)', fontSize: '0.9rem' }}></i>
            <p style={{ fontSize: '0.62rem', fontWeight: 800, color: 'var(--color-magenta)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Motivo da Recusa</p>
          </div>
          <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{motivoNegacao}</p>
        </div>

        {parecerAi?.pontosAtencao?.length > 0 && (
          <div style={{ marginTop: '12px', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px' }}>
            <p style={{ fontSize: '0.58rem', fontWeight: 800, color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '10px' }}>O que melhorar</p>
            {parecerAi.pontosAtencao.map((p) => (
              <div key={p} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginBottom: '7px' }}>
                <i className="fa-solid fa-arrow-right" style={{ color: 'var(--color-gold)', fontSize: '0.6rem', marginTop: '3px', flexShrink: 0 }}></i>
                <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{p}</span>
              </div>
            ))}
          </div>
        )}

        {parecerAi?.consideracaoEquidade && (
          <div style={{ marginTop: '12px', background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '12px', padding: '14px' }}>
            <p style={{ fontSize: '0.58rem', fontWeight: 800, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>A Abias reconhece</p>
            <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{parecerAi.consideracaoEquidade}</p>
          </div>
        )}

        <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', marginTop: '16px', textAlign: 'center', lineHeight: 1.4 }}>
          Continue rodando e construindo sua jornada.<br />
          <strong style={{ color: 'var(--color-gold)' }}>A Abias reavalia automaticamente com novos dados.</strong>
        </p>
      </div>
    )

    return (
      <div style={{ padding: '24px 20px', paddingBottom: '24px' }}>
        <span style={{ fontSize: '0.55rem', fontWeight: 800, padding: '3px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border-color)', borderRadius: '20px', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>SEM CRÉDITO</span>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em', marginTop: '10px', lineHeight: 1.1 }}>Aguardando<br />Avaliação</h3>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '10px', lineHeight: 1.5 }}>
          Seu limite de crédito será definido após a IA analisar seus dados operacionais do iFood. Isso acontece automaticamente após o cadastro.
        </p>
        <div style={{ marginTop: '20px', background: 'rgba(201,154,61,0.06)', border: '1px solid rgba(201,154,61,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {[
            ['fa-calendar-check', 'Dias ativos na plataforma'],
            ['fa-star',           'Avaliação média das entregas'],
            ['fa-route',          'Taxa de conclusão de rotas'],
            ['fa-wallet',         'Ganho médio semanal'],
          ].map(([icon, label]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className={`fa-solid ${icon}`} style={{ color: 'var(--color-gold)', fontSize: '0.75rem', width: '14px' }}></i>
              <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>{label}</span>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', marginTop: '14px', textAlign: 'center' }}>
          Acesse a aba <strong style={{ color: 'var(--color-gold)' }}>Reputação</strong> para acompanhar sua avaliação.
        </p>
      </div>
    )
  }

  if (cicloEstado === 'draft') return (
    <div style={{ paddingBottom: '24px' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <span style={{ fontSize: '0.55rem', fontWeight: 800, padding: '3px 10px', background: 'rgba(224,36,124,0.1)', border: '1px solid rgba(224,36,124,0.3)', borderRadius: '20px', color: 'var(--color-magenta)', letterSpacing: '0.1em' }}>NOVO CICLO</span>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em', marginTop: '10px', lineHeight: 1.1 }}>Crédito de Rede<br />Validado</h3>

        {/* Limite disponível */}
        <div style={{ marginTop: '14px', background: 'var(--bg-card)', border: '1px solid rgba(201,154,61,0.25)', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Seu limite disponível</p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--color-gold)', lineHeight: 1 }}>{fmt(limiteCredito)}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Juros a.m.</p>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>{fmtPct(taxaMensalJuros)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSolicitacaoSubmit} style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="mobile-form-group">
          <label className="form-label">Quanto você precisa?</label>
          <div className="money-input-wrapper">
            <span className="currency-symbol">R$</span>
            <input
              type="number" value={inputAmount}
              onChange={(e) => setInputAmount(Math.min(Number(e.target.value), limiteCredito))}
              min="100" max={limiteCredito} required />
          </div>
          <span className="form-helper">Máximo disponível para você: {fmt(limiteCredito)}</span>
        </div>

        {/* Preview do custo em tempo real */}
        {inputAmount >= 100 && (
          <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '12px 14px' }}>
            <p style={{ fontSize: '0.58rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>Simulação do ciclo</p>
            {[
              ['Valor solicitado', fmt(Number(inputAmount))],
              [`Originação (2%)`, fmt(Number(inputAmount) * 0.02)],
              [`Juros (${fmtPct(taxaMensalJuros)} × ${inputPrazo}d)`, fmt(Number(inputAmount) * taxaMensalJuros * (Number(inputPrazo) / 30))],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '3px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{l}</span>
                <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginTop: '6px', fontWeight: 800 }}>
              <span>Total a devolver</span>
              <span style={{ fontFamily: 'var(--font-mono)', color: 'var(--color-gold)' }}>
                {fmt(Number(inputAmount) * (1 + 0.02 + taxaMensalJuros * (Number(inputPrazo) / 30)))}
              </span>
            </div>
          </div>
        )}

        <div className="mobile-form-group">
          <label className="form-label">Qual a finalidade?</label>
          <div className="chips-selector">
            {['Pneu + Revisão','Troca de pneu','Revisão da moto','Celular de trabalho','Baú ou Mochila','Documentação','Seguro contra roubo','Equipamento de segurança','Emergência operacional'].map((fin) => (
              <label className="chip-option" key={fin}>
                <input type="radio" name="finalidade-mvp" value={fin} checked={inputFinalidade === fin} onChange={() => setInputFinalidade(fin)} />
                <span>{fin}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Prazo de pagamento</label>
          <select className="form-select" value={inputPrazo} onChange={(e) => setInputPrazo(e.target.value)}>
            <option value="7">7 dias — 1 parcela</option>
            <option value="15">15 dias — 2 parcelas</option>
            <option value="30">30 dias — 4 parcelas</option>
            <option value="45">45 dias — 6 parcelas</option>
          </select>
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Oficina credenciada</label>
          <input type="text" className="form-text-input" value={inputOficina} onChange={(e) => setInputOficina(e.target.value)} required />
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Nível de Urgência</label>
          <select className="form-select" value={inputUrgencia} onChange={(e) => setInputUrgencia(e.target.value)}>
            <option value="Baixa">Baixa — manutenção preventiva</option>
            <option value="Media">Média — avisos de desgaste</option>
            <option value="Alta">Alta — ferramenta parada ou risco</option>
          </select>
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Descrição da necessidade</label>
          <textarea className="form-textarea" value={inputDescricao} onChange={(e) => setInputDescricao(e.target.value)} placeholder="Explique porque o serviço é necessário." required />
        </div>
        <button type="submit" style={{ width: '100%', padding: '14px', background: 'var(--color-magenta)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
          Gerar plano de crédito
        </button>
      </form>
    </div>
  )

  if (cicloEstado === 'submitted') return (
    <div style={{ paddingBottom: '24px' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <span style={{ fontSize: '0.55rem', fontWeight: 800, padding: '3px 10px', background: 'rgba(201,154,61,0.1)', border: '1px solid rgba(201,154,61,0.3)', borderRadius: '20px', color: 'var(--color-gold)', letterSpacing: '0.1em' }}>PLANO GERADO</span>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em', marginTop: '10px' }}>Revise seu plano<br />de crédito</h3>
      </div>
      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Comprovante */}
        <div style={{ background: 'linear-gradient(135deg, #1a0a10 0%, #0d0b0b 100%)', border: '1px solid rgba(201,154,61,0.25)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: '0.85rem', fontWeight: 800 }}>Abias</span>
            <span style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', letterSpacing: '0.08em' }}>CRÉDITO PRODUTIVO</span>
          </div>
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              ['Finalidade', currentFinalidade],
              ['Oficina', currentOficina],
              ['Prazo', `${currentPrazo} dias`],
              ['Urgência', currentUrgencia],
            ].map(([l, v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>{l}</span>
                <span style={{ fontWeight: 600 }}>{v}</span>
              </div>
            ))}
          </div>
          <div style={{ padding: '14px 16px', background: 'rgba(201,154,61,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>Crédito solicitado</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.2rem', fontWeight: 700, color: 'var(--color-gold)' }}>{fmt(currentAmount)}</span>
          </div>
        </div>

        {/* Breakdown financeiro transparente */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
            <h5 style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>O QUE VOCÊ PAGA</h5>
          </div>
          <div style={{ padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {[
              ['Valor do crédito', fmt(currentAmount), null],
              [`Taxa de originação (2%)`, `+ ${fmt(valorOriginacao)}`, 'var(--text-secondary)'],
              [`Juros ${fmtPct(taxaMensalJuros)}/mês × ${currentPrazo}d`, `+ ${fmt(valorJuros)}`, 'var(--text-secondary)'],
            ].map(([l, v, c]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span style={{ color: 'var(--text-secondary)', flex: 1 }}>{l}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: c || 'var(--text-primary)', marginLeft: '8px' }}>{v}</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', padding: '8px 0 4px' }}>
              <div>
                <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>Total a devolver</span>
                <p style={{ fontSize: '0.58rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{numParcelas}x de {fmt(Number(parcelasValor))}</p>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-gold)' }}>{fmt(totalMembro)}</span>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
          <button style={{ width: '100%', padding: '14px', background: 'var(--color-magenta)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }} onClick={handleConfirmarPlano}>
            Confirmar solicitação
          </button>
          <button style={{ width: '100%', padding: '12px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => setCicloEstado('draft')}>
            Editar solicitação
          </button>
        </div>
      </div>
    </div>
  )

  if (cicloEstado === 'community_validation') return (
    <div style={{ paddingBottom: '24px' }}>
      <div style={{ padding: '20px 20px 0' }}>
        <span style={{ fontSize: '0.55rem', fontWeight: 800, padding: '3px 10px', background: 'rgba(201,154,61,0.1)', border: '1px solid rgba(201,154,61,0.3)', borderRadius: '20px', color: 'var(--color-gold)', letterSpacing: '0.1em' }}>VALIDAÇÃO DE REDE</span>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 900, letterSpacing: '-0.02em', marginTop: '10px' }}>Quem reconhece<br />sua jornada?</h3>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '6px', lineHeight: 1.4 }}>
          Na Abias, a rede ajuda a reconhecer o que o banco não sabe ler sozinho.
        </p>
      </div>
      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0', padding: '12px 14px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px' }}>
          {['JD', 'MK', 'AL'].map((init, i) => (
            <div key={init} style={{ width: '36px', height: '36px', borderRadius: '50%', background: `hsl(${i * 80 + 180}, 25%, 20%)`, border: '2px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', fontWeight: 800, marginLeft: i > 0 ? '-12px' : 0 }}>{init}</div>
          ))}
          <div style={{ marginLeft: '10px' }}>
            <p style={{ fontSize: '0.72rem', fontWeight: 700 }}>Membros da rede</p>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>prontos para validar</p>
          </div>
        </div>
        {[
          { key: 'marcos', nome: 'Marcos Santos', sub: 'Membro Indicador Leste', handler: handleMarcosAval, estado: avaliacoes.marcos, comment: avaliacoes.marcosComment },
          { key: 'aline',  nome: 'Aline Souza',   sub: 'Parceira de Rota Leste', handler: handleAlineAval,  estado: avaliacoes.aline,  comment: avaliacoes.alineComment }
        ].map(({ key, nome, sub, handler, estado, comment }) => (
          <div key={key} style={{ background: 'var(--bg-card)', border: `1px solid ${estado === 'approved' ? 'rgba(16,185,129,0.25)' : 'var(--border-color)'}`, borderRadius: '12px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'rgba(201,154,61,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <i className="fa-solid fa-user" style={{ fontSize: '0.85rem', color: 'var(--color-gold)' }}></i>
                </div>
                <div>
                  <h5 style={{ fontSize: '0.78rem', fontWeight: 800 }}>{nome}</h5>
                  <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>{sub}</span>
                </div>
              </div>
              <span style={{ fontSize: '0.5rem', fontWeight: 800, padding: '3px 8px', background: estado === 'approved' ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)', border: `1px solid ${estado === 'approved' ? 'rgba(16,185,129,0.3)' : 'var(--border-color)'}`, borderRadius: '20px', color: estado === 'approved' ? 'var(--success)' : 'var(--text-secondary)' }}>
                {estado === 'approved' ? 'VALIDADO' : 'PENDENTE'}
              </span>
            </div>
            {estado === 'pending' ? (
              <button style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }} onClick={handler}>
                <i className="fa-solid fa-signature" style={{ marginRight: '6px' }}></i>Registrar aval de {nome.split(' ')[0]}
              </button>
            ) : (
              <div style={{ background: 'rgba(16,185,129,0.05)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '8px', padding: '10px' }}>
                <p style={{ fontSize: '0.7rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: 1.4 }}>"{comment}"</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )

  if (['partner_quote','under_review','approved','evidence_pending','evidence_review','validated','completed','needs_revision','rejected'].includes(cicloEstado)) return (
    <div style={{ paddingBottom: '24px' }}>
      <div style={{ padding: '20px 20px 16px' }}>
        <span style={{ fontSize: '0.55rem', fontWeight: 800, padding: '3px 10px', background: cicloEstado === 'completed' ? 'rgba(16,185,129,0.1)' : 'rgba(224,36,124,0.1)', border: `1px solid ${cicloEstado === 'completed' ? 'rgba(16,185,129,0.3)' : 'rgba(224,36,124,0.3)'}`, borderRadius: '20px', color: cicloEstado === 'completed' ? 'var(--success)' : 'var(--color-magenta)', letterSpacing: '0.1em' }}>
          {cicloEstado === 'completed' ? 'CICLO CONCLUÍDO' : 'ACTIVE FLOW'}
        </span>
        <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.02em', marginTop: '10px', lineHeight: 1.1 }}>{currentFinalidade}</h3>
        <p style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic', fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
          {currentOficina} • {currentPrazo} dias • {numParcelas}x
        </p>
      </div>

      <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Status atual */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px' }}>
          <p style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '6px' }}>STATUS ATUAL</p>
          <h5 style={{ fontSize: '0.88rem', fontWeight: 800 }}>{getEstadoLabel(cicloEstado).label}</h5>
          <p style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>{getEstadoLabel(cicloEstado).step}</p>
        </div>

        {/* Resumo financeiro */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '10px 16px', borderBottom: '1px solid var(--border-color)' }}>
            <h5 style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>RESUMO DO CICLO</h5>
          </div>
          {[
            ['Crédito', fmt(currentAmount)],
            ['Originação + Juros', fmt(valorOriginacao + valorJuros)],
            [`Total a devolver`, fmt(totalMembro)],
            [`Parcelas`, `${numParcelas}x de ${fmt(Number(parcelasValor))}`],
          ].map(([l, v]) => (
            <div key={l} style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.67rem', color: 'var(--text-secondary)' }}>{l}</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 600 }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Ciclo concluído */}
        {cicloEstado === 'completed' && (
          <div style={{ background: 'linear-gradient(135deg, rgba(22,61,47,0.4) 0%, rgba(11,11,11,0.9) 100%)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)', fontSize: '1.2rem' }}></i>
              <h5 style={{ fontSize: '0.9rem', fontWeight: 800 }}>Ciclo Validado</h5>
            </div>
            <p style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic', fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.5, textAlign: 'center' }}>
              "Este ciclo fortaleceu a jornada de {membro.nome.split(' ')[0]} e contribuiu ao Fundo Abias."
            </p>
          </div>
        )}

        {cicloEstado !== 'completed' && (
          <button style={{ width: '100%', padding: '14px', background: 'var(--color-magenta)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
            Ver Comprovante
          </button>
        )}
        {cicloEstado === 'completed' && (
          <button style={{ width: '100%', padding: '14px', background: 'var(--color-magenta)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }} onClick={handleNovoCiclo}>
            Iniciar Novo Ciclo
          </button>
        )}
      </div>
    </div>
  )

  return null
}
