export function ReputacaoScreen({ ctrl }) {
  const { reputacao, avaliacoes, cicloEstado } = ctrl

  return (
    <div className="screen active" id="screen-reputacao">
      <div className="app-header-simple">
        <h3>Reputação de Jornada</h3>
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
            {reputacao <= 720 ? 'Jornada ativa' : reputacao <= 745 ? 'Jornada forte' : 'Jornada de ouro (Referência da rede)'}
          </div>
          <p className="reputacao-desc">
            A reputação não nasce de um número isolado. Ela nasce de uma jornada reconhecida pela rede, baseada na integridade do seu trabalho e na confiança mútua.
          </p>
        </div>

        <div className="reputacao-factors-list">
          <h4>Fatores de Crescimento</h4>
          {[
            { label: 'Frequência Operacional', pct: '92%', color: 'var(--color-green)' },
            {
              label: 'Confiança Comunitária (Avais)',
              pct: avaliacoes.marcos === 'approved' && avaliacoes.aline === 'approved' ? '100%' : avaliacoes.marcos === 'approved' || avaliacoes.aline === 'approved' ? '50%' : '0%',
              color: 'var(--color-gold)'
            },
            { label: 'Consistência de Rota', pct: '88%', color: 'var(--color-terra)' },
            {
              label: 'Comprovação de Uso (Evidências)',
              pct: ['evidence_review', 'validated', 'completed'].includes(cicloEstado) ? '100%' : '0%',
              color: 'var(--color-gold)'
            }
          ].map(({ label, pct, color }) => (
            <div key={label} className="factor-progress-item">
              <div className="factor-lbl">
                <span>{label}</span>
                <span className="percent font-mono">{pct}</span>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: pct, backgroundColor: color }}></div>
              </div>
            </div>
          ))}
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
  )
}
