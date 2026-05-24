import { useState, useEffect } from 'react'
import { apiFetch } from '../models/api.js'
import { syncCicloToState, getEstadoLabel } from '../models/cicloHelper.js'

export function useAppController() {
  const [membroId, setMembroId] = useState(() => localStorage.getItem('abias_membro_id'))
  const [cicloId, setCicloId] = useState(() => localStorage.getItem('abias_ciclo_id'))
  const [loading, setLoading] = useState(true)

  const [membro, setMembro] = useState(null)
  const [solicitacao, setSolicitacao] = useState(null)
  const [cicloEstado, setCicloEstado] = useState('draft')
  const [reputacao, setReputacao] = useState(720)
  const [fundo, setFundo] = useState(4820)
  const [avaliacoes, setAvaliacoes] = useState({ marcos: 'pending', marcosComment: '', aline: 'pending', alineComment: '' })
  const [evidencia, setEvidencia] = useState({ file: '', obs: '', status: 'pending', type: '' })
  const [oficinaConfirmacao, setOficinaConfirmacao] = useState({ quoteConfirmed: false, serviceConfirmed: false, note: '' })
  const [gestaoJustificativa, setGestaoJustificativa] = useState('')

  const [profileMode, setProfileMode] = useState('membro')
  const [activeTab, setActiveTab] = useState('inicio')
  const [clockTime, setClockTime] = useState('00:00')
  const [showAreaOperacional, setShowAreaOperacional] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState('splash')

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

  const _sync = (data) => syncCicloToState(
    data.ciclo, data.reputacao, data.fundo,
    setCicloId, setSolicitacao, setCicloEstado,
    setAvaliacoes, setEvidencia, setOficinaConfirmacao,
    setGestaoJustificativa, setReputacao, setFundo
  )

  useEffect(() => {
    if (!membroId) { setLoading(false); return }
    async function carregarEstado() {
      try {
        const { membro: m } = await apiFetch(`/abias/membros/${membroId}`)
        setMembro(m)
        setReputacao(m.reputacao)
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
  }, [])

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setClockTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`)
    }
    updateTime()
    const timer = setInterval(updateTime, 30000)
    return () => clearInterval(timer)
  }, [])

  const currentAmount = solicitacao ? solicitacao.valor : 850
  const currentFinalidade = solicitacao ? solicitacao.finalidade : 'Pneu + Revisão'
  const currentOficina = solicitacao ? solicitacao.oficina : 'Oficina JN'
  const currentPrazo = solicitacao ? solicitacao.prazo : '30'
  const currentUrgencia = solicitacao ? solicitacao.urgencia : 'Alta'
  const currentDescricao = solicitacao ? solicitacao.descricao : ''
  const totalAmount = currentAmount * 1.08
  const parcelasValor = (totalAmount / 4).toFixed(2)
  const currentStatus = getEstadoLabel(cicloEstado)
  const tabIds = ['inicio', 'reputacao', 'credito', 'rede', 'perfil']
  const activeIndex = tabIds.indexOf(activeTab)

  const handleCadastro = async (e) => {
    e.preventDefault()
    if (!inputAceite) { alert('Você precisa aceitar o uso de dados para entrar na comunidade.'); return }
    try {
      const { membro: m } = await apiFetch('/abias/membros', {
        method: 'POST',
        body: { nome: inputNome, telefone: inputTelefone, regiao: inputRegiao, tempo: inputTempo, ferramenta: inputFerramenta, raca: inputRaca }
      })
      setMembro(m)
      setMembroId(m.id)
      setReputacao(m.reputacao)
      localStorage.setItem('abias_membro_id', m.id)
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
    setMembro(null); setMembroId(null); setCicloId(null)
    setOnboardingStep('splash'); setSolicitacao(null); setCicloEstado('draft')
    setReputacao(720); setFundo(4820)
    setAvaliacoes({ marcos: 'pending', marcosComment: '', aline: 'pending', alineComment: '' })
    setEvidencia({ file: '', obs: '', status: 'pending', type: '' })
    setOficinaConfirmacao({ quoteConfirmed: false, serviceConfirmed: false, note: '' })
    setGestaoJustificativa('')
    setInputNome('João Silva'); setInputTelefone('(11) 98765-4321')
    setInputRegiao('Zona Leste, São Paulo'); setInputTempo('4 anos')
    setInputFerramenta('Moto'); setInputRaca('Negro'); setInputAceite(true)
    setInputAmount(850); setInputFinalidade('Pneu + Revisão')
    setInputPrazo('30'); setInputOficina('Oficina JN')
    setInputUrgencia('Alta')
    setInputDescricao('Preciso trocar o pneu traseiro careca e fazer revisão básica da suspensão para continuar rodando com segurança.')
    setUploadFileSelected(''); setUploadFileType(''); setUploadFileObs('')
    setAdminJustifyInput('')
    setProfileMode('membro'); setActiveTab('inicio')
    alert('Os dados locais foram limpos!')
  }

  return {
    loading, membro, cicloEstado, reputacao, fundo,
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
    parcelasValor, currentStatus, activeIndex,
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
