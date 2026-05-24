export function HomeScreen({ ctrl }) {
  const {
    membro, cicloEstado, reputacao, fundo, avaliacoes, oficinaConfirmacao,
    currentAmount, currentFinalidade, currentStatus,
    uploadFileSelected, setUploadFileSelected, uploadFileType, setUploadFileType,
    uploadFileObs, setUploadFileObs,
    handleAnexarFoto, handleAnexarRecibo, handleEnviarEvidencia, handleNovoCiclo,
    setActiveTab
  } = ctrl

  const renderHomeCTA = () => {
    switch (cicloEstado) {
      case 'draft':
        return <button className="btn-app btn-app-primary" onClick={() => setActiveTab('credito')}><i className="fa-solid fa-route"></i> Solicitar crédito de jornada</button>
      case 'community_validation':
        return <button className="btn-app btn-app-primary" onClick={() => setActiveTab('credito')}><i className="fa-solid fa-users-double"></i> Acompanhar validação da rede</button>
      case 'evidence_pending':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <button className="btn-app btn-app-primary" onClick={() => setActiveTab('evidencia')}><i className="fa-solid fa-upload"></i> Enviar evidência</button>
            <button className="btn-app btn-app-secondary" onClick={() => setActiveTab('credito')}>Acompanhar ciclo</button>
          </div>
        )
      case 'submitted': case 'partner_quote': case 'under_review': case 'evidence_review': case 'validated':
        return <button className="btn-app btn-app-primary" onClick={() => setActiveTab('credito')}><i className="fa-solid fa-route"></i> Acompanhar ciclo</button>
      case 'completed':
        return <button className="btn-app btn-app-primary" onClick={handleNovoCiclo}><i className="fa-solid fa-rotate-left"></i> Iniciar novo ciclo</button>
      default:
        return <button className="btn-app btn-app-primary" onClick={() => setActiveTab('credito')}>Ver status</button>
    }
  }

  return (
    <div className="screen active" id="screen-home">
      <div className="app-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
        <div className="member-profile">
          <div className="member-avatar" style={{ background: 'rgba(201, 154, 61, 0.15)', border: '1px solid var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <i className="fa-solid fa-motorcycle" style={{ color: 'var(--color-gold)', fontSize: '0.9rem' }}></i>
          </div>
          <div>
            <span className="greeting-sub">Sua rota comprova trabalho. Sua jornada constrói reputação.</span>
            <h3 className="member-name">Salve, {membro.nome}</h3>
          </div>
        </div>
        <span className="badge-status-membro"><i className="fa-solid fa-shield-halved"></i> Rota Comprovada</span>
      </div>

      <div className="home-main-card" style={{ marginTop: '16px', position: 'relative', overflow: 'hidden' }}>
        <div className="card-glow" style={{ position: 'absolute', right: '-20px', top: '-20px', width: '120px', height: '120px', background: 'rgba(201, 154, 61, 0.05)', filter: 'blur(30px)', borderRadius: '50%' }}></div>
        <div className="home-card-header">
          <span className="card-tag">STATUS OPERACIONAL</span>
          {['evidence_pending', 'evidence_review', 'validated'].includes(cicloEstado) ? (
            <span className="status-indicator-green" style={{ color: 'var(--color-gold)' }}><i className="fa-solid fa-circle"></i> Crédito Produtivo Ativo</span>
          ) : (
            <span className="status-indicator-green"><i className="fa-solid fa-circle"></i> Sua jornada está ativa</span>
          )}
        </div>
        <div className="home-card-body">
          <div className="reputacao-summary">
            <span className="lbl">Reputação de Jornada</span>
            <div className="score-display">
              <span className="score-num font-mono">{reputacao}</span>
              <span className="score-max font-mono">/1000</span>
            </div>
            <span className="score-level-badge">
              {reputacao <= 720 ? 'Jornada ativa' : reputacao <= 745 ? 'Jornada forte' : 'Jornada de ouro (Referência da rede)'}
            </span>
          </div>
        </div>
        <div className="home-card-footer">
          <div className="fundo-summary">
            <i className="fa-solid fa-vault"></i>
            <span>Fundo Abias: <strong>R$ {fundo.toFixed(2)}</strong> em reserva piloto</span>
          </div>
        </div>
      </div>

      {cicloEstado !== 'draft' && (
        <div className="info-notice-card plain-border" style={{ margin: '0 20px 20px', position: 'relative' }}>
          <h4 style={{ fontSize: '0.8rem', color: 'var(--color-gold)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>Acompanhar ciclo</h4>
          <p style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 'bold' }}>Passo Atual: {currentStatus.label}</p>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>Próximo passo: {currentStatus.step}</p>
        </div>
      )}

      {cicloEstado === 'evidence_pending' && (
        <div className="info-notice-card" style={{ margin: '0 20px 20px', background: 'rgba(154, 79, 47, 0.05)', border: '1px solid rgba(154, 79, 47, 0.2)' }}>
          <h4 style={{ fontSize: '0.8rem', color: 'var(--color-terra)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>
            <i className="fa-solid fa-triangle-exclamation"></i> Enviar Evidências de Trabalho
          </h4>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.4' }}>
            Forneça a comprovação técnica da manutenção do veículo para validar seu crédito produtivo.
          </p>
          <div className="upload-methods" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
            <div className="upload-box-action" onClick={handleAnexarFoto} style={{ padding: '12px 8px', border: uploadFileType === 'foto' ? '1px solid var(--color-gold)' : '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
              <div className="box-icon" style={{ fontSize: '1rem' }}><i className="fa-solid fa-camera"></i></div>
              <span style={{ fontSize: '0.65rem' }}>Foto do Pneu Instalado</span>
            </div>
            <div className="upload-box-action" onClick={handleAnexarRecibo} style={{ padding: '12px 8px', border: uploadFileType === 'recibo' ? '1px solid var(--color-gold)' : '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
              <div className="box-icon" style={{ fontSize: '1rem' }}><i className="fa-solid fa-file-invoice-dollar"></i></div>
              <span style={{ fontSize: '0.65rem' }}>Recibo da Oficina</span>
            </div>
          </div>
          {uploadFileSelected && (
            <div className="simulated-file-badge" style={{ marginBottom: '12px', fontSize: '0.75rem', padding: '6px 10px' }}>
              <div><i className="fa-solid fa-paperclip" style={{ marginRight: '6px' }}></i><span>{uploadFileSelected}</span></div>
              <button className="btn-remove-file" onClick={() => { setUploadFileSelected(''); setUploadFileType('') }} style={{ fontSize: '0.9rem' }}>&times;</button>
            </div>
          )}
          <div className="mobile-form-group" style={{ marginBottom: '12px' }}>
            <label className="form-label" style={{ fontSize: '0.7rem' }}>O que foi feito? (Observação)</label>
            <textarea className="form-textarea" style={{ height: '50px', padding: '8px 10px', fontSize: '0.75rem' }} value={uploadFileObs} onChange={(e) => setUploadFileObs(e.target.value)} placeholder="Ex: Trocado pneu traseiro na Oficina JN." />
          </div>
          <button className="btn-app btn-app-primary" style={{ padding: '10px 14px', fontSize: '0.8rem' }} onClick={handleEnviarEvidencia}>Enviar evidência</button>
        </div>
      )}

      {cicloEstado !== 'evidence_pending' && (
        <div className="home-actions-group">{renderHomeCTA()}</div>
      )}

      <div className="home-stats-section" style={{ marginTop: '20px', padding: '0 20px' }}>
        <h4 className="section-title-mobile">Fluxo e Atividade Recente</h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {cicloEstado === 'draft' ? (
            <div className="activity-item-card" style={{ display: 'flex', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
              <div className="activity-icon-badge" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}><i className="fa-solid fa-circle-check text-success"></i></div>
              <div>
                <h5 style={{ fontSize: '0.75rem', fontWeight: 800 }}>Comunidade Abias criada</h5>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Membro João Silva integrado com sucesso.</p>
              </div>
            </div>
          ) : (
            <>
              {['community_validation','partner_quote','under_review','approved','evidence_pending','evidence_review','validated','completed'].includes(cicloEstado) && (
                <div className="activity-item-card" style={{ display: 'flex', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                  <div className="activity-icon-badge" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--color-gold)' }}><i className="fa-solid fa-file-invoice"></i></div>
                  <div>
                    <h5 style={{ fontSize: '0.75rem', fontWeight: 800 }}>Crédito de Jornada Solicitado</h5>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Crédito produtivo de R$ {currentAmount} para {currentFinalidade} registrado.</p>
                  </div>
                </div>
              )}
              {avaliacoes.marcos === 'approved' && (
                <div className="activity-item-card" style={{ display: 'flex', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                  <div className="activity-icon-badge" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--success)' }}><i className="fa-solid fa-signature"></i></div>
                  <div>
                    <h5 style={{ fontSize: '0.75rem', fontWeight: 800 }}>Aval de Marcos Santos registrado</h5>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Validação territorial efetuada na Zona Leste.</p>
                  </div>
                </div>
              )}
              {oficinaConfirmacao.quoteConfirmed && (
                <div className="activity-item-card" style={{ display: 'flex', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                  <div className="activity-icon-badge" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--color-gold)' }}><i className="fa-solid fa-wrench"></i></div>
                  <div>
                    <h5 style={{ fontSize: '0.75rem', fontWeight: 800 }}>Orçamento Oficina JN Confirmado</h5>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Mecânica credenciada validou custos operacionais.</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <div className="home-stats-section" style={{ marginTop: '20px', marginBottom: '20px', padding: '0 20px' }}>
        <h4 className="section-title-mobile">Parceiro Recomendado Local</h4>
        <div className="recommended-partner-card" style={{ display: 'flex', gap: '12px', padding: '16px', background: 'rgba(201, 154, 61, 0.03)', border: '1px solid rgba(201, 154, 61, 0.2)' }}>
          <div className="partner-circle-icon" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(201, 154, 61, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-gold)' }}><i className="fa-solid fa-warehouse"></i></div>
          <div>
            <h5 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '2px' }}>Oficina JN — 1.2km</h5>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>Mecânica autorizada da comunidade Abias. Especialistas em kit relação, pneus e revisões rápidas.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
