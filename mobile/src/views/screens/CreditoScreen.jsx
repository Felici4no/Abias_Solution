export function CreditoScreen({ ctrl }) {
  const {
    cicloEstado, setCicloEstado, membro,
    currentAmount, currentFinalidade, currentOficina, currentPrazo, currentUrgencia, currentDescricao,
    parcelasValor, reputacao, avaliacoes,
    inputAmount, setInputAmount, inputFinalidade, setInputFinalidade,
    inputPrazo, setInputPrazo, inputOficina, setInputOficina,
    inputUrgencia, setInputUrgencia, inputDescricao, setInputDescricao,
    handleSolicitacaoSubmit, handleConfirmarPlano,
    handleMarcosAval, handleAlineAval,
    handleNovoCiclo, getEstadoLabel
  } = ctrl

  if (cicloEstado === 'draft') return (
    <>
      <div className="app-header-simple"><h3>Crédito de Rede Validado</h3></div>
      <form className="mobile-form" onSubmit={handleSolicitacaoSubmit}>
        <div className="form-banner-info">
          <p><strong>Não é empréstimo livre. É crédito produtivo com finalidade clara, validação comunitária e evidência de uso.</strong> Fomento produtivo para manter sua jornada em movimento.</p>
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Quanto você precisa?</label>
          <div className="money-input-wrapper">
            <span className="currency-symbol">R$</span>
            <input type="number" value={inputAmount} onChange={(e) => setInputAmount(e.target.value)} min="300" max="3000" required />
          </div>
          <span className="form-helper">Valor alvo sugerido para pneu + revisão: R$ 850</span>
        </div>
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
          <label className="form-label">Em quanto tempo pode pagar?</label>
          <select className="form-select" value={inputPrazo} onChange={(e) => setInputPrazo(e.target.value)}>
            <option value="7">7 dias (Ciclo rápido)</option>
            <option value="15">15 dias (Ciclo quinzenal)</option>
            <option value="30">30 dias (Ciclo mensal)</option>
            <option value="45">45 dias (Ciclo estendido)</option>
          </select>
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Qual oficina credenciada?</label>
          <input type="text" className="form-text-input" value={inputOficina} onChange={(e) => setInputOficina(e.target.value)} required />
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Nível de Urgência</label>
          <select className="form-select" value={inputUrgencia} onChange={(e) => setInputUrgencia(e.target.value)}>
            <option value="Baixa">Baixa (Manutenção preventiva)</option>
            <option value="Media">Média (Avisos de desgaste)</option>
            <option value="Alta">Alta (Ferramenta parada ou risco)</option>
          </select>
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Descrição da necessidade</label>
          <textarea className="form-textarea" value={inputDescricao} onChange={(e) => setInputDescricao(e.target.value)} placeholder="Explique porque o serviço é necessário para continuar as entregas." required />
        </div>
        <button type="submit" className="btn-app btn-app-primary">Gerar plano de crédito produtivo</button>
      </form>
    </>
  )

  if (cicloEstado === 'submitted') return (
    <>
      <div className="app-header-simple"><h3>Plano de Crédito Sugerido</h3></div>
      <div className="plano-container">
        <div className="plano-notice-badge"><span><i className="fa-solid fa-triangle-exclamation"></i> Plano comunitário sugerido. Sujeito à validação.</span></div>
        <div className="premium-credit-card compact-slip" style={{ position: 'relative', overflow: 'hidden' }}>
          <div className="card-brand-row">
            <span className="card-brand">Abias</span>
            <span className="card-contactless"><i className="fa-solid fa-receipt"></i> COMPROVANTE OPERACIONAL</span>
          </div>
          <div className="slip-details">
            {[['FINALIDADE DE CRÉDITO', currentFinalidade],['PRAZO TOTAL', `${currentPrazo} dias`],['OFICINA PARCEIRA', currentOficina],['EVIDÊNCIAS COBRADAS', 'Nota + Foto da Instalação'],['GRAU DE URGÊNCIA', currentUrgencia]].map(([lbl, val]) => (
              <div key={lbl} className="slip-row"><span className="slip-label">{lbl}</span><span className="slip-value">{val}</span></div>
            ))}
          </div>
          <div className="slip-footer">
            <div className="slip-badge">CRÉDITO PRODUTIVO</div>
            <span className="slip-amount">R$ {currentAmount.toFixed(2)}</span>
          </div>
        </div>
        <div className="plano-payment-card glass">
          <h4>Estrutura do Ciclo Comunitário</h4>
          <div className="payment-row">
            <span className="lbl font-bold">Retorno estimado:</span>
            <span className="val font-mono font-bold">4x de R$ {new Intl.NumberFormat('pt-BR').format(parcelasValor)}</span>
          </div>
          <span className="tax-info-footer">Sem taxas abusivas. Juros de 8% voltados a blindar o Fundo.</span>
        </div>
        <div className="validacoes-list-card glass">
          <h4>Evidências Necessárias</h4>
          <ul className="bullet-list-mobile">
            <li><i className="fa-solid fa-receipt text-success"></i> Orçamento confirmado pela oficina parceira</li>
            <li><i className="fa-solid fa-camera text-warning"></i> Foto do pneu/serviço instalado na moto</li>
            <li><i className="fa-solid fa-check-double text-warning"></i> Aval emitido por 2 membros da comunidade</li>
          </ul>
        </div>
        <div className="plano-actions">
          <button className="btn-app btn-app-primary" onClick={handleConfirmarPlano}>Confirmar solicitação</button>
          <button className="btn-app btn-app-secondary" onClick={() => setCicloEstado('draft')}>Editar solicitação</button>
        </div>
      </div>
    </>
  )

  if (cicloEstado === 'community_validation') return (
    <>
      <div className="app-header-simple"><h3>Validação de Rede</h3></div>
      <div className="aval-container">
        <div className="aval-status-banner glass">
          <span className="section-tag tag-yellow">AVAL COMUNITÁRIO</span>
          <h2>Quem reconhece sua jornada?</h2>
          <p>Na Abias, a rede ajuda a reconhecer o que o banco não sabe ler sozinho: presença, consistência, trabalho, território e confiança.</p>
        </div>
        <div className="aval-peers-list">
          {[
            { key: 'marcos', nome: 'Marcos Santos', sub: 'Membro Indicador Leste', handler: handleMarcosAval, estado: avaliacoes.marcos, comment: avaliacoes.marcosComment },
            { key: 'aline',  nome: 'Aline Souza',   sub: 'Parceira de Rota Leste', handler: handleAlineAval,  estado: avaliacoes.aline,  comment: avaliacoes.alineComment }
          ].map(({ key, nome, sub, handler, estado, comment }) => (
            <div key={key} className="peer-item-card glass" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="peer-avatar" style={{ background: 'rgba(217, 210, 197, 0.05)', color: 'var(--color-gold)', borderRadius: '50%' }}><i className="fa-solid fa-user"></i></div>
                  <div className="peer-info" style={{ marginLeft: 0 }}>
                    <h5>{nome}</h5><span className="peer-sub">{sub}</span>
                  </div>
                </div>
                <span className={`status-badge ${estado === 'approved' ? 'badge-success' : 'badge-pending'}`}>{estado === 'approved' ? 'Validou' : 'Pendente'}</span>
              </div>
              {estado === 'pending' ? (
                <button className="btn-app btn-app-secondary" onClick={handler} style={{ fontSize: '0.75rem', padding: '10px' }}>
                  <i className="fa-solid fa-signature"></i> Registrar aval de {nome.split(' ')[0]}
                </button>
              ) : (
                <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>"{comment}"</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )

  if (['partner_quote','under_review','approved','evidence_pending','evidence_review','validated','completed','needs_revision','rejected'].includes(cicloEstado)) return (
    <>
      <div className="app-header-simple"><h3>Status do Crédito Produtivo</h3></div>
      <div className="plano-container">
        <div className="milestone-card glass">
          <span className="lbl-milestone">ETAPA DO CICLO DE CRÉDITO</span>
          <h4 style={{ margin: 0 }}>{getEstadoLabel(cicloEstado).label}</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{getEstadoLabel(cicloEstado).step}</p>
        </div>

        {cicloEstado === 'completed' ? (
          <div className="premium-credit-card compact-slip" style={{ position: 'relative', overflow: 'hidden', border: '1px solid var(--color-green)', background: 'linear-gradient(180deg, #0e1c16 0%, #0b0b0b 100%)' }}>
            <div className="card-brand-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="card-brand" style={{ color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
                <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)' }}></i> Ciclo de jornada validado
              </span>
              <span className="card-contactless" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}><i className="fa-solid fa-shield-halved"></i> ABIAS PRODUTIVO</span>
            </div>
            <div className="slip-details" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                ['VALOR', `R$ ${currentAmount.toFixed(2)}`, null],
                ['FINALIDADE', currentFinalidade, null],
                ['OFICINA', currentOficina, null],
                ['VALIDADORES', 'Marcos e Aline', null],
                ['EVIDÊNCIA', 'recibo + foto', null],
                ['REPUTAÇÃO', `720 → ${reputacao}`, 'var(--success)'],
                ['FUNDO ABIAS', `+R$ ${(currentAmount * 0.08).toFixed(0)}`, 'var(--color-gold)'],
                ['STATUS', 'ciclo concluído', 'var(--success)']
              ].map(([lbl, val, color]) => (
                <div key={lbl} className="slip-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}>
                  <span className="slip-label" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{lbl}</span>
                  <span className="slip-value" style={{ fontSize: '0.8rem', fontWeight: 700, color: color || undefined }}>{val}</span>
                </div>
              ))}
            </div>
            <div className="slip-footer" style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '10px', marginTop: '10px', display: 'block', height: 'auto' }}>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.4', textAlign: 'center', margin: 0 }}>
                "Este ciclo fortaleceu a jornada de {membro.nome.split(' ')[0]} e adicionou contribuição ao Fundo Abias."
              </p>
            </div>
          </div>
        ) : (
          <div className="premium-credit-card compact-slip" style={{ position: 'relative', overflow: 'hidden' }}>
            <div className="card-brand-row">
              <span className="card-brand">Abias</span>
              <span className="card-contactless"><i className="fa-solid fa-receipt"></i> COMPROVANTE OPERACIONAL</span>
            </div>
            <div className="slip-details">
              {[['MOTOCICLISTA', membro.nome],['FINALIDADE PRODUTIVA', currentFinalidade],['OFICINA VINCULADA', currentOficina],['RETORNO ACORDADO', `4x de R$ ${new Intl.NumberFormat('pt-BR').format(parcelasValor)}`]].map(([lbl, val]) => (
                <div key={lbl} className="slip-row"><span className="slip-label">{lbl}</span><span className="slip-value">{val}</span></div>
              ))}
            </div>
            <div className="slip-footer">
              <div className="slip-badge">CRÉDITO PRODUTIVO</div>
              <span className="slip-amount">R$ {currentAmount.toFixed(2)}</span>
            </div>
          </div>
        )}

        {cicloEstado === 'completed' && (
          <button className="btn-app btn-app-primary" onClick={handleNovoCiclo}>Iniciar Novo Ciclo Comunitário</button>
        )}
      </div>
    </>
  )

  return null
}
