export function OficinaScreen({ ctrl }) {
  const {
    membro, solicitacao, cicloEstado, evidencia,
    currentAmount, currentFinalidade, currentOficina, currentUrgencia, currentDescricao,
    handleOficinaConfirmarOrcamento, handleOficinaConfirmarServico,
    getEstadoLabel
  } = ctrl

  return (
    <div className="screen active" id="screen-oficina-mode" style={{ padding: '20px' }}>
      <div className="app-header-simple" style={{ margin: '-20px -20px 20px', background: 'var(--color-gold)', color: '#0b0b0b' }}>
        <h3 style={{ color: '#0b0b0b' }}><i className="fa-solid fa-wrench"></i> Painel Oficina Parceira</h3>
      </div>

      {!solicitacao || ['draft','submitted','community_validation'].includes(cicloEstado) ? (
        <div className="info-notice-card" style={{ margin: 0 }}>
          <p>Nenhuma solicitação de crédito produtivo vinculada à Oficina JN no momento.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="milestone-card glass">
            <span className="lbl-milestone">OFICINA JN</span>
            <h4 style={{ marginBottom: '8px' }}>Solicitação de crédito produtivo de {membro?.nome || 'João Silva'}</h4>
            <div className="q-details" style={{ marginBottom: '10px' }}>
              <span>Finalidade: <strong>{currentFinalidade}</strong></span>
              <span>Valor Solicitado: <strong>R$ {currentAmount.toFixed(2)}</strong></span>
              <span>Urgência declarada: <strong>{currentUrgencia}</strong></span>
              <span>Descrição: "{currentDescricao}"</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px dashed var(--border-color)', paddingTop: '10px' }}>
              Status do Ciclo: <strong>{getEstadoLabel(cicloEstado).label}</strong>
            </p>
          </div>

          {cicloEstado === 'partner_quote' && (
            <div className="glass" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h5>Validar Orçamento de R$ {currentAmount}</h5>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Confirme que o orçamento é adequado para o reparo necessário do veículo.</p>
              <button className="btn-app btn-app-primary" style={{ background: 'var(--color-gold)', color: '#0b0b0b' }} onClick={handleOficinaConfirmarOrcamento}>
                Confirmar Orçamento
              </button>
            </div>
          )}

          {cicloEstado === 'evidence_review' && (
            <div className="glass" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <h5>Confirmar Execução do Serviço</h5>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>João enviou o comprovante técnico. Confirme que o serviço foi finalizado.</p>
              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px', fontSize: '0.75rem' }}>
                <p><strong>Arquivo anexado:</strong> {evidencia.file}</p>
                <p><strong>Observações João:</strong> "{evidencia.obs || 'Nenhuma obs.'}"</p>
              </div>
              <button className="btn-app btn-app-primary" style={{ background: 'var(--color-gold)', color: '#0b0b0b' }} onClick={handleOficinaConfirmarServico}>
                Confirmar Serviço Realizado
              </button>
            </div>
          )}

          {['under_review','approved','evidence_pending','validated','completed'].includes(cicloEstado) && (
            <div className="info-notice-card plain-border" style={{ margin: 0 }}>
              <p><i className="fa-solid fa-circle-check" style={{ color: 'var(--success)' }}></i> Ações técnicas concluídas para este ciclo.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
