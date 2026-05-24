import { useState, useEffect } from 'react'

function App() {
  // Navigation states
  const [activeScreen, setActiveScreen] = useState('onboarding')

  // Clock state
  const [clockTime, setClockTime] = useState('00:00')

  // Simulation states
  const [currentAmount, setCurrentAmount] = useState(850)
  const [currentFinalidade, setCurrentFinalidade] = useState('Troca de pneu')
  const [currentOficina, setCurrentOficina] = useState('Oficina JN')
  const [currentPrazo, setCurrentPrazo] = useState('30')
  const [userReputacao, setUserReputacao] = useState(720)

  // Sub-states
  const [alineAvalStatus, setAlineAvalStatus] = useState('pending') // 'pending' | 'requesting' | 'approved'
  const [evidenciaStatus, setEvidenciaStatus] = useState('pending') // 'pending' | 'sent' | 'analysis' | 'approved'
  const [fileUploaded, setFileUploaded] = useState(false)
  const [fileName, setFileName] = useState('')
  const [uploadObs, setUploadObs] = useState('')
  const [cycleStatus, setCycleStatus] = useState('active') // 'active' | 'approved'
  const [adminQueueApproved, setAdminQueueApproved] = useState(false)

  // Inputs in Form screen
  const [inputAmount, setInputAmount] = useState(850)
  const [inputFinalidade, setInputFinalidade] = useState('Troca de pneu')
  const [inputPrazo, setInputPrazo] = useState('30')
  const [inputOficina, setInputOficina] = useState('Oficina JN')

  // Live Clock effect
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const hrs = String(now.getHours()).padStart(2, '0')
      const mins = String(now.getMinutes()).padStart(2, '0')
      setClockTime(`${hrs}:${mins}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 30000)
    return () => clearInterval(timer)
  }, [])

  // Dynamic calculations
  const totalAmount = currentAmount * 1.08
  const parcelasValor = (totalAmount / 4).toFixed(2)

  // Simulation handlers
  const handleSolicitar = (e) => {
    e.preventDefault()
    setCurrentAmount(Number(inputAmount))
    setCurrentFinalidade(inputFinalidade)
    setCurrentOficina(inputOficina)
    setCurrentPrazo(inputPrazo)
    setActiveScreen('plano')
  }

  const handleConfirmarPlano = () => {
    setActiveScreen('aval')
  }

  const handleSimularAprovacaoComunidade = () => {
    if (alineAvalStatus !== 'pending') return
    setAlineAvalStatus('requesting')
    setTimeout(() => {
      setAlineAvalStatus('approved')
    }, 2200)
  }

  const handleSimularSelecaoFoto = () => {
    setFileName('foto_peca_nova.jpg')
    setFileUploaded(true)
  }

  const handleSimularUploadRecibo = () => {
    setFileName('recibo_oficina_jn.jpg')
    setFileUploaded(true)
  }

  const handleRemoverArquivo = () => {
    setFileName('')
    setFileUploaded(false)
  }

  const handleEnviarEvidencia = () => {
    if (!fileUploaded) {
      alert('Por favor, tire uma foto ou selecione um recibo primeiro para simular.')
      return
    }
    setEvidenciaStatus('sent')
    setTimeout(() => {
      setEvidenciaStatus('analysis')
      setTimeout(() => {
        setEvidenciaStatus('approved')
        setUserReputacao(765)
      }, 2500)
    }, 1500)
  }

  const handleAdminAprovarCiclo = () => {
    setAdminQueueApproved(true)
    setTimeout(() => {
      setCycleStatus('approved')
      setActiveScreen('home')
    }, 1800)
  }

  const handleAdminSolicitarRevisao = () => {
    alert('Solicitação de revisão enviada com sucesso para João Silva via WhatsApp da Rede.')
  }

  const handleResetDemo = () => {
    setCurrentAmount(850)
    setCurrentFinalidade('Troca de pneu')
    setCurrentOficina('Oficina JN')
    setCurrentPrazo('30')
    setUserReputacao(720)
    setAlineAvalStatus('pending')
    setEvidenciaStatus('pending')
    setFileUploaded(false)
    setFileName('')
    setUploadObs('')
    setCycleStatus('active')
    setAdminQueueApproved(false)

    setInputAmount(850)
    setInputFinalidade('Troca de pneu')
    setInputPrazo('30')
    setInputOficina('Oficina JN')

    setActiveScreen('onboarding')
    alert('A simulação do protótipo foi reiniciada!')
  }

  return (
    <div className="desktop-showcase-container">
      {/* Left Showcase Side Bar (Only visible on Desktop) */}
      <div className="showcase-sidebar">
        <div className="sidebar-header">
          <span className="badge-hackathon">AFROCAPITAL HACK 2026</span>
          <h1 className="sidebar-title">Abias</h1>
          <p className="sidebar-subtitle">Comunidade de Crédito Produtivo</p>
        </div>

        <div className="sidebar-context-card">
          <p><strong>A Abias não é banco digital nem aplicativo de cartão de crédito.</strong></p>
          <p>É um protótipo de alta fidelidade desenhado para motoboys negros e periféricos, focado em crédito produtivo para manter a ferramenta de trabalho funcionando — validado pela rede e oficinas locais.</p>
        </div>

        <div className="sidebar-instructions">
          <h3>Controles da Demo</h3>
          <p>Clique nos botões abaixo ou navegue tocando diretamente nas telas e botões do celular simulado ao lado.</p>

          <div className="sidebar-actions-grid">
            <button
              className={`btn-sidebar ${activeScreen === 'onboarding' ? 'active' : ''}`}
              onClick={() => setActiveScreen('onboarding')}
            >
              <i className="fa-solid fa-mobile-screen-button"></i> Tela Inicial (Onboarding)
            </button>
            <button
              className={`btn-sidebar ${['home', 'solicitar', 'plano', 'aval', 'upload', 'reputacao', 'fundo', 'rede'].includes(activeScreen) ? 'active' : ''}`}
              onClick={() => setActiveScreen('home')}
            >
              <i className="fa-solid fa-house"></i> Home do Membro
            </button>
            <button
              className={`btn-sidebar ${activeScreen === 'admin' ? 'active' : ''}`}
              onClick={() => setActiveScreen('admin')}
            >
              <i className="fa-solid fa-users-cog"></i> Painel Admin / Financiador
            </button>
            <button className="btn-sidebar btn-reset" onClick={handleResetDemo}>
              <i className="fa-solid fa-rotate-left"></i> Reiniciar Simulação
            </button>
          </div>
        </div>

        <div className="sidebar-rules">
          <h4>Microcopy em Destaque:</h4>
          <ul>
            <li><i className="fa-solid fa-quote-left"></i> “Não é empréstimo livre. É crédito produtivo validado.”</li>
            <li><i className="fa-solid fa-quote-left"></i> “Quando a moto para, a renda para.”</li>
            <li><i className="fa-solid fa-quote-left"></i> “A IA apoia a análise. A decisão não é automática.”</li>
          </ul>
        </div>
      </div>

      {/* Right Side: Phone Mockup Frame */}
      <div className="phone-showcase-wrapper">
        <div className="smartphone-frame">
          {/* Speaker and Camera notch */}
          <div className="phone-notch"></div>
          {/* Physical Buttons */}
          <div className="phone-button volume-up"></div>
          <div className="phone-button volume-down"></div>
          <div className="phone-button power-button"></div>

          {/* Screen Area */}
          <div className="phone-screen-container">
            {/* Simulated Mobile Status Bar */}
            <div className="mobile-status-bar">
              <span className="status-time">{clockTime}</span>
              <div className="status-icons">
                <i className="fa-solid fa-signal"></i>
                <span className="network-type">5G</span>
                <i className="fa-solid fa-wifi"></i>
                <i className="fa-solid fa-battery-three-quarters"></i>
              </div>
            </div>

            {/* Screen Content Wrapper */}
            <div className="screen-scroll-area">
              {/* Screen 1: Onboarding */}
              {activeScreen === 'onboarding' && (
                <div className="screen active" id="screen-onboarding">
                  <div className="onboarding-container">
                    <div className="onboarding-logo">
                      <span className="abias-logo">Abias</span>
                    </div>
                    <div className="onboarding-content">
                      <h2 className="onboarding-title">O banco vê um CPF.<br />A Abias vê uma rota.</h2>
                      <p className="onboarding-subtitle">
                        Crédito produtivo validado para motoboys negros manterem a ferramenta de trabalho funcionando.
                      </p>
                      <div className="onboarding-warning-card">
                        <p><i className="fa-solid fa-circle-info"></i> Não é empréstimo livre. É crédito para manter sua rota viva.</p>
                      </div>
                      <div className="onboarding-actions">
                        <button className="btn-app btn-app-primary" onClick={() => setActiveScreen('home')}>Entrar na comunidade</button>
                        <button className="btn-app btn-app-secondary" onClick={() => setActiveScreen('solicitar')}>Simular crédito de rota</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Screen 2: Home */}
              {activeScreen === 'home' && (
                <div className="screen active" id="screen-home">
                  <div className="app-header">
                    <div className="member-profile">
                      <div className="member-avatar"><i className="fa-solid fa-motorcycle"></i></div>
                      <div>
                        <span className="greeting-sub">Bem-vindo, corre ativo</span>
                        <h3 className="member-name">Salve, João Silva</h3>
                      </div>
                    </div>
                    <span className="badge-status-membro"><i className="fa-solid fa-shield-halved"></i> Membro Validado</span>
                  </div>

                  {/* Main Rota Active Status Card */}
                  <div className="home-main-card">
                    <div className="home-card-header">
                      <span className="card-tag">STATUS OPERACIONAL</span>
                      {cycleStatus === 'active' ? (
                        <span className="status-indicator-green"><i className="fa-solid fa-circle"></i> Sua rota está ativa</span>
                      ) : (
                        <span className="status-indicator-green" style={{ color: 'var(--color-gold)' }}><i className="fa-solid fa-circle"></i> Fomento em Manutenção Ativo</span>
                      )}
                    </div>
                    <div className="home-card-body">
                      <div className="reputacao-summary">
                        <span className="lbl">Reputação de Rota</span>
                        <div className="score-display">
                          <span className="score-num font-mono">{userReputacao}</span>
                          <span className="score-max font-mono">/1000</span>
                        </div>
                        <span className="score-level-badge">{userReputacao === 720 ? 'Confiança Rota A2' : 'Confiança Rota A3'}</span>
                      </div>
                    </div>
                    <div className="home-card-footer">
                      <div className="fundo-summary">
                        <i className="fa-solid fa-vault"></i>
                        <span>Fundo Abias: <strong>R$ 4.820</strong> em reserva coletiva</span>
                      </div>
                    </div>
                  </div>

                  {/* Primary CTAs */}
                  <div className="home-actions-group">
                    <button className="btn-app btn-app-primary" onClick={() => setActiveScreen('solicitar')}>
                      <i className="fa-solid fa-wrench"></i> Solicitar crédito de rota
                    </button>
                    <button className="btn-app btn-app-secondary" onClick={() => setActiveScreen('upload')}>
                      <i className="fa-solid fa-upload"></i> Enviar evidência
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="home-stats-section">
                    <h4 className="section-title-mobile">Sua Frequência</h4>
                    <div className="stats-mobile-grid">
                      <div className="stat-mobile-card">
                        <span className="val font-mono">02</span>
                        <span className="lbl">Ciclos concluídos</span>
                      </div>
                      <div className="stat-mobile-card text-success">
                        <span className="val font-mono">00</span>
                        <span className="lbl">Atrasos de rota</span>
                      </div>
                      <div className="stat-mobile-card">
                        <span className="val font-mono">01</span>
                        <span className="lbl">Aval recebido</span>
                      </div>
                      <div className="stat-mobile-card">
                        <span className="val font-mono">R$ 850</span>
                        <span className="lbl">Último fomento</span>
                      </div>
                    </div>
                  </div>

                  {/* Notice Card */}
                  <div className="info-notice-card">
                    <p><i className="fa-solid fa-quote-left"></i> A comunidade ajuda a provar o que o banco não enxerga.</p>
                  </div>
                </div>
              )}

              {/* Screen 3: Solicitação de Crédito */}
              {activeScreen === 'solicitar' && (
                <div className="screen active" id="screen-solicitar">
                  <div className="app-header-simple">
                    <button className="btn-back" onClick={() => setActiveScreen('home')}><i className="fa-solid fa-chevron-left"></i></button>
                    <h3>Solicitar Crédito de Rota</h3>
                  </div>

                  <form className="mobile-form" id="solicitacao-form" onSubmit={handleSolicitar}>
                    <div className="form-banner-info">
                      <p><strong>Não é empréstimo livre.</strong> O recurso é exclusivo para despesas da sua ferramenta de trabalho.</p>
                    </div>

                    <div className="mobile-form-group">
                      <label className="form-label">Quanto você precisa?</label>
                      <div className="money-input-wrapper">
                        <span className="currency-symbol">R$</span>
                        <input
                          type="number"
                          id="form-amount"
                          value={inputAmount}
                          onChange={(e) => setInputAmount(e.target.value)}
                          min="100"
                          max="2000"
                          required
                        />
                      </div>
                      <span className="form-helper">Valor alvo sugerido para manutenção regular: R$ 850</span>
                    </div>

                    <div className="mobile-form-group">
                      <label className="form-label">Para qual finalidade?</label>
                      <div className="chips-selector">
                        {[
                          'Troca de pneu',
                          'Revisão da moto',
                          'Celular de trabalho',
                          'Baú ou Mochila',
                          'Documentação',
                          'Seguro contra roubo',
                          'Equipamento de segurança',
                          'Emergência operacional'
                        ].map((fin) => (
                          <label className="chip-option" key={fin}>
                            <input
                              type="radio"
                              name="finalidade"
                              value={fin}
                              checked={inputFinalidade === fin}
                              onChange={() => setInputFinalidade(fin)}
                            />
                            <span>{fin}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className="mobile-form-group">
                      <label className="form-label">Em quanto tempo pode pagar?</label>
                      <select
                        className="form-select"
                        id="form-prazo"
                        value={inputPrazo}
                        onChange={(e) => setInputPrazo(e.target.value)}
                        required
                      >
                        <option value="7">7 dias (Ciclo rápido)</option>
                        <option value="15">15 dias (Ciclo quinzenal)</option>
                        <option value="30">30 dias (Ciclo mensal)</option>
                        <option value="45">45 dias (Ciclo estendido)</option>
                      </select>
                    </div>

                    <div className="mobile-form-group">
                      <label className="form-label">Qual oficina pretende usar?</label>
                      <input
                        type="text"
                        className="form-text-input"
                        id="form-oficina"
                        value={inputOficina}
                        onChange={(e) => setInputOficina(e.target.value)}
                        placeholder="Ex: Oficina JN ou Borracharia São Jorge"
                        required
                      />
                    </div>

                    <div className="mobile-form-group">
                      <label className="form-label">Você já possui orçamento / comprovante?</label>
                      <div className="file-uploader-box" onClick={handleSimularSelecaoFoto} style={{ cursor: 'pointer' }}>
                        <i className="fa-solid fa-camera"></i>
                        <span>Tirar foto ou anexar orçamento</span>
                        <span className="helper-text">Formatos PDF, PNG ou JPG (Clique para simular)</span>
                      </div>
                    </div>

                    <button type="submit" className="btn-app btn-app-primary">Gerar plano de crédito</button>
                  </form>
                </div>
              )}

              {/* Screen 4: Plano Sugerido */}
              {activeScreen === 'plano' && (
                <div className="screen active" id="screen-plano">
                  <div className="app-header-simple">
                    <button className="btn-back" onClick={() => setActiveScreen('solicitar')}><i className="fa-solid fa-chevron-left"></i></button>
                    <h3>Plano de Crédito Sugerido</h3>
                  </div>

                  <div className="plano-container">
                    <div className="plano-notice-badge">
                      <span><i className="fa-solid fa-triangle-exclamation"></i> Plano sugerido. Sujeito à validação da rede.</span>
                    </div>

                    {/* Slip de Crédito Produtivo */}
                    <div className="premium-credit-card compact-slip">
                      <div className="card-brand-row">
                        <span className="card-brand">Abias</span>
                        <span className="card-contactless"><i className="fa-solid fa-receipt"></i> MOCK SLIP</span>
                      </div>
                      <div className="slip-details">
                        <div className="slip-row">
                          <span className="slip-label">FINALIDADE DE CRÉDITO</span>
                          <span className="slip-value">{currentFinalidade}</span>
                        </div>
                        <div className="slip-row">
                          <span className="slip-label">PRAZO TOTAL</span>
                          <span className="slip-value">{currentPrazo} dias</span>
                        </div>
                        <div className="slip-row">
                          <span className="slip-label">OFICINA PARCEIRA</span>
                          <span className="slip-value">{currentOficina}</span>
                        </div>
                        <div className="slip-row">
                          <span className="slip-label">EVIDÊNCIAS COBRADAS</span>
                          <span className="slip-value">Nota + Foto do Serviço</span>
                        </div>
                      </div>
                      <div className="slip-footer">
                        <div className="slip-badge">CRÉDITO PRODUTIVO</div>
                        <span className="slip-amount">R$ {currentAmount.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Parcelas */}
                    <div className="plano-payment-card glass">
                      <h4>Estrutura do Ciclo Comunitário</h4>
                      <div className="payment-row">
                        <span className="lbl font-bold">Retorno estimado:</span>
                        <span className="val font-mono font-bold">4x de R$ {new Intl.NumberFormat('pt-BR').format(parcelasValor)}</span>
                      </div>
                      <span className="tax-info-footer">Sem taxas abusivas. Juros voltados a blindar a rede.</span>
                    </div>

                    {/* Validações Exigidas */}
                    <div className="validacoes-list-card glass">
                      <h4>Evidências Necessárias no Ciclo</h4>
                      <ul className="bullet-list-mobile">
                        <li><i className="fa-solid fa-receipt text-success"></i> Orçamento cadastrado pela oficina parceira</li>
                        <li><i className="fa-solid fa-image text-warning"></i> Foto da manutenção concluída na moto</li>
                        <li><i className="fa-solid fa-check-double text-warning"></i> Aval emitido por 2 membros da comunidade</li>
                      </ul>
                    </div>

                    {/* Impacto Estimado */}
                    <div className="impacto-estimado-card">
                      <h4 className="impacto-title"><i className="fa-solid fa-sparkles"></i> Impacto estimado no asfalto</h4>
                      <div className="impact-grid">
                        <div className="impact-item">
                          <i className="fa-solid fa-calendar-check"></i>
                          <span>Até 3 dias parados evitados</span>
                        </div>
                        <div className="impact-item">
                          <i className="fa-solid fa-money-bill-trend-up"></i>
                          <span>Renda diária preservada</span>
                        </div>
                        <div className="impact-item">
                          <i className="fa-solid fa-shop"></i>
                          <span>Oficina local ativada no bairro</span>
                        </div>
                      </div>
                    </div>

                    <div className="plano-actions">
                      <button className="btn-app btn-app-primary" onClick={handleConfirmarPlano}>Confirmar solicitação</button>
                      <button className="btn-app btn-app-secondary" onClick={() => setActiveScreen('solicitar')}>Editar plano</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Screen 5: Aval Comunitário */}
              {activeScreen === 'aval' && (
                <div className="screen active" id="screen-aval">
                  <div className="app-header-simple">
                    <button className="btn-back" onClick={() => setActiveScreen('home')}><i className="fa-solid fa-chevron-left"></i></button>
                    <h3>Validação de Rede</h3>
                  </div>

                  <div className="aval-container">
                    <div className="aval-status-banner glass">
                      <span className="section-tag tag-yellow">ESTADO DA SOLICITAÇÃO</span>
                      <h2>Quem valida sua rota?</h2>
                      <p>Seu crédito de rota entra em vigor assim que a rede de confiança validar seu perfil e a oficina credenciar o orçamento.</p>
                    </div>

                    {/* Lista de Validores */}
                    <div className="aval-peers-list">
                      <div className="peer-item-card glass">
                        <div className="peer-avatar"><i className="fa-solid fa-motorcycle"></i></div>
                        <div className="peer-info">
                          <h5>Marcos Santos</h5>
                          <span className="peer-sub">Motoboy Leste 4 anos</span>
                        </div>
                        <span className="status-badge badge-success"><i className="fa-solid fa-circle-check"></i> Validou</span>
                      </div>

                      <div className="peer-item-card glass" id="peer-aline-card">
                        <div className="peer-avatar"><i className="fa-solid fa-motorcycle"></i></div>
                        <div className="peer-info">
                          <h5>Aline Souza</h5>
                          <span className="peer-sub">Membro da Rede - ZL</span>
                        </div>
                        {alineAvalStatus === 'pending' && (
                          <span className="status-badge badge-pending" id="status-aline"><i className="fa-solid fa-spinner fa-spin"></i> Pendente</span>
                        )}
                        {alineAvalStatus === 'requesting' && (
                          <span className="status-badge badge-pending" id="status-aline"><i className="fa-solid fa-spinner fa-spin"></i> Solicitando...</span>
                        )}
                        {alineAvalStatus === 'approved' && (
                          <span className="status-badge badge-success" id="status-aline"><i className="fa-solid fa-circle-check"></i> Validou</span>
                        )}
                      </div>

                      <div className="peer-item-card glass">
                        <div className="peer-avatar"><i className="fa-solid fa-screwdriver-wrench"></i></div>
                        <div className="peer-info">
                          <h5>Oficina JN</h5>
                          <span className="peer-sub">Oficina parceira credenciada</span>
                        </div>
                        <span className="status-badge badge-success"><i className="fa-solid fa-circle-check"></i> Confirmado</span>
                      </div>
                    </div>

                    {/* Explicação do aval */}
                    <div className="info-notice-card plain-border">
                      <p><strong>Por que isso importa?</strong> O aval comunitário não substitui a análise de dados. Ele comprova que você está ativo na rota e que a sua necessidade produtiva é real.</p>
                    </div>

                    <div className="aval-actions">
                      <button
                        className="btn-app btn-app-primary"
                        id="btn-convidar-validador"
                        disabled={alineAvalStatus !== 'pending'}
                        onClick={handleSimularAprovacaoComunidade}
                      >
                        {alineAvalStatus === 'pending' && 'Convidar validador (Simular)'}
                        {alineAvalStatus === 'requesting' && 'Solicitando aval...'}
                        {alineAvalStatus === 'approved' && 'Aval comunidade concedido!'}
                      </button>
                      <button className="btn-app btn-app-secondary" onClick={() => setActiveScreen('upload')}>Avançar para evidência</button>
                    </div>
                  </div>
                </div>
              )}

              {/* Screen 6: Upload de Evidência */}
              {activeScreen === 'upload' && (
                <div className="screen active" id="screen-upload">
                  <div className="app-header-simple">
                    <button className="btn-back" onClick={() => setActiveScreen('home')}><i className="fa-solid fa-chevron-left"></i></button>
                    <h3>Comprovar Uso de Crédito</h3>
                  </div>

                  <div className="upload-container">
                    <div className="form-banner-info border-terra">
                      <p><strong>Quando a moto para, a renda para.</strong> Mantenha seu ciclo saudável provando que o recurso foi aplicado na finalidade acordada.</p>
                    </div>

                    <div className="milestone-card glass">
                      <span className="lbl-milestone">CICLO CORRENTE</span>
                      <h4>Manutenção da Moto ({currentFinalidade})</h4>
                      <div className="milestone-status-row">
                        <span className="lbl">Estado da Análise:</span>
                        {evidenciaStatus === 'pending' && <span className="val-status text-warning">Pendente de Envio</span>}
                        {evidenciaStatus === 'sent' && <span className="val-status text-warning"><i className="fa-solid fa-spinner fa-spin"></i> Enviando...</span>}
                        {evidenciaStatus === 'analysis' && <span className="val-status text-warning">Em análise pela rede</span>}
                        {evidenciaStatus === 'approved' && <span className="val-status text-success">Evidência aprovada</span>}
                      </div>
                    </div>

                    {/* Upload options simulator */}
                    <div className="upload-methods">
                      <div className="upload-box-action" onClick={handleSimularSelecaoFoto} style={{ cursor: 'pointer' }}>
                        <div className="box-icon"><i className="fa-solid fa-camera"></i></div>
                        <span>Tirar foto da moto / peças</span>
                      </div>
                      <div className="upload-box-action" onClick={handleSimularUploadRecibo} style={{ cursor: 'pointer' }}>
                        <div className="box-icon"><i className="fa-solid fa-file-invoice-dollar"></i></div>
                        <span>Enviar recibo da oficina</span>
                      </div>
                      <div className="upload-box-action" onClick={() => alert('Leitura de QR Code local simulada.')} style={{ cursor: 'pointer' }}>
                        <div className="box-icon"><i className="fa-solid fa-qrcode"></i></div>
                        <span>Ler QR da oficina parceira</span>
                      </div>
                    </div>

                    {/* File display */}
                    {fileUploaded && (
                      <div className="simulated-file-badge" id="file-upload-display">
                        <i className="fa-solid fa-paperclip"></i> <span>{fileName}</span>
                        <button className="btn-remove-file" onClick={handleRemoverArquivo}>&times;</button>
                      </div>
                    )}

                    <div className="mobile-form-group" style={{ marginTop: '24px' }}>
                      <label className="form-label">O que foi feito? (Observação)</label>
                      <textarea
                        className="form-textarea"
                        value={uploadObs}
                        onChange={(e) => setUploadObs(e.target.value)}
                        placeholder="Ex: Trocado pneu traseiro careca e ajustado o kit relação na Oficina JN."
                      />
                    </div>

                    <button
                      className="btn-app btn-app-primary"
                      id="btn-send-evidencia"
                      onClick={handleEnviarEvidencia}
                      disabled={evidenciaStatus !== 'pending'}
                    >
                      {evidenciaStatus === 'pending' && 'Enviar evidência'}
                      {evidenciaStatus === 'sent' && 'Enviando...'}
                      {evidenciaStatus === 'analysis' && 'Evidência em Análise'}
                      {evidenciaStatus === 'approved' && 'Evidência Aprovada!'}
                    </button>
                  </div>
                </div>
              )}

              {/* Screen 7: Reputação de Rota */}
              {activeScreen === 'reputacao' && (
                <div className="screen active" id="screen-reputacao">
                  <div className="app-header-simple">
                    <h3>Reputação de Rota</h3>
                  </div>

                  <div className="reputacao-container">
                    <div className="reputacao-score-box glass">
                      <span className="lbl-tag">SUA NOTA EXPLICÁVEL</span>
                      <div className="reputacao-number-row">
                        <span className="val font-mono">{userReputacao}</span>
                        <span className="max font-mono">/1000</span>
                      </div>
                      <h4 className="reputacao-level">{userReputacao === 720 ? 'Rota Confiável' : 'Alta Confiança'}</h4>
                      <p className="reputacao-desc">
                        Sua reputação cresce quando você destina o crédito corretamente, valida evidências em até 24h, conclui os ciclos e apoia outros parceiros na rede.
                      </p>
                    </div>

                    {/* Factors progress bars */}
                    <div className="reputacao-factors-list">
                      <h4>Fatores da Reputação</h4>

                      <div className="factor-progress-item">
                        <div className="factor-lbl">
                          <span>Ciclos pagos em dia</span>
                          <span className="percent font-mono">85%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-bar" style={{ width: '85%', backgroundColor: 'var(--color-accent-pink)' }}></div>
                        </div>
                      </div>

                      <div className="factor-progress-item">
                        <div className="factor-lbl">
                          <span>Evidências validadas</span>
                          <span className="percent font-mono">{userReputacao === 720 ? '90%' : '98%'}</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-bar" style={{ width: userReputacao === 720 ? '90%' : '98%', backgroundColor: 'var(--color-accent-pink)' }}></div>
                        </div>
                      </div>

                      <div className="factor-progress-item">
                        <div className="factor-lbl">
                          <span>Aval comunitário emitido</span>
                          <span className="percent font-mono">70%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-bar" style={{ width: '70%', backgroundColor: 'var(--color-accent-gold)' }}></div>
                        </div>
                      </div>

                      <div className="factor-progress-item">
                        <div className="factor-lbl">
                          <span>Participação no Fundo Coletivo</span>
                          <span className="percent font-mono">55%</span>
                        </div>
                        <div className="progress-track">
                          <div className="progress-bar" style={{ width: '55%', backgroundColor: 'var(--color-accent-gold)' }}></div>
                        </div>
                      </div>
                    </div>

                    {/* How to improve */}
                    <div className="how-to-improve-card glass">
                      <h4>Como subir sua reputação?</h4>
                      <ul className="improve-checklist">
                        {userReputacao === 720 ? (
                          <>
                            <li><i className="fa-solid fa-square-plus"></i> Finalizar ciclo de crédito corrente</li>
                            <li><i className="fa-solid fa-square-plus"></i> Enviar a foto da manutenção em menos de 24h</li>
                            <li><i className="fa-solid fa-square-plus"></i> Emitir aval pendente para um colega da rota</li>
                          </>
                        ) : (
                          <>
                            <li><i className="fa-solid fa-circle-check text-success"></i> Foto de manutenção aprovada! (+45 pts)</li>
                            <li><i className="fa-solid fa-square-plus"></i> Finalizar pagamentos do ciclo corrente</li>
                            <li><i className="fa-solid fa-square-plus"></i> Apoiar a entrada de um novo membro da rede</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Screen 8: Fundo Abias */}
              {activeScreen === 'fundo' && (
                <div className="screen active" id="screen-fundo">
                  <div className="app-header-simple">
                    <h3>Fundo Abias</h3>
                  </div>

                  <div className="fundo-mobile-container">
                    <div className="fundo-headline-card glass">
                      <span className="section-tag tag-yellow">PROTEÇÃO DE REDE</span>
                      <h2>Crédito individual.<br />Proteção coletiva.</h2>
                      <p>Parte do valor de cada ciclo concluído fortalece a reserva coletiva de emergência da nossa rota.</p>
                    </div>

                    <div className="fundo-reserve-card glass">
                      <span className="lbl">Reserva Coletiva do Piloto</span>
                      <div className="amount-val font-mono">R$ 4.820,00</div>
                      <div className="fundo-bar-wrapper">
                        <div className="fundo-bar-fill-mobile" style={{ width: '58%' }}></div>
                      </div>
                      <span className="fundo-subtext-meta">Meta de blindagem do piloto: R$ 8.000,00</span>
                    </div>

                    {/* Inflows / Outflows */}
                    <div className="fundo-inout-grid">
                      <div className="inout-section">
                        <h5><i className="fa-solid fa-arrow-down-long text-success"></i> Entradas do Fundo</h5>
                        <ul>
                          <li>Margem dos ciclos (10%)</li>
                          <li>Parceiros mecânicos</li>
                          <li>Apoiadores do Hack</li>
                        </ul>
                      </div>
                      <div className="inout-section">
                        <h5><i className="fa-solid fa-arrow-up-long text-danger"></i> Destinação Coletiva</h5>
                        <ul>
                          <li>Manutenção emergencial</li>
                          <li>Redução de juros futuros</li>
                          <li>Auxílio quebra/acidente</li>
                        </ul>
                      </div>
                    </div>

                    <div className="info-notice-card plain-border">
                      <p><i className="fa-solid fa-quote-left"></i> O crédito entra na rede e volta como proteção coletiva.</p>
                    </div>

                    <button
                      className="btn-app btn-app-secondary"
                      onClick={() => alert('Regras do Fundo: 1. Cobertura de reboque em até R$ 200 por evento. 2. Juros comunitários são recalculados mensalmente baseado na saúde do fundo.')}
                    >
                      Ver regulamento completo
                    </button>
                  </div>
                </div>
              )}

              {/* Screen 9: Rede / Economia Local */}
              {activeScreen === 'rede' && (
                <div className="screen active" id="screen-rede">
                  <div className="app-header-simple">
                    <h3>Rede & Economia Local</h3>
                  </div>

                  <div className="rede-container">
                    <div className="rede-headline-box">
                      <h2>A rota movimenta o território</h2>
                      <p>Nosso crédito produtivo fortalece os negócios do bairro. Veja os indicadores da economia circular:</p>
                    </div>

                    {/* Stats list */}
                    <div className="rede-stats-grid">
                      <div className="stat-card-inline glass">
                        <span className="lbl">Oficinas Parceiras</span>
                        <span className="val font-mono">03</span>
                      </div>
                      <div className="stat-card-inline glass">
                        <span className="lbl">Ciclos de Manutenção</span>
                        <span className="val font-mono">10</span>
                      </div>
                      <div className="stat-card-inline glass">
                        <span className="lbl">Dias Parados Evitados</span>
                        <span className="val font-mono">05</span>
                      </div>
                      <div className="stat-card-inline glass">
                        <span className="lbl">Circulação Estimada</span>
                        <span className="val font-mono">R$ 8.500</span>
                      </div>
                    </div>

                    {/* Flow Diagram inside app */}
                    <div className="rede-flow-card glass">
                      <h5>Fluxo da Rede:</h5>
                      <div className="inline-flow-steps">
                        <div className="flow-dot-step">Fomento</div>
                        <i className="fa-solid fa-chevron-right"></i>
                        <div className="flow-dot-step">Oficina</div>
                        <i className="fa-solid fa-chevron-right"></i>
                        <div className="flow-dot-step">Rota</div>
                        <i className="fa-solid fa-chevron-right"></i>
                        <div className="flow-dot-step">Fundo</div>
                      </div>
                    </div>

                    {/* Partners List */}
                    <div className="rede-partners-list">
                      <h4>Negócios Locais Parceiros</h4>

                      <div className="partner-item glass">
                        <div className="p-icon"><i className="fa-solid fa-wrench"></i></div>
                        <div className="p-info">
                          <h5>Oficina JN</h5>
                          <span>Mecânica de motos - Zona Leste</span>
                        </div>
                      </div>

                      <div className="partner-item glass">
                        <div className="p-icon"><i className="fa-solid fa-circle-radiation"></i></div>
                        <div className="p-info">
                          <h5>Borracharia São Jorge</h5>
                          <span>Reparos rápidos e pneus</span>
                        </div>
                      </div>

                      <div className="partner-item glass">
                        <div className="p-icon"><i className="fa-solid fa-box-archive"></i></div>
                        <div className="p-info">
                          <h5>Moto Peças Leste</h5>
                          <span>Componentes e acessórios</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Screen 10: Admin Panel */}
              {activeScreen === 'admin' && (
                <div className="screen active" id="screen-admin">
                  <div className="app-header-admin">
                    <h3>Mesa de Gestão — Abias</h3>
                    <span className="badge-admin">Mesa Operacional</span>
                  </div>

                  <div className="admin-container">
                    {/* Admin metrics */}
                    <div className="admin-metrics-grid">
                      <div className="metric-admin-card glass">
                        <span className="lbl">Ciclos Ativos</span>
                        <span className="val font-mono">10</span>
                      </div>
                      <div className="metric-admin-card glass">
                        <span className="lbl">Volume Solicitado</span>
                        <span className="val font-mono">R$ 8.500</span>
                      </div>
                      <div className="metric-admin-card glass">
                        <span className="lbl">Evidências Pendentes</span>
                        <span className="val font-mono">01</span>
                      </div>
                      <div className="metric-admin-card glass">
                        <span className="lbl">Fundo Simulador</span>
                        <span className="val font-mono">R$ 4.820</span>
                      </div>
                    </div>

                    {/* Pending Validation Queue */}
                    <div className="admin-queue-card glass">
                      <h4>Fila de Ciclos Pendentes</h4>

                      {!adminQueueApproved ? (
                        <div className="queue-item" id="admin-pending-item">
                          <div className="q-header">
                            <span className="q-name">João Silva (Leste)</span>
                            <span className="q-amount font-mono">R$ {currentAmount.toFixed(2)}</span>
                          </div>
                          <div className="q-details">
                            <span>Finalidade: {currentFinalidade}</span>
                            <span>Oficina: {currentOficina}</span>
                          </div>
                          <div className="q-checklists">
                            <span className="chk-status checked"><i className="fa-solid fa-check"></i> Rota Comprovada</span>
                            <span className="chk-status checked"><i className="fa-solid fa-check"></i> Aval: Marcos</span>
                            {alineAvalStatus === 'approved' ? (
                              <span className="chk-status checked"><i className="fa-solid fa-check"></i> Aval: Aline</span>
                            ) : alineAvalStatus === 'requesting' ? (
                              <span className="chk-status warning"><i className="fa-solid fa-spinner fa-spin"></i> Solicitando Aval...</span>
                            ) : (
                              <span className="chk-status warning" id="admin-chk-aline"><i className="fa-solid fa-spinner fa-spin"></i> Aval: Aline</span>
                            )}
                          </div>

                          {/* Actions */}
                          <div className="admin-actions-row">
                            <button
                              className="btn-admin btn-admin-approve"
                              id="btn-admin-approve"
                              onClick={handleAdminAprovarCiclo}
                              disabled={alineAvalStatus !== 'approved'}
                            >
                              Aprovar Fomento
                            </button>
                            <button className="btn-admin btn-admin-reject" onClick={handleAdminSolicitarRevisao}>Pedir Revisão</button>
                          </div>
                        </div>
                      ) : (
                        <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--success)', fontWeight: 'bold', animation: 'fadeIn 0.4s' }}>
                          <i className="fa-solid fa-circle-check" style={{ fontSize: '2rem', marginBottom: '8px' }}></i>
                          <p>Ciclo de Rota Pré-Aprovado!</p>
                          <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 'normal', marginTop: '4px' }}>Recurso liberado direto para a {currentOficina}.</p>
                        </div>
                      )}
                    </div>

                    {/* Alerts / Audit */}
                    <div className="admin-alerts-card glass">
                      <h4>Alertas de Risco Operacional</h4>
                      <div className="alert-log-item danger">
                        <i className="fa-solid fa-circle-exclamation"></i>
                        <span>Evidência ilegível: Foto do recibo enviada por Carlos M. desfocada.</span>
                      </div>
                      <div className="alert-log-item warning">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>Aval circular: Marcos e João validaram um ao outro na mesma rota.</span>
                      </div>
                    </div>

                    <div className="info-notice-card">
                      <p><i className="fa-solid fa-circle-info"></i> <strong>Decisão Humana:</strong> A IA apoia a análise. A decisão não é automática.</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Bottom Navigation Tab Bar (Hidden on onboarding/admin) */}
            {activeScreen !== 'onboarding' && activeScreen !== 'admin' && (
              <div className="mobile-tab-bar" id="app-tab-bar">
                <button
                  className={`tab-item ${activeScreen === 'home' ? 'active' : ''}`}
                  id="tab-home"
                  onClick={() => setActiveScreen('home')}
                >
                  <i className="fa-solid fa-house"></i>
                  <span>Início</span>
                </button>
                <button
                  className={`tab-item ${['solicitar', 'plano', 'aval', 'upload'].includes(activeScreen) ? 'active' : ''}`}
                  id="tab-solicitar"
                  onClick={() => setActiveScreen('solicitar')}
                >
                  <i className="fa-solid fa-route"></i>
                  <span>Rota</span>
                </button>
                <button
                  className={`tab-item ${activeScreen === 'reputacao' ? 'active' : ''}`}
                  id="tab-reputacao"
                  onClick={() => setActiveScreen('reputacao')}
                >
                  <i className="fa-solid fa-chart-simple"></i>
                  <span>Reputação</span>
                </button>
                <button
                  className={`tab-item ${activeScreen === 'fundo' ? 'active' : ''}`}
                  id="tab-fundo"
                  onClick={() => setActiveScreen('fundo')}
                >
                  <i className="fa-solid fa-vault"></i>
                  <span>Fundo</span>
                </button>
                <button
                  className={`tab-item ${activeScreen === 'rede' ? 'active' : ''}`}
                  id="tab-rede"
                  onClick={() => setActiveScreen('rede')}
                >
                  <i className="fa-solid fa-network-wired"></i>
                  <span>Rede</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
