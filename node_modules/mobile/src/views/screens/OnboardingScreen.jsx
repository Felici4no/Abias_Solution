export function OnboardingScreen({ ctrl }) {
  const {
    onboardingStep, setOnboardingStep,
    inputNome,
    inputApelido, setInputApelido,
    loginUsuario,
    inputTelefone, setInputTelefone,
    inputRegiao, setInputRegiao,
    inputTempo, setInputTempo,
    inputFerramenta, setInputFerramenta,
    inputRaca, setInputRaca,
    inputAceite, setInputAceite,
    handleCadastro
  } = ctrl

  const nomeRegistro = loginUsuario?.nome || inputNome

  const formatPhone = (value) => {
    const d = value.replace(/\D/g, '').slice(0, 11)
    if (d.length === 0) return ''
    if (d.length <= 2) return `(${d}`
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
  }

  if (onboardingStep === 'splash') return (
    <div className="screen active" style={{ position: 'relative', overflow: 'hidden', height: '680px', display: 'flex', flexDirection: 'column' }}>
      {/* Background layers */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, #0a0505 0%, #0d0b0b 40%, #0b0b12 100%)' }}></div>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(201,154,61,0.06) 0%, transparent 70%)' }}></div>
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'linear-gradient(0deg, rgba(224,36,124,0.04) 0%, transparent 100%)' }}></div>
      {/* Grid texture */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '40px 40px', opacity: 0.5 }}></div>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 2, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '40px 32px', textAlign: 'center' }}>
        <div style={{ marginBottom: '32px' }}>
          <div style={{ fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '16px' }}>
            ABIAS NETWORK
          </div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '4.2rem', fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 0.9, margin: 0 }}>
            <span style={{ color: 'var(--text-primary)' }}>ABI</span><span style={{ color: 'var(--color-gold)' }}>AS</span>
          </h1>
        </div>
        <p style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic', fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.45, maxWidth: '260px', margin: '0 0 40px' }}>
          "Onde o asfalto reconhece o seu valor."
        </p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['FINTECH', 'URBAN', 'EQUITY'].map((tag) => (
            <span key={tag} style={{ fontSize: '0.55rem', fontWeight: 800, padding: '5px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', color: 'var(--text-secondary)', letterSpacing: '0.12em' }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Bottom section */}
      <div style={{ position: 'relative', zIndex: 2, padding: '0 32px 32px' }}>
        <button
          style={{ width: '100%', padding: '16px', background: 'var(--color-magenta)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          onClick={() => setOnboardingStep('benefits')}>
          Entrar na rede <i className="fa-solid fa-arrow-right"></i>
        </button>
        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <i className="fa-solid fa-chevron-down" style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}></i>
        </div>
      </div>
    </div>
  )

  if (onboardingStep === 'benefits') return (
    <div className="screen active" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '680px' }}>
      {/* Hero */}
      <div style={{ height: '130px', background: 'linear-gradient(135deg, #0a0505 0%, #1a0a10 60%, #0d0b10 100%)', border: '1px solid var(--border-color)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '20px', overflow: 'hidden', flexShrink: 0 }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(224,36,124,0.08) 1px, transparent 1px)', backgroundSize: '18px 18px' }}></div>
        <div style={{ position: 'absolute', width: '100px', height: '100px', background: 'rgba(213,63,140,0.1)', filter: 'blur(30px)', borderRadius: '50%' }}></div>
        <i className="fa-solid fa-motorcycle" style={{ fontSize: '3rem', color: 'var(--color-gold)', position: 'relative' }}></i>
      </div>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ marginBottom: '4px' }}>
          <span style={{ fontSize: '0.55rem', fontWeight: 800, letterSpacing: '0.1em', color: 'var(--color-magenta)', textTransform: 'uppercase' }}>PASSO 01/04</span>
        </div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: '8px' }}>A rua não mente.<br />O banco nem sempre sabe ler.</h2>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: 1.4 }}>
          A Abias reconhece jornadas que o score tradicional ignora: trabalho diário, confiança da rede, território, oficina parceira e evidências reais.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {[
            { icon: 'fa-chart-simple', title: 'Reputação de Jornada', desc: 'Sua consistência, seus avais e evidências constroem reputação financeira.' },
            { icon: 'fa-route', title: 'Crédito Produtivo', desc: 'Para pneu, manutenção, celular, documentação e segurança. Com finalidade clara.' },
            { icon: 'fa-users', title: 'Quilombo Digital', desc: 'Uma rede aberta de proteção econômica — a comunidade valida e fortalece cada ciclo.' }
          ].map(({ icon, title, desc }) => (
            <div key={title} style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
              <div style={{ fontSize: '1.1rem', color: 'var(--color-gold)', flexShrink: 0, marginTop: '2px' }}><i className={`fa-solid ${icon}`}></i></div>
              <div>
                <h4 style={{ fontSize: '0.82rem', fontWeight: 800, marginBottom: '2px' }}>{title}</h4>
                <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ paddingTop: '16px', flexShrink: 0 }}>
        <button className="btn-app btn-app-primary" onClick={() => setOnboardingStep('form')}>
          Começar minha jornada <i className="fa-solid fa-chevron-right" style={{ marginLeft: '4px' }}></i>
        </button>
      </div>
    </div>
  )

  return (
    <div className="screen active" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <button type="button" style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem' }} onClick={() => setOnboardingStep('benefits')}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--color-magenta)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>PASSO 02/04 — SCORE</span>
      </div>

      <div style={{ background: 'linear-gradient(180deg, rgba(224,36,124,0.08) 0%, transparent 40%)', borderRadius: '12px', padding: '20px 0 10px', marginBottom: '16px', textAlign: 'center' }}>
        <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--color-magenta)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>REPUTAÇÃO DE ROTA</span>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, marginTop: '6px', marginBottom: '6px', lineHeight: 1.15, letterSpacing: '-0.02em' }}>
          Sua rota vale crédito.
        </h2>
        <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4, maxWidth: '280px', margin: '0 auto 12px' }}>
          Micro-crédito produtivo construído sobre jornada, território e confiança comunitária — não score bancário.
        </p>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '20px' }}>
          <i className="fa-solid fa-circle" style={{ fontSize: '0.4rem', color: 'var(--success)' }}></i>
          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--success)', letterSpacing: '0.06em' }}>STATUS DA ANÁLISE: PRONTO PARA CONECTAR</span>
        </div>
      </div>

      <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {/* Nome do cadastro — somente leitura */}
        <div className="mobile-form-group">
          <label className="form-label">Nome registrado</label>
          <div style={{
            padding: '12px 14px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            fontSize: '0.88rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className="fa-solid fa-lock" style={{ fontSize: '0.65rem', opacity: 0.5 }}></i>
            {nomeRegistro}
          </div>
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Como gostaria de ser chamado?</label>
          <input
            type="text"
            className="form-text-input"
            placeholder={nomeRegistro.split(' ')[0]}
            value={inputApelido}
            onChange={(e) => setInputApelido(e.target.value)}
          />
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Telefone / WhatsApp</label>
          <input
            type="tel"
            className="form-text-input"
            placeholder="(11) 98765-4321"
            value={inputTelefone}
            onChange={(e) => setInputTelefone(formatPhone(e.target.value))}
            required
          />
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Região principal de atuação</label>
          <input
            type="text"
            className="form-text-input"
            placeholder="ex: Zona Leste, São Paulo"
            value={inputRegiao}
            onChange={(e) => setInputRegiao(e.target.value)}
            required
          />
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Tempo como Motoboy</label>
          <select className="form-select" value={inputTempo} onChange={(e) => setInputTempo(e.target.value)} required>
            <option value="">Selecione...</option>
            <option value="1">1 ano</option>
            {[2,3,4,5,6,7,8,9,10].map(n => (
              <option key={n} value={String(n)}>{n} anos</option>
            ))}
            <option value="11">Mais de 10 anos</option>
          </select>
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Ferramenta Principal de Trabalho</label>
          <select className="form-select" value={inputFerramenta} onChange={(e) => setInputFerramenta(e.target.value)}>
            <option value="Moto">Motocicleta (Combustão / Elétrica)</option>
            <option value="Bicicleta">Bicicleta / Bike Elétrica</option>
            <option value="Outro">Outro veículo</option>
          </select>
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Autodeclaração Racial — IBGE (Opcional)</label>
          <select className="form-select" value={inputRaca} onChange={(e) => setInputRaca(e.target.value)}>
            <option value="">Prefiro não informar</option>
            <option value="Preto">Preto</option>
            <option value="Pardo">Pardo</option>
            <option value="Branco">Branco</option>
            <option value="Amarelo">Amarelo</option>
            <option value="Indigena">Indígena</option>
          </select>
        </div>
        <div className="mobile-form-group" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '10px', marginTop: '4px' }}>
          <input type="checkbox" id="aceite-dados-mvp" checked={inputAceite} style={{ marginTop: '2px', flexShrink: 0 }} onChange={(e) => setInputAceite(e.target.checked)} />
          <label htmlFor="aceite-dados-mvp" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
            Concordo com os termos de consentimento e aceito o compartilhamento de jornada comunitária da Abias.
          </label>
        </div>
        <button type="submit" style={{ width: '100%', padding: '14px', background: 'var(--color-magenta)', border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', letterSpacing: '0.04em', marginTop: '6px' }}>
          Começar a pontuar →
        </button>
        <p style={{ textAlign: 'center', fontSize: '0.65rem', color: 'var(--color-magenta)', cursor: 'pointer', textDecoration: 'underline', letterSpacing: '0.02em' }}>
          SAIBA MAIS SOBRE O SCORE
        </p>
      </form>
    </div>
  )
}
