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
    alert('O ambiente piloto do MVP foi reiniciado!')
  }

  // Helper para tradução amigável do estado
  const getEstadoLabel = (state) => {
    const dict = {
      draft: { label: 'Inativo', step: 'Solicitar crédito de rota para iniciar' },
      submitted: { label: 'Plano Sugerido', step: 'Confirmar os termos do plano comunitário' },
      community_validation: { label: 'Validação da Rede', step: 'Acompanhar validação da rede (Marcos e Aline)' },
      partner_quote: { label: 'Aguardando Orçamento', step: 'Oficina JN confirmando valores' },
      under_review: { label: 'Em Análise', step: 'Aguardando validação da Gestão Abias' },
      approved: { label: 'Aprovado', step: 'Recurso liberado para a manutenção' },
      evidence_pending: { label: 'Comprovação Pendente', step: 'Enviar comprovantes na aba Evidências' },
      evidence_review: { label: 'Evidência em Análise', step: 'Oficina JN validando serviço realizado' },
      validated: { label: 'Serviço Validado', step: 'Aguardando finalização pela Gestão Abias' },
      completed: { label: 'Ciclo Concluído', step: 'Parabéns! Sua reputação subiu' },
      needs_revision: { label: 'Revisão Solicitada', step: 'Editar dados conforme indicado pela gestão' },
      rejected: { label: 'Recusado', step: 'Ciclo encerrado sem aprovação' }
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
            <i className="fa-solid fa-route"></i> Solicitar crédito de rota
          </button>
        )
      case 'community_validation':
        return (
          <button className="btn-app btn-app-primary" onClick={() => setActiveTab('credito')}>
            <i className="fa-solid fa-users-double"></i> Acompanhar validação da rede
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
          <h1>Abias</h1>
          <p>MVP Operacional — Rede Piloto</p>
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
                      <p>Área operacional do MVP local. Use apenas para alternar perfis e validar o ciclo.</p>
                    </div>
                    
                    <div className="area-operacional-content">
                      <div className="area-operacional-info-card">
                        <p><strong>Membro:</strong> {membro ? membro.nome : 'Não cadastrado'}</p>
                        <p><strong>Estado do Ciclo:</strong> <span className="font-mono">{getEstadoLabel(cicloEstado).label}</span></p>
                        <p><strong>Reputação de Rota:</strong> <span className="font-mono">{reputacao}/1000</span></p>
                        <p><strong>Fundo Abias:</strong> <span className="font-mono">R$ {fundo.toFixed(2)}</span></p>
                      </div>

                      <div className="area-operacional-actions">
                        <button 
                          className="btn-app btn-app-primary"
                          style={{ 
                            background: profileMode === 'membro' ? 'var(--color-green)' : 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-color)' 
                          }}
                          onClick={() => { setProfileMode('membro'); setShowAreaOperacional(false); }}>
                          Acessar Modo Membro {profileMode === 'membro' && '✓'}
                        </button>
                        <button 
                          className="btn-app btn-app-primary"
                          style={{ 
                            background: profileMode === 'oficina' ? 'var(--color-gold)' : 'rgba(255,255,255,0.03)', 
                            color: profileMode === 'oficina' ? '#0b0b0b' : '#ffffff',
                            border: '1px solid var(--border-color)'
                          }}
                          onClick={() => { setProfileMode('oficina'); setShowAreaOperacional(false); }}>
                          Acessar Modo Oficina {profileMode === 'oficina' && '✓'}
                        </button>
                        <button 
                          className="btn-app btn-app-primary"
                          style={{ 
                            background: profileMode === 'gestao' ? 'var(--color-terra)' : 'rgba(255,255,255,0.03)',
                            border: '1px solid var(--border-color)'
                          }}
                          onClick={() => { setProfileMode('gestao'); setShowAreaOperacional(false); }}>
                          Acessar Modo Gestão {profileMode === 'gestao' && '✓'}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="area-operacional-footer">
                    <button 
                      className="btn-app btn-app-secondary" 
                      style={{ color: 'var(--danger)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                      onClick={handleResetDemo}>
                      Limpar dados locais
                    </button>
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
                            <h2 className="splash-title" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '14px' }}>O PODER DA TUA ROTA</h2>
                            <p className="splash-subtitle" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', maxWidth: '280px', margin: '0 auto' }}>
                              Quando a moto para, a renda para. Crédito produtivo validado para manter sua ferramenta de trabalho funcionando.
                            </p>
                          </div>
                          <div style={{ width: '100%', paddingBottom: '20px', zIndex: 2 }}>
                            <button className="btn-app btn-app-primary" onClick={() => setOnboardingStep('benefits')}>
                              Entrar no fluxo <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
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
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.15', marginBottom: '8px' }}>CONFIANÇA QUE GERA CAPITAL</h2>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
                              A comunidade ajuda a provar o que o banco não enxerga. A Abias transforma sua reputação de asfalto e cooperação em fomento para o seu corre.
                            </p>
                            
                            <div className="benefits-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                              <div className="benefit-item-box" style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '1.2rem', color: 'var(--color-gold)' }}><i className="fa-solid fa-chart-simple"></i></div>
                                <div>
                                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '2px' }}>Reputação de Rota</h4>
                                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>Seu corre diário e consistência no asfalto valem mais do que score de CPF.</p>
                                </div>
                              </div>
                              
                              <div className="benefit-item-box" style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '1.2rem', color: 'var(--color-gold)' }}><i className="fa-solid fa-route"></i></div>
                                <div>
                                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '2px' }}>Crédito de Rota</h4>
                                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>Fomento produtivo de R$ 300 a R$ 3.000 exclusivo para manter sua ferramenta ativa.</p>
                                </div>
                              </div>
                              
                              <div className="benefit-item-box" style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)' }}>
                                <div style={{ fontSize: '1.2rem', color: 'var(--color-gold)' }}><i className="fa-solid fa-users"></i></div>
                                <div>
                                  <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '2px' }}>Rede de Oficinas Parceiras</h4>
                                  <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>Manutenção e peças com orçamento confirmado e serviço validado localmente.</p>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div style={{ width: '100%', marginTop: '10px' }}>
                            <button className="btn-app btn-app-primary" onClick={() => setOnboardingStep('form')}>
                              Começar Cadastro <i className="fa-solid fa-chevron-right" style={{ marginLeft: '4px' }}></i>
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
                            O banco vê um CPF.<br />A Abias vê uma rota.
                          </h2>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px' }}>
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
                                Concordo com os termos de consentimento e aceito o compartilhamento de rota comunitária da Abias.
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
                                <span className="greeting-sub">Sua rota também é reputação</span>
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
                                <span>Fundo Abias: <strong>R$ {fundo.toFixed(2)}</strong> em reserva piloto</span>
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
                                <i className="fa-solid fa-triangle-exclamation"></i> Enviar Comprovantes de Rota
                              </h4>
                              <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: '1.4' }}>
                                Forneça a comprovação técnica da manutenção do veículo (troca do pneu ou revisão realizada) para validar seu fomento.
                              </p>
                              
                              <div className="upload-methods" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
                                <div 
                                  className="upload-box-action" 
                                  onClick={handleSimularFoto} 
                                  style={{ padding: '12px 8px', border: uploadFileType === 'foto' ? '1px solid var(--color-gold)' : '1px solid var(--border-color)', background: 'rgba(0,0,0,0.2)' }}>
                                  <div className="box-icon" style={{ fontSize: '1rem' }}><i className="fa-solid fa-camera"></i></div>
                                  <span style={{ fontSize: '0.65rem' }}>Foto do Pneu Instalado</span>
                                </div>
                                <div 
                                  className="upload-box-action" 
                                  onClick={handleSimularRecibo} 
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
                                        <h5 style={{ fontSize: '0.75rem', fontWeight: 800 }}>Crédito de Rota Solicitado</h5>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>Fomento de R$ {currentAmount} para {currentFinalidade} registrado.</p>
                                      </div>
                                    </div>
                                  )}
                                  {avaliacoes.marcos === 'approved' && (
                                    <div className="activity-item-card" style={{ display: 'flex', gap: '10px', padding: '12px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)' }}>
                                      <div className="activity-icon-badge" style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: 'var(--success)' }}><i className="fa-solid fa-signature"></i></div>
                                      <div>
                                        <h5 style={{ fontSize: '0.75rem', fontWeight: 800 }}>Aval de Marcos Santos Emitido</h5>
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
                            <h3>Reputação de Rota</h3>
                          </div>
                          
                          <div className="reputacao-container">
                            <div className="reputacao-score-box glass" style={{ position: 'relative', overflow: 'hidden' }}>
                              <div className="card-glow" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)', width: '160px', height: '160px', background: 'rgba(201, 154, 61, 0.06)', filter: 'blur(34px)', borderRadius: '50%' }}></div>
                              <span className="lbl-tag">PONTUAÇÃO COLETIVA</span>
                              <div className="reputacao-number-row font-mono">
                                <span className="val">{reputacao}</span>
                                <span className="max">/1000</span>
                              </div>
                              <div className="reputacao-level">
                                <i className="fa-solid fa-shield-halved" style={{ color: 'var(--color-gold)', marginRight: '6px' }}></i>
                                {reputacao <= 720 ? 'Confiança Rota A2' : reputacao <= 745 ? 'Confiança Rota A2+' : 'Confiança Rota A3'}
                              </div>
                              <p className="reputacao-desc">
                                Seu score representa a integridade de suas rotas e a validação mútua dos parceiros. Evite motos paradas e preserve sua ficha local.
                              </p>
                            </div>

                            <div className="reputacao-factors-list">
                              <h4>Fatores de Crescimento</h4>
                              
                              <div className="factor-progress-item">
                                <div className="factor-lbl">
                                  <span>Frequência Operacional</span>
                                  <span className="percent font-mono">92%</span>
                                </div>
                                <div className="progress-track">
                                  <div className="progress-bar" style={{ width: '92%', backgroundColor: 'var(--color-green)' }}></div>
                                </div>
                              </div>

                              <div className="factor-progress-item">
                                <div className="factor-lbl">
                                  <span>Confiança Comunitária (Avais)</span>
                                  <span className="percent font-mono">{avaliacoes.marcos === 'approved' && avaliacoes.aline === 'approved' ? '100%' : avaliacoes.marcos === 'approved' || avaliacoes.aline === 'approved' ? '50%' : '0%'}</span>
                                </div>
                                <div className="progress-track">
                                  <div className="progress-bar" style={{ width: avaliacoes.marcos === 'approved' && avaliacoes.aline === 'approved' ? '100%' : avaliacoes.marcos === 'approved' || avaliacoes.aline === 'approved' ? '50%' : '0%', backgroundColor: 'var(--color-gold)' }}></div>
                                </div>
                              </div>

                              <div className="factor-progress-item">
                                <div className="factor-lbl">
                                  <span>Consistência de Rota</span>
                                  <span className="percent font-mono">88%</span>
                                </div>
                                <div className="progress-track">
                                  <div className="progress-bar" style={{ width: '88%', backgroundColor: 'var(--color-terra)' }}></div>
                                </div>
                              </div>

                              <div className="factor-progress-item">
                                <div className="factor-lbl">
                                  <span>Comprovação de Uso (Evidências)</span>
                                  <span className="percent font-mono">{['evidence_review', 'validated', 'completed'].includes(cicloEstado) ? '100%' : '0%'}</span>
                                </div>
                                <div className="progress-track">
                                  <div className="progress-bar" style={{ width: ['evidence_review', 'validated', 'completed'].includes(cicloEstado) ? '100%' : '0%', backgroundColor: 'var(--color-gold)' }}></div>
                                </div>
                              </div>
                            </div>

                            <div className="how-to-improve-card glass">
                              <h4>Histórico de Conquistas</h4>
                              <ul className="bullet-list-mobile">
                                <li><i className="fa-solid fa-award text-success"></i> <strong>Corre Histórico</strong>: 4 anos de asfalto cadastrados.</li>
                                <li><i className="fa-solid fa-award text-success"></i> <strong>Voto Comunitário</strong>: Indicado por 2 avalistas da rede.</li>
                                {['validated', 'completed'].includes(cicloEstado) && (
                                  <li><i className="fa-solid fa-award text-success"></i> <strong>Ficha Limpa JN</strong>: Oficina parceira validada sem divergências.</li>
                                )}
                              </ul>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* TAB 3: CRÉDITO */}
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
                                  <p><strong>Não é empréstimo livre. É crédito produtivo validado.</strong> O recurso é exclusivo para despesas da sua ferramenta de trabalho.</p>
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
                                  <label className="form-label">Descrição da necessidade</label>
                                  <textarea 
                                    className="form-textarea" 
                                    value={inputDescricao} 
                                    onChange={(e) => setInputDescricao(e.target.value)} 
                                    placeholder="Explique porque o serviço é necessário para continuar as entregas."
                                    required
                                  />
                                </div>

                                <button type="submit" className="btn-app btn-app-primary">
                                  Gerar plano de fomento
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
                                  <span><i className="fa-solid fa-triangle-exclamation"></i> Plano comunitário sugerido. Sujeito à validação.</span>
                                </div>

                                {/* Slip Card */}
                                <div className="premium-credit-card compact-slip" style={{ position: 'relative', overflow: 'hidden' }}>
                                  <div className="card-brand-row">
                                    <span className="card-brand">Abias</span>
                                    <span className="card-contactless"><i className="fa-solid fa-receipt"></i> COMPROVANTE OPERACIONAL</span>
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
                                    Editar fomento
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
                                        <i className="fa-solid fa-signature"></i> Confirmar Aval de Marcos
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
                                        <i className="fa-solid fa-signature"></i> Confirmar Aval de Aline
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
                                <h3>Status do Fomento</h3>
                              </div>
                              <div className="plano-container">
                                <div className="milestone-card glass">
                                  <span className="lbl-milestone">ETAPA DO CICLO DE CRÉDITO</span>
                                  <h4 style={{ margin: 0 }}>{getEstadoLabel(cicloEstado).label}</h4>
                                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                                    {getEstadoLabel(cicloEstado).step}
                                  </p>
                                </div>

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
                                      <span className="slip-label">FINALIDADE PRODUTIVA</span>
                                      <span className="slip-value">{currentFinalidade}</span>
                                    </div>
                                    <div className="slip-row">
                                      <span className="slip-label">OFICINA VINCULADA</span>
                                      <span className="slip-value">{currentOficina}</span>
                                    </div>
                                    <div className="slip-row">
                                      <span className="slip-label">RETORNO ACORDADO</span>
                                      <span className="slip-value">4x de R$ {new Intl.NumberFormat('pt-BR').format(parcelasValor)}</span>
                                    </div>
                                  </div>
                                  <div className="slip-footer">
                                    <div className="slip-badge">FOMENTO ATIVO</div>
                                    <span className="slip-amount">R$ {currentAmount.toFixed(2)}</span>
                                  </div>
                                </div>

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
                              <span className="section-tag tag-yellow">FUNDO ABIAS — AMBIENTE PILOTO</span>
                              <h2>Crédito circular. Proteção territorial.</h2>
                              <p>O crédito entra na rede e volta como proteção coletiva. Os retornos de sustentabilidade alimentam a reserva de rotas para assegurar novos fomentos locais.</p>
                            </div>

                            <div className="fundo-reserve-card glass">
                              <span className="lbl">Saldo da Reserva Comunitária</span>
                              <div className="amount-val font-mono">R$ {fundo.toFixed(2)}</div>
                              <div className="fundo-bar-wrapper">
                                <div className="fundo-bar-fill-mobile" style={{ width: `${Math.min(100, (fundo / 8000) * 100)}%` }}></div>
                              </div>
                              <span className="fundo-subtext-meta">Meta de blindagem do piloto: R$ 8.000,00</span>
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
                                  <span style={{ fontWeight: 700, color: 'var(--color-gold)' }}>1. Crédito na Rede</span>
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Fomento produtivo para a moto.</span>
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
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Recursos circulam nos comércios da rota.</span>
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
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Membro segue rodando e gerando renda.</span>
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
                                  <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Retorno de taxa blindando o fundo piloto.</span>
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
                            <h3>Perfil da Rota</h3>
                          </div>
                          
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
                              <h4 style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: 800 }}>Conquistas da Rota</h4>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', textAlign: 'center' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 4px', border: '1px solid var(--border-color)' }}>
                                  <i className="fa-solid fa-users" style={{ color: 'var(--color-gold)', fontSize: '1rem', marginBottom: '4px' }}></i>
                                  <h6 style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ffffff' }}>Avalista</h6>
                                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Validado</span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 4px', border: '1px solid var(--border-color)' }}>
                                  <i className="fa-solid fa-check-double" style={{ color: 'var(--success)', fontSize: '1rem', marginBottom: '4px' }}></i>
                                  <h6 style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ffffff' }}>Ficha Limpa</h6>
                                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>100% Evidência</span>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '10px 4px', border: '1px solid var(--border-color)' }}>
                                  <i className="fa-solid fa-vault" style={{ color: 'var(--color-terra)', fontSize: '1rem', marginBottom: '4px' }}></i>
                                  <h6 style={{ fontSize: '0.65rem', fontWeight: 800, color: '#ffffff' }}>Builder</h6>
                                  <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>Reserva local</span>
                                </div>
                              </div>
                            </div>

                            <div className="how-to-improve-card glass" style={{ padding: '16px' }}>
                              <h4 style={{ fontSize: '0.8rem', color: 'var(--color-gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px', fontWeight: 800 }}>Depoimentos e Avais Comunitários</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem' }}>
                                    <strong>Marcos Santos</strong>
                                    <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓ Rota Validada</span>
                                  </div>
                                  <p style={{ fontSize: '0.72rem', fontStyle: 'italic', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                                    "João é parceiro de confiança, conheço a rota dele na Zona Leste."
                                  </p>
                                </div>
                                <div style={{ background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)' }}>
                                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem' }}>
                                    <strong>Aline Souza</strong>
                                    <span style={{ color: 'var(--success)', fontWeight: 800 }}>✓ Rota Validada</span>
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
                      <p>Nenhuma solicitação de fomento vinculada à Oficina JN no momento.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div className="milestone-card glass">
                        <span className="lbl-milestone">OFICINA JN</span>
                        <h4 style={{ marginBottom: '8px' }}>Solicitação de fomento de {membro?.nome || 'João Silva'}</h4>
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
                        <span className="lbl">Fundo Operacional</span>
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
                            <span className="chk-status checked"><i className="fa-solid fa-check"></i> Rota Validada Comunidade</span>
                            <span className="chk-status checked"><i className="fa-solid fa-check"></i> Aval de Marcos Santos</span>
                            <span className="chk-status checked"><i className="fa-solid fa-check"></i> Aval de Aline Souza</span>
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
                                <p>Comprovante técnico validado.</p>
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
                  <span>Crédito</span>
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
