import './App.css'
import { useAppController } from './controllers/useAppController.js'
import { AreaOperacional }  from './views/components/AreaOperacional.jsx'
import { BottomNav }        from './views/components/BottomNav.jsx'
import { OnboardingScreen } from './views/screens/OnboardingScreen.jsx'
import { HomeScreen }       from './views/screens/HomeScreen.jsx'
import { ReputacaoScreen }  from './views/screens/ReputacaoScreen.jsx'
import { CreditoScreen }    from './views/screens/CreditoScreen.jsx'
import { RedeScreen }       from './views/screens/RedeScreen.jsx'
import { PerfilScreen }     from './views/screens/PerfilScreen.jsx'
import { OficinaScreen }    from './views/screens/OficinaScreen.jsx'
import { GestaoScreen }     from './views/screens/GestaoScreen.jsx'

function App() {
  const ctrl = useAppController()
  const { loading, membro, profileMode, activeTab, activeIndex, clockTime, showAreaOperacional, setShowAreaOperacional } = ctrl

  if (loading) {
    return (
      <div className="desktop-showcase-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
          <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '2rem', color: 'var(--color-gold)' }}></i>
          <p style={{ marginTop: '12px', fontSize: '0.85rem' }}>Carregando jornada...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="desktop-showcase-container">
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
            <div className="mobile-status-bar">
              <span className="status-time">{clockTime}</span>
              <div className="status-icons">
                <i className="fa-solid fa-signal"></i>
                <span className="network-type">5G</span>
                <i className="fa-solid fa-wifi"></i>
                <i className="fa-solid fa-battery-three-quarters"></i>
              </div>
            </div>

            <div className="app-header-main-top" style={{ display: 'flex', background: '#0B0B0B', borderBottom: '1px solid var(--border-color)', padding: '12px 20px', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="abias-logo" style={{ fontSize: '1.2rem', fontWeight: 800 }}>Abias</span>
              <button className="btn-settings-toggle" onClick={() => setShowAreaOperacional(true)} title="Área operacional" aria-label="Abrir Área operacional">
                <i className="fa-solid fa-sliders"></i>
              </button>
            </div>

            <div className="screen-scroll-area">
              {showAreaOperacional && <AreaOperacional ctrl={ctrl} />}

              {profileMode === 'membro' && (
                <>
                  {!membro ? (
                    <OnboardingScreen ctrl={ctrl} />
                  ) : (
                    <>
                      {activeTab === 'inicio'    && <HomeScreen      ctrl={ctrl} />}
                      {activeTab === 'reputacao' && <ReputacaoScreen ctrl={ctrl} />}
                      {activeTab === 'credito'   && <CreditoScreen   ctrl={ctrl} />}
                      {activeTab === 'rede'      && <RedeScreen      ctrl={ctrl} />}
                      {activeTab === 'perfil'    && <PerfilScreen    ctrl={ctrl} />}
                    </>
                  )}
                </>
              )}

              {profileMode === 'oficina' && <OficinaScreen ctrl={ctrl} />}
              {profileMode === 'gestao'  && <GestaoScreen  ctrl={ctrl} />}
            </div>

            {profileMode === 'membro' && membro && (
              <BottomNav activeTab={activeTab} setActiveTab={ctrl.setActiveTab} activeIndex={activeIndex} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
