export function RedeScreen({ ctrl }) {
  const { fundo, cicloEstado } = ctrl

  const flowSteps = [
    { key: 'credito', label: '1. Crédito na Rede', desc: 'Crédito produtivo para a moto.', color: 'var(--color-gold)', active: ['submitted','community_validation'].includes(cicloEstado), border: 'var(--color-gold)', bg: 'rgba(201, 154, 61, 0.15)' },
    { key: 'oficina', label: '2. Oficina Recebe',  desc: 'Recursos circulam nos comércios da rota.', color: 'var(--success)', active: ['partner_quote','evidence_review','validated'].includes(cicloEstado), border: 'var(--color-green)', bg: 'rgba(22, 61, 47, 0.4)' },
    { key: 'moto',    label: '3. Moto na Rota',   desc: 'Membro segue rodando e gerando renda.', color: 'var(--color-terra)', active: cicloEstado === 'evidence_pending', border: 'var(--color-terra)', bg: 'rgba(154, 79, 47, 0.15)' },
    { key: 'fundo',   label: '4. Fundo Cresce',   desc: 'Retorno de taxa blindando o fundo piloto.', color: 'var(--color-gold)', active: cicloEstado === 'completed', border: 'var(--color-gold)', bg: 'rgba(201, 154, 61, 0.15)' }
  ]

  const parceiros = [
    { nome: 'Oficina JN',         sub: 'Serviço Mecânico e Reparos — Zona Leste' },
    { nome: 'Motopeças Silva',    sub: 'Venda de Peças e Acessórios — Zona Leste' },
    { nome: 'Borracharia do Ponto', sub: 'Reparo e Venda de Pneus — Zona Leste' }
  ]

  return (
    <div className="screen active" id="screen-rede">
      <div className="app-header-simple"><h3>Rede & Economia Local</h3></div>
      <div className="fundo-mobile-container" style={{ padding: '20px' }}>
        <div className="fundo-headline-card glass" style={{ position: 'relative', overflow: 'hidden' }}>
          <span className="section-tag tag-yellow">FUNDO ABIAS — AMBIENTE PILOTO</span>
          <h2>Fundo Abias</h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--color-gold)', marginBottom: '10px' }}>Proteção coletiva para jornadas individuais.</p>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>Cada ciclo validado fortalece uma reserva comunitária em ambiente piloto. O Fundo Abias ajuda a proteger a rede, apoiar emergências e ampliar novos acessos.</p>
        </div>

        <div className="fundo-reserve-card glass">
          <span className="lbl">Saldo da Reserva Comunitária</span>
          <div className="amount-val font-mono">R$ {fundo.toFixed(2)}</div>
          <div className="fundo-bar-wrapper">
            <div className="fundo-bar-fill-mobile" style={{ width: `${Math.min(100, (fundo / 8000) * 100)}%` }}></div>
          </div>
          <span className="fundo-subtext-meta">Meta de blindagem do piloto: R$ 8.000,00</span>
        </div>

        <div className="rede-flow-card glass" style={{ marginTop: '0', padding: '16px' }}>
          <h5 style={{ fontSize: '0.85rem', fontWeight: 800 }}>Circulação Circular de Recursos</h5>
          <div className="economy-flow-vertical" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', marginTop: '10px' }}>
            {flowSteps.map(({ key, label, desc, color, active, border, bg }) => (
              <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', borderRadius: '4px', background: active ? bg : 'rgba(255,255,255,0.02)', border: active ? `1px solid ${border}` : '1px solid transparent' }}>
                <span style={{ fontWeight: 700, color }}>{label}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="how-to-improve-card glass" style={{ marginTop: '20px' }}>
          <h4 style={{ color: 'var(--color-gold)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: 800 }}>Oficinas e Comércios Credenciados</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {parceiros.map(({ nome, sub }) => (
              <div key={nome} style={{ background: 'rgba(255,255,255,0.01)', padding: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h5 style={{ fontSize: '0.8rem', fontWeight: 700 }}>{nome}</h5>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{sub}</span>
                </div>
                <span style={{ fontSize: '0.65rem', padding: '3px 8px', background: 'rgba(22, 61, 47, 0.2)', border: '1px solid var(--color-green)', color: 'var(--success)' }}>Ativa</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
