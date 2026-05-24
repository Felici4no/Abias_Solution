export function PerfilScreen({ ctrl }) {
  const { membro, cicloEstado } = ctrl

  return (
    <div className="screen active" id="screen-perfil">
      <div className="app-header-simple"><h3>Meu Perfil</h3></div>
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <div className="reputacao-score-box glass" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center', textAlign: 'left' }}>
          <div className="member-avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(201, 154, 61, 0.1)', border: '2px solid var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: 'var(--color-gold)' }}>
            <i className="fa-solid fa-user"></i>
          </div>
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>{membro.nome}</h4>
            <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Membro Indicador Leste</span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
              {membro.ferramenta} • {membro.tempo} de asfalto • {membro.regiao}
            </p>
          </div>
        </div>

        <div className="how-to-improve-card glass" style={{ padding: '16px' }}>
          <h4 style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: 800 }}>Conquistas de Jornada</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
            {[
              { icon: 'fa-users',       title: 'Avalista',    sub: 'Validado',      color: 'var(--color-gold)' },
              { icon: 'fa-check-double', title: 'Ficha Limpa', sub: '100% Evidência', color: 'var(--success)' },
              { icon: 'fa-vault',       title: 'Builder',     sub: 'Reserva local',  color: 'var(--color-terra)' }
            ].map(({ icon, title, sub, color }) => (
              <div key={title} style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 4px', border: '1px solid var(--border-color)' }}>
                <i className={`fa-solid ${icon}`} style={{ color, fontSize: '1rem', marginBottom: '4px' }}></i>
                <h6 style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ffffff' }}>{title}</h6>
                <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>{sub}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="how-to-improve-card glass" style={{ padding: '16px' }}>
          <h4 style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: 800 }}>Depoimentos e Avais Comunitários</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[
              { nome: 'Marcos Santos', depo: 'João é parceiro de confiança, conheço a rota dele na Zona Leste.' },
              { nome: 'Aline Souza',   depo: 'Grande profissional de entrega. Corre garantido no asfalto.' }
            ].map(({ nome, depo }) => (
              <div key={nome} style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem' }}>
                  <strong>{nome}</strong>
                  <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓ Jornada Reconhecida</span>
                </div>
                <p style={{ fontSize: '0.72rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.4' }}>"{depo}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
