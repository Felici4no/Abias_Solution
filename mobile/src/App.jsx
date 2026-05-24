import { useState, useEffect } from 'react'

const getEstadoQualitativo = (state) => {
  switch (state) {
    case 'draft':
      return 'Jornada em registro'
    case 'submitted':
    case 'community_validation':
      return 'Jornada com evidências'
    case 'partner_quote':
    case 'under_review':
      return 'Jornada validada'
    case 'approved':
    case 'evidence_pending':
    case 'evidence_review':
    case 'validated':
    case 'needs_revision':
      return 'Pronta para análise de ciclo'
    case 'completed':
      return 'Ciclo acompanhado'
    case 'rejected':
      return 'Ciclo pausado para revisão'
    default:
      return 'Jornada em registro'
  }
}

const getEstadoQualitativoDesc = (state) => {
  switch (state) {
    case 'draft':
      return 'O membro começou a organizar suas informações de trabalho.'
    case 'submitted':
    case 'community_validation':
      return 'O membro adicionou sinais básicos de recorrência, rota, ferramenta ou necessidade.'
    case 'partner_quote':
    case 'under_review':
      return 'A rede ou parceiro local confirmou parte das informações.'
    case 'approved':
    case 'evidence_pending':
    case 'evidence_review':
    case 'validated':
    case 'needs_revision':
      return 'A jornada tem evidências suficientes para solicitar uma Carta de Corre.'
    case 'completed':
      return 'A necessidade foi atendida, registrada e acompanhada pela comunidade.'
    default:
      return 'O membro começou a organizar suas informações de trabalho.'
  }
}

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

  // --- UI Navigation States ---
  const [profileMode, setProfileMode] = useState('membro') // 'membro' | 'oficina' | 'gestao'
  const [activeTab, setActiveTab] = useState('inicio') // 'inicio' | 'credito' | 'evidencia' | 'reputacao' | 'fundo'
  const [clockTime, setClockTime] = useState('00:00')
  const [showAreaOperacional, setShowAreaOperacional] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState('splash') // 'splash' | 'benefits' | 'form'

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

  // 4. Avais comunitários
  const handleMarcosAval = () => {
    const updated = { ...avaliacoes, marcos: 'approved', marcosComment: 'João é parceiro de confiança, conheço a rota dele na Zona Leste.' }
    setAvaliacoes(updated)
    checkAvais(updated)
  }

  const handleAlineAval = () => {
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

  // 7. Evidência - Envio
  const handleAnexarRecibo = () => {
    setUploadFileSelected('recibo_oficina_jn.jpg')
    setUploadFileType('recibo')
  }

  const handleAnexarFoto = () => {
    setUploadFileSelected('foto_pneu_instalado.jpg')
    setUploadFileType('foto')
  }

  const handleEnviarEvidencia = () => {
    if (!uploadFileSelected) {
      alert('Selecione ou tire uma foto do serviço para envio.')
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

  // 10. Novo ciclo (Reset parcial para novo fluxo)
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
    setOnboardingStep('splash')
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
    alert('Os dados locais foram limpos!')
  }

  // Helper para tradução amigável do estado
  const getEstadoLabel = (state) => {
    const dict = {
      draft: { label: 'Em registro', step: 'Solicitar análise de ciclo para iniciar' },
      submitted: { label: 'Aguardando evidências', step: 'Confirmar os termos do plano comunitário' },
      community_validation: { label: 'Aguardando validação', step: 'Acompanhar validação de Corre (Marcos e Aline)' },
      partner_quote: { label: 'Aguardando Orçamento', step: 'Oficina JN confirmando necessidade' },
      under_review: { label: 'Em análise de ciclo', step: 'Aguardando validação da Gestão Abias' },
      approved: { label: 'Autorização produtiva emitida', step: 'Encaminhando orçamento para a oficina' },
      evidence_pending: { label: 'Comprovação Pendente', step: 'Enviar comprovantes na aba Evidências' },
      evidence_review: { label: 'Serviço em execução', step: 'Oficina JN confirmando realização do serviço' },
      validated: { label: 'Ciclo acompanhado', step: 'Aguardando finalização pela Gestão Abias' },
      completed: { label: 'Ciclo recomposto', step: 'Ciclo concluído com sucesso e reserva fortalecida!' },
      needs_revision: { label: 'Ciclo pausado para revisão', step: 'Editar dados conforme indicado pela gestão' },
      rejected: { label: 'Ciclo pausado para revisão', step: 'Verifique as observações da gestão' }
    }
    return dict[state] || { label: state, step: '' }
  }

  const currentStatus = getEstadoLabel(cicloEstado)

  // Dynamic Home Screen CTA render
  const renderHomeCTA = () => {
    switch (cicloEstado) {
      case 'draft':
        return (
          <button className="btn-app btn-app-primary" onClick={() => setActiveTab('credito')}>
            <i className="fa-solid fa-route"></i> Solicitar análise de ciclo
          </button>
        )
      case 'community_validation':
        return (
          <button className="btn-app btn-app-primary" onClick={() => setActiveTab('credito')}>
            <i className="fa-solid fa-users-double"></i> Acompanhar validação de Corre
          </button>
        )
      case 'evidence_pending':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
            <button className="btn-app btn-app-primary" onClick={() => setActiveTab('evidencia')}>
              <i className="fa-solid fa-upload"></i> Enviar evidência
            </button>
            <button className="btn-app btn-app-secondary" onClick={() => setActiveTab('credito')}>
              Acompanhar ciclo
            </button>
          </div>
        )
      case 'submitted':
      case 'partner_quote':
      case 'under_review':
      case 'evidence_review':
      case 'validated':
        return (
          <button className="btn-app btn-app-primary" onClick={() => setActiveTab('credito')}>
            <i className="fa-solid fa-route"></i> Acompanhar ciclo
          </button>
        )
      case 'completed':
        return (
          <button className="btn-app btn-app-primary" onClick={handleNovoCiclo}>
            <i className="fa-solid fa-rotate-left"></i> Iniciar novo ciclo
          </button>
        )
      default:
        return (
          <button className="btn-app btn-app-primary" onClick={() => setActiveTab('credito')}>
            Ver status
          </button>
        )
    }
  }

  const tabIds = ['inicio', 'reputacao', 'credito', 'rede', 'perfil']
  const activeIndex = tabIds.indexOf(activeTab)

  return (
    <div className="desktop-showcase-container">
      {/* Centered phone wrapper with clean outer header */}
      <div className="phone-showcase-wrapper">
        <div className="external-desktop-header">
          <h1>Abias — MVP Operacional</h1>
        </div>

        <div className="smartphone-frame">
          <div className="phone-notch"></div>
          <div className="phone-button volume-up"></div>
          <div className="phone-button volume-down"></div>
          <div className="phone-button power-button"></div>

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

            {/* Header Area with Discrete Settings Gear for Operating Drawer */}
            <div className="app-header-main-top" style={{
              display: 'flex',
              background: '#0B0B0B',
              borderBottom: '1px solid var(--border-color)',
              padding: '12px 20px',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span className="abias-logo" style={{ fontSize: '1.2rem', fontWeight: 800 }}>Abias</span>
              <button 
                className="btn-settings-toggle" 
                onClick={() => setShowAreaOperacional(true)}
                title="Área operacional"
                aria-label="Abrir Área operacional">
                <i className="fa-solid fa-sliders"></i>
              </button>
            </div>

            {/* Screen Content Scroll Area */}
            <div className="screen-scroll-area">
              
              {/* OPERATIONAL DRAWER OVERLAY */}
              {showAreaOperacional && (
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
                        <p><strong>Reputação de Corre (Simulado):</strong> <span className="font-mono">{reputacao}/1000</span></p>
                        <p><strong>Reserva de Ciclos Piloto:</strong> <span className="font-mono">R$ {fundo.toFixed(2)}</span></p>
                      </div>

                      <div className="area-operacional-actions">
                        <button 
                          className="btn-app btn-app-primary"
                          style={{ 
                            background: profileMode === 'membro' ? 'var(--color-green)' : 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-color)' 
                          }}
                          onClick={() => { setProfileMode('membro'); setShowAreaOperacional(false); }}>
                          Modo Membro {profileMode === 'membro' && '✓'}
                        </button>
                        <button 
                          className="btn-app btn-app-primary"
                          style={{ 
                            background: profileMode === 'oficina' ? 'var(--color-gold)' : 'rgba(255,255,255,0.03)', 
                            color: profileMode === 'oficina' ? '#0b0b0b' : '#ffffff',
                            border: '1px solid var(--border-color)'
                          }}
                          onClick={() => { setProfileMode('oficina'); setShowAreaOperacional(false); }}>
                          Modo Oficina {profileMode === 'oficina' && '✓'}
                        </button>
                        <button 
                          className="btn-app btn-app-primary"
                          style={{ 
                            background: profileMode === 'gestao' ? 'var(--color-terra)' : 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-color)'
                          }}
                          onClick={() => { setProfileMode('gestao'); setShowAreaOperacional(false); }}>
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
              )}

              {/* PROFILE MODE: MEMBRO */}
              {profileMode === 'membro' && (
                <>
                  {/* If not registered, force registration onboarding */}
                  {!membro ? (
                    <>
                      {onboardingStep === 'splash' && (
                        <div className="screen active" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '680px', position: 'relative' }}>
                          <div className="splash-glow"></div>
                          <div style={{ margin: 'auto 0', textAlign: 'center', zIndex: 2 }}>
                            <div className="splash-logo-wrapper" style={{ marginBottom: '20px' }}>
                              <h1 className="splash-logo-text" style={{ fontSize: '3.6rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', margin: 0 }}>ABIAS</h1>
                            </div>
                            <h2 className="splash-title" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '14px' }}>O PODER DA TUA JORNADA</h2>
                            <p className="splash-subtitle" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', maxWidth: '280px', margin: '0 auto' }}>
                              Uma comunidade de reputação e acesso produtivo para entregadores que precisam manter suas ferramentas de trabalho ativas.
                            </p>
                          </div>
                          <div style={{ width: '100%', paddingBottom: '20px', zIndex: 2 }}>
                            <button className="btn-app btn-app-primary" onClick={() => setOnboardingStep('benefits')}>
                              Entrar na rede <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
                            </button>
                          </div>
                        </div>
                      )}

                      {onboardingStep === 'benefits' && (
                        <div className="screen active" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '680px' }}>
                          <div>
                            <div className="benefits-hero-card" style={{ height: '140px', background: 'rgba(255, 255, 255, 0.02)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '20px' }}>
                              <div className="hero-glow" style={{ position: 'absolute', width: '80px', height: '80px', background: 'rgba(213, 63, 140, 0.15)', filter: 'blur(30px)' }}></div>
                              <i className="fa-solid fa-motorcycle" style={{ fontSize: '3rem', color: 'var(--color-gold)', zIndex: 1 }}></i>
                            </div>
                            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.15', marginBottom: '8px' }}>A rua não mente. Mas o banco nem sempre sabe ler.</h2>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
                              A Abias reconhece jornadas que os modelos de score tradicionais ignoram: trabalho diário, confiança da rede, território, oficina parceira e evidências reais.
                            </p>
                            
                            <div className="benefits-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div className="benefit-item-box" style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '1.2rem', color: 'var(--color-gold)' }}><i className="fa-solid fa-chart-simple"></i></div>
                                <div>
                                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '2px' }}>Reputação de Corre</h4>
                                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>Organize evidências simples da sua jornada produtiva de forma transparente.</p>
                                </div>
                              </div>
                              
                              <div className="benefit-item-box" style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '1.2rem', color: 'var(--color-gold)' }}><i className="fa-solid fa-route"></i></div>
                                <div>
                                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '2px' }}>Carta de Corre</h4>
                                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>Acesse uma autorização produtiva para resolver necessidades específicas de trabalho em parceiros locais.</p>
                                </div>
                              </div>
                              
                              <div className="benefit-item-box" style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '1.2rem', color: 'var(--color-gold)' }}><i className="fa-solid fa-users"></i></div>
                                <div>
                                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '2px' }}>Quilombo Digital</h4>
                                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>Uma rede de apoio mútuo para manter ferramentas de trabalho ativas, onde a comunidade valida e acompanha cada ciclo.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ width: '100%', marginTop: '10px' }}>
                            <button className="btn-app btn-app-primary" onClick={() => setOnboardingStep('form')}>
                              Começar minha jornada <i className="fa-solid fa-chevron-right" style={{ marginLeft: '4px' }}></i>
                            </button>
                          </div>
                        </div>
                      )}

                      {onboardingStep === 'form' && (
                        <div className="screen active" style={{ padding: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <button 
                              type="button"
                              style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem' }} 
                              onClick={() => setOnboardingStep('benefits')} 
                              aria-label="Voltar">
                              <i className="fa-solid fa-arrow-left"></i>
                            </button>
                            <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>ETAPA FINAL</span>
                          </div>
                          
                          <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px', lineHeight: '1.15', letterSpacing: '-0.02em' }}>
                            O banco vê um CPF.<br />A Abias reconhece uma jornada.
                          </h2>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
                            O sistema financeiro tradicional avalia pessoas como números isolados: CPF, score, renda formal e garantias. A Abias parte de outra ótica. A jornada de um entregador negro e periférico carrega território, rede, trabalho, confiança, obstáculos e consistência que a análise bancária fria não sabe ler. A Abias organiza essa jornada em reputação comunitária e acesso produtivo.
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
                              <label className="form-label">Região principal de atuação</label>
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

                            <div className="mobile-form-group" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '10px', marginTop: '10px' }}>
                              <input 
                                type="checkbox" 
                                id="aceite-dados-mvp" 
                                checked={inputAceite} 
                                style={{ marginTop: '2px' }}
                                onChange={(e) => setInputAceite(e.target.checked)} 
                              />
                              <label htmlFor="aceite-dados-mvp" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
                                Concordo com os Termos de Uso e a Política de Privacidade. A participação no piloto não garante acesso automático a ciclos produtivos.
                              </label>
                            </div>

                            <button type="submit" className="btn-app btn-app-primary" style={{ marginTop: '10px' }}>
                              Registrar membro
                            </button>
                          </form>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      {/* TAB 1: INÍCIO */}
                      {activeTab === 'inicio' && (
                        <div className="screen active" id="screen-home">
                          <div className="app-header" style={{ borderBottom: 'none', paddingBottom: '0' }}>
                            <div className="member-profile">
                              <div className="member-avatar" style={{ background: 'rgba(201, 154, 61, 0.15)', border: '1px solid var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <i className="fa-solid fa-motorcycle" style={{ color: 'var(--color-gold)', fontSize: '0.9rem' }}></i>
                              </div>
                              <div>
                                <span className="greeting-sub">Sua rota comprova trabalho. Sua jornada constrói confiança.</span>
                                <h3 className="member-name">Salve, {membro.nome}</h3>
                              </div>
                            </div>
                            <span className="badge-status-membro"><i className="fa-solid fa-shield-halved"></i> Rota Comprovada</span>
                          </div>

                          {/* Cycle Active Status Card */}
                          <div className="home-main-card" style={{ marginTop: '16px', position: 'relative', overflow: 'hidden' }}>
                            <div className="card-glow" style={{ position: 'absolute', right: '-20px', top: '-20px', width: '120px', height: '120px', background: 'rgba(201, 154, 61, 0.05)', filter: 'blur(30px)', borderRadius: '50%' }}></div>
                            <div className="home-card-header">
                              <span className="card-tag">STATUS OPERACIONAL</span>
                              {['evidence_pending', 'evidence_review', 'validated'].includes(cicloEstado) ? (
                                <span className="status-indicator-green" style={{ color: 'var(--color-gold)' }}>
                                  <i className="fa-solid fa-circle"></i> Autorização Produtiva Ativa
                                </span>
                              ) : (
                                <span className="status-indicator-green">
                                  <i className="fa-solid fa-circle"></i> Sua jornada está active
                                </span>
                              )}
                            </div>
                            <div className="home-card-body">
                              <div className="reputacao-summary">
                                <span className="lbl">Reputação de Corre</span>
                                <div className="score-display">
                                  <span className="score-num font-mono" style={{ fontSize: '1.3rem', fontWeight: 800 }}>{getEstadoQualitativo(cicloEstado)}</span>
                                </div>
                                <span className="score-level-badge">
                                  {getEstadoQualitativoDesc(cicloEstado)}
                                </span>
                              </div>
                            </div>
                            <div className="home-card-footer">
                              <div className="fundo-summary">
                                <i className="fa-solid fa-vault"></i>
                                <span>Reserva Piloto: <strong>R$ {fundo.toFixed(2)}</strong> em ciclos piloto</span>
                              </div>
                            </div>
                          </div>

                          {/* Timeline / Cycle status notice */}
                          {cicloEstado !== 'draft' && (
                            <div className="info-notice-card plain-border" style={{ margin: '0 20px 20px', position: 'relative' }}>
                              <h4 style={{ fontSize: '0.8rem', color: 'var(--color-gold)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>Acompanhar ciclo</h4>
                              <p style={{ fontSize: '0.8rem', color: '#ffffff', fontWeight: 'bold' }}>Passo Atual: {currentStatus.label}</p>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: '1.4' }}>Próximo passo: {currentStatus.step}</p>
                            </div>
                          )}

                          {/* EVIDENCIAS UPLOAD INTEGRATION DIRECTLY ON HOME IF PENDING */}
                          {cicloEstado === 'evidence_pending' && (
                            <div className="info-notice-card" style={{ margin: '0 20px 20px', background: 'rgba(154, 79, 47, 0.05)', border: '1px solid rgba(154, 79, 47, 0.2)' }}>
                              <h4 style={{ fontSize: '0.8rem', color: 'var(--color-terra)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 800 }}>
                                <i className="fa-solid fa-triangle-exclamation"></i> Enviar Evidências de Corre
                              </h4>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.4' }}>
                                Forneça a comprovação técnica da manutenção do veículo (troca do pneu ou revisão realizada) para registrar o ciclo acompanhado pela comunidade.
                              </p>
                              
                              <div className="upload-methods" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
                                <div 
                                  className="upload-box-action" 
                                  onClick={handleAnexarFoto} 
                                  style={{ padding: '12px 8px', border: uploadFileType === 'foto' ? '1px solid var(--color-gold)' : '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                                  <div className="box-icon" style={{ fontSize: '1rem' }}><i className="fa-solid fa-camera"></i></div>
                                  <span style={{ fontSize: '0.65rem' }}>Foto do Pneu Instalado</span>
                                </div>
                                <div 
                                  className="upload-box-action" 
                                  onClick={handleAnexarRecibo} 
                                  style={{ padding: '12px 8px', border: uploadFileType === 'recibo' ? '1px solid var(--color-gold)' : '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                                  <div className="box-icon" style={{ fontSize: '1rem' }}><i className="fa-solid fa-file-invoice-dollar"></i></div>
                                  <span style={{ fontSize: '0.65rem' }}>Recibo da Oficina</span>
                                </div>
                              </div>

                              {uploadFileSelected && (
                                <div className="simulated-file-badge" style={{ marginBottom: '12px', fontSize: '0.75rem', padding: '6px 10px' }}>
                                  <div>
                                    <i className="fa-solid fa-paperclip" style={{ marginRight: '6px' }}></i> 
                                    <span>{uploadFileSelected}</span>
                                  </div>
                                  <button className="btn-remove-file" onClick={() => { setUploadFileSelected(''); setUploadFileType(''); }} style={{ fontSize: '0.9rem' }}>&times;</button>
                                </div>
                              )}

                              <div className="mobile-form-group" style={{ marginBottom: '12px' }}>
                                <label className="form-label" style={{ fontSize: '0.7rem' }}>O que foi feito? (Observação)</label>
                                <textarea 
                                  className="form-textarea" 
                                  style={{ height: '50px', padding: '8px 10px', fontSize: '0.75rem' }}
                                  value={uploadFileObs} 
                                  onChange={(e) => setUploadFileObs(e.target.value)} 
                                  placeholder="Ex: Trocado pneu traseiro na Oficina JN."
                                />
                              </div>

                              <button className="btn-app btn-app-primary" style={{ padding: '10px 14px', fontSize: '0.8rem' }} onClick={handleEnviarEvidencia}>
                                Enviar evidência
                              </button>
                            </div>
                          )}

                          {/* Dynamic CTA button conforme estado */}
                          {cicloEstado !== 'evidence_pending' && (
                            <div className="home-actions-group">
                              {renderHomeCTA()}
                            </div>
                          )}

                          {/* Recent Activity Feed */}
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
                                  {['community_validation', 'partner_quote', 'under_review', 'approved', 'evidence_pending', 'evidence_review', 'validated', 'completed'].includes(cicloEstado) && (
                                    <div className="activity-item-card" style={{ display: 'flex', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                                      <div className="activity-icon-badge" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--color-gold)' }}><i className="fa-solid fa-file-invoice"></i></div>
                                      <div>
                                        <h5 style={{ fontSize: '0.75rem', fontWeight: 800 }}>Carta de Corre Solicitada</h5>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Carta de Corre de R$ {currentAmount} para {currentFinalidade} registrada.</p>
                                      </div>
                                    </div>
                                  )}
                                  {avaliacoes.marcos === 'approved' && (
                                    <div className="activity-item-card" style={{ display: 'flex', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                                      <div className="activity-icon-badge" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--success)' }}><i className="fa-solid fa-signature"></i></div>
                                      <div>
                                        <h5 style={{ fontSize: '0.75rem', fontWeight: 800 }}>Validação de Marcos Santos registrada</h5>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Validação territorial efetuada na Zona Leste.</p>
                                      </div>
                                    </div>
                                  )}
                                  {oficinaConfirmacao.quoteConfirmed && (
                                    <div className="activity-item-card" style={{ display: 'flex', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                                      <div className="activity-icon-badge" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--color-gold)' }}><i className="fa-solid fa-wrench"></i></div>
                                      <div>
                                        <h5 style={{ fontSize: '0.75rem', fontWeight: 800 }}>Orçamento Oficina JN Confirmado</h5>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Mecânica credenciada validou necessidade produtiva.</p>
                                      </div>
                                    </div>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          {/* Local Recommended Partner */}
                          <div className="home-stats-section" style={{ marginTop: '20px', marginBottom: '20px', padding: '0 20px' }}>
                            <h4 className="section-title-mobile">Parceiro Recomendado Local</h4>
                            <div className="recommended-partner-card" style={{ display: 'flex', gap: '12px', padding: '16px', background: 'rgba(201, 154, 61, 0.03)', border: '1px solid rgba(201, 154, 61, 0.2)' }}>
                              <div className="partner-circle-icon" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(201, 154, 61, 0.1)', display: 'flex', alignItems: 'center', justify: 'center', color: 'var(--color-gold)' }}><i className="fa-solid fa-warehouse"></i></div>
                              <div>
                                <h5 style={{ fontSize: '0.8rem', fontWeight: 800, marginBottom: '2px' }}>Oficina JN — 1.2km</h5>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>Mecânica autorizada da comunidade Abias. Especialistas em kit relação, pneus e revisões rápidas.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 2: REPUTAÇÃO */}
                      {activeTab === 'reputacao' && (
                        <div className="screen active" id="screen-reputacao">
                          <div className="app-header-simple">
                            <h3>Reputação de Corre</h3>
                          </div>
                          
                          <div className="reputacao-container">
                            <div className="reputacao-score-box glass" style={{ position: 'relative', overflow: 'hidden' }}>
                              <div className="card-glow" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '160px', height: '160px', background: 'rgba(201, 154, 61, 0.06)', filter: 'blur(34px)', borderRadius: '50%' }}></div>
                              <span className="lbl-tag">ESTADO DA JORNADA</span>
                              <div className="reputacao-number-row font-mono" style={{ fontSize: '1.5rem', margin: '12px 0' }}>
                                <span className="val" style={{ fontSize: '1.6rem' }}>{getEstadoQualitativo(cicloEstado)}</span>
                              </div>
                              <p className="reputacao-desc" style={{ marginTop: '8px' }}>
                                {getEstadoQualitativoDesc(cicloEstado)}
                              </p>
                            </div>

                            <div className="reputacao-factors-list" style={{ marginTop: '20px' }}>
                              <h4>Níveis da Reputação de Corre</h4>
                              
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
                                {[
                                  { state: 'draft', label: '1. Jornada em registro', desc: 'Informações de trabalho iniciadas.' },
                                  { state: 'submitted', label: '2. Jornada com evidências', desc: 'Necessidades e rotas registradas.' },
                                  { state: 'community_validation', label: '3. Jornada validada', desc: 'A rede e parceiros locais validaram seu corre.' },
                                  { state: 'approved', label: '4. Pronta para análise de ciclo', desc: 'Evidências suficientes para Carta de Corre.' },
                                  { state: 'completed', label: '5. Ciclo acompanhado', desc: 'Necessidade atendida e ciclo recomposto.' }
                                ].map((step, idx) => {
                                  const getStepActive = (currentState, stepState) => {
                                    const statesOrder = ['draft', 'submitted', 'community_validation', 'approved', 'completed'];
                                    let currentIdx = statesOrder.indexOf(currentState);
                                    if (currentState === 'partner_quote' || currentState === 'under_review') currentIdx = 2;
                                    if (['approved', 'evidence_pending', 'evidence_review', 'validated', 'needs_revision'].includes(currentState)) currentIdx = 3;
                                    if (currentState === 'completed') currentIdx = 4;
                                    
                                    const stepIdx = statesOrder.indexOf(stepState);
                                    return stepIdx <= currentIdx;
                                  };
                                  const isActive = getStepActive(cicloEstado, step.state);
                                  const isHighlight = (step.state === 'draft' && cicloEstado === 'draft') ||
                                                      (step.state === 'submitted' && (cicloEstado === 'submitted' || cicloEstado === 'community_validation')) ||
                                                      (step.state === 'community_validation' && (cicloEstado === 'partner_quote' || cicloEstado === 'under_review')) ||
                                                      (step.state === 'approved' && ['approved', 'evidence_pending', 'evidence_review', 'validated', 'needs_revision'].includes(cicloEstado)) ||
                                                      (step.state === 'completed' && cicloEstado === 'completed');

                                  return (
                                    <div key={idx} style={{ 
                                      display: 'flex', 
                                      alignItems: 'center', 
                                      gap: '12px', 
                                      padding: '10px 14px', 
                                      borderRadius: '6px',
                                      background: isHighlight ? 'rgba(201, 154, 61, 0.08)' : 'rgba(255, 255, 255, 0.01)',
                                      border: isHighlight ? '1px solid rgba(201, 154, 61, 0.2)' : '1px solid var(--border-color)',
                                      opacity: isActive ? 1 : 0.4
                                    }}>
                                      <div style={{ color: isActive ? 'var(--color-gold)' : 'var(--text-muted)', fontSize: '1.1rem' }}>
                                        <i className={isActive ? 'fa-solid fa-circle-check' : 'fa-regular fa-circle'}></i>
                                      </div>
                                      <div>
                                        <h5 style={{ fontSize: '0.85rem', fontWeight: 800, margin: 0, color: isHighlight ? 'var(--color-gold)' : '#ffffff' }}>{step.label}</h5>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>{step.desc}</p>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="how-to-improve-card glass">
                              <h4>Histórico de Conquistas</h4>
                              <ul className="bullet-list-mobile">
                                <li><i className="fa-solid fa-award text-success"></i> <strong>Corre Histórico</strong>: 4 anos de asfalto cadastrados.</li>
                                <li><i className="fa-solid fa-award text-success"></i> <strong>Validação de Rede</strong>: Indicado por 2 membros da comunidade.</li>
                                {['validated', 'completed'].includes(cicloEstado) && (
                                  <li><i className="fa-solid fa-award text-success"></i> <strong>Ficha Limpa JN</strong>: Oficina parceira validada sem divergências.</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 3: CARTA DE CORRE */}
                      {activeTab === 'credito' && (
                        <div className="screen active" id="screen-solicitar">
                          {/* DRAFT: Solicitação Form */}
                          {cicloEstado === 'draft' && (
                            <>
                              <div className="app-header-simple">
                                <h3>Carta de Corre</h3>
                              </div>
                              
                              <form className="mobile-form" onSubmit={handleSolicitacaoSubmit}>
                                <div className="form-banner-info">
                                  <p><strong>Não liberamos dinheiro livre. A Carta de Corre é uma autorização produtiva para resolver necessidades específicas de trabalho direcionada a parceiros credenciados.</strong></p>
                                </div>

                                <div className="mobile-form-group">
                                  <label className="form-label">Qual o valor estimado da necessidade?</label>
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
                                  <span className="form-helper">Valor sugerido para pneu e revisão básica: R$ 850</span>
                                </div>

                                <div className="mobile-form-group">
                                  <label className="form-label">Qual a necessidade de trabalho?</label>
                                  <div className="chips-selector">
                                    {[
                                      'Pneu',
                                      'Revisão',
                                      'Celular',
                                      'Documentação',
                                      'Manutenção',
                                      'Outro item produtivo'
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
                                  <label className="form-label">Plano de recomposição do ciclo</label>
                                  <select 
                                    className="form-select" 
                                    value={inputPrazo} 
                                    onChange={(e) => setInputPrazo(e.target.value)}>
                                    <option value="7">7 dias (Recomposição rápida)</option>
                                    <option value="15">15 dias (Recomposição quinzenal)</option>
                                    <option value="30">30 dias (Recomposição mensal)</option>
                                    <option value="45">45 dias (Recomposição estendida)</option>
                                  </select>
                                </div>

                                <div className="mobile-form-group">
                                  <label className="form-label">Indicar oficina parceira</label>
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
                                  <label className="form-label">Como essa necessidade impacta sua jornada?</label>
                                  <textarea 
                                    className="form-textarea" 
                                    value={inputDescricao} 
                                    onChange={(e) => setInputDescricao(e.target.value)} 
                                    placeholder="Explique porque o serviço é necessário para continuar as entregas."
                                    required
                                  />
                                </div>

                                <button type="submit" className="btn-app btn-app-primary">
                                  Solicitar análise de ciclo
                                </button>
                              </form>
                            </>
                          )}

                          {/* SUBMITTED: Plano Sugerido (Slip) */}
                          {cicloEstado === 'submitted' && (
                            <>
                              <div className="app-header-simple">
                                <h3>Carta de Corre em Análise</h3>
                              </div>
                              <div className="plano-container">
                                <div className="plano-notice-badge">
                                  <span><i className="fa-solid fa-triangle-exclamation"></i> Carta de Corre sugerida. Sujeita à validação de Corre.</span>
                                </div>

                                {/* Slip Card */}
                                <div className="premium-credit-card compact-slip" style={{ position: 'relative', overflow: 'hidden' }}>
                                  <div className="card-brand-row">
                                    <span className="card-brand">Abias</span>
                                    <span className="card-contactless"><i className="fa-solid fa-receipt"></i> COMPROVANTE OPERACIONAL</span>
                                  </div>
                                  <div className="slip-details">
                                    <div className="slip-row">
                                      <span className="slip-label">NECESSIDADE PRODUTIVA</span>
                                      <span className="slip-value">{currentFinalidade}</span>
                                    </div>
                                    <div className="slip-row">
                                      <span className="slip-label">PLANO DE RECOMPOSIÇÃO</span>
                                      <span className="slip-value">{currentPrazo} dias</span>
                                    </div>
                                    <div className="slip-row">
                                      <span className="slip-label">OFICINA PARCEIRA</span>
                                      <span className="slip-value">{currentOficina}</span>
                                    </div>
                                    <div className="slip-row">
                                      <span className="slip-label">EVIDÊNCIAS DE CORRE</span>
                                      <span className="slip-value">Nota + Foto da Instalação</span>
                                    </div>
                                    <div className="slip-row">
                                      <span className="slip-label">GRAU DE URGÊNCIA</span>
                                      <span className="slip-value">{currentUrgencia}</span>
                                    </div>
                                  </div>
                                  <div className="slip-footer">
                                    <div className="slip-badge">CARTA DE CORRE</div>
                                    <span className="slip-amount">R$ {currentAmount.toFixed(2)}</span>
                                  </div>
                                </div>

                                <div className="plano-payment-card glass">
                                  <h4>Estrutura do Ciclo Comunitário</h4>
                                  <div className="payment-row">
                                    <span className="lbl font-bold">Recomposição estimada:</span>
                                    <span className="val font-mono font-bold">4x de R$ {new Intl.NumberFormat('pt-BR').format(parcelasValor)}</span>
                                  </div>
                                  <span className="tax-info-footer">Taxa de sustentabilidade do piloto de 8% voltada a fortalecer a Reserva de Ciclos Piloto.</span>
                                </div>

                                <div className="validacoes-list-card glass">
                                  <h4>Evidências Necessárias</h4>
                                  <ul className="bullet-list-mobile">
                                    <li><i className="fa-solid fa-receipt text-success"></i> Orçamento confirmado pela oficina parceira</li>
                                    <li><i className="fa-solid fa-camera text-warning"></i> Foto do pneu/serviço instalado na moto</li>
                                    <li><i className="fa-solid fa-check-double text-warning"></i> Validação de Corre emitida por 2 membros</li>
                                  </ul>
                                </div>

                                <div className="plano-actions">
                                  <button className="btn-app btn-app-primary" onClick={handleConfirmarPlano}>
                                    Confirmar plano de recomposição
                                  </button>
                                  <button className="btn-app btn-app-secondary" onClick={() => setCicloEstado('draft')}>
                                    Editar necessidade
                                  </button>
                                </div>
                              </div>
                            </>
                          )}

                          {/* COMMUNITY VALIDATION: Peer Endorsements Screen */}
                          {cicloEstado === 'community_validation' && (
                            <>
                              <div className="app-header-simple">
                                <h3>Validação de Corre</h3>
                              </div>
                              <div className="aval-container">
                                <div className="aval-status-banner glass">
                                  <span className="section-tag tag-yellow">VALIDAÇÃO DE CORRE</span>
                                  <h2>Quem reconhece sua jornada?</h2>
                                  <p>Convide pessoas ou parceiros que conhecem seu corre para validar evidências da sua jornada produtiva.</p>
                                </div>

                                <div className="aval-peers-list">
                                  {/* Marcos card */}
                                  <div className="peer-item-card glass" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div className="peer-avatar" style={{ background: 'rgba(217, 210, 197, 0.05)', color: 'var(--color-gold)', borderRadius: '50%' }}><i className="fa-solid fa-user"></i></div>
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
                                        onClick={handleMarcosAval}
                                        style={{ fontSize: '0.75rem', padding: '10px' }}>
                                        <i className="fa-solid fa-signature"></i> Registrar validação de Marcos
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
                                        <div className="peer-avatar" style={{ background: 'rgba(217, 210, 197, 0.05)', color: 'var(--color-gold)', borderRadius: '50%' }}><i className="fa-solid fa-user"></i></div>
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
                                        onClick={handleAlineAval}
                                        style={{ fontSize: '0.75rem', padding: '10px' }}>
                                        <i className="fa-solid fa-signature"></i> Registrar validação de Aline
                                      </button>
                                    ) : (
                                      <p style={{ fontSize: '0.75rem', fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                                        "{avaliacoes.alineComment}"
                                      </p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          )}

                          {/* OTHER STATES: Status view */}
                          {['partner_quote', 'under_review', 'approved', 'evidence_pending', 'evidence_review', 'validated', 'completed', 'needs_revision', 'rejected'].includes(cicloEstado) && (
                            <>
                              <div className="app-header-simple">
                                <h3>Status da Carta de Corre</h3>
                              </div>
                              <div className="plano-container">
                                <div className="milestone-card glass">
                                  <span className="lbl-milestone">ESTADO DA CARTA DE CORRE</span>
                                  <h4 style={{ margin: 0 }}>{getEstadoLabel(cicloEstado).label}</h4>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                    {getEstadoLabel(cicloEstado).step}
                                  </p>
                                </div>

                                {cicloEstado === 'completed' ? (
                                  <div className="premium-credit-card compact-slip" style={{ 
                                    position: 'relative', 
                                    overflow: 'hidden',
                                    border: '1px solid var(--color-green)',
                                    background: 'linear-gradient(180deg, #0e1c16 0%, #0b0b0b 100%)'
                                  }}>
                                    <div className="card-brand-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span className="card-brand" style={{ color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 800 }}>
                                        <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)' }}></i> Carta autorizada e concluída
                                      </span>
                                      <span className="card-contactless" style={{ fontSize: '0.6rem', color: 'var(--text-secondary)' }}><i className="fa-solid fa-shield-halved"></i> ABIAS PRODUTIVO</span>
                                    </div>
                                    <div className="slip-details" style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                      <div className="slip-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}>
                                        <span className="slip-label" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>VALOR DO CICLO</span>
                                        <span className="slip-value" style={{ fontSize: '0.8rem', fontWeight: 700 }}>R$ {currentAmount.toFixed(2)}</span>
                                      </div>
                                      <div className="slip-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}>
                                        <span className="slip-label" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>NECESSIDADE PRODUTIVA</span>
                                        <span className="slip-value" style={{ fontSize: '0.8rem', fontWeight: 700 }}>{currentFinalidade}</span>
                                      </div>
                                      <div className="slip-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}>
                                        <span className="slip-label" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>OFICINA</span>
                                        <span className="slip-value" style={{ fontSize: '0.8rem', fontWeight: 700 }}>{currentOficina}</span>
                                      </div>
                                      <div className="slip-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}>
                                        <span className="slip-label" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>VALIDAÇÃO DE CORRE</span>
                                        <span className="slip-value" style={{ fontSize: '0.8rem', fontWeight: 700 }}>Marcos e Aline</span>
                                      </div>
                                      <div className="slip-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}>
                                        <span className="slip-label" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>COMPROVANTE</span>
                                        <span className="slip-value" style={{ fontSize: '0.8rem', fontWeight: 700 }}>recibo + foto</span>
                                      </div>
                                      <div className="slip-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}>
                                        <span className="slip-label" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>ESTADO DA JORNADA</span>
                                        <span className="slip-value" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>{getEstadoQualitativo(cicloEstado)}</span>
                                      </div>
                                      <div className="slip-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.03)', paddingBottom: '4px' }}>
                                        <span className="slip-label" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>RESERVA PILOTO</span>
                                        <span className="slip-value" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-gold)' }}>+R$ {(currentAmount * 0.08).toFixed(0)}</span>
                                      </div>
                                      <div className="slip-row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span className="slip-label" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>ESTADO</span>
                                        <span className="slip-value" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--success)' }}>ciclo recomposto</span>
                                      </div>
                                    </div>
                                    <div className="slip-footer" style={{ borderTop: '1px dashed var(--border-color)', paddingTop: '10px', marginTop: '10px', display: 'block', height: 'auto' }}>
                                      <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', fontStyle: 'italic', lineHeight: '1.4', textAlign: 'center', margin: 0 }}>
                                        “Este ciclo fortaleceu a jornada de {membro.nome.split(' ')[0]} e adicionou contribuição à Reserva de Ciclos Piloto.”
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
                                      <div className="slip-row">
                                        <span className="slip-label">MOTOCICLISTA</span>
                                        <span className="slip-value">{membro.nome}</span>
                                      </div>
                                      <div className="slip-row">
                                        <span className="slip-label">NECESSIDADE PRODUTIVA</span>
                                        <span className="slip-value">{currentFinalidade}</span>
                                      </div>
                                      <div className="slip-row">
                                        <span className="slip-label">OFICINA VINCULADA</span>
                                        <span className="slip-value">{currentOficina}</span>
                                      </div>
                                      <div className="slip-row">
                                        <span className="slip-label">PLANO DE RECOMPOSIÇÃO</span>
                                        <span className="slip-value">4x de R$ {new Intl.NumberFormat('pt-BR').format(parcelasValor)}</span>
                                      </div>
                                    </div>
                                    <div className="slip-footer">
                                      <div className="slip-badge">CARTA DE CORRE</div>
                                      <span className="slip-amount">R$ {currentAmount.toFixed(2)}</span>
                                    </div>
                                  </div>
                                )}

                                {cicloEstado === 'completed' && (
                                  <button className="btn-app btn-app-primary" onClick={handleNovoCiclo}>
                                    Iniciar Novo Ciclo Comunitário
                                  </button>
                                )}
                              </div>
                            </>
                          )}
                        </div>
                      )}

                      {/* TAB 4: REDE / ECONOMIA LOCAL */}
                      {activeTab === 'rede' && (
                        <div className="screen active" id="screen-rede">
                          <div className="app-header-simple">
                            <h3>Rede & Economia Local</h3>
                          </div>

                          <div className="fundo-mobile-container" style={{ padding: '20px' }}>
                            <div className="fundo-headline-card glass" style={{ position: 'relative', overflow: 'hidden' }}>
                              <span className="section-tag tag-yellow">RESERVA DE CICLOS PILOTO — AMBIENTE PILOTO</span>
                              <h2>Reserva de Ciclos Piloto</h2>
                              <p style={{ fontSize: '0.9rem', color: 'var(--color-gold)', marginBottom: '10px' }}>Apoio mútuo para jornadas individuais.</p>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>A reserva ajuda a entender como novos ciclos podem ser viabilizados com responsabilidade, acompanhamento e transparência. No ambiente piloto, ela serve para aprender como a rede pode sustentar novos acessos produtivos sem prometer garantia, seguro ou aprovação automática.</p>
                            </div>

                            <div className="fundo-reserve-card glass">
                              <span className="lbl">Saldo da Reserva de Ciclos Piloto</span>
                              <div className="amount-val font-mono">R$ {fundo.toFixed(2)}</div>
                              <div className="fundo-bar-wrapper">
                                <div className="fundo-bar-fill-mobile" style={{ width: `${Math.min(100, (fundo / 8000) * 100)}%` }}></div>
                              </div>
                              <span className="fundo-subtext-meta">Meta de sustentabilidade do piloto: R$ 8.000,00</span>
                            </div>

                            {/* Circular Economy loop visual */}
                            <div className="rede-flow-card glass" style={{ marginTop: '0', padding: '16px' }}>
                              <h5 style={{ fontSize: '0.85rem', fontWeight: 800 }}>Circulação Circular de Recursos</h5>
                              
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
                                  <span style={{ fontWeight: 700, color: 'var(--color-gold)' }}>1. Jornada reconhecida</span>
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Comunidade organiza evidências do corre.</span>
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
                                  <span style={{ fontWeight: 700, color: 'var(--success)' }}>2. Necessidade validada</span>
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Oficina e rede confirmam a necessidade.</span>
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
                                  <span style={{ fontWeight: 700, color: 'var(--color-terra)' }}>3. Ciclo acompanhado</span>
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Carta de Corre usada no parceiro local.</span>
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
                                  <span style={{ fontWeight: 700, color: 'var(--color-gold)' }}>4. Reserva recomposta</span>
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Ciclo retorna aprendizado e capacidade.</span>
                                </div>
                              </div>
                            </div>

                            {/* Partners directory */}
                            <div className="how-to-improve-card glass" style={{ marginTop: '20px' }}>
                              <h4 style={{ color: 'var(--color-gold)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: 800 }}>Oficinas e Comércios Credenciados</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                    <h5 style={{ fontSize: '0.8rem', fontWeight: 700 }}>Oficina JN</h5>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Serviço Mecânico e Reparos — Zona Leste</span>
                                  </div>
                                  <span style={{ fontSize: '0.65rem', padding: '3px 8px', background: 'rgba(22, 61, 47, 0.2)', border: '1px solid var(--color-green)', color: 'var(--success)' }}>Ativa</span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                    <h5 style={{ fontSize: '0.8rem', fontWeight: 700 }}>Motopeças Silva</h5>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Venda de Peças e Acessórios — Zona Leste</span>
                                  </div>
                                  <span style={{ fontSize: '0.65rem', padding: '3px 8px', background: 'rgba(22, 61, 47, 0.2)', border: '1px solid var(--color-green)', color: 'var(--success)' }}>Ativa</span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.01)', padding: '10px', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                  <div>
                                    <h5 style={{ fontSize: '0.8rem', fontWeight: 700 }}>Borracharia do Ponto</h5>
                                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Reparo e Venda de Pneus — Zona Leste</span>
                                  </div>
                                  <span style={{ fontSize: '0.65rem', padding: '3px 8px', background: 'rgba(22, 61, 47, 0.2)', border: '1px solid var(--color-green)', color: 'var(--success)' }}>Ativa</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 5: PERFIL */}
                      {activeTab === 'perfil' && (
                        <div className="screen active" id="screen-perfil">
                          <div className="app-header-simple">
                            <h3>Meu Perfil</h3>
                          </div>
                          
                          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <div className="reputacao-score-box glass" style={{ padding: '20px', display: 'flex', gap: '16px', alignItems: 'center', textAlign: 'left' }}>
                              <div className="member-avatar" style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(201, 154, 61, 0.1)', border: '2px solid var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', color: 'var(--color-gold)' }}>
                                <i className="fa-solid fa-user"></i>
                              </div>
                              <div>
                                <h4 style={{ fontSize: '1.1rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>{membro.nome}</h4>
                                <span style={{ fontSize: '0.7rem', color: 'var(--color-gold)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Membro Indicador Leste</span>
                                <div className="how-to-improve-card glass" style={{ padding: '16px' }}>
                                  <h4 style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: 800 }}>Conquistas de Jornada</h4>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 4px', border: '1px solid var(--border-color)' }}>
                                      <i className="fa-solid fa-users" style={{ color: 'var(--color-gold)', fontSize: '1rem', marginBottom: '4px' }}></i>
                                      <h6 style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ffffff' }}>Validador</h6>
                                      <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Confiança</span>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 4px', border: '1px solid var(--border-color)' }}>
                                      <i className="fa-solid fa-check-double" style={{ color: 'var(--success)', fontSize: '1rem', marginBottom: '4px' }}></i>
                                      <h6 style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ffffff' }}>Evidências</h6>
                                      <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Confirmadas</span>
                                    </div>
                                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 4px', border: '1px solid var(--border-color)' }}>
                                      <i className="fa-solid fa-vault" style={{ color: 'var(--color-terra)', fontSize: '1rem', marginBottom: '4px' }}></i>
                                      <h6 style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ffffff' }}>Circularidade</h6>
                                      <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Recompositor</span>
                                    </div>
                                  </div>
                                </div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                  {membro.ferramenta} • {membro.tempo} de asfalto • {membro.regiao}
                                </p>
                              </div>
                            </div>

                            <div className="how-to-improve-card glass" style={{ padding: '16px' }}>
                              <h4 style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: 800 }}>Depoimentos e Validações de Corre</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem' }}>
                                    <strong>Marcos Santos</strong>
                                    <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓ Jornada Reconhecida</span>
                                  </div>
                                  <p style={{ fontSize: '0.72rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                    "João é parceiro de confiança, conheço a rota dele na Zona Leste."
                                  </p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem' }}>
                                    <strong>Aline Souza</strong>
                                    <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓ Jornada Reconhecida</span>
                                  </div>
                                  <p style={{ fontSize: '0.72rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                    "Grande profissional de entrega. Corre garantido no asfalto."
                                  </p>
                                </div>
                              </div>
                            </div>
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
                  <div className="app-header-simple" style={{ margin: '-20px -20px 20px', background: 'var(--color-gold)', color: '#0b0b0b' }}>
                    <h3 style={{ color: '#0b0b0b' }}><i className="fa-solid fa-wrench"></i> Painel Oficina Parceira</h3>
                  </div>

                  {!solicitacao || ['draft', 'submitted', 'community_validation'].includes(cicloEstado) ? (
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

                      {/* State Action: Confirm quote */}
                      {cicloEstado === 'partner_quote' && (
                        <div className="glass" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <h5>Validar Orçamento de R$ {currentAmount}</h5>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            Confirme que o orçamento é adequado para o reparo necessário do veículo.
                          </p>
                          <button className="btn-app btn-app-primary" style={{ background: 'var(--color-gold)', color: '#0b0b0b' }} onClick={handleOficinaConfirmarOrçamento}>
                            Confirmar Orçamento
                          </button>
                        </div>
                      )}

                      {/* State Action: Confirm service completed */}
                      {cicloEstado === 'evidence_review' && (
                        <div className="glass" style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                          <h5>Confirmar Execução do Serviço</h5>
                          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            João enviou o comprovante técnico. Confirme que o serviço foi finalizado.
                          </p>
                          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '10px', borderRadius: '4px', fontSize: '0.75rem' }}>
                            <p><strong>Arquivo anexado:</strong> {evidencia.file}</p>
                            <p><strong>Observações João:</strong> "{evidencia.obs || 'Nenhuma obs.'}"</p>
                          </div>
                          <button className="btn-app btn-app-primary" style={{ background: 'var(--color-gold)', color: '#0b0b0b' }} onClick={handleOficinaConfirmarServico}>
                            Confirmar Serviço Realizado
                          </button>
                        </div>
                      )}

                      {['under_review', 'approved', 'evidence_pending', 'validated', 'completed'].includes(cicloEstado) && (
                        <div className="info-notice-card plain-border" style={{ margin: 0 }}>
                          <p><i className="fa-solid fa-circle-check" style={{ color: 'var(--success)' }}></i> Ações técnicas concluídas para este ciclo.</p>
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
                        <span className="lbl">Reserva Operacional</span>
                        <span className="val font-mono">R$ {fundo}</span>
                      </div>
                    </div>

                    {/* Pending validation queue */}
                    <div className="admin-queue-card glass">
                      <h4>Fila de Ciclos Operacionais</h4>

                      {!solicitacao || ['draft', 'submitted', 'community_validation', 'partner_quote'].includes(cicloEstado) ? (
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
                            <span className="chk-status checked"><i className="fa-solid fa-check"></i> Validação de Marcos Santos registrada</span>
                            <span className="chk-status checked"><i className="fa-solid fa-check"></i> Validação de Aline Souza registrada</span>
                            <span className={`chk-status ${oficinaConfirmacao.quoteConfirmed ? 'checked' : 'warning'}`}>
                              <i className={`fa-solid ${oficinaConfirmacao.quoteConfirmed ? 'fa-check' : 'fa-spinner fa-spin'}`}></i> Orçamento Oficina JN
                            </span>
                            {['evidence_review', 'validated', 'completed'].includes(cicloEstado) && (
                              <span className={`chk-status ${oficinaConfirmacao.serviceConfirmed ? 'checked' : 'warning'}`}>
                                <i className={`fa-solid ${oficinaConfirmacao.serviceConfirmed ? 'fa-check' : 'fa-spinner fa-spin'}`}></i> Validação de Serviço
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
                                placeholder="Descreva os motivos caso vá pedir revisão ou recusar."
                              />
                              <div className="admin-actions-row">
                                <button className="btn-admin btn-admin-approve" onClick={handleGestaoAprovar}>
                                  Aprovar Crédito Produtivo
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
                                <p>Comprovante técnico validado.</p>
                              </div>
                              <button className="btn-app btn-app-primary" style={{ background: 'var(--color-green)' }} onClick={handleGestaoConcluirCiclo}>
                                Fechar e Concluir Ciclo de Jornada
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
                      <h4>Governança de Risco</h4>
                      <div className="alert-log-item warning">
                        <i className="fa-solid fa-circle-info"></i>
                        <span>A IA apoia a análise. A decisão não é automática.</span>
                      </div>
                      <div className="alert-log-item warning">
                        <i className="fa-solid fa-triangle-exclamation"></i>
                        <span>Ciclo validado pela rede local sem inconsistências.</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Simulated Bottom Navigation Tab Bar (Hidden on onboarding/admin) */}
            {profileMode === 'membro' && membro && (
              <div className="mobile-tab-bar" id="app-tab-bar">
                <div 
                  className="tab-selection-indicator" 
                  style={{ transform: `translateX(${activeIndex * 100}%) translateZ(0)` }}
                />
                <button 
                  className={`tab-item ${activeTab === 'inicio' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('inicio')}>
                  <i className="fa-solid fa-house"></i>
                  <span>Início</span>
                </button>
                <button 
                  className={`tab-item ${activeTab === 'reputacao' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('reputacao')}>
                  <i className="fa-solid fa-chart-simple"></i>
                  <span>Reputação</span>
                </button>
                <button 
                  className={`tab-item ${activeTab === 'credito' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('credito')}>
                  <i className="fa-solid fa-route"></i>
                  <span>Carta de Corre</span>
                </button>
                <button 
                  className={`tab-item ${activeTab === 'rede' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('rede')}>
                  <i className="fa-solid fa-users"></i>
                  <span>Rede</span>
                </button>
                <button 
                  className={`tab-item ${activeTab === 'perfil' ? 'active' : ''}`} 
                  onClick={() => setActiveTab('perfil')}>
                  <i className="fa-solid fa-user"></i>
                  <span>Perfil</span>
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
