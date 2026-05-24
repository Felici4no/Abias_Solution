export function syncCicloToState(
  ciclo, reputacao, fundo,
  setCicloId, setSolicitacao, setCicloEstado,
  setAvaliacoes, setEvidencia, setOficinaConfirmacao,
  setGestaoJustificativa, setReputacao, setFundo
) {
  if (!ciclo) return
  setCicloId(ciclo.id)
  localStorage.setItem('abias_ciclo_id', ciclo.id)
  setSolicitacao({
    valor: ciclo.valor,
    finalidade: ciclo.finalidade,
    prazo: ciclo.prazo,
    oficina: ciclo.oficina,
    urgencia: ciclo.urgencia,
    descricao: ciclo.descricao
  })
  setCicloEstado(ciclo.estado)
  setAvaliacoes(ciclo.avais)
  setEvidencia(ciclo.evidencia)
  setOficinaConfirmacao(ciclo.oficinaConfirmacao)
  setGestaoJustificativa(ciclo.justificativa || '')
  if (reputacao !== undefined) setReputacao(reputacao)
  if (fundo !== undefined) setFundo(fundo)
}

export function getEstadoLabel(state) {
  const dict = {
    draft:                { label: 'Inativo',                step: 'Solicitar crédito de jornada para iniciar' },
    submitted:            { label: 'Plano Sugerido',         step: 'Confirmar os termos do plano comunitário' },
    community_validation: { label: 'Validação da Rede',      step: 'Acompanhar validação da rede (Marcos e Aline)' },
    partner_quote:        { label: 'Aguardando Orçamento',   step: 'Oficina JN confirmando valores' },
    under_review:         { label: 'Em Análise',             step: 'Aguardando validação da Gestão Abias' },
    approved:             { label: 'Aprovado',               step: 'Recurso liberado para a manutenção' },
    evidence_pending:     { label: 'Comprovação Pendente',   step: 'Enviar comprovantes na aba Evidências' },
    evidence_review:      { label: 'Evidência em Análise',   step: 'Oficina JN validando serviço realizado' },
    validated:            { label: 'Serviço Validado',       step: 'Aguardando finalização pela Gestão Abias' },
    completed:            { label: 'Ciclo Concluído',        step: 'Parabéns! Sua reputação subiu' },
    needs_revision:       { label: 'Revisão Solicitada',     step: 'Editar dados conforme indicado pela gestão' },
    rejected:             { label: 'Recusado',               step: 'Ciclo encerrado sem aprovação' }
  }
  return dict[state] || { label: state, step: '' }
}
