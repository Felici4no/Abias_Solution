export function OnboardingScreen({ ctrl }) {
  const {
    onboardingStep, setOnboardingStep,
    inputNome, setInputNome,
    inputTelefone, setInputTelefone,
    inputRegiao, setInputRegiao,
    inputTempo, setInputTempo,
    inputFerramenta, setInputFerramenta,
    inputRaca, setInputRaca,
    inputAceite, setInputAceite,
    handleCadastro
  } = ctrl

  if (onboardingStep === 'splash') return (
    <div className="screen active" style={{ padding: '30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '680px', position: 'relative' }}>
      <div className="splash-glow"></div>
      <div style={{ margin: 'auto 0', textAlign: 'center', zIndex: 2 }}>
        <div className="splash-logo-wrapper" style={{ marginBottom: '20px' }}>
          <h1 className="splash-logo-text" style={{ fontSize: '3.6rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)', margin: 0 }}>ABIAS</h1>
        </div>
        <h2 className="splash-title" style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-gold)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '14px' }}>O PODER DA TUA JORNADA</h2>
        <p className="splash-subtitle" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4', maxWidth: '280px', margin: '0 auto' }}>
          Crédito produtivo validado por rede para manter sua ferramenta de trabalho funcionando.
        </p>
      </div>
      <div style={{ width: '100%', paddingBottom: '20px', zIndex: 2 }}>
        <button className="btn-app btn-app-primary" onClick={() => setOnboardingStep('benefits')}>
          Entrar na rede <i className="fa-solid fa-arrow-right" style={{ marginLeft: '6px' }}></i>
        </button>
      </div>
    </div>
  )

  if (onboardingStep === 'benefits') return (
    <div className="screen active" style={{ padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '680px' }}>
      <div>
        <div className="benefits-hero-card" style={{ height: '140px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', marginBottom: '20px' }}>
          <div className="hero-glow" style={{ position: 'absolute', width: '80px', height: '80px', background: 'rgba(213, 63, 140, 0.15)', filter: 'blur(30px)' }}></div>
          <i className="fa-solid fa-motorcycle" style={{ fontSize: '3rem', color: 'var(--color-gold)', zIndex: 1 }}></i>
        </div>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, letterSpacing: '-0.03em', lineHeight: '1.15', marginBottom: '8px' }}>A rua não mente. Mas o banco nem sempre sabe ler.</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
          A Abias reconhece jornadas que o score tradicional ignora: trabalho diário, confiança da rede, território, oficina parceira e evidências reais.
        </p>
        <div className="benefits-list" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {[
            { icon: 'fa-chart-simple', title: 'Reputação de Jornada', desc: 'Sua consistência, seus avais e suas evidências constroem reputação financeira.' },
            { icon: 'fa-route', title: 'Crédito produtivo', desc: 'Crédito produtivo para pneu, manutenção, celular, documentação e segurança. Não é empréstimo livre.' },
            { icon: 'fa-users', title: 'Quilombo Digital', desc: 'Uma rede aberta de proteção econômica, onde a comunidade valida e fortalece cada ciclo.' }
          ].map(({ icon, title, desc }) => (
            <div key={title} className="benefit-item-box" style={{ display: 'flex', gap: '12px', background: 'rgba(255,255,255,0.02)', padding: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ fontSize: '1.2rem', color: 'var(--color-gold)' }}><i className={`fa-solid ${icon}`}></i></div>
              <div>
                <h4 style={{ fontSize: '0.85rem', fontWeight: 800, marginBottom: '2px' }}>{title}</h4>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ width: '100%', marginTop: '10px' }}>
        <button className="btn-app btn-app-primary" onClick={() => setOnboardingStep('form')}>
          Começar minha jornada <i className="fa-solid fa-chevron-right" style={{ marginLeft: '4px' }}></i>
        </button>
      </div>
    </div>
  )

  return (
    <div className="screen active" style={{ padding: '20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <button type="button" style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1rem' }} onClick={() => setOnboardingStep('benefits')}>
          <i className="fa-solid fa-arrow-left"></i>
        </button>
        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--color-gold)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>ETAPA FINAL</span>
      </div>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px', lineHeight: '1.15', letterSpacing: '-0.02em' }}>
        O banco vê um CPF.<br />A Abias reconhece uma jornada.
      </h2>
      <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '20px', lineHeight: '1.4' }}>
        O sistema financeiro tradicional avalia pessoas como números isolados: CPF, score, renda formal e garantias. A Abias parte de outra ótica. A jornada de um trabalhador negro e periférico carrega território, rede, trabalho, confiança, obstáculos e consistência que o score tradicional não sabe ler. A Abias transforma essa jornada em reputação comunitária e acesso a crédito produtivo.
      </p>
      <form onSubmit={handleCadastro} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div className="mobile-form-group">
          <label className="form-label">Nome Completo</label>
          <input type="text" className="form-text-input" value={inputNome} onChange={(e) => setInputNome(e.target.value)} required />
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Telefone / WhatsApp</label>
          <input type="text" className="form-text-input" value={inputTelefone} onChange={(e) => setInputTelefone(e.target.value)} required />
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Região principal de atuação</label>
          <input type="text" className="form-text-input" value={inputRegiao} onChange={(e) => setInputRegiao(e.target.value)} required />
        </div>
        <div className="mobile-form-group">
          <label className="form-label">Tempo como Motoboy</label>
          <input type="text" className="form-text-input" value={inputTempo} onChange={(e) => setInputTempo(e.target.value)} required />
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
          <label className="form-label">Autodeclaração Racial (Opcional)</label>
          <select className="form-select" value={inputRaca} onChange={(e) => setInputRaca(e.target.value)}>
            <option value="Negro">Negro (Preto ou Pardo)</option>
            <option value="Indigena">Indígena</option>
            <option value="Outro">Outro</option>
          </select>
        </div>
        <div className="mobile-form-group" style={{ flexDirection: 'row', alignItems: 'flex-start', gap: '10px', marginTop: '10px' }}>
          <input type="checkbox" id="aceite-dados-mvp" checked={inputAceite} style={{ marginTop: '2px' }} onChange={(e) => setInputAceite(e.target.checked)} />
          <label htmlFor="aceite-dados-mvp" style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
            Concordo com os termos de consentimento e aceito o compartilhamento de jornada comunitária da Abias.
          </label>
        </div>
        <button type="submit" className="btn-app btn-app-primary" style={{ marginTop: '10px' }}>Registrar membro</button>
      </form>
    </div>
  )
}
