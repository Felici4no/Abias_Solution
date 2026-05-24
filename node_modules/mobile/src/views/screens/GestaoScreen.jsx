export function GestaoScreen({ ctrl }) {
  const {
    membro, solicitacao, cicloEstado, fundo, oficinaConfirmacao,
    currentAmount, currentFinalidade, currentOficina, currentPrazo, currentUrgencia, currentDescricao,
    adminJustifyInput, setAdminJustifyInput,
    handleGestaoAprovar, handleGestaoPedirRevisao, handleGestaoRecusar, handleGestaoConcluirCiclo,
    getEstadoLabel
  } = ctrl

  return (
    <div className="screen active" id="screen-admin">
      <div className="app-header-admin">
        <h3>Mesa de Gestão — Abias</h3>
        <span className="badge-admin">Mesa Operacional</span>
      </div>

      <div className="admin-container">
        <div className="admin-metrics-grid">
          {[
            { lbl: 'Ciclos Ativos',          val: cicloEstado !== 'draft' && cicloEstado !== 'completed' ? '1' : '0' },
            { lbl: 'Volume Solicitado',       val: `R$ ${cicloEstado !== 'draft' ? currentAmount : '0'}` },
            { lbl: 'Evidências Pendentes',    val: cicloEstado === 'evidence_review' ? '1' : '0' },
            { lbl: 'Fundo Operacional',       val: `R$ ${fundo}` }
          ].map(({ lbl, val }) => (
            <div key={lbl} className="metric-admin-card glass">
              <span className="lbl">{lbl}</span>
              <span className="val font-mono">{val}</span>
            </div>
          ))}
        </div>

        <div className="admin-queue-card glass">
          <h4>Fila de Ciclos Operacionais</h4>
          {!solicitacao || ['draft','submitted','community_validation','partner_quote'].includes(cicloEstado) ? (
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Nenhuma solicitação aguardando análise da Gestão.</p>
          ) : (
            <div className="queue-item">
              <div className="q-header">
                <span className="q-name">{membro?.nome || 'João Silva'}</span>
                <span className="q-amount font-mono">R$ {currentAmount.toFixed(2)}</span>
              </div>
              <div className="q-details">
                <span>Finalidade: <strong>{currentFinalidade}</strong></span>
                <span>Oficina indicada: <strong>{currentOficina}</strong></span>
                <span>Prazo solicitado: <strong>{currentPrazo} dias</strong></span>
                <span>Urgência: <strong>{currentUrgencia}</strong></span>
                {currentDescricao && <span>Descrição: "{currentDescricao}"</span>}
              </div>
              <div className="q-checklists">
                <span className="chk-status checked"><i className="fa-solid fa-check"></i> Jornada Reconhecida pela Rede</span>
                <span className="chk-status checked"><i className="fa-solid fa-check"></i> Aval de Marcos Santos registrado</span>
                <span className="chk-status checked"><i className="fa-solid fa-check"></i> Aval de Aline Souza registrado</span>
                <span className={`chk-status ${oficinaConfirmacao.quoteConfirmed ? 'checked' : 'warning'}`}>
                  <i className={`fa-solid ${oficinaConfirmacao.quoteConfirmed ? 'fa-check' : 'fa-spinner fa-spin'}`}></i> Orçamento Oficina JN
                </span>
                {['evidence_review','validated','completed'].includes(cicloEstado) && (
                  <span className={`chk-status ${oficinaConfirmacao.serviceConfirmed ? 'checked' : 'warning'}`}>
                    <i className={`fa-solid ${oficinaConfirmacao.serviceConfirmed ? 'fa-check' : 'fa-spinner fa-spin'}`}></i> Validação de Serviço
                  </span>
                )}
              </div>

              {cicloEstado === 'under_review' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Justificativa (para Revisão ou Recusa)</label>
                  <textarea className="form-textarea" style={{ height: '50px' }} value={adminJustifyInput} onChange={(e) => setAdminJustifyInput(e.target.value)} placeholder="Descreva os motivos caso vá pedir revisão ou recusar." />
                  <div className="admin-actions-row">
                    <button className="btn-admin btn-admin-approve" onClick={handleGestaoAprovar}>Aprovar Crédito Produtivo</button>
                    <button className="btn-admin btn-admin-reject" onClick={handleGestaoPedirRevisao} style={{ flex: 'unset' }}>Pedir Revisão</button>
                    <button className="btn-admin btn-admin-reject" onClick={handleGestaoRecusar} style={{ flex: 'unset', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>Recusar</button>
                  </div>
                </div>
              )}

              {cicloEstado === 'validated' && (
                <div style={{ marginTop: '10px' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px', fontSize: '0.75rem', marginBottom: '10px' }}>
                    <p><strong>Serviço realizado confirmado pela oficina.</strong></p>
                    <p>Comprovante técnico validado.</p>
                  </div>
                  <button className="btn-app btn-app-primary" style={{ background: 'var(--color-green)' }} onClick={handleGestaoConcluirCiclo}>
                    Fechar e Concluir Ciclo de Jornada
                  </button>
                </div>
              )}

              {['approved','evidence_pending','evidence_review','completed','needs_revision','rejected'].includes(cicloEstado) && (
                <div className="info-notice-card plain-border" style={{ margin: '10px 0 0' }}>
                  <p><i className="fa-solid fa-circle-check" style={{ color: 'var(--success)' }}></i> Decisão operacional registrada: <strong>{getEstadoLabel(cicloEstado).label}</strong></p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="admin-alerts-card glass">
          <h4>Governança de Risco</h4>
          <div className="alert-log-item warning"><i className="fa-solid fa-circle-info"></i><span>A IA apoia a análise. A decisão não é automática.</span></div>
          <div className="alert-log-item warning"><i className="fa-solid fa-triangle-exclamation"></i><span>Ciclo validado pela rede local sem inconsistências.</span></div>
        </div>
      </div>
    </div>
  )
}
