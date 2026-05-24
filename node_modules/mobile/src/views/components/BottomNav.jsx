export function BottomNav({ activeTab, setActiveTab, activeIndex }) {
  return (
    <div className="mobile-tab-bar" id="app-tab-bar">
      <div className="tab-selection-indicator" style={{ transform: `translateX(${activeIndex * 100}%) translateZ(0)` }} />
      <button className={`tab-item ${activeTab === 'inicio' ? 'active' : ''}`} onClick={() => setActiveTab('inicio')}>
        <i className="fa-solid fa-house"></i><span>Início</span>
      </button>
      <button className={`tab-item ${activeTab === 'reputacao' ? 'active' : ''}`} onClick={() => setActiveTab('reputacao')}>
        <i className="fa-solid fa-chart-simple"></i><span>Reputação</span>
      </button>
      <button className={`tab-item ${activeTab === 'credito' ? 'active' : ''}`} onClick={() => setActiveTab('credito')}>
        <i className="fa-solid fa-route"></i><span>Crédito</span>
      </button>
      <button className={`tab-item ${activeTab === 'rede' ? 'active' : ''}`} onClick={() => setActiveTab('rede')}>
        <i className="fa-solid fa-users"></i><span>Rede</span>
      </button>
      <button className={`tab-item ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>
        <i className="fa-solid fa-user"></i><span>Perfil</span>
      </button>
    </div>
  )
}
