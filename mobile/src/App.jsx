import { useState, useEffect } from 'react'

function App() {
  // --- LocalStorage State Initializers ---
  const [membro, setMembro] = useState(() => {
    const saved = localStorage.getItem('abias_membro')
    return saved ? JSON.parse(saved) : null
  })

  const [solicitacao, setSolicitacao] = useState(() => {
    const saved = localStorage.getItem('abias_solicitacao')
    return saved ? JSON.parse(saved) : null
  })

  const [cicloEstado, setCicloEstado] = useState(() => {
    return localStorage.getItem('abias_ciclo_estado') || 'draft'
  })

  const [reputacao, setReputacao] = useState(() => {
    const saved = localStorage.getItem('abias_reputacao')
    return saved ? Number(saved) : 720
  })

  const [fundo, setFundo] = useState(() => {
    const saved = localStorage.getItem('abias_fundo')
    return saved ? Number(saved) : 4820
  })

  const [avaliacoes, setAvaliacoes] = useState(() => {
    const saved = localStorage.getItem('abias_avaliacoes')
    return saved ? JSON.parse(saved) : { marcos: 'pending', marcosComment: '', aline: 'pending', alineComment: '' }
  })

  const [evidencia, setEvidencia] = useState(() => {
    const saved = localStorage.getItem('abias_evidencia')
    return saved ? JSON.parse(saved) : { file: '', obs: '', status: 'pending', type: '' }
  })

  const [oficinaConfirmacao, setOficinaConfirmacao] = useState(() => {
    const saved = localStorage.getItem('abias_oficina_confirmacao')
    return saved ? JSON.parse(saved) : { quoteConfirmed: false, serviceConfirmed: false, note: '' }
  })

  const [gestaoJustificativa, setGestaoJustificativa] = useState(() => {
    return localStorage.getItem('abias_gestao_justificativa') || ''
  })

  // --- UI-only Navigation States ---
  const [profileMode, setProfileMode] = useState('membro') // 'membro' | 'oficina' | 'gestao'
  const [activeTab, setActiveTab] = useState('inicio') // 'inicio' | 'credito' | 'evidencia' | 'reputacao' | 'fundo'
  const [clockTime, setClockTime] = useState('00:00')

  // --- Temporary inputs for forms ---
  const [inputNome, setInputNome] = useState('João Silva')
  const [inputTelefone, setInputTelefone] = useState('(11) 98765-4321')
  const [inputRegiao, setInputRegiao] = useState('Zona Leste, São Paulo')
  const [inputTempo, setInputTempo] = useState('4 anos')
  const [inputFerramenta, setInputFerramenta] = useState('Moto')
  const [inputRaca, setInputRaca] = useState('Negro')
  const [inputAceite, setInputAceite] = useState(true)

  const [inputAmount, setInputAmount] = useState(850)
  const [inputFinalidade, setInputFinalidade] = useState('Pneu + Revisão')
  const [inputPrazo, setInputPrazo] = useState('30')
  const [inputOficina, setInputOficina] = useState('Oficina JN')
  const [inputUrgencia, setInputUrgencia] = useState('Alta')
  const [inputDescricao, setInputDescricao] = useState('Preciso trocar o pneu traseiro careca e fazer revisão básica da suspensão para continuar rodando com segurança.')

  const [uploadFileSelected, setUploadFileSelected] = useState('')
  const [uploadFileType, setUploadFileType] = useState('')
  const [uploadFileObs, setUploadFileObs] = useState('')

  const [adminJustifyInput, setAdminJustifyInput] = useState('')

  // --- Clock effect ---
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

  // --- Sync State to LocalStorage ---
  useEffect(() => {
    if (membro) localStorage.setItem('abias_membro', JSON.stringify(membro))
    else localStorage.removeItem('abias_membro')
  }, [membro])

  useEffect(() => {
    if (solicitacao) localStorage.setItem('abias_solicitacao', JSON.stringify(solicitacao))
    else localStorage.removeItem('abias_solicitacao')
  }, [solicitacao])

  useEffect(() => {
    localStorage.setItem('abias_ciclo_estado', cicloEstado)
  }, [cicloEstado])

  useEffect(() => {
    localStorage.setItem('abias_reputacao', String(reputacao))
  }, [reputacao])

  useEffect(() => {
    localStorage.setItem('abias_fundo', String(fundo))
  }, [fundo])

  useEffect(() => {
    localStorage.setItem('abias_avaliacoes', JSON.stringify(avaliacoes))
  }, [avaliacoes])

  useEffect(() => {
    localStorage.setItem('abias_evidencia', JSON.stringify(evidencia))
  }, [evidencia])

  useEffect(() => {
    localStorage.setItem('abias_oficina_confirmacao', JSON.stringify(oficinaConfirmacao))
  }, [oficinaConfirmacao])

  useEffect(() => {
    localStorage.setItem('abias_gestao_justificativa', gestaoJustificativa)
  }, [gestaoJustificativa])

  // --- Calculations ---
  const currentAmount = solicitacao ? solicitacao.valor : 850
  const currentFinalidade = solicitacao ? solicitacao.finalidade : 'Pneu + Revisão'
  const currentOficina = solicitacao ? solicitacao.oficina : 'Oficina JN'
  const currentPrazo = solicitacao ? solicitacao.prazo : '30'
  const currentUrgencia = solicitacao ? solicitacao.urgencia : 'Alta'
  const currentDescricao = solicitacao ? solicitacao.descricao : ''

  const totalAmount = currentAmount * 1.08
  const parcelasValor = (totalAmount / 4).toFixed(2)

  // --- State Transitions & Simulation Events ---

  // 1. Cadastro
  const handleCadastro = (e) => {
    e.preventDefault()
    if (!inputAceite) {
      alert('Você precisa aceitar o uso de dados para entrar na comunidade.')
      return
    }
    const novoMembro = {
      nome: inputNome,
      telefone: inputTelefone,
      regiao: inputRegiao,
      tempo: inputTempo,
      ferramenta: inputFerramenta,
      raca: inputRaca
    }
    setMembro(novoMembro)
    setCicloEstado('draft')
    setActiveTab('inicio')
  }

  // 2. Solicitação
  const handleSolicitacaoSubmit = (e) => {
    e.preventDefault()
    const novaSolicitacao = {
      valor: Number(inputAmount),
      finalidade: inputFinalidade,
      prazo: inputPrazo,
      oficina: inputOficina,
      urgencia: inputUrgencia,
      descricao: inputDescricao
    }
    setSolicitacao(novaSolicitacao)
    setCicloEstado('submitted')
  }

  // 3. Confirmar Plano Sugerido
  const handleConfirmarPlano = () => {
    setCicloEstado('community_validation')
  }

  // 4. Simulação de avais comunitários
  const handleSimularAvalMarcos = () => {
    const updated = { ...avaliacoes, marcos: 'approved', marcosComment: 'João é parceiro de confiança, conheço a rota dele na Zona Leste.' }
    setAvaliacoes(updated)
    checkAvais(updated)
  }

  const handleSimularAvalAline = () => {
    const updated = { ...avaliacoes, aline: 'approved', alineComment: 'Grande profissional de entrega. Corre garantido no asfalto.' }
    setAvaliacoes(updated)
    checkAvais(updated)
  }

  const checkAvais = (currentAvais) => {
    if (currentAvais.marcos === 'approved' && currentAvais.aline === 'approved') {
      setReputacao(prev => prev + 10)
      setCicloEstado('partner_quote')
    }
  }

  // 5. Oficina - Confirmação do Orçamento
  const handleOficinaConfirmarOrçamento = () => {
    setOficinaConfirmacao(prev => ({ ...prev, quoteConfirmed: true }))
    setReputacao(prev => prev + 15)
    setCicloEstado('under_review')
  }

  // 6. Gestão - Aprovação / Ações Administrativas
  const handleGestaoAprovar = () => {
    setFundo(prev => prev + 34) // Contribuição simbólica no aprovado
    setCicloEstado('approved')
    // Auto transition to evidence_pending for the member
    setTimeout(() => {
      setCicloEstado('evidence_pending')
    }, 100)
  }

  const handleGestaoPedirRevisao = () => {
    if (!adminJustifyInput.trim()) {
      alert('Por favor, descreva o que precisa ser revisado.')
      return
    }
    setGestaoJustificativa(adminJustifyInput)
    setCicloEstado('needs_revision')
    setAdminJustifyInput('')
  }

  const handleGestaoRecusar = () => {
    if (!adminJustifyInput.trim()) {
      alert('Por favor, insira o motivo da recusa.')
      return
    }
    setGestaoJustificativa(adminJustifyInput)
    setReputacao(prev => Math.max(0, prev - 30))
    setCicloEstado('rejected')
    setAdminJustifyInput('')
  }

  // 7. Evidência - Simulação de seleção e envio
  const handleSimularRecibo = () => {
    setUploadFileSelected('recibo_oficina_jn.jpg')
    setUploadFileType('recibo')
  }

  const handleSimularFoto = () => {
    setUploadFileSelected('foto_pneu_instalado.jpg')
    setUploadFileType('foto')
  }

  const handleEnviarEvidencia = () => {
    if (!uploadFileSelected) {
      alert('Selecione ou simule um arquivo para envio.')
      return
    }
    const novaEvidencia = {
      file: uploadFileSelected,
      obs: uploadFileObs,
      status: 'sent',
      type: uploadFileType
    }
    setEvidencia(novaEvidencia)
    setReputacao(prev => prev + 20)
    setCicloEstado('evidence_review')
  }

  // 8. Oficina - Confirmação de execução do serviço
  const handleOficinaConfirmarServico = () => {
    setOficinaConfirmacao(prev => ({ ...prev, serviceConfirmed: true }))
    setFundo(prev => prev + 34) // Aumenta a reserva piloto (+34 +34 = +68 total)
    setCicloEstado('validated')
  }

  // 9. Gestão - Conclusão do ciclo
  const handleGestaoConcluirCiclo = () => {
    setReputacao(prev => prev + 25)
    setCicloEstado('completed')
  }

  // 10. Novo ciclo (Reset parcial para novo fluxo mantendo score e fundo)
  const handleNovoCiclo = () => {
    setSolicitacao(null)
    setAvaliacoes({ marcos: 'pending', marcosComment: '', aline: 'pending', alineComment: '' })
    setEvidencia({ file: '', obs: '', status: 'pending', type: '' })
    setOficinaConfirmacao({ quoteConfirmed: false, serviceConfirmed: false, note: '' })
    setGestaoJustificativa('')
    setCicloEstado('draft')
    setActiveTab('credito')
  }

  // 11. Reset completo do MVP
  const handleResetDemo = () => {
    localStorage.clear()
    setMembro(null)
    setSolicitacao(null)
    setCicloEstado('draft')
    setReputacao(720)
    setFundo(4820)
    setAvaliacoes({ marcos: 'pending', marcosComment: '', aline: 'pending', alineComment: '' })
    setEvidencia({ file: '', obs: '', status: 'pending', type: '' })
    setOficinaConfirmacao({ quoteConfirmed: false, serviceConfirmed: false, note: '' })
    setGestaoJustificativa('')

    // inputs reset
    setInputNome('João Silva')
    setInputTelefone('(11) 98765-4321')
    setInputRegiao('Zona Leste, São Paulo')
    setInputTempo('4 anos')
    setInputFerramenta('Moto')
    setInputRaca('Negro')
    setInputAceite(true)

    setInputAmount(850)
    setInputFinalidade('Pneu + Revisão')
    setInputPrazo('30')
    setInputOficina('Oficina JN')
    setInputUrgencia('Alta')
    setInputDescricao('Preciso trocar o pneu traseiro careca e fazer revisão básica da suspensão para continuar rodando com segurança.')

    setUploadFileSelected('')
    setUploadFileType('')
    setUploadFileObs('')
    setAdminJustifyInput('')

    setProfileMode('membro')
    setActiveTab('inicio')
    alert('O ambiente piloto do MVP foi reiniciado!')
  }

  // Helper para tradução amigável do estado
  const getEstadoLabel = (state) => {
    const dict = {
      draft: { label: 'Rascunho', step: 'Preencher solicitação de crédito' },
      submitted: { label: 'Plano Sugerido', step: 'Confirmar os termos do plano comunitário' },
      community_validation: { label: 'Validação da Rede', step: 'Obter avais de Marcos e Aline' },
      partner_quote: { label: 'Aguardando Orçamento', step: 'Oficina JN confirmando valores' },
      under_review: { label: 'Em Análise', step: 'Aguardando validação da Gestão Abias' },
      approved: { label: 'Aprovado', step: 'Recurso liberado para a manutenção' },
      evidence_pending: { label: 'Comprovação Pendente', step: 'Enviar comprovantes na aba Evidências' },
      evidence_review: { label: 'Evidência em Validação', step: 'Oficina JN analisando serviço realizado' },
      validated: { label: 'Serviço Validado', step: 'Aguardando finalização pela Gestão Abias' },
      completed: { label: 'Ciclo Concluído', step: 'Parabéns! Sua reputação subiu' },
      needs_revision: { label: 'Revisão Solicitada', step: 'Editar dados conforme indicado pela gestão' },
      rejected: { label: 'Recusado', step: 'Ciclo encerrado sem aprovação' }
    }
    return dict[state] || { label: state, step: '' }
  }

  const currentStatus = getEstadoLabel(cicloEstado)

  return (
    <div className="desktop-showcase-container">
      {/* Left Showcase Side Bar (Only visible on Desktop) */}
      <div className="showcase-sidebar">
        <div className="sidebar-header">
          <span className="badge-hackathon">AMBIENTE PILOTO</span>
          <h1 className="sidebar-title">Abias</h1>
          <p className="sidebar-subtitle">MVP Funcional Local</p>
        </div>

        <div className="sidebar-context-card">
          <p><strong>Não é empréstimo livre. É crédito produtivo validado.</strong></p>
          <p>Este painel opera com persistência local em <code>localStorage</code>. Toda alteração de estado em modo Oficina ou Gestão reflete dinamicamente na tela do membro.</p>
        </div>

        <div className="sidebar-instructions">
          <h3>Testando o MVP</h3>
          <p>Simule a jornada de <strong>João Silva</strong> (R$ 850 para pneu + revisão) navegando pelas abas e alternando perfis no topo do smartphone ao lado.</p>

          <div className="sidebar-actions-grid">
            <button className="btn-sidebar btn-reset" onClick={handleResetDemo}>
              <i className="fa-solid fa-rotate-left"></i> Reiniciar MVP (Reset Local)
            </button>
          </div>
        </div>

        <div className="sidebar-rules">
          <h4>Parâmetros da Simulação:</h4>
          <ul>
            <li><i className="fa-solid fa-check"></i> Motoboy: João Silva (Leste)</li>
            <li><i className="fa-solid fa-check"></i> Oficina: Oficina JN</li>
            <li><i className="fa-solid fa-check"></i> Validadores: Marcos e Aline</li>
            <li><i className="fa-solid fa-quote-left"></i> “Quando a moto para, a renda para.”</li>
          </ul>
        </div>
      </div>

      {/* Right Side: Phone Mockup Frame */}
      <div className="phone-showcase-wrapper">
        <div className="smartphone-frame">
          <div className="phone-notch"></div>
          <div className="phone-button volume-up"></div>
          <div className="phone-button volume-down"></div>
          <div className="phone-button power-button"></div>

          <div className="phone-screen-container">
            {/* Top Status Bar */}
            <div className="mobile-status-bar">
              <span className="status-time">{clockTime}</span>
              <div className="status-icons">
                <i className="fa-solid fa-signal"></i>
                <span className="network-type">5G</span>
                <i className="fa-solid fa-wifi"></i>
                <i className="fa-solid fa-battery-three-quarters"></i>
              </div>
            </div>

            {/* Profile Swapper Buttons in App Header */}
            <div className="app-profile-switcher-header" style={{
              display: 'flex',
              background: '#141416',
              borderBottom: '1px solid var(--border-color)',
              padding: '6px 12px',
              justifyContent: 'space-around',
              gap: '6px'
            }}>
              <button 
                onClick={() => setProfileMode('membro')}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  background: profileMode === 'membro' ? 'var(--color-green)' : 'rgba(255,255,255,0.03)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}>
                <i className="fa-solid fa-user-ninja" style={{ marginRight: '4px' }}></i> Membro
              </button>
              <button 
                onClick={() => setProfileMode('oficina')}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  background: profileMode === 'oficina' ? 'var(--color-gold)' : 'rgba(255,255,255,0.03)',
                  border: 'none',
                  borderRadius: '4px',
                  color: profileMode === 'oficina' ? '#000000' : '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}>
                <i className="fa-solid fa-wrench" style={{ marginRight: '4px' }}></i> Oficina
              </button>
              <button 
                onClick={() => setProfileMode('gestao')}
                style={{
                  flex: 1,
                  padding: '6px 4px',
                  background: profileMode === 'gestao' ? 'var(--color-terra)' : 'rgba(255,255,255,0.03)',
                  border: 'none',
                  borderRadius: '4px',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}>
                <i className="fa-solid fa-users-cog" style={{ marginRight: '4px' }}></i> Gestão
              </button>
            </div>

            {/* Main Screen Content */}
            <div className="screen-scroll-area" style={{ paddingBottom: '80px' }}>
              
              {/* PROFILE MODE: MEMBRO */}
              {profileMode === 'membro' && (
                <>
                  {/* If not registered yet, force registration screen */}
                  {!membro ? (
                    <div className="screen active" style={{ padding: '20px' }}>
                      <div className="onboarding-logo" style={{ marginBottom: '20px' }}>
                        <span className="abias-logo">Abias</span>
                      </div>
                      <h2 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>Cadastro de Membro</h2>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
                        Cadastre-se na comunidade para validar sua rota e acessar fomento produtivo.
                      </p>
                      
                      <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div className="mobile-form-group">
                          <label className="form-label">Nome Completo</label>
                          <input 
                            type="text" 
                            className="form-text-input" 
                            value={inputNome} 
                            onChange={(e) => setInputNome(e.target.value)} 
                            required 
                          />
                        </div>

                        <div className="mobile-form-group">
                          <label className="form-label">Telefone / WhatsApp</label>
                          <input 
                            type="text" 
                            className="form-text-input" 
                            value={inputTelefone} 
                            onChange={(e) => setInputTelefone(e.target.value)} 
                            required 
                          />
                        </div>

                        <div className="mobile-form-group">
                          <label className="form-label">Região / Cidade</label>
                          <input 
                            type="text" 
                            className="form-text-input" 
                            value={inputRegiao} 
                            onChange={(e) => setInputRegiao(e.target.value)} 
                            required 
                          />
                        </div>

                        <div className="mobile-form-group">
                          <label className="form-label">Tempo como Motoboy</label>
                          <input 
                            type="text" 
                            className="form-text-input" 
                            value={inputTempo} 
                            onChange={(e) => setInputTempo(e.target.value)} 
                            required 
                          />
                        </div>

                        <div className="mobile-form-group">
                          <label className="form-label">Ferramenta Principal de Trabalho</label>
                          <select 
                            className="form-select" 
                            value={inputFerramenta} 
                            onChange={(e) => setInputFerramenta(e.target.value)}>
                            <option value="Moto">Motocicleta (Combustão / Elétrica)</option>
                            <option value="Bicicleta">Bicicleta / Bike Elétrica</option>
                            <option value="Outro">Outro veículo</option>
                          </select>
                        </div>

                        <div className="mobile-form-group">
                          <label className="form-label">Autodeclaração Racial (Opcional)</label>
                          <select 
                            className="form-select" 
                            value={inputRaca} 
                            onChange={(e) => setInputRaca(e.target.value)}>
                            <option value="Negro">Negro (Preto ou Pardo)</option>
                            <option value="Indigena">Indígena</option>
                            <option value="Outro">Outro</option>
                          </select>
                        </div>

                        <div className="mobile-form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
                          <input 
                            type="checkbox" 
                            id="aceite-dados" 
                            checked={inputAceite} 
                            onChange={(e) => setInputAceite(e.target.checked)} 
                          />
                          <label htmlFor="aceite-dados" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Aceito os termos da comunidade e concordo com o compartilhamento de rota Abias.
                          </label>
                        </div>

                        <button type="submit" className="btn-app btn-app-primary" style={{ marginTop: '10px' }}>
                          Concluir Cadastro
                        </button>
                      </form>
                    </div>
                  ) : (
                    <>
                      {/* TAB 1: INÍCIO */}
                      {activeTab === 'inicio' && (
                        <div className="screen active" id="screen-home">
                          <div className="app-header">
                            <div className="member-profile">
                              <div className="member-avatar"><i className="fa-solid fa-motorcycle"></i></div>
                              <div>
                                <span className="greeting-sub">Corre Ativo</span>
                                <h3 className="member-name">Salve, {membro.nome}</h3>
                              </div>
                            </div>
                            <span className="badge-status-membro"><i className="fa-solid fa-shield-halved"></i> Membro Validado</span>
                          </div>

                          {/* Operational Status Card */}
                          <div className="home-main-card">
                            <div className="home-card-header">
                              <span className="card-tag">STATUS DO CICLO</span>
                              {cicloEstado === 'evidence_pending' || cicloEstado === 'evidence_review' || cicloEstado === 'validated' ? (
                                <span className="status-indicator-green" style={{ color: 'var(--color-gold)' }}>
                                  <i className="fa-solid fa-circle"></i> Fomento em Manutenção Ativo
                                </span>
                              ) : (
                                <span className="status-indicator-green">
                                  <i className="fa-solid fa-circle"></i> Sua rota está ativa
                                </span>
                              )}
                            </div>
                            <div className="home-card-body">
                              <div className="reputacao-summary">
                                <span className="lbl">Reputação de Rota</span>
                                <div className="score-display">
                                  <span className="score-num font-mono">{reputacao}</span>
                                  <span className="score-max font-mono">/1000</span>
                                </div>
                                <span className="score-level-badge">
                                  {reputacao <= 720 ? 'Confiança Rota A2' : reputacao <= 745 ? 'Confiança Rota A2+' : 'Confiança Rota A3 (Alta Confiança)'}
                                </span>
                              </div>
                            </div>
                            <div className="home-card-footer">
                              <div className="fundo-summary">
                                <i className="fa-solid fa-vault"></i>
                                <span>Fundo Abias: <strong>R$ {fundo}</strong> em reserva piloto</span>
                              </div>
                            </div>
                          </div>

                          {/* Quick Stats Grid */}
                          <div className="home-stats-section" style={{ marginTop: '0', marginBottom: '20px' }}>
                            <h4 className="section-title-mobile">Métricas Operacionais do Piloto</h4>
                            <div className="stats-mobile-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
                              <div className="stat-mobile-card">
                                <span className="val font-mono">{cicloEstado !== 'draft' ? '1' : '0'}</span>
                                <span className="lbl">Solicitação ativa</span>
                              </div>
                              <div className="stat-mobile-card">
                                <span className="val font-mono">
                                  {cicloEstado === 'community_validation' ? (
                                    (avaliacoes.marcos === 'approved' ? 0 : 1) + (avaliacoes.aline === 'approved' ? 0 : 1)
                                  ) : cicloEstado === 'draft' || cicloEstado === 'submitted' ? '2' : '0'}
                                </span>
                                <span className="lbl">Avais comunitários pendentes</span>
                              </div>
                              <div className="stat-mobile-card">
                                <span className="val font-mono">{cicloEstado !== 'draft' ? '1' : '0'}</span>
                                <span className="lbl">Oficina vinculada</span>
                              </div>
                              <div className="stat-mobile-card">
                                <span className="val font-mono">R$ {currentAmount}</span>
                                <span className="lbl">Valor solicitado</span>
                              </div>
                              <div className="stat-mobile-card">
                                <span className="val font-mono">{cicloEstado !== 'draft' ? '4' : '0'}</span>
                                <span className="lbl">Parcelas sugeridas</span>
                              </div>
                              <div className="stat-mobile-card">
                                <span className="val font-mono">
                                  {cicloEstado === 'completed' || cicloEstado === 'validated' ? '2/2' : '0/2'}
                                </span>
                                <span className="lbl">Evidências validadas</span>
                              </div>
                            </div>
                          </div>

                          {/* Timeline display */}
                          {cicloEstado !== 'draft' && (
                            <div className="info-notice-card plain-border" style={{ margin: '0 20px 20px' }}>
                              <h4 style={{ fontSize: '0.8rem', color: 'var(--color-gold)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Acompanhamento do Ciclo</h4>
                              <p style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 'bold' }}>Passo Atual: {currentStatus.label}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>Próximo passo: {currentStatus.step}</p>
                            </div>
                          )}

                          <div className="info-notice-card" style={{ margin: '0 20px' }}>
                            <p><i className="fa-solid fa-quote-left"></i> A comunidade ajuda a provar o que o banco não enxerga.</p>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: CRÉDITO */}
                      {activeTab === 'credito' && (
                        <div className="screen active" id="screen-solicitar">
                          
                          {/* DRAFT: Solicitação Form */}
                          {cicloEstado === 'draft' && (
                            <>
                              <div className="app-header-simple">
                                <h3>Solicitar Crédito de Rota</h3>
                              </div>
                              
                              <form className="mobile-form" onSubmit={handleSolicitacaoSubmit}>
                                <div className="form-banner-info">
                                  <p><strong>Não é empréstimo livre.</strong> O recurso é exclusivo para despesas da sua ferramenta de trabalho.</p>
                                </div>

                                <div className="mobile-form-group">
                                  <label className="form-label">Quanto você precisa?</label>
                                  <div className="money-input-wrapper">
                                    <span className="currency-symbol">R$</span>
                                    <input 
                                      type="number" 
                                      value={inputAmount} 
                                      onChange={(e) => setInputAmount(e.target.value)} 
                                      min="300" 
                                      max="3000" 
                                      required 
                                    />
                                  </div>
                                  <span className="form-helper">Valor alvo sugerido para pneu + revisão: R$ 850</span>
                                </div>

                                <div className="mobile-form-group">
                                  <label className="form-label">Qual a finalidade?</label>
                                  <div className="chips-selector">
                                    {[
                                      'Pneu + Revisão',
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
                                          name="finalidade-mvp" 
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
                                    value={inputPrazo} 
                                    onChange={(e) => setInputPrazo(e.target.value)}>
                                    <option value="7">7 dias (Ciclo rápido)</option>
                                    <option value="15">15 dias (Ciclo quinzenal)</option>
                                    <option value="30">30 dias (Ciclo mensal)</option>
                                    <option value="45">45 dias (Ciclo estendido)</option>
                                  </select>
                                </div>

                                <div className="mobile-form-group">
                                  <label className="form-label">Qual oficina credenciada?</label>
                                  <input 
                                    type="text" 
                                    className="form-text-input" 
                                    value={inputOficina} 
                                    onChange={(e) => setInputOficina(e.target.value)} 
                                    required 
                                  />
                                </div>

                                <div className="mobile-form-group">
                                  <label className="form-label">Nível de Urgência</label>
                                  <select 
                                    className="form-select" 
                                    value={inputUrgencia} 
                                    onChange={(e) => setInputUrgencia(e.target.value)}>
                                    <option value="Baixa">Baixa (Manutenção preventiva)</option>
                                    <option value="Media">Média (Avisos de desgaste)</option>
                                    <option value="Alta">Alta (Ferramenta parada ou risco)</option>
                                  </select>
                                </div>

                                <div className="mobile-form-group">
                                  <label className="form-label">Descrição curta da necessidade</label>
                                  <textarea 
                                    className="form-textarea" 
                                    value={inputDescricao} 
                                    onChange={(e) => setInputDescricao(e.target.value)} 
                                    placeholder="Descreva por que o serviço é necessário agora."
                                    required
                                  />
                                </div>

                                <button type="submit" className="btn-app btn-app-primary">
                                  Gerar plano de crédito
                                </button>
                              </form>
                            </>
                          )}

                          {/* SUBMITTED: Plano Sugerido (Slip) */}
                          {cicloEstado === 'submitted' && (
                            <>
                              <div className="app-header-simple">
                                <h3>Plano de Crédito Sugerido</h3>
                              </div>
                              <div className="plano-container">
                                <div className="plano-notice-badge">
                                  <span><i className="fa-solid fa-triangle-exclamation"></i> Plano sugerido. Sujeito à validação da rede Abias.</span>
                                </div>

                                {/* Slip Card */}
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
                                      <span className="slip-value">Nota + Foto da Instalação</span>
                                    </div>
                                    <div className="slip-row">
                                      <span className="slip-label">GRAU DE URGÊNCIA</span>
                                      <span className="slip-value">{currentUrgencia}</span>
                                    </div>
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
                                  <button className="btn-app btn-app-primary" onClick={handleConfirmarPlano}>
                                    Confirmar solicitação
                                  </button>
                                  <button className="btn-app btn-app-secondary" onClick={() => setCicloEstado('draft')}>
                                    Editar plano
                                  </button>
                                </div>
                              </div>
                            </>
                          )}

                          {/* COMMUNITY VALIDATION: Peer Endorsements Screen */}
                          {cicloEstado === 'community_validation' && (
                            <>
                              <div className="app-header-simple">
                                <h3>Validação de Rede</h3>
                              </div>
                              <div className="aval-container">
                                <div className="aval-status-banner glass">
                                  <span className="section-tag tag-yellow">AVAL COMUNITÁRIO</span>
                                  <h2>Quem valida sua rota?</h2>
                                  <p>Para ativar este fomento produtivo, Aline e Marcos da rota Leste precisam registrar o aval comunitário atestando que você está ativo.</p>
                                </div>

                                <div className="aval-peers-list">
                                  {/* Marcos card */}
                                  <div className="peer-item-card glass" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div className="peer-avatar"><i className="fa-solid fa-user"></i></div>
                                        <div className="peer-info" style={{ marginLeft: 0 }}>
                                          <h5>Marcos Santos</h5>
                                          <span className="peer-sub">Membro Indicador Leste</span>
                                        </div>
                                      </div>
                                      <span className={`status-badge ${avaliacoes.marcos === 'approved' ? 'badge-success' : 'badge-pending'}`}>
                                        {avaliacoes.marcos === 'approved' ? 'Validou' : 'Pendente'}
                                      </span>
                                    </div>
                                    {avaliacoes.marcos === 'pending' ? (
                                      <button 
                                        className="btn-app btn-app-secondary" 
                                        onClick={handleSimularMarcos}>
                                        <i className="fa-solid fa-signature"></i> Simular Aval de Marcos
                                      </button>
                                    ) : (
                                      <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                        "{avaliacoes.marcosComment}"
                                      </p>
                                    )}
                                  </div>

                                  {/* Aline card */}
                                  <div className="peer-item-card glass" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div className="peer-avatar"><i className="fa-solid fa-user"></i></div>
                                        <div className="peer-info" style={{ marginLeft: 0 }}>
                                          <h5>Aline Souza</h5>
                                          <span className="peer-sub">Parceira de Rota Leste</span>
                                        </div>
                                      </div>
                                      <span className={`status-badge ${avaliacoes.aline === 'approved' ? 'badge-success' : 'badge-pending'}`}>
                                        {avaliacoes.aline === 'approved' ? 'Validou' : 'Pendente'}
                                      </span>
                                    </div>
                                    {avaliacoes.aline === 'pending' ? (
                                      <button 
                                        className="btn-app btn-app-secondary" 
                                        onClick={handleSimularAline}>
                                        <i className="fa-solid fa-signature"></i> Simular Aval de Aline
                                      </button>
                                    ) : (
                                      <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                        "{avaliacoes.alineComment}"
                                      </p>
                                    )}
                                  </div>
                                </div>

                                <div className="info-notice-card plain-border">
                                  <p><strong>Roteamento de Confiança:</strong> O aval comunitário valida seu corre diário e reduz a dependência de scores genéricos de CPF.</p>
                                </div>
                              </div>
                            </>
                          )}

                          {/* OTHER CYCLE STATES: Status display */}
                          {['partner_quote', 'under_review', 'approved', 'evidence_pending', 'evidence_review', 'validated', 'completed', 'needs_revision', 'rejected'].includes(cicloEstado) && (
                            <>
                              <div className="app-header-simple">
                                <h3>Status do Fomento</h3>
                              </div>
                              <div className="plano-container">
                                
                                <div className="milestone-card glass">
                                  <span className="lbl-milestone">MÁQUINA DE ESTADO</span>
                                  <h4 style={{ margin: 0 }}>Ciclo: {getEstadoLabel(cicloEstado).label}</h4>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                    {getEstadoLabel(cicloEstado).step}
                                  </p>
                                </div>

                                <div className="premium-credit-card compact-slip">
                                  <div className="card-brand-row">
                                    <span className="card-brand">Abias</span>
                                    <span className="card-contactless"><i className="fa-solid fa-receipt"></i> DEFINITIVE SLIP</span>
                                  </div>
                                  <div className="slip-details">
                                    <div className="slip-row">
                                      <span className="slip-label">MOTOCICLISTA</span>
                                      <span className="slip-value">{membro.nome}</span>
                                    </div>
                                    <div className="slip-row">
                                      <span className="slip-label">FINALIDADE PRODUTIVA</span>
                                      <span className="slip-value">{currentFinalidade}</span>
                                    </div>
                                    <div className="slip-row">
                                      <span className="slip-label">OFICINA VINCULADA</span>
                                      <span className="slip-value">{currentOficina}</span>
                                    </div>
                                    <div className="slip-row">
                                      <span className="slip-label">PARCELAS ESTABELECIDAS</span>
                                      <span className="slip-value">4x de R$ {new Intl.NumberFormat('pt-BR').format(parcelasValor)}</span>
                                    </div>
                                  </div>
                                  <div className="slip-footer">
                                    <div className="slip-badge">FOMENTO APROVADO</div>
                                    <span className="slip-amount">R$ {currentAmount.toFixed(2)}</span>
                                  </div>
                                </div>

                                {cicloEstado === 'completed' && (
                                  <button className="btn-app btn-app-primary" onClick={handleNovoCiclo}>
                                    Iniciar Novo Ciclo Comunitário
                                  </button>
                                )}

                                {cicloEstado === 'needs_revision' && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div className="info-notice-card" style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', margin: 0 }}>
                                      <p style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Motivo da Revisão:</p>
                                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>"{gestaoJustificativa}"</p>
                                    </div>
                                    <button className="btn-app btn-app-primary" onClick={() => setCicloEstado('draft')}>
                                      Editar Solicitação
                                    </button>
                                  </div>
                                )}

                                {cicloEstado === 'rejected' && (
                                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <div className="info-notice-card" style={{ background: 'rgba(239, 68, 68, 0.05)', borderColor: 'rgba(239, 68, 68, 0.2)', margin: 0 }}>
                                      <p style={{ color: 'var(--danger)', fontWeight: 'bold' }}>Motivo da Recusa:</p>
                                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>"{gestaoJustificativa}"</p>
                                    </div>
                                    <button className="btn-app btn-app-primary" onClick={handleNovoCiclo}>
                                      Solicitar Nova Rota
                                    </button>
                                  </div>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* TAB 3: EVIDÊNCIAS */}
                      {activeTab === 'evidencia' && (
                        <div className="screen active" id="screen-upload">
                          <div className="app-header-simple">
                            <h3>Comprovar Uso de Crédito</h3>
                          </div>

                          <div className="upload-container">
                            <div className="form-banner-info border-terra">
                              <p><strong>Quando a moto para, a renda para.</strong> Mantenha seu ciclo saudável provando que o recurso foi aplicado na finalidade acordada.</p>
                            </div>

                            {['approved', 'evidence_pending'].includes(cicloEstado) ? (
                              <>
                                <div className="milestone-card glass">
                                  <span className="lbl-milestone">CICLO EM EXECUÇÃO</span>
                                  <h4>Manutenção da Moto ({currentFinalidade})</h4>
                                  <div className="milestone-status-row">
                                    <span className="lbl">Estado da Evidência:</span>
                                    <span className="val-status text-warning">Pendente de Upload</span>
                                  </div>
                                </div>

                                <div className="upload-methods">
                                  <div className="upload-box-action" onClick={handleSimularFoto} style={{ border: uploadFileType === 'foto' ? '1px solid var(--color-gold)' : '' }}>
                                    <div className="box-icon"><i className="fa-solid fa-camera"></i></div>
                                    <span>Tirar foto do pneu instalado</span>
                                  </div>
                                  <div className="upload-box-action" onClick={handleSimularRecibo} style={{ border: uploadFileType === 'recibo' ? '1px solid var(--color-gold)' : '' }}>
                                    <div className="box-icon"><i className="fa-solid fa-file-invoice-dollar"></i></div>
                                    <span>Enviar recibo da oficina</span>
                                  </div>
                                </div>

                                {uploadFileSelected && (
                                  <div className="simulated-file-badge" id="file-upload-display">
                                    <div>
                                      <i className="fa-solid fa-paperclip" style={{ marginRight: '6px' }}></i> 
                                      <span>{uploadFileSelected}</span>
                                    </div>
                                    <button className="btn-remove-file" onClick={() => { setUploadFileSelected(''); setUploadFileType(''); }}>&times;</button>
                                  </div>
                                )}

                                <div className="mobile-form-group" style={{ marginTop: '10px' }}>
                                  <label className="form-label">O que foi feito? (Observação)</label>
                                  <textarea 
                                    className="form-textarea" 
                                    value={uploadFileObs} 
                                    onChange={(e) => setUploadFileObs(e.target.value)} 
                                    placeholder="Ex: Trocado pneu traseiro careca e alinhamento concluído na Oficina JN."
                                  />
                                </div>

                                <button className="btn-app btn-app-primary" onClick={handleEnviarEvidencia}>
                                  Enviar evidência
                                </button>
                              </>
                            ) : ['evidence_review', 'validated', 'completed'].includes(cicloEstado) ? (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div className="milestone-card glass">
                                  <span className="lbl-milestone">EVIDÊNCIA SUBMETIDA</span>
                                  <h4>Status: {getEstadoLabel(cicloEstado).label}</h4>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                    Arquivo enviado: <strong>{evidencia.file}</strong>
                                  </p>
                                  {evidencia.obs && (
                                    <p style={{ fontSize: '0.75rem', fontStyle: 'italic', marginTop: '6px', color: 'var(--text-muted)' }}>
                                      Observações: "{evidencia.obs}"
                                    </p>
                                  )}
                                </div>
                                <div className="info-notice-card plain-border" style={{ margin: 0 }}>
                                  <p><i className="fa-solid fa-circle-info"></i> O próximo passo é a confirmação do serviço pela Oficina JN.</p>
                                </div>
                              </div>
                            ) : (
                              <div className="info-notice-card" style={{ margin: 0 }}>
                                <p>Não há nenhum fomento ativo que precise de comprovação de serviço no momento.</p>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* TAB 4: REPUTAÇÃO */}
                      {activeTab === 'reputacao' && (
                        <div className="screen active" id="screen-reputacao">
                          <div className="app-header-simple">
                            <h3>Reputação de Rota</h3>
                          </div>

                          <div className="reputacao-container">
                            <div className="reputacao-score-box glass">
                              <span className="lbl-tag font-mono">SUA NOTA EXPLICÁVEL</span>
                              <div className="reputacao-number-row">
                                <span className="val font-mono">{reputacao}</span>
                                <span className="max font-mono">/1000</span>
                              </div>
                              <h4 className="reputacao-level">
                                {reputacao <= 720 ? 'Rota Confiável' : reputacao <= 745 ? 'Rota Consolidada' : 'Alta Confiança de Rota'}
                              </h4>
                              <p className="reputacao-desc">
                                Sua reputação cresce com o cumprimento de ciclos em dia, validação rápida de evidências em até 24h e suporte comunitário a outros entregadores da rede.
                              </p>
                            </div>

                            <div className="reputacao-factors-list">
                              <h4>Fatores explicativos</h4>
                              
                              <div className="factor-progress-item">
                                <div className="factor-lbl">
                                  <span>Ciclos produtivos concluídos</span>
                                  <span className="percent font-mono">{reputacao >= 765 ? '100%' : '85%'}</span>
                                </div>
                                <div className="progress-track">
                                  <div className="progress-bar" style={{ width: reputacao >= 765 ? '100%' : '85%', backgroundColor: 'var(--color-green)' }}></div>
                                </div>
                              </div>

                              <div className="factor-progress-item">
                                <div className="factor-lbl">
                                  <span>Evidências validadas</span>
                                  <span className="percent font-mono">{cicloEstado === 'completed' ? '100%' : '75%'}</span>
                                </div>
                                <div className="progress-track">
                                  <div className="progress-bar" style={{ width: cicloEstado === 'completed' ? '100%' : '75%', backgroundColor: 'var(--color-green)' }}></div>
                                </div>
                              </div>

                              <div className="factor-progress-item">
                                <div className="factor-lbl">
                                  <span>Aval de rede emitido</span>
                                  <span className="percent font-mono">90%</span>
                                </div>
                                <div className="progress-track">
                                  <div className="progress-bar" style={{ width: '90%', backgroundColor: 'var(--color-gold)' }}></div>
                                </div>
                              </div>

                              <div className="factor-progress-item">
                                <div className="factor-lbl">
                                  <span>Uso de oficina parceira local</span>
                                  <span className="percent font-mono">100%</span>
                                </div>
                                <div className="progress-track">
                                  <div className="progress-bar" style={{ width: '100%', backgroundColor: 'var(--color-gold)' }}></div>
                                </div>
                              </div>
                            </div>

                            <div className="how-to-improve-card glass">
                              <h4>Como subir seu score?</h4>
                              <ul className="improve-checklist">
                                <li><i className="fa-solid fa-plus-square"></i> Confirmar avais comunitários (+10 pts)</li>
                                <li><i className="fa-solid fa-plus-square"></i> Confirmar orçamento na oficina (+15 pts)</li>
                                <li><i className="fa-solid fa-plus-square"></i> Enviar evidência do serviço realizado (+20 pts)</li>
                                <li><i className="fa-solid fa-plus-square"></i> Finalizar ciclo com sucesso (+25 pts)</li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 5: FUNDO & ECONOMIA LOCAL */}
                      {activeTab === 'fundo' && (
                        <div className="screen active" id="screen-fundo">
                          <div className="app-header-simple">
                            <h3>Fundo Abias</h3>
                          </div>

                          <div className="fundo-mobile-container">
                            <div className="fundo-headline-card glass">
                              <span className="section-tag tag-yellow">FUNDO ABIAS — AMBIENTE PILOTO</span>
                              <h2>Crédito individual. Proteção coletiva.</h2>
                              <p>A taxa de sustentabilidade de 8% compartilhada na manutenção da moto retorna integralmente para blindar a rede de motoboys contra imprevistos.</p>
                            </div>

                            <div className="fundo-reserve-card glass">
                              <span className="lbl">Saldo da Reserva Comunitária</span>
                              <div className="amount-val font-mono">R$ {fundo.toFixed(2)}</div>
                              <div className="fundo-bar-wrapper">
                                <div className="fundo-bar-fill-mobile" style={{ width: `${Math.min(100, (fundo / 8000) * 100)}%` }}></div>
                              </div>
                              <span className="fundo-subtext-meta">Meta de cobertura piloto: R$ 8.000,00</span>
                            </div>

                            {/* Circular Economy loop visual */}
                            <div className="rede-flow-card glass" style={{ marginTop: '0' }}>
                              <h5>Circulação de Crédito Circular</h5>
                              
                              <div className="economy-flow-vertical" style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.75rem', marginTop: '10px' }}>
                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '8px', 
                                  padding: '6px 10px', 
                                  borderRadius: '4px',
                                  background: (cicloEstado === 'submitted' || cicloEstado === 'community_validation') ? 'rgba(201, 154, 61, 0.15)' : 'rgba(255,255,255,0.02)',
                                  border: (cicloEstado === 'submitted' || cicloEstado === 'community_validation') ? '1px solid var(--color-gold)' : '1px solid transparent'
                                }}>
                                  <span style={{ fontWeight: 700, color: 'var(--color-gold)' }}>1. Crédito na Rede</span>
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Fomento produtivo pequeno liberado.</span>
                                </div>

                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '8px', 
                                  padding: '6px 10px', 
                                  borderRadius: '4px',
                                  background: (cicloEstado === 'partner_quote' || cicloEstado === 'evidence_review' || cicloEstado === 'validated') ? 'rgba(22, 61, 47, 0.4)' : 'rgba(255,255,255,0.02)',
                                  border: (cicloEstado === 'partner_quote' || cicloEstado === 'evidence_review' || cicloEstado === 'validated') ? '1px solid var(--color-green)' : '1px solid transparent'
                                }}>
                                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>2. Oficina Recebe</span>
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Recurso entra direto nas oficinas do bairro.</span>
                                </div>

                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '8px', 
                                  padding: '6px 10px', 
                                  borderRadius: '4px',
                                  background: (cicloEstado === 'evidence_pending') ? 'rgba(154, 79, 47, 0.15)' : 'rgba(255,255,255,0.02)',
                                  border: (cicloEstado === 'evidence_pending') ? '1px solid var(--color-terra)' : '1px solid transparent'
                                }}>
                                  <span style={{ fontWeight: 700, color: 'var(--color-terra)' }}>3. Moto na Rota</span>
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>João volta às ruas reduzindo dias parados.</span>
                                </div>

                                <div style={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: '8px', 
                                  padding: '6px 10px', 
                                  borderRadius: '4px',
                                  background: (cicloEstado === 'completed') ? 'rgba(201, 154, 61, 0.15)' : 'rgba(255,255,255,0.02)',
                                  border: (cicloEstado === 'completed') ? '1px solid var(--color-gold)' : '1px solid transparent'
                                }}>
                                  <span style={{ fontWeight: 700, color: 'var(--color-gold)' }}>4. Fundo Cresce</span>
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Taxa quitada retroalimenta o fundo de blindagem.</span>
                                </div>
                              </div>

                              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '10px', fontStyle: 'italic' }}>
                                "O crédito entra na rede e volta como proteção coletiva."
                              </p>
                            </div>

                            <button className="btn-app btn-app-secondary" onClick={() => alert('Parâmetros do Fundo Piloto: Cobertura parcial para guincho, pneus sobressalentes e manutenção emergencial na rede de oficinas certificadas.')}>
                              Visualizar Parâmetros do Fundo
                            </button>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </>
              )}

              {/* PROFILE MODE: OFICINA */}
              {profileMode === 'oficina' && (
                <div className="screen active" id="screen-oficina-mode" style={{ padding: '20px' }}>
                  <div className="app-header-simple" style={{ margin: '-20px -20px 20px', background: 'var(--color-gold)', color: '#000000' }}>
                    <h3 style={{ color: '#000000' }}><i className="fa-solid fa-wrench"></i> Painel Oficina Credenciada</h3>
                  </div>

                  {!solicitacao || ['draft', 'submitted', 'community_validation'].includes(cicloEstado) ? (
                    <div className="info-notice-card" style={{ margin: 0 }}>
                      <p>Nenhuma solicitação de orçamento vinculada à Oficina JN no momento.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="milestone-card glass">
                        <span className="lbl-milestone">OFICINA JN</span>
                        <h4 style={{ marginBottom: '8px' }}>Solicitação de {membro?.nome || 'João Silva'}</h4>
                        <div className="q-details" style={{ marginBottom: '10px' }}>
                          <span>Finalidade: <strong>{currentFinalidade}</strong></span>
                          <span>Valor Solicitado: <strong>R$ {currentAmount.toFixed(2)}</strong></span>
                          <span>Urgência declarada: <strong>{currentUrgencia}</strong></span>
                          <span>Descrição do motoboy: "{currentDescricao}"</span>
                        </div>
                        
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', borderTop: '1px dashed var(--border-color)', paddingTop: '10px' }}>
                          Status do Ciclo: <strong>{getEstadoLabel(cicloEstado).label}</strong>
                        </p>
                      </div>

                      {/* State Action: Confirm quote */}
                      {cicloEstado === 'partner_quote' && (
                        <div className="glass" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <h5>Ação 1: Validar Orçamento Técnico</h5>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Confirme que o valor solicitado de R$ {currentAmount} está de acordo com as necessidades técnicos do veículo.
                          </p>
                          <button className="btn-app btn-app-primary" style={{ background: 'var(--color-gold)', color: '#000000' }} onClick={handleOficinaConfirmarOrçamento}>
                            Confirmar Orçamento
                          </button>
                        </div>
                      )}

                      {/* State Action: Confirm service completed */}
                      {cicloEstado === 'evidence_review' && (
                        <div className="glass" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <h5>Ação 2: Confirmar Execução do Serviço</h5>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            O motoboy enviou o comprovante/recibo técnico. Confirme que o pneu foi trocado ou a revisão concluída na sua oficina.
                          </p>
                          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px', fontSize: '0.75rem' }}>
                            <p><strong>Comprovante anexado:</strong> {evidencia.file}</p>
                            <p><strong>Obs João:</strong> "{evidencia.obs || 'Nenhuma obs.'}"</p>
                          </div>
                          <button className="btn-app btn-app-primary" style={{ background: 'var(--color-gold)', color: '#000000' }} onClick={handleOficinaConfirmarServico}>
                            Confirmar Serviço Realizado
                          </button>
                        </div>
                      )}

                      {['under_review', 'approved', 'evidence_pending', 'validated', 'completed'].includes(cicloEstado) && (
                        <div className="info-notice-card plain-border" style={{ margin: 0 }}>
                          <p><i className="fa-solid fa-circle-check" style={{ color: 'var(--success)' }}></i> Ação técnica concluída para esta etapa do fomento.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* PROFILE MODE: GESTÃO */}
              {profileMode === 'gestao' && (
                <div className="screen active" id="screen-admin">
                  <div className="app-header-admin">
                    <h3>Mesa de Gestão — Abias</h3>
                    <span className="badge-admin">Mesa Operacional</span>
                  </div>

                  <div className="admin-container">
                    {/* Metrics grid */}
                    <div className="admin-metrics-grid">
                      <div className="metric-admin-card glass">
                        <span className="lbl">Ciclos Ativos</span>
                        <span className="val font-mono">{cicloEstado !== 'draft' && cicloEstado !== 'completed' ? '1' : '0'}</span>
                      </div>
                      <div className="metric-admin-card glass">
                        <span className="lbl">Volume Solicitado</span>
                        <span className="val font-mono">R$ {cicloEstado !== 'draft' ? currentAmount : '0'}</span>
                      </div>
                      <div className="metric-admin-card glass">
                        <span className="lbl">Evidências Pendentes</span>
                        <span className="val font-mono">{cicloEstado === 'evidence_review' ? '1' : '0'}</span>
                      </div>
                      <div className="metric-admin-card glass">
                        <span className="lbl">Reserva Coletiva</span>
                        <span className="val font-mono">R$ {fundo}</span>
                      </div>
                    </div>

                    {/* Pending validation queue */}
                    <div className="admin-queue-card glass">
                      <h4>Fila de Ciclos Operacionais</h4>

                      {!solicitacao || ['draft', 'submitted', 'community_validation', 'partner_quote'].includes(cicloEstado) ? (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Nenhuma solicitação na fila de análise da Gestão.</p>
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
                            <span>Urgência operacional: <strong>{currentUrgencia}</strong></span>
                            {currentDescricao && <span>Descrição: "{currentDescricao}"</span>}
                          </div>

                          <div className="q-checklists">
                            <span className="chk-status checked"><i className="fa-solid fa-check"></i> Rota Validada Comunidade</span>
                            <span className="chk-status checked"><i className="fa-solid fa-check"></i> Aval de Marcos Santos</span>
                            <span className="chk-status checked"><i className="fa-solid fa-check"></i> Aval de Aline Souza</span>
                            <span className={`chk-status ${oficinaConfirmacao.quoteConfirmed ? 'checked' : 'warning'}`}>
                              <i className={`fa-solid ${oficinaConfirmacao.quoteConfirmed ? 'fa-check' : 'fa-spinner fa-spin'}`}></i> Orçamento Oficina JN
                            </span>
                            {['evidence_review', 'validated', 'completed'].includes(cicloEstado) && (
                              <span className={`chk-status ${oficinaConfirmacao.serviceConfirmed ? 'checked' : 'warning'}`}>
                                <i className={`fa-solid ${oficinaConfirmacao.serviceConfirmed ? 'fa-check' : 'fa-spinner fa-spin'}`}></i> Validação de Serviço Realizado
                              </span>
                            )}
                          </div>

                          {/* ACTION: under_review approval */}
                          {cicloEstado === 'under_review' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '10px' }}>
                              <label className="form-label" style={{ fontSize: '0.75rem' }}>Justificativa (para Revisão ou Recusa)</label>
                              <textarea 
                                className="form-textarea" 
                                style={{ height: '50px' }}
                                value={adminJustifyInput} 
                                onChange={(e) => setAdminJustifyInput(e.target.value)} 
                                placeholder="Insira o texto de justificativa aqui..."
                              />
                              <div className="admin-actions-row">
                                <button className="btn-admin btn-admin-approve" onClick={handleGestaoAprovar}>
                                  Aprovar Fomento
                                </button>
                                <button className="btn-admin btn-admin-reject" onClick={handleGestaoPedirRevisao} style={{ flex: 'unset' }}>
                                  Pedir Revisão
                                </button>
                                <button className="btn-admin btn-admin-reject" onClick={handleGestaoRecusar} style={{ flex: 'unset', color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
                                  Recusar
                                </button>
                              </div>
                            </div>
                          )}

                          {/* ACTION: final validation completion */}
                          {cicloEstado === 'validated' && (
                            <div style={{ marginTop: '10px' }}>
                              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px', fontSize: '0.75rem', marginBottom: '10px' }}>
                                <p><strong>Serviço realizado confirmado pela oficina.</strong></p>
                                <p>Pneu instalado e nota fiscal validada em conformidade.</p>
                              </div>
                              <button className="btn-app btn-app-primary" style={{ background: 'var(--color-green)' }} onClick={handleGestaoConcluirCiclo}>
                                Fechar e Concluir Ciclo de Rota
                              </button>
                            </div>
                          )}

                          {['approved', 'evidence_pending', 'evidence_review', 'completed', 'needs_revision', 'rejected'].includes(cicloEstado) && (
                            <div className="info-notice-card plain-border" style={{ margin: '10px 0 0' }}>
                              <p><i className="fa-solid fa-circle-check" style={{ color: 'var(--success)' }}></i> Decisão operacional registrada: <strong>{getEstadoLabel(cicloEstado).label}</strong></p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="admin-alerts-card glass">
                      <h4>Risco e Inconsistências (IA Abias)</h4>
                      <div className="alert-log-item warning">
                        <i className="fa-solid fa-circle-info"></i>
                        <span>A IA apoia a análise. A decisão não é automática.</span>
                      </div>
                      <div className="alert-log-item warning">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>Aval de rede concluído em 15 minutos. Nenhuma anormalidade territorial.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Simulated Bottom Navigation Tab Bar (Hidden on onboarding/admin) */}
            {profileMode === 'membro' && membro && (
              <div className="mobile-tab-bar" id="app-tab-bar">
                <button 
                  className={`tab-item ${activeTab === 'inicio' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('inicio')}>
                  <i className="fa-solid fa-house"></i>
                  <span>Início</span>
                </button>
                <button 
                  className={`tab-item ${activeTab === 'credito' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('credito')}>
                  <i className="fa-solid fa-route"></i>
                  <span>Crédito</span>
                </button>
                <button 
                  className={`tab-item ${activeTab === 'evidencia' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('evidencia')}>
                  <i className="fa-solid fa-upload"></i>
                  <span>Evidências</span>
                </button>
                <button 
                  className={`tab-item ${activeTab === 'reputacao' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('reputacao')}>
                  <i className="fa-solid fa-chart-simple"></i>
                  <span>Reputação</span>
                </button>
                <button 
                  className={`tab-item ${activeTab === 'fundo' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('fundo')}>
                  <i className="fa-solid fa-vault"></i>
                  <span>Fundo</span>
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
