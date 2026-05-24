export function AreaOperacional({ ctrl }) {
  const { membro, cicloEstado, reputacao, fundo, profileMode, setProfileMode, setShowAreaOperacional, handleResetDemo, getEstadoLabel } = ctrl

  return (
    <div className="area-operacional-overlay">
      <div>
        <div className="area-operacional-header">
          <h3>Área operacional</h3>
          <p>Área operacional local. Use para alternar contexto e validar o ciclo.</p>
        </div>
        <div className="area-operacional-content">
          <div className="area-operacional-info-card">
            <p><strong>Membro:</strong> {membro ? membro.nome : 'Não cadastrado'}</p>
            <p><strong>Estado do Ciclo:</strong> <span className="font-mono">{getEstadoLabel(cicloEstado).label}</span></p>
            <p><strong>Reputação de Jornada:</strong> <span className="font-mono">{reputacao}/1000</span></p>
            <p><strong>Fundo Abias:</strong> <span className="font-mono">R$ {fundo.toFixed(2)}</span></p>
          </div>
          <div className="area-operacional-actions">
            <button
              className="btn-app btn-app-primary"
              style={{ background: profileMode === 'membro' ? 'var(--color-green)' : 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}
              onClick={() => { setProfileMode('membro'); setShowAreaOperacional(false) }}>
              Modo Membro {profileMode === 'membro' && '✓'}
            </button>
            <button
              className="btn-app btn-app-primary"
              style={{ background: profileMode === 'oficina' ? 'var(--color-gold)' : 'rgba(255,255,255,0.03)', color: profileMode === 'oficina' ? '#0b0b0b' : '#ffffff', border: '1px solid var(--border-color)' }}
              onClick={() => { setProfileMode('oficina'); setShowAreaOperacional(false) }}>
              Modo Oficina {profileMode === 'oficina' && '✓'}
            </button>
            <button
              className="btn-app btn-app-primary"
              style={{ background: profileMode === 'gestao' ? 'var(--color-terra)' : 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}
              onClick={() => { setProfileMode('gestao'); setShowAreaOperacional(false) }}>
              Modo Gestão {profileMode === 'gestao' && '✓'}
            </button>
            <button
              className="btn-app btn-app-secondary"
              style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)', marginTop: '8px' }}
              onClick={handleResetDemo}>
              Limpar dados locais
            </button>
          </div>
        </div>
      </div>
      <div className="area-operacional-footer">
        <button className="btn-app btn-app-secondary" onClick={() => setShowAreaOperacional(false)}>
          Voltar ao aplicativo
        </button>
      </div>
    </div>
  )
}
