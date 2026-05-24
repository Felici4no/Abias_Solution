export function PerfilScreen({ ctrl }) {
  const { membro, reputacao, handleLogout } = ctrl

  const tierLabel = reputacao >= 800 ? 'MASTER TIER' : reputacao >= 700 ? 'GOLD TIER' : 'MEMBER TIER'
  const tierColor = reputacao >= 800 ? 'var(--color-gold)' : reputacao >= 700 ? '#c8a84b' : 'var(--text-secondary)'
  const scorePct = (reputacao / 1000) * 100

  const dadosOp = membro?.dadosOperacionais || null
  const rankingOp = membro?.rankingOperacional || null

  const badges = [
    { icon: 'fa-box', label: 'Entregas', sub: dadosOp?.entregasRealizadas ?? '–', color: 'var(--color-gold)' },
    { icon: 'fa-calendar-day', label: 'Dias ativos', sub: dadosOp?.diasAtivos ?? '–', color: 'var(--success)' },
    { icon: 'fa-star', label: 'Avaliação', sub: dadosOp?.avaliacaoMedia ? `${Number(dadosOp.avaliacaoMedia).toFixed(2)} ★` : '–', color: 'var(--color-magenta)' },
  ]

  const validations = [
    { icon: 'fa-handshake', label: 'Confiabilidade', sub: 'Avaliação média iFood', score: dadosOp?.avaliacaoMedia ? Number(dadosOp.avaliacaoMedia).toFixed(2) : '–' },
    { icon: 'fa-ban', label: 'Taxa de cancel.', sub: 'Últimos 90 dias', score: dadosOp?.taxaCancelamento ? `${(dadosOp.taxaCancelamento * 100).toFixed(1)}%` : '–' },
    { icon: 'fa-money-bill', label: 'Ganho médio', sub: 'por semana', score: dadosOp?.ganhoMedioSemanal ? `R$ ${Number(dadosOp.ganhoMedioSemanal).toFixed(0)}` : '–' },
  ]

  const history = dadosOp ? [
    { date: dadosOp.periodoFim ? new Date(dadosOp.periodoFim).toLocaleDateString() : '-', route: `${membro.regiao || 'Região'} — período`, score: dadosOp.bonusPeriodo ? `R$ ${Number(dadosOp.bonusPeriodo).toFixed(0)}` : '—' }
  ] : []

  return (
    <div className="screen active" id="screen-perfil" style={{ paddingBottom: '24px' }}>
      {/* Profile Hero */}
      <div style={{ padding: '24px 20px 0' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(201,154,61,0.12)', border: '2px solid var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: 'var(--color-gold)' }}>
              <i className="fa-solid fa-user"></i>
            </div>
            <span style={{ position: 'absolute', bottom: '-4px', right: '-4px', fontSize: '0.42rem', fontWeight: 800, padding: '2px 5px', background: 'var(--success)', borderRadius: '10px', color: '#fff', letterSpacing: '0.04em', border: '2px solid var(--bg-primary)' }}>VERIFIED</span>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', margin: 0, lineHeight: 1.1 }}>{membro.nome}</h3>
            <p style={{ fontSize: '0.62rem', color: tierColor, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '4px' }}>
              {tierLabel} • DESDE 2022
            </p>
            <p style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic', fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '4px', lineHeight: 1.3 }}>
              {membro.ferramenta} • {membro.tempo} de asfalto
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Reputation Score Bar */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
            <div>
              <p style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>REPUTATION SCORE</p>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{reputacao}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--success)', fontWeight: 700, display: 'block' }}>+12 pts este mês</span>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-secondary)' }}>TOP 15% DA REDE</span>
            </div>
          </div>
          <div style={{ height: '6px', background: 'rgba(255,255,255,0.06)', borderRadius: '3px', overflow: 'hidden' }}>
            <div style={{ width: `${scorePct}%`, height: '100%', background: 'linear-gradient(90deg, #9b59b6, #C99A3D, #F2C96E)', borderRadius: '3px', transition: 'width 0.8s ease' }}></div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.5rem', color: 'var(--text-secondary)' }}>
            <span>EXPERT</span><span>MASTER ELITE</span>
          </div>
        </div>

        {/* Total runs */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.55rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>TOTAL DE CICLOS</p>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>{dadosOp?.entregasRealizadas ?? '–'}</div>
            <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{dadosOp ? 'entregas registradas' : 'sem dados iFood'}</p>
          </div>
          <span style={{ fontSize: '0.55rem', fontWeight: 800, padding: '4px 10px', background: 'rgba(201,154,61,0.08)', border: '1px solid rgba(201,154,61,0.15)', borderRadius: '20px', color: 'var(--color-gold)', letterSpacing: '0.06em' }}>{rankingOp ? `TOP ${Math.max(1, Math.round(100 - rankingOp.percentilRanking))}%` : '—'}</span>
        </div>

        {/* Validations */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h5 style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>VALIDAÇÕES</h5>
          </div>
          {validations.map(({ icon, label, sub, score }) => (
            <div key={label} style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(201,154,61,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <i className={`fa-solid ${icon}`} style={{ fontSize: '0.8rem', color: 'var(--color-gold)' }}></i>
              </div>
              <div style={{ flex: 1 }}>
                <h6 style={{ fontSize: '0.75rem', fontWeight: 700 }}>{label}</h6>
                <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}>{sub}</p>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-gold)' }}>{score}</span>
            </div>
          ))}
          <div style={{ padding: '12px 16px' }}>
            <button style={{ width: '100%', padding: '10px', background: 'transparent', border: '1px solid var(--color-magenta)', borderRadius: '8px', color: 'var(--color-magenta)', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer', letterSpacing: '0.05em' }}>
              VER TODAS AS AVALIAÇÕES
            </button>
          </div>
        </div>

        {/* Earned Badges */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '16px' }}>
          <h5 style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>CONQUISTAS</h5>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
            {badges.map(({ icon, label, sub, color }) => (
              <div key={label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '12px 6px', textAlign: 'center' }}>
                <i className={`fa-solid ${icon}`} style={{ fontSize: '1.1rem', color, marginBottom: '6px', display: 'block' }}></i>
                <p style={{ fontSize: '0.55rem', fontWeight: 800, color: '#fff', lineHeight: 1.2 }}>{label}</p>
                <p style={{ fontSize: '0.5rem', color: 'var(--text-secondary)' }}>{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Operational History */}
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '12px', overflow: 'hidden' }}>
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-color)' }}>
            <h5 style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em' }}>HISTÓRICO OPERACIONAL</h5>
          </div>
          {history.map(({ date, route, score }) => (
            <div key={date} style={{ padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.04)', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '0.72rem', fontWeight: 600 }}>{route}</p>
                <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', color: 'var(--text-secondary)', marginTop: '2px' }}>{date}</p>
              </div>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', fontWeight: 700, color: 'var(--color-gold)', flexShrink: 0 }}>{score}</span>
            </div>
          ))}
        </div>

        {/* Região info */}
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '0.58rem', color: 'var(--text-secondary)', marginBottom: '2px' }}>Região Principal</p>
            <p style={{ fontSize: '0.8rem', fontWeight: 700 }}>{membro.regiao}</p>
          </div>
          <button onClick={handleLogout} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: 'var(--text-secondary)', fontSize: '0.65rem', cursor: 'pointer' }}>
            Sair
          </button>
        </div>
      </div>
    </div>
  )
}
