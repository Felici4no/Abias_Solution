import { useState, useEffect } from 'react'
import { apiFetch } from '../models/api.js'
import { syncCicloToState, getEstadoLabel } from '../models/cicloHelper.js'

export function useAppController() {
  const [membroId, setMembroId] = useState(() => localStorage.getItem('abias_membro_id'))
  const [cicloId, setCicloId] = useState(() => localStorage.getItem('abias_ciclo_id'))
  const [loading, setLoading] = useState(true)

  const [membro, setMembro] = useState(null)
  const [parecerAi, setParecerAi] = useState(null)
  const [solicitacao, setSolicitacao] = useState(null)
  const [cicloEstado, setCicloEstado] = useState('draft')
  const [reputacao, setReputacao] = useState(0)
  const [fundo, setFundo] = useState(4820)
  const [avaliacoes, setAvaliacoes] = useState({ marcos: 'pending', marcosComment: '', aline: 'pending', alineComment: '' })
  const [evidencia, setEvidencia] = useState({ file: '', obs: '', status: 'pending', type: '' })
  const [oficinaConfirmacao, setOficinaConfirmacao] = useState({ quoteConfirmed: false, serviceConfirmed: false, note: '' })
  const [gestaoJustificativa, setGestaoJustificativa] = useState('')
  const [analisandoIA, setAnalisandoIA] = useState(false)
  const [aiError, setAiError] = useState(null)

  const [loginRole, setLoginRole] = useState(() => localStorage.getItem('abias_login_role'))
  const [loginUsuario, setLoginUsuario] = useState(() => {
    try { return JSON.parse(localStorage.getItem('abias_usuario') || 'null') } catch { return null }
  })
  const [profileMode, setProfileMode] = useState(() => localStorage.getItem('abias_login_role') || 'membro')
  const [activeTab, setActiveTab] = useState('inicio')
  const [clockTime, setClockTime] = useState('00:00')
  const [showAreaOperacional, setShowAreaOperacional] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState('splash')

  const [inputNome, setInputNome] = useState(() => {
    try { return JSON.parse(localStorage.getItem('abias_usuario') || 'null')?.nome || '' } catch { return '' }
  })
  const [inputTelefone, setInputTelefone] = useState('(11) 98765-4321')
  const [inputRegiao, setInputRegiao] = useState('Zona Leste, São Paulo')
  const [inputTempo, setInputTempo] = useState('')
  const [inputFerramenta, setInputFerramenta] = useState('Moto')
  const [inputRaca, setInputRaca] = useState('')
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

  const _sync = (data) => syncCicloToState(
    data.ciclo, data.reputacao, data.fundo,
    setCicloId, setSolicitacao, setCicloEstado,
    setAvaliacoes, setEvidencia, setOficinaConfirmacao,
    setGestaoJustificativa, setReputacao, setFundo
  )

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!membroId) { setLoading(false); return }
    async function carregarEstado() {
      try {
        const { membro: m } = await apiFetch(`/abias/membros/${membroId}`)
        setMembro(m)
        setReputacao(m.reputacao)
        if (m.aiParecer)  setParecerAi(m.aiParecer)
        const { ciclo } = await apiFetch(`/abias/ciclos/ativo?membroId=${membroId}`)
        if (ciclo) _sync({ ciclo })
        const { fundo: f } = await apiFetch('/abias/fundo')
        setFundo(f.saldo)
      } catch {
        localStorage.removeItem('abias_membro_id')
        localStorage.removeItem('abias_ciclo_id')
        setMembroId(null)
        setCicloId(null)
      } finally {
        setLoading(false)
      }
    }
    carregarEstado()
  }, [membroId])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setClockTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 30000)
    return () => clearInterval(timer)
  }, [])

  const currentAmount     = solicitacao ? solicitacao.valor      : inputAmount
  const currentFinalidade = solicitacao ? solicitacao.finalidade : inputFinalidade
  const currentOficina    = solicitacao ? solicitacao.oficina    : inputOficina
  const currentPrazo      = solicitacao ? solicitacao.prazo      : inputPrazo
  const currentUrgencia   = solicitacao ? solicitacao.urgencia   : inputUrgencia
  const currentDescricao  = solicitacao ? solicitacao.descricao  : inputDescricao

  // ═══════════════════════════════════════════════════════════════════════════
  // PRODUTO 1 — CARTÃO ABIAS (crédito rotativo para compras do dia a dia)
  // Limite menor, pensado para gasto corrente + interchange nas transações
  // ═══════════════════════════════════════════════════════════════════════════
  const limiteCreditoCartao =
    reputacao === 0   ?    0 :
    reputacao >= 800  ? 1500 :
    reputacao >= 700  ?  900 :
    reputacao >= 600  ?  500 :
    reputacao >= 500  ?  250 : 120

  // Taxa rotativo do cartão (cobrada só se não pagar a fatura completa)
  const taxaRotativoCartao =
    reputacao >= 800 ? 0.079 :
    reputacao >= 700 ? 0.099 :
    reputacao >= 600 ? 0.119 :
    reputacao >= 500 ? 0.139 : 0.159

  // Cashback acumulado: R$ 2,00 por compra em território comunitário
  // Vem direto do banco — novo membro começa em R$ 0,00
  const TETO_CASHBACK      = 200
  const cashbackSaldo      = membro?.cashbackSaldo ?? 0
  const cashbackPct        = 0.015  // referência interna de percentual

  // ═══════════════════════════════════════════════════════════════════════════
  // PRODUTO 2 — EMPRÉSTIMO PRODUTIVO (moto, equipamento, documentação)
  // Processo: solicitação → validação comunitária → liberação para oficina
  // ═══════════════════════════════════════════════════════════════════════════
  const limiteEmprestimo =
    reputacao === 0   ?    0 :
    reputacao >= 800  ? 3000 :
    reputacao >= 700  ? 2000 :
    reputacao >= 600  ? 1200 :
    reputacao >= 500  ?  700 : 400

  // Taxa de juros mensal do empréstimo por faixa de risco
  const taxaMensalJuros =
    reputacao >= 800 ? 0.025 :
    reputacao >= 700 ? 0.035 :
    reputacao >= 600 ? 0.045 :
    reputacao >= 500 ? 0.055 : 0.070

  // Manter limiteCredito apontando para empréstimo (usado no CreditoScreen)
  const limiteCredito = limiteEmprestimo

  // ═══════════════════════════════════════════════════════════════════════════
  // ESTADOS DE AVALIAÇÃO
  // foiAvaliado  = IA já rodou (avaliadoEm preenchido)
  // foiNegado    = IA rodou, deu NEGAR, score continua 0
  // motivoNegacao = texto direto ao membro explicando a recusa
  // ═══════════════════════════════════════════════════════════════════════════
  const foiAvaliado   = !!membro?.avaliadoEm
  const foiNegado     = foiAvaliado && reputacao === 0 && parecerAi?.recomendacao === 'NEGAR'
  const motivoNegacao = foiNegado
    ? (parecerAi?.motivoNegacao || parecerAi?.analise || 'Seu perfil operacional atual não atende os critérios mínimos de crédito.')
    : null

  // ═══════════════════════════════════════════════════════════════════════════
  // MÉTRICAS OPERACIONAIS — derivadas dos dados reais do iFood
  // ═══════════════════════════════════════════════════════════════════════════
  const dadosOp  = membro?.dadosOperacionais || null
  const rankingOp = membro?.rankingOperacional || null

  // Consistência = dias ativos nos últimos 90 dias
  const consistenciaRota = dadosOp ? Math.round((dadosOp.diasAtivos / 90) * 100) : 0

  // Entregas por dia útil trabalhado
  const entregasPorDia = dadosOp && dadosOp.diasAtivos > 0
    ? Math.round(dadosOp.entregasRealizadas / dadosOp.diasAtivos)
    : 0

  // Ranking na rede: percentil_ranking = posição ascendente → Top X% = 100 - percentil
  const topPct = rankingOp ? Math.round(100 - rankingOp.percentilRanking) : null

  // Classificação iFood: EXCELENTE / BOM / REGULAR / BASICO
  const classificacao = rankingOp?.classificacao || null

  // Sparkline baseada em dados reais: shape pela taxa de cancelamento, height pelo score
  const sparkYs = reputacao === 0 || !dadosOp
    ? Array(10).fill(2)
    : (() => {
        const peak = Math.max(5, Math.min(85, (reputacao / 1000) * 85))
        const cancelPenalty = dadosOp.taxaCancelamento * 8  // dip proporcional aos cancelamentos
        return [0.25, 0.28, 0.22, 0.38, 0.47, 0.58, 0.66, 0.78, 0.89, 1.00].map((r, i) => {
          const dip = i % 2 === 1 ? cancelPenalty * 0.12 : 0
          return Math.round(Math.max(2, peak * (r - dip)))
        })
      })()

  // Taxa de originação: 2% flat (custo operacional, pago pelo membro)
  const TAXA_ORIGINACAO  = 0.02
  // Interchange: 3% descontado da oficina (principal receita da Abias)
  const TAXA_INTERCHANGE = 0.03

  const prazoNum        = Number(currentPrazo) || 30
  const numParcelas     = prazoNum <= 7 ? 1 : prazoNum <= 15 ? 2 : prazoNum <= 30 ? 4 : 6

  const valorOriginacao      = currentAmount * TAXA_ORIGINACAO
  const valorJuros           = currentAmount * taxaMensalJuros * (prazoNum / 30)
  const totalMembro          = currentAmount + valorOriginacao + valorJuros
  const parcelasValor        = (totalMembro / numParcelas).toFixed(2)
  const valorLiberadoOficina = currentAmount * (1 - TAXA_INTERCHANGE)

  // Receita Abias por ciclo de empréstimo
  const receitaInterchange = currentAmount * TAXA_INTERCHANGE
  const receitaOriginacao  = valorOriginacao
  const receitaJuros       = valorJuros
  const receitaTotal       = receitaInterchange + receitaOriginacao + receitaJuros
  const receitaFundo       = receitaTotal * 0.40
  const receitaOperacoes   = receitaTotal * 0.60

  const currentStatus = getEstadoLabel(cicloEstado)
  const tabIds = ['inicio', 'reputacao', 'credito', 'rede', 'perfil']
  const activeIndex = tabIds.indexOf(activeTab)

  const handleCadastro = async (e) => {
    e.preventDefault()
    if (!inputAceite) { alert('Você precisa aceitar o uso de dados para entrar na comunidade.'); return }
    try {
      const { membro: m } = await apiFetch('/abias/membros', {
        method: 'POST',
        body: { nome: inputNome, telefone: inputTelefone, regiao: inputRegiao, tempo: inputTempo === '1' ? '1 ano' : inputTempo === '11' ? 'Mais de 10 anos' : `${inputTempo} anos`, ferramenta: inputFerramenta, raca: inputRaca }
      })
      setMembro(m)
      setMembroId(m.id)
      setReputacao(m.reputacao)
      localStorage.setItem('abias_membro_id', m.id)
      // Avaliação IA: dispara em paralelo sem bloquear o fluxo
      apiFetch(`/abias/membros/${m.id}/avaliar`, { method: 'POST' })
        .then(({ membro: avMembro, parecer }) => {
          if (avMembro) { setMembro(avMembro); setReputacao(avMembro.reputacao) }
          if (parecer) setParecerAi(parecer)
        })
        .catch(() => {})
      // Vincular membro ao usuário autenticado
      if (loginUsuario?.id) {
        try {
          const { usuario: u } = await apiFetch(`/abias/auth/usuarios/${loginUsuario.id}/membro`, {
            method: 'PATCH',
            body: { membroId: m.id }
          })
          setLoginUsuario(u)
          localStorage.setItem('abias_usuario', JSON.stringify(u))
        } catch { /* não bloqueia o fluxo */ }
      }
      setCicloEstado('draft')
      setActiveTab('inicio')
    } catch (err) { alert('Erro ao registrar membro: ' + err.message) }
  }

  const handleSolicitacaoSubmit = async (e) => {
    e.preventDefault()
    try {
      const data = await apiFetch('/abias/ciclos', {
        method: 'POST',
        body: { membroId, valor: Number(inputAmount), finalidade: inputFinalidade, prazo: inputPrazo, oficina: inputOficina, urgencia: inputUrgencia, descricao: inputDescricao }
      })
      _sync(data)
    } catch (err) { alert('Erro ao criar solicitação: ' + err.message) }
  }

  const handleConfirmarPlano = async () => {
    try { _sync(await apiFetch(`/abias/ciclos/${cicloId}/estado`, { method: 'PATCH', body: { estado: 'community_validation' } })) }
    catch (err) { alert('Erro: ' + err.message) }
  }

  const handleMarcosAval = async () => {
    try { _sync(await apiFetch(`/abias/ciclos/${cicloId}/avais`, { method: 'POST', body: { avaliadoPor: 'marcos', comentario: 'João é parceiro de confiança, conheço a rota dele na Zona Leste.' } })) }
    catch (err) { alert('Erro: ' + err.message) }
  }

  const handleAlineAval = async () => {
    try { _sync(await apiFetch(`/abias/ciclos/${cicloId}/avais`, { method: 'POST', body: { avaliadoPor: 'aline', comentario: 'Grande profissional de entrega. Corre garantido no asfalto.' } })) }
    catch (err) { alert('Erro: ' + err.message) }
  }

  const handleOficinaConfirmarOrcamento = async () => {
    try { _sync(await apiFetch(`/abias/ciclos/${cicloId}/confirmacoes`, { method: 'POST', body: { tipo: 'orcamento' } })) }
    catch (err) { alert('Erro: ' + err.message) }
  }

  const handleGestaoAprovar = async () => {
    try { _sync(await apiFetch(`/abias/ciclos/${cicloId}/estado`, { method: 'PATCH', body: { estado: 'approved' } })) }
    catch (err) { alert('Erro: ' + err.message) }
  }

  const handleGestaoPedirRevisao = async () => {
    if (!adminJustifyInput.trim()) { alert('Por favor, descreva o que precisa ser revisado.'); return }
    try {
      _sync(await apiFetch(`/abias/ciclos/${cicloId}/estado`, { method: 'PATCH', body: { estado: 'needs_revision', justificativa: adminJustifyInput } }))
      setAdminJustifyInput('')
    } catch (err) { alert('Erro: ' + err.message) }
  }

  const handleGestaoRecusar = async () => {
    if (!adminJustifyInput.trim()) { alert('Por favor, insira o motivo da recusa.'); return }
    try {
      _sync(await apiFetch(`/abias/ciclos/${cicloId}/estado`, { method: 'PATCH', body: { estado: 'rejected', justificativa: adminJustifyInput } }))
      setAdminJustifyInput('')
    } catch (err) { alert('Erro: ' + err.message) }
  }

  const handleAnexarRecibo = () => { setUploadFileSelected('recibo_oficina_jn.jpg'); setUploadFileType('recibo') }
  const handleAnexarFoto   = () => { setUploadFileSelected('foto_pneu_instalado.jpg'); setUploadFileType('foto') }

  const handleEnviarEvidencia = async () => {
    if (!uploadFileSelected) { alert('Selecione ou tire uma foto do serviço para envio.'); return }
    try { _sync(await apiFetch(`/abias/ciclos/${cicloId}/evidencias`, { method: 'POST', body: { arquivo: uploadFileSelected, observacao: uploadFileObs, tipo: uploadFileType } })) }
    catch (err) { alert('Erro ao enviar evidência: ' + err.message) }
  }

  const handleOficinaConfirmarServico = async () => {
    try { _sync(await apiFetch(`/abias/ciclos/${cicloId}/confirmacoes`, { method: 'POST', body: { tipo: 'servico' } })) }
    catch (err) { alert('Erro: ' + err.message) }
  }

  const handleGestaoConcluirCiclo = async () => {
    try { _sync(await apiFetch(`/abias/ciclos/${cicloId}/estado`, { method: 'PATCH', body: { estado: 'completed' } })) }
    catch (err) { alert('Erro: ' + err.message) }
  }

  const handlePedirAnalise = async () => {
    if (!membroId || analisandoIA) return
    if (!membro?.dadosOperacionais) {
      setAiError('Dados operacionais insuficientes: não é possível gerar decisão automática para membros sem dados iFood vinculados.')
      return
    }
    setAnalisandoIA(true)
    setAiError(null)
    try {
      const { membro: avMembro, parecer } = await apiFetch(`/abias/membros/${membroId}/avaliar`, { method: 'POST' })
      if (avMembro) { setMembro(avMembro); setReputacao(avMembro.reputacao) }
      if (parecer) setParecerAi(parecer)
    } catch (err) {
      if (err?.message?.includes('Dados operacionais insuficientes')) {
        setAiError(err.message)
      } else {
        alert('Erro ao solicitar análise: ' + err.message)
      }
    } finally {
      setAnalisandoIA(false)
    }
  }

  const handleNovoCiclo = () => {
    setCicloId(null)
    localStorage.removeItem('abias_ciclo_id')
    setSolicitacao(null)
    setAvaliacoes({ marcos: 'pending', marcosComment: '', aline: 'pending', alineComment: '' })
    setEvidencia({ file: '', obs: '', status: 'pending', type: '' })
    setOficinaConfirmacao({ quoteConfirmed: false, serviceConfirmed: false, note: '' })
    setGestaoJustificativa('')
    setCicloEstado('draft')
    setActiveTab('credito')
  }

  const handleResetDemo = () => {
    localStorage.clear()
    setMembro(null); setMembroId(null); setCicloId(null); setLoginUsuario(null)
    setOnboardingStep('splash'); setSolicitacao(null); setCicloEstado('draft')
    setReputacao(0); setFundo(4820)
    setAvaliacoes({ marcos: 'pending', marcosComment: '', aline: 'pending', alineComment: '' })
    setEvidencia({ file: '', obs: '', status: 'pending', type: '' })
    setOficinaConfirmacao({ quoteConfirmed: false, serviceConfirmed: false, note: '' })
    setGestaoJustificativa('')
    setInputNome('João Silva'); setInputTelefone('(11) 98765-4321')
    setInputRegiao('Zona Leste, São Paulo'); setInputTempo('')
    setInputFerramenta('Moto'); setInputRaca(''); setInputAceite(true)
    setInputAmount(850); setInputFinalidade('Pneu + Revisão')
    setInputPrazo('30'); setInputOficina('Oficina JN')
    setInputUrgencia('Alta')
    setInputDescricao('Preciso trocar o pneu traseiro careca e fazer revisão básica da suspensão para continuar rodando com segurança.')
    setUploadFileSelected(''); setUploadFileType(''); setUploadFileObs('')
    setAdminJustifyInput('')
    setProfileMode('membro'); setActiveTab('inicio')
    alert('Os dados locais foram limpos!')
  }

  const handleLogin = (role, usuario) => {
    setLoginRole(role)
    setProfileMode(role)
    localStorage.setItem('abias_login_role', role)
    if (usuario) {
      setLoginUsuario(usuario)
      localStorage.setItem('abias_usuario', JSON.stringify(usuario))
      if (usuario.membro_id) {
        setMembroId(usuario.membro_id)
        localStorage.setItem('abias_membro_id', usuario.membro_id)
      } else {
        // Novo usuário sem membro vinculado — garante que não carrega dados de outro login
        setMembroId(null)
        setMembro(null)
        setParecerAi(null)
        setReputacao(0)
        localStorage.removeItem('abias_membro_id')
        localStorage.removeItem('abias_ciclo_id')
      }
    }
  }

  const handleLogout = () => {
    setLoginRole(null)
    setLoginUsuario(null)
    setMembro(null)
    setMembroId(null)
    setParecerAi(null)
    setReputacao(0)
    setCicloEstado('draft')
    setSolicitacao(null)
    setProfileMode('membro')
    localStorage.removeItem('abias_login_role')
    localStorage.removeItem('abias_usuario')
    localStorage.removeItem('abias_membro_id')
    localStorage.removeItem('abias_ciclo_id')
  }

  return {
    loginRole,
    loginUsuario,
    handleLogin,
    handleLogout,
    loading, membro, membroId, parecerAi, cicloEstado, reputacao, fundo,
    avaliacoes, evidencia, oficinaConfirmacao, gestaoJustificativa,
    profileMode, setProfileMode,
    activeTab, setActiveTab,
    clockTime,
    showAreaOperacional, setShowAreaOperacional,
    onboardingStep, setOnboardingStep,
    inputNome, setInputNome,
    inputTelefone, setInputTelefone,
    inputRegiao, setInputRegiao,
    inputTempo, setInputTempo,
    inputFerramenta, setInputFerramenta,
    inputRaca, setInputRaca,
    inputAceite, setInputAceite,
    inputAmount, setInputAmount,
    inputFinalidade, setInputFinalidade,
    inputPrazo, setInputPrazo,
    inputOficina, setInputOficina,
    inputUrgencia, setInputUrgencia,
    inputDescricao, setInputDescricao,
    uploadFileSelected, setUploadFileSelected,
    uploadFileType, setUploadFileType,
    uploadFileObs, setUploadFileObs,
    adminJustifyInput, setAdminJustifyInput,
    currentAmount, currentFinalidade, currentOficina,
    currentPrazo, currentUrgencia, currentDescricao,
    limiteCreditoCartao, taxaRotativoCartao,
    cashbackSaldo, cashbackPct, TETO_CASHBACK,
    limiteEmprestimo, limiteCredito, taxaMensalJuros,
    foiAvaliado, foiNegado, motivoNegacao,
    dadosOp, rankingOp, consistenciaRota, entregasPorDia, topPct, classificacao, sparkYs,
    valorOriginacao, valorJuros, totalMembro,
    parcelasValor, numParcelas,
    valorLiberadoOficina,
    receitaTotal, receitaFundo, receitaOperacoes, receitaInterchange,
    currentStatus, activeIndex,
    analisandoIA, aiError, handlePedirAnalise,
    handleCadastro, handleSolicitacaoSubmit, handleConfirmarPlano,
    handleMarcosAval, handleAlineAval,
    handleOficinaConfirmarOrcamento,
    handleGestaoAprovar, handleGestaoPedirRevisao, handleGestaoRecusar,
    handleAnexarRecibo, handleAnexarFoto, handleEnviarEvidencia,
    handleOficinaConfirmarServico, handleGestaoConcluirCiclo,
    handleNovoCiclo, handleResetDemo,
    getEstadoLabel,
  }
}
