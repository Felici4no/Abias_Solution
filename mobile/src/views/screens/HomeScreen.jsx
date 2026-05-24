export function HomeScreen({ ctrl }) {
  const {
    membro, cicloEstado, reputacao, parecerAi,
    foiNegado, motivoNegacao,
    topPct, classificacao, sparkYs,
    avaliacoes,
    limiteCreditoCartao, taxaRotativoCartao,
    limiteEmprestimo, taxaMensalJuros,
    cashbackSaldo, TETO_CASHBACK,
    currentAmount, currentFinalidade,
    handleNovoCiclo, setActiveTab
  } = ctrl

  const fmtBRL = (v) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 }).format(v)

  const now = new Date()
  const days = ['Domingo','Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado']
  const months = ['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro']
  const dateStr = `${days[now.getDay()]}, ${now.getDate()} de ${months[now.getMonth()]}`
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite'
  const firstName = membro?.nome?.split(' ')[0] || 'Membro'
  const semScore = reputacao === 0
  const tierLabel = reputacao >= 800 ? 'ELITE' : reputacao >= 700 ? 'GOLD' : reputacao > 0 ? 'MEMBER' : 'NOVO'
  const isElite = reputacao >= 700

  const sparkPath = sparkYs.map((y, i) => `${i * 30},${90 - y}`).join(' ')

  const ctaStyle = {
    width: '100%', padding: '14px',
    background: 'var(--color-magenta)', border: 'none',
    borderRadius: '8px', color: '#fff', fontWeight: 800,
    fontSize: '0.85rem', cursor: 'pointer', letterSpacing: '0.03em',
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
  }

  const renderCTA = () => {
    if (cicloEstado === 'draft')
      return <button style={ctaStyle} onClick={() => setActiveTab('credito')}><i className="fa-solid fa-route"></i> Solicitar crédito de jornada</button>
    if (cicloEstado === 'community_validation')
      return <button style={ctaStyle} onClick={() => setActiveTab('credito')}><i className="fa-solid fa-users-double"></i> Acompanhar validação</button>
    if (cicloEstado === 'evidence_pending')
      return <button style={ctaStyle} onClick={() => setActiveTab('credito')}><i className="fa-solid fa-upload"></i> Enviar evidência</button>
    if (cicloEstado === 'completed')
      return <button style={ctaStyle} onClick={handleNovoCiclo}><i className="fa-solid fa-rotate-left"></i> Iniciar novo ciclo</button>
    return <button style={ctaStyle} onClick={() => setActiveTab('credito')}><i className="fa-solid fa-route"></i> Acompanhar ciclo</button>
  }

  const hasAval = avaliacoes?.marcos === 'approved' || avaliacoes?.aline === 'approved'

  const activities = [
    { icon: 'fa-circle-check', label: 'Membro cadastrado na rede', sub: `Abias — ${membro?.regiao || 'Rede'}`, badge: 'VERIFICADO', bc: 'var(--success)', bb: 'rgba(16,185,129,0.1)' },
    ...(reputacao > 0 ? [{ icon: 'fa-robot', label: `Score avaliado: ${reputacao} pts`, sub: parecerAi?.recomendacao ? `IA: ${parecerAi.recomendacao}` : 'Baseado em dados operacionais', badge: 'AVALIADO', bc: 'var(--color-gold)', bb: 'rgba(201,154,61,0.1)' }] : []),
    ...(reputacao > 0 && limiteEmprestimo > 0 ? [{ icon: 'fa-route', label: `Limite empréstimo: ${fmtBRL(limiteEmprestimo)}`, sub: 'Baseado em reputação', badge: 'DEFINIDO', bc: 'var(--color-gold)', bb: 'rgba(201,154,61,0.1)' }] : []),
    ...(cicloEstado !== 'draft' ? [{ icon: 'fa-file-invoice', label: `Ciclo: ${currentFinalidade}`, sub: `R$ ${currentAmount}`, badge: 'ATIVO', bc: 'var(--color-magenta)', bb: 'rgba(224,36,124,0.1)' }] : []),
    ...(hasAval ? [{ icon: 'fa-signature', label: 'Aval comunitário confirmado', sub: 'Validação da rede registrada', badge: 'CONFIRMADO', bc: 'var(--success)', bb: 'rgba(16,185,129,0.1)' }] : [])
  ]

  return (
    <div className="screen active" id="screen-home" style={{ paddingBottom: '24px' }}>
      {/* Date + greeting */}
      <div style={{ padding: '20px 20px 0' }}>
        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: '4px' }}>{dateStr}</p>
        <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.7rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.1 }}>
          {greeting}, <em style={{ fontFamily: 'var(--font-italic)', color: 'var(--color-gold)', fontStyle: 'italic' }}>{firstName}.</em>
        </h2>
      </div>

      {/* Operational Score Card */}
      <div style={{ margin: '16px 20px 0', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
          <div>
            <p style={{ fontSize: '0.58rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Score Operacional</p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '2.2rem', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em', lineHeight: 1 }}>
              {reputacao}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              {reputacao === 0 ? (
                <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>Aguardando avaliação da IA</span>
              ) : (
                <>
                  <i className="fa-solid fa-arrow-trend-up" style={{ color: 'var(--success)', fontSize: '0.65rem' }}></i>
                  <span style={{ fontSize: '0.6rem', color: 'var(--success)' }}>
                    {topPct != null ? `Top ${topPct}% da rede` : classificacao || `Score ${reputacao} pts`}
                    {parecerAi?.recomendacao ? ` — ${parecerAi.recomendacao}` : ''}
                  </span>
                </>
              )}
            </div>
          </div>
          <span style={{
            fontSize: '0.55rem', fontWeight: 800, padding: '4px 10px',
            background: isElite ? 'rgba(201,154,61,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${isElite ? 'rgba(201,154,61,0.35)' : 'var(--border-color)'}`,
            borderRadius: '20px',
            color: isElite ? 'var(--color-gold)' : 'var(--text-secondary)',
            letterSpacing: '0.08em', whiteSpace: 'nowrap'
          }}>{tierLabel} STATUS</span>
        </div>
        <div style={{ position: 'relative', height: '44px', overflow: 'hidden' }}>
          <svg width="100%" height="44" viewBox="0 0 270 90" preserveAspectRatio="none" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(201,154,61,0.3)" />
                <stop offset="100%" stopColor="rgba(201,154,61,0.9)" />
              </linearGradient>
            </defs>
            <polyline points={sparkPath} fill="none" stroke="rgba(201,154,61,0.25)" strokeWidth="3" strokeDasharray="6 3" />
            <polyline points={sparkPath} fill="none" stroke="url(#sparkGrad)" strokeWidth="1.5" />
          </svg>
          <div style={{ position: 'absolute', bottom: '0', left: '0', right: '0', display: 'flex', justifyContent: 'space-between', fontSize: '0.5rem', color: 'var(--text-secondary)', padding: '0 2px' }}>
            {reputacao === 0
              ? <><span>—</span><span style={{ letterSpacing: '0.06em' }}>SEM DADOS</span><span>—</span></>
              : <><span>INÍCIO</span><span>EVOLUÇÃO</span><span>AGORA</span></>
            }
          </div>
        </div>
      </div>

      {/* Dois produtos lado a lado: Cartão | Empréstimo */}
      {semScore ? (
        foiNegado ? (
          <div style={{ margin: '10px 20px 0', background: 'rgba(224,36,124,0.06)', border: '1px solid rgba(224,36,124,0.25)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <i className="fa-solid fa-circle-xmark" style={{ fontSize: '1rem', color: 'var(--color-magenta)', flexShrink: 0 }}></i>
              <p style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--color-magenta)' }}>Crédito não disponível</p>
            </div>
            <p style={{ fontSize: '0.63rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>{motivoNegacao}</p>
            <p style={{ fontSize: '0.58rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Acesse <strong style={{ color: 'var(--color-gold)' }}>Reputação</strong> para ver a análise completa.
            </p>
          </div>
        ) : (
          <div style={{ margin: '10px 20px 0', background: 'rgba(201,154,61,0.05)', border: '1px solid rgba(201,154,61,0.2)', borderRadius: '12px', padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <i className="fa-solid fa-robot" style={{ fontSize: '1.2rem', color: 'var(--color-gold)', flexShrink: 0 }}></i>
            <div>
              <p style={{ fontSize: '0.72rem', fontWeight: 800, marginBottom: '3px' }}>IA avaliando sua jornada</p>
              <p style={{ fontSize: '0.63rem', color: 'var(--text-secondary)', lineHeight: 1.35 }}>Seus limites serão definidos após a análise dos seus dados operacionais. Acesse a aba Reputação para acompanhar.</p>
            </div>
          </div>
        )
      ) : (
        <div style={{ margin: '10px 20px 0', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {/* Cartão ABIAS */}
          <div
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px', cursor: 'pointer' }}
            onClick={() => setActiveTab('credito')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <i className="fa-solid fa-credit-card" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}></i>
              <span style={{ fontSize: '0.44rem', fontWeight: 800, padding: '2px 6px', background: 'rgba(201,154,61,0.1)', border: '1px solid rgba(201,154,61,0.3)', borderRadius: '20px', color: 'var(--color-gold)', letterSpacing: '0.06em' }}>CARTÃO</span>
            </div>
            <p style={{ fontSize: '0.52rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Limite</p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{fmtBRL(limiteCreditoCartao)}</div>
            <p style={{ fontSize: '0.56rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Rotativo {(taxaRotativoCartao * 100).toFixed(1)}% a.m.</p>
          </div>

          {/* Empréstimo Produtivo */}
          <div
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px', cursor: 'pointer' }}
            onClick={() => setActiveTab('credito')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <i className="fa-solid fa-hand-holding-dollar" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}></i>
              <span style={{ fontSize: '0.44rem', fontWeight: 800, padding: '2px 6px', background: 'rgba(224,36,124,0.1)', border: '1px solid rgba(224,36,124,0.3)', borderRadius: '20px', color: 'var(--color-magenta)', letterSpacing: '0.06em' }}>EMPRÉSTIMO</span>
            </div>
            <p style={{ fontSize: '0.52rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Disponível</p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{fmtBRL(limiteEmprestimo)}</div>
            <p style={{ fontSize: '0.56rem', color: 'var(--text-secondary)', marginTop: '4px' }}>Juros {(taxaMensalJuros * 100).toFixed(1)}% a.m.</p>
          </div>
        </div>
      )}

      {/* Cashback acumulado — só aparece após avaliação e uso */}
      {cashbackSaldo > 0 && <div style={{ margin: '10px 20px 0', background: 'rgba(22,61,47,0.25)', border: '1px solid rgba(74,222,128,0.15)', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <i className="fa-solid fa-piggy-bank" style={{ fontSize: '0.9rem', color: 'var(--success)' }}></i>
          <div>
            <p style={{ fontSize: '0.52rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>Cashback acumulado</p>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>R$ 2,00 por compra em território comunitário • teto {fmtBRL(TETO_CASHBACK)}</p>
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1rem', fontWeight: 700, color: 'var(--success)' }}>
            {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cashbackSaldo)}
          </div>
          <p style={{ fontSize: '0.5rem', color: 'var(--success)', marginTop: '2px', fontWeight: 700 }}>disponível para resgatar</p>
        </div>
      </div>}

      {/* Recent Activity */}
      <div style={{ padding: '16px 20px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h4 style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>ATIVIDADE RECENTE</h4>
          <span style={{ fontSize: '0.58rem', color: 'var(--color-gold)', fontWeight: 700, letterSpacing: '0.05em', cursor: 'pointer' }}>VER HISTÓRICO</span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
          {activities.map(({ icon, label, sub, badge, bc, bb }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={`fa-solid ${icon}`} style={{ fontSize: '0.7rem', color: 'var(--color-gold)' }}></i>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <h5 style={{ fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</h5>
                <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>{sub}</p>
              </div>
              <span style={{ fontSize: '0.46rem', fontWeight: 800, padding: '3px 6px', background: bb, borderRadius: '4px', color: bc, letterSpacing: '0.05em', flexShrink: 0, whiteSpace: 'nowrap' }}>{badge}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: '14px 20px 0' }}>
        {renderCTA()}
      </div>
    </div>
  )
}
