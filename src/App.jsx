import { useState, useEffect } from 'react'

// ==========================================================================
// 1. COMPONENTES AUXILIARES E ESTRUTURAS DE DADOS
// ==========================================================================

const LogoJornada = ({ size = 28, color = 'var(--gold)' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <circle cx="16" cy="16" r="13" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
    <path d="M9 16.5L14 21.5L23 10.5" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 9H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M16 9V14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const ComplianceNotice = () => (
  <div style={{
    marginTop: '20px',
    padding: '12px',
    background: 'rgba(255,255,255,0.01)',
    border: '1px dashed var(--border)',
    borderRadius: '8px',
    fontSize: '0.68rem',
    color: 'var(--text-secondary)',
    lineHeight: '1.4'
  }}>
    <i className="fa-solid fa-circle-info" style={{ color: 'var(--gold)', marginRight: '6px' }}></i>
    <strong>Aviso de Conformidade:</strong> No MVP experimental, o <em>Crédito de Jornada</em> é uma unidade privada de impacto socioambiental. Não representa crédito de carbono regulado, créditos oficiais do mercado de capitais (CBIO) ou compensações oficiais auditadas internacionalmente.
  </div>
)

const ImpactCreditLifecycle = ({ currentStatus }) => {
  const steps = [
    { key: 'reservado', label: 'Reservado', desc: 'Pré-compra efetuada pela empresa patrocinadora' },
    { key: 'financiado', label: 'Financiado', desc: 'Recurso depositado e alocado na reserva piloto' },
    { key: 'vinculado', label: 'Vinculado', desc: 'Crédito associado a um motoboy elegível do programa' },
    { key: 'bolsa_ativa', label: 'Bolsa Ativa', desc: 'Primeiro repasse feito para a faculdade parceira' },
    { key: 'monitorado', label: 'Monitorado', desc: 'Dados de km e rotas estão sendo reportados via API' },
    { key: 'verificado', label: 'Verificado', desc: 'Evidências conferidas e validadas pela rede local' },
    { key: 'reportado', label: 'Reportado', desc: 'Impacto computado no painel de ESG da empresa' },
    { key: 'aposentado', label: 'Aposentado', desc: 'Crédito liquidado, não pode ser revendido ou reutilizado' }
  ];

  const getStepIndex = (status) => steps.findIndex(s => s.key === status);
  const activeIndex = getStepIndex(currentStatus);

  return (
    <div className="glass-card" style={{ marginBottom: '16px' }}>
      <h4 style={{ fontSize: '0.85rem', color: 'var(--gold)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '14px' }}>
        <i className="fa-solid fa-circle-nodes"></i> Ciclo de Vida do Crédito
      </h4>
      <div className="lifecycle-timeline">
        {steps.map((step, idx) => {
          const isActive = idx === activeIndex;
          const isCompleted = idx < activeIndex;
          let nodeClass = 'lifecycle-step';
          if (isActive) nodeClass += ' active';
          if (isCompleted) nodeClass += ' completed';

          return (
            <div key={step.key} className={nodeClass} title={step.desc}>
              <div className="step-node">{isCompleted ? '✓' : idx + 1}</div>
              <span className="step-label">{step.label}</span>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: '12px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px', fontSize: '0.72rem' }}>
        <strong>Fase atual:</strong> <span style={{ color: 'var(--gold)' }}>{steps[activeIndex]?.label}</span> — {steps[activeIndex]?.desc}
      </div>
    </div>
  );
}

const UniversityPartners = () => {
  const partners = [
    { name: 'Faculdade Unifac', course: 'Análise e Desenvolvimento de Sistemas', price: 340, subsidy: 220, riders: 12, region: 'Zona Leste', status: 'Ativa' },
    { name: 'Instituto Politec', course: 'Logística de Abastecimento', price: 290, subsidy: 200, riders: 8, region: 'Zona Sul', status: 'Ativa' },
    { name: 'Centro Acadêmico Leste', course: 'Marketing Digital & Gestão', price: 310, subsidy: 220, riders: 5, region: 'Zona Norte', status: 'Em validação' },
    { name: 'Faculdade Metropolitana', course: 'Segurança da Informação', price: 390, subsidy: 250, riders: 5, region: 'Centro', status: 'Ativa' }
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
      {partners.map((p, idx) => (
        <div key={idx} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="flex-between">
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff' }}>{p.name}</span>
            <span className={`badge-status ${p.status === 'Ativa' ? 'green' : 'neutral'}`}>{p.status}</span>
          </div>
          <div>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Curso Tecnólogo</span>
            <span style={{ fontSize: '0.78rem', color: 'var(--gold)', fontWeight: 700 }}>{p.course}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', background: 'rgba(0,0,0,0.15)', padding: '8px', borderRadius: '6px', fontSize: '0.7rem' }}>
            <div>
              <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.6rem' }}>Mensalidade</span>
              <strong style={{ color: '#ffffff' }}>R$ {p.price}</strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.6rem' }}>Subsídio do Corre</span>
              <strong style={{ color: 'var(--green)' }}>R$ {p.subsidy}</strong>
            </div>
          </div>
          <div className="flex-between" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.02)', paddingTop: '6px' }}>
            <span><i className="fa-solid fa-users"></i> {p.riders} Bolsistas</span>
            <span><i className="fa-solid fa-location-dot"></i> {p.region}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

const DocumentoCredito = ({ cred }) => {
  if (!cred) return null;
  return (
    <div className="glass-card glow-gold" style={{ padding: '20px', border: '1px solid var(--border)', background: 'linear-gradient(180deg, #12110F 0%, #080807 100%)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(244, 241, 232, 0.08)', paddingBottom: '10px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <LogoJornada size={22} />
          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ffffff', letterSpacing: '0.05em' }}>CRÉDITO DE JORNADA</span>
        </div>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--gold)', fontWeight: 700 }}>{cred.id}</span>
      </div>

      <div className="mono-table">
        <div className="mono-row">
          <span className="mono-lbl">Status da Unidade</span>
          <span className="badge-status green">{cred.status.replace('_', ' ')}</span>
        </div>
        <div className="mono-row">
          <span className="mono-lbl">Membro Apoiado</span>
          <span className="mono-val">{cred.membro || 'Aguardando vinculação'}</span>
        </div>
        <div className="mono-row">
          <span className="mono-lbl">Instituição de Ensino</span>
          <span className="mono-val">{cred.faculdade || 'Pendente'}</span>
        </div>
        <div className="mono-row">
          <span className="mono-lbl">Cota Contratada</span>
          <span className="mono-val gold">R$ {cred.valor.toFixed(2)}/mês</span>
        </div>
        <div className="mono-row">
          <span className="mono-lbl">Combustível / Veículo</span>
          <span className="mono-val">{cred.veiculo || 'Moto (Gasolina)'}</span>
        </div>
        <div className="mono-row">
          <span className="mono-lbl">Emissão CO₂ Estimada</span>
          <span className="mono-val green">-{cred.reducaoCO2 || 0} kg/mês</span>
        </div>
        <div className="mono-row">
          <span className="mono-lbl">Destinação Educacional</span>
          <span className="mono-val gold">R$ {((cred.valor * 220)/300).toFixed(2)}</span>
        </div>
        <div className="mono-row">
          <span className="mono-lbl">Código Hash Rastreável</span>
          <span className="mono-val" style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>{cred.hash}</span>
        </div>
      </div>

      <div style={{ borderTop: '1px dashed rgba(244, 241, 232, 0.08)', paddingTop: '10px', marginTop: '12px', textAlign: 'center' }}>
        <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
          <i className="fa-solid fa-shield-halved" style={{ color: 'var(--gold)', marginRight: '4px' }}></i> Impacto Social & Ambiental Verificado pela Rede
        </span>
      </div>
    </div>
  );
}

// ==========================================================================
// 2. COMPONENTE PRINCIPAL (VIEWPORT COMPARTILHADO)
// ==========================================================================

export default function App() {
  // --- Simulação de Estado Persistente ---
  const [activeTab, setActiveTab] = useState('pitch'); // 'pitch' | 'sponsor' | 'university' | 'backoffice'
  const [activePhoneTab, setActivePhoneTab] = useState('carteira'); // 'carteira' | 'registrar' | 'academic'

  // Motoboy Logado
  const [membro, setMembro] = useState({
    nome: 'João Silva',
    tempoCorre: '4 anos',
    veiculo: 'Moto a Combustão (150cc)',
    combustivel: 'Gasolina',
    curso: 'Análise e Desenvolvimento de Sistemas',
    faculdade: 'Faculdade Unifac',
    matricula: 'UF-8032-2026',
    kmMensal: 2450,
    bolsaProgresso: 4, // 4 parcelas pagas
    bolsaTotal: 24 // curso de 2 anos
  });

  // Lista de Créditos simulados
  const [creditos, setCreditos] = useState(() => {
    const saved = localStorage.getItem('cj_creditos');
    return saved ? JSON.parse(saved) : [
      { id: '#CJ-101', status: 'aposentado', membro: 'João Silva', faculdade: 'Faculdade Unifac', valor: 300, veiculo: 'Moto a Gasolina', reducaoCO2: 12, hash: '0x3ef9a82cd819' },
      { id: '#CJ-102', status: 'reportado', membro: 'João Silva', faculdade: 'Faculdade Unifac', valor: 300, veiculo: 'Moto a Gasolina', reducaoCO2: 12, hash: '0xa871be82cd02' },
      { id: '#CJ-103', status: 'verificado', membro: 'Marcos Santos', faculdade: 'Instituto Politec', valor: 300, veiculo: 'Scooter Elétrica', reducaoCO2: 48, hash: '0xb2cd3489fe12' },
      { id: '#CJ-104', status: 'bolsa_ativa', membro: 'João Silva', faculdade: 'Faculdade Unifac', valor: 300, veiculo: 'Moto a Gasolina', reducaoCO2: 12, hash: '0xf92b7cd8014e' },
      { id: '#CJ-105', status: 'vinculado', membro: 'Aline Oliveira', faculdade: 'Instituto Politec', valor: 300, veiculo: 'Moto a Gasolina', reducaoCO2: 14, hash: '0x7e819bcf8211' }
    ];
  });

  // Inputs de formulários
  const [kmInput, setKmInput] = useState('120');
  const [combustivelInput, setCombustivelInput] = useState('Gasolina');
  const [veiculoInput, setVeiculoInput] = useState('Moto a Combustão (150cc)');
  const [cotaCheckout, setCotaCheckout] = useState('300'); // '150' | '300' | '500'
  const [empresaInput, setEmpresaInput] = useState('Logística Z Leste');
  const [quantidadeCheckout, setQuantidadeCheckout] = useState('2');
  const [selectedCreditoId, setSelectedCreditoId] = useState('#CJ-104');

  // Persistir créditos
  useEffect(() => {
    localStorage.setItem('cj_creditos', JSON.stringify(creditos));
  }, [creditos]);

  // Relógio do celular
  const [clockTime, setClockTime] = useState('11:20');
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setClockTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  // --- Funções Operacionais do MVP ---

  // Motoboy registra km e gera estimativa de impacto
  const handleRegistrarKm = (e) => {
    e.preventDefault();
    const kmNum = parseFloat(kmInput);
    if (isNaN(kmNum) || kmNum <= 0) return;

    // Atualiza cadastro do motoboy
    const updatedMembro = {
      ...membro,
      kmMensal: membro.kmMensal + kmNum,
      veiculo: veiculoInput,
      combustivel: combustivelInput
    };
    setMembro(updatedMembro);

    // Atualiza dinamicamente o status do crédito vinculado na carteira do João (#CJ-104)
    // Se o veículo for elétrico ou a gasolina com alta eficiência, recalculamos a redução estimada.
    const isElectric = veiculoInput.includes('Elétrica');
    const fatorReducao = isElectric ? 0.045 : 0.012; // kg de CO2 por km

    setCreditos(prev => prev.map(c => {
      if (c.membro === 'João Silva' && c.status === 'bolsa_ativa') {
        return {
          ...c,
          veiculo: veiculoInput,
          reducaoCO2: Math.round(c.reducaoCO2 + (kmNum * fatorReducao))
        };
      }
      return c;
    }));

    setKmInput('');
    alert(`Corre de ${kmNum} km registrado com sucesso! Impacto atualizado.`);
    setActivePhoneTab('carteira');
  };

  // Empresa patrocinadora compra créditos (Checkout)
  const handleComprarCotas = (e) => {
    e.preventDefault();
    const valor = parseFloat(cotaCheckout);
    const qty = parseInt(quantidadeCheckout);
    const novasCotas = [];

    for (let i = 0; i < qty; i++) {
      const novoId = `#CJ-${Math.floor(100 + Math.random() * 900)}`;
      const randomHash = '0x' + Array.from({length: 12}, () => Math.floor(Math.random()*16).toString(16)).join('');
      novasCotas.push({
        id: novoId,
        status: 'financiado',
        membro: '',
        faculdade: '',
        valor: valor,
        veiculo: 'Moto a Gasolina',
        reducaoCO2: 12,
        hash: randomHash
      });
    }

    setCreditos(prev => [...prev, ...novasCotas]);
    alert(`Compra de ${qty} Créditos de Jornada no valor de R$ ${valor} efetuada com sucesso! Os créditos já estão disponíveis no sistema.`);
    setActiveTab('sponsor');
  };

  // Admin vincula um crédito financiado a um motoboy
  const handleVincularMembro = (credId, membroNome, faculdadeNome) => {
    setCreditos(prev => prev.map(c => {
      if (c.id === credId) {
        return {
          ...c,
          status: 'vinculado',
          membro: membroNome,
          faculdade: faculdadeNome
        };
      }
      return c;
    }));
    alert(`Crédito ${credId} vinculado a ${membroNome}.`);
  };

  // Admin atualiza o status do ciclo de vida do crédito
  const handleAtualizarStatusCredito = (credId, novoStatus) => {
    setCreditos(prev => prev.map(c => {
      if (c.id === credId) {
        // Se avançou para bolsa ativa e o membro for João Silva, incrementamos a parcela da bolsa
        if (novoStatus === 'bolsa_ativa' && c.membro === 'João Silva' && c.status !== 'bolsa_ativa') {
          setMembro(m => ({ ...m, bolsaProgresso: Math.min(m.bolsaTotal, m.bolsaProgresso + 1) }));
        }
        return { ...c, status: novoStatus };
      }
      return c;
    }));
  };

  // --- Estatísticas Consolidadas para o Dashboard ESG ---
  const totalCreditos = creditos.length;
  const creditosAtivos = creditos.filter(c => c.status !== 'aposentado').length;
  const totalRepassadoEducacao = creditos
    .filter(c => ['bolsa_ativa', 'monitorado', 'verificado', 'reportado', 'aposentado'].includes(c.status))
    .reduce((sum, c) => sum + ((c.valor * 220) / 300), 0);

  const totalCO2Reduzido = creditos.reduce((sum, c) => sum + c.reducaoCO2, 0);

  const activeCredito = creditos.find(c => c.id === selectedCreditoId) || creditos[0];

  return (
    <div className="demo-viewport">
      
      {/* HEADER */}
      <header className="demo-header">
        <div className="demo-logo-section">
          <LogoJornada size={30} color="var(--gold)" />
          <h1 className="demo-title">Corre pra Faculdade</h1>
          <span className="demo-badge-pluggable">Módulo Plugável ESG</span>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className={`panel-tab-btn ${activeTab === 'pitch' ? 'active' : ''}`} 
            onClick={() => setActiveTab('pitch')}>
            Pitch & Conceito
          </button>
          <button 
            className={`panel-tab-btn ${['sponsor', 'university', 'backoffice'].includes(activeTab) ? 'active' : ''}`} 
            onClick={() => setActiveTab('sponsor')}>
            Painel da Feature
          </button>
        </div>
      </header>

      {/* WORKSPACE DIVIDIDO EM DUAS PANES */}
      <div className="demo-workspace">
        
        {/* LADO ESQUERDO: SMARTPHONE SIMULATOR (INTERFACE MÓVEL DO MOTOBOY) */}
        <section className="phone-simulator-frame">
          <div className="phone-screen">
            <div className="phone-notch"></div>
            
            {/* Status Bar */}
            <div style={{ height: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px 0 20px', fontSize: '0.72rem', fontWeight: 800 }}>
              <span>{clockTime}</span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <i className="fa-solid fa-signal"></i>
                <span style={{ fontSize: '0.6rem' }}>5G</span>
                <i className="fa-solid fa-battery-three-quarters"></i>
              </div>
            </div>

            {/* Smartphone App Header */}
            <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogoJornada size={20} color="var(--gold)" />
                <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#ffffff' }}>Corre pra Faculdade</span>
              </div>
              <span className="badge-status green" style={{ fontSize: '0.55rem' }}>Bolsista EAD</span>
            </div>

            {/* Smartphone Scroll Content */}
            <div className="phone-content">
              
              {activePhoneTab === 'carteira' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  
                  {/* Introdução do Rider */}
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Salve, {membro.nome.split(' ')[0]}</span>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>Seu corre é sua faculdade.</h3>
                  </div>

                  {/* Bolsa Progresso Card */}
                  <div className="glass-card glow-gold" style={{ padding: '16px' }}>
                    <div className="flex-between" style={{ marginBottom: '8px' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800 }}>MENSALIDADE SUBSIDIADA</span>
                      <span style={{ fontSize: '0.65rem', color: 'var(--gold)', fontWeight: 800 }}>{membro.bolsaProgresso}/{membro.bolsaTotal} Meses</span>
                    </div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>{membro.faculdade}</h4>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '10px' }}>Curso: {membro.curso}</p>
                    
                    {/* Progress Bar */}
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden', marginBottom: '8px' }}>
                      <div style={{ width: `${(membro.bolsaProgresso / membro.bolsaTotal) * 100}%`, height: '100%', background: 'var(--gold)', borderRadius: '3px' }}></div>
                    </div>
                    <div className="flex-between" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>
                      <span>Matrícula ativa</span>
                      <span style={{ color: 'var(--green)' }}>Repasse operacional em dia</span>
                    </div>
                  </div>

                  {/* Km / Impacto acumulado */}
                  <div className="glass-card" style={{ padding: '16px', background: 'rgba(255,255,255,0.01)' }}>
                    <h4 style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary)', marginBottom: '12px' }}>Histórico do ciclo ativo</h4>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', display: 'block' }}>Km rodados</span>
                        <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>{membro.kmMensal} km</strong>
                      </div>
                      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', display: 'block' }}>Combustível</span>
                        <strong style={{ fontSize: '0.95rem', color: '#ffffff' }}>{membro.combustivel.split(' ')[0]}</strong>
                      </div>
                    </div>
                    
                    <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '12px', paddingTop: '10px' }} className="flex-between">
                      <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Emissões salvas</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--green)', fontWeight: 700 }}>
                        <i className="fa-solid fa-leaf"></i> {creditos.find(c => c.membro === 'João Silva' && c.status === 'bolsa_ativa')?.reducaoCO2 || 12} kg CO₂
                      </span>
                    </div>
                  </div>

                  {/* Ações Rápidas */}
                  <button className="btn-premium btn-primary" onClick={() => setActivePhoneTab('registrar')} style={{ padding: '10px 16px', fontSize: '0.78rem' }}>
                    <i className="fa-solid fa-route"></i> Registrar corre do dia
                  </button>

                  <button className="btn-premium btn-secondary" onClick={() => setActivePhoneTab('academic')} style={{ padding: '10px 16px', fontSize: '0.78rem' }}>
                    <i className="fa-solid fa-graduation-cap"></i> Ver comprovantes EAD
                  </button>

                </div>
              )}

              {activePhoneTab === 'registrar' && (
                <form onSubmit={handleRegistrarKm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <button type="button" className="btn-back" onClick={() => setActivePhoneTab('carteira')} style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <i className="fa-solid fa-arrow-left"></i> Voltar
                    </button>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>REGISTRAR JORNADA</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>Insira dados reais da corrida</h3>

                  <div className="form-input-group">
                    <label className="form-label">Quilometragem Rodada</label>
                    <input 
                      type="number" 
                      className="form-text" 
                      value={kmInput} 
                      onChange={(e) => setKmInput(e.target.value)} 
                      placeholder="Ex: 85" 
                      required 
                    />
                  </div>

                  <div className="form-input-group">
                    <label className="form-label">Veículo Utilizado</label>
                    <select 
                      className="form-select" 
                      value={veiculoInput} 
                      onChange={(e) => setVeiculoInput(e.target.value)}>
                      <option value="Moto a Combustão (150cc)">Moto a Combustão (Gasolina)</option>
                      <option value="Scooter Elétrica">Scooter Elétrica (Alugada)</option>
                      <option value="Bike Elétrica">Bicicleta Elétrica</option>
                    </select>
                  </div>

                  <div className="form-input-group">
                    <label className="form-label">Tipo de Abastecimento / Energia</label>
                    <select 
                      className="form-select" 
                      value={combustivelInput} 
                      onChange={(e) => setCombustivelInput(e.target.value)}>
                      <option value="Gasolina">Gasolina comum</option>
                      <option value="Etanol">Etanol (Menos emissões)</option>
                      <option value="Eletricidade">Bateria recarregada (Redução máxima)</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-premium btn-primary">
                    Confirmar e Enviar
                  </button>
                </form>
              )}

              {activePhoneTab === 'academic' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <button type="button" className="btn-back" onClick={() => setActivePhoneTab('carteira')} style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.9rem' }}>
                      <i className="fa-solid fa-arrow-left"></i> Voltar
                    </button>
                    <span style={{ fontSize: '0.7rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>HISTÓRICO ACADÊMICO</span>
                  </div>

                  <div className="glass-card" style={{ padding: '14px' }}>
                    <h4 style={{ fontSize: '0.8rem', color: '#ffffff', marginBottom: '8px' }}>Comprovante de Vínculo</h4>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '6px', fontSize: '0.7rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <p><strong>Instituição:</strong> {membro.faculdade}</p>
                      <p><strong>Matrícula:</strong> {membro.matricula}</p>
                      <p><strong>Status acadêmico:</strong> Frequência regular (ADS EAD)</p>
                    </div>
                  </div>

                  <div className="glass-card glow-green" style={{ padding: '14px' }}>
                    <h4 style={{ fontSize: '0.8rem', color: 'var(--green)', marginBottom: '8px' }}>Repasses Sociais do Corre</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {[
                        { mes: 'Maio/2026', valor: 'R$ 220,00', status: 'Liquidado' },
                        { mes: 'Abril/2026', valor: 'R$ 220,00', status: 'Liquidado' },
                        { mes: 'Março/2026', valor: 'R$ 220,00', status: 'Liquidado' },
                        { mes: 'Fevereiro/2026', valor: 'R$ 220,00', status: 'Liquidado' }
                      ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '4px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{item.mes}</span>
                          <span style={{ fontWeight: 600, color: '#ffffff' }}>{item.valor} <span style={{ color: 'var(--green)', fontSize: '0.62rem' }}>(✓)</span></span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Mobile Nav Bar */}
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              right: '10px',
              background: 'rgba(18, 17, 15, 0.85)',
              backdropFilter: 'blur(20px)',
              border: '1px solid var(--border)',
              borderRadius: '24px',
              height: '56px',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              padding: '0 10px',
              zIndex: 10
            }}>
              <button 
                onClick={() => { setActivePhoneTab('carteira'); }}
                style={{ background: 'transparent', border: 'none', color: activePhoneTab === 'carteira' ? 'var(--gold)' : 'var(--text-secondary)', fontSize: '1rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <i className="fa-solid fa-wallet"></i>
                <span style={{ fontSize: '0.55rem', fontWeight: 800 }}>Bolsa</span>
              </button>
              <button 
                onClick={() => { setActivePhoneTab('registrar'); }}
                style={{ background: 'transparent', border: 'none', color: activePhoneTab === 'registrar' ? 'var(--gold)' : 'var(--text-secondary)', fontSize: '1rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <i className="fa-solid fa-plus-circle"></i>
                <span style={{ fontSize: '0.55rem', fontWeight: 800 }}>Registrar</span>
              </button>
              <button 
                onClick={() => { setActivePhoneTab('academic'); }}
                style={{ background: 'transparent', border: 'none', color: activePhoneTab === 'academic' ? 'var(--gold)' : 'var(--text-secondary)', fontSize: '1rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <i className="fa-solid fa-graduation-cap"></i>
                <span style={{ fontSize: '0.55rem', fontWeight: 800 }}>Matrícula</span>
              </button>
            </div>

          </div>
        </section>

        {/* LADO DIREITO: DESKTOP CONTROL PANEL (ESG / FACULDADES / ADMIN BACKOFFICE) */}
        <main className="desktop-panel">
          
          <nav className="panel-tabs">
            <button 
              className={`panel-tab-btn ${activeTab === 'pitch' ? 'active' : ''}`}
              onClick={() => setActiveTab('pitch')}>
              <i className="fa-solid fa-circle-play"></i> Pitch
            </button>
            <button 
              className={`panel-tab-btn ${activeTab === 'sponsor' ? 'active' : ''}`}
              onClick={() => setActiveTab('sponsor')}>
              <i className="fa-solid fa-building"></i> Patrocinador ESG
            </button>
            <button 
              className={`panel-tab-btn ${activeTab === 'university' ? 'active' : ''}`}
              onClick={() => setActiveTab('university')}>
              <i className="fa-solid fa-university"></i> Faculdades Parceiras
            </button>
            <button 
              className={`panel-tab-btn ${activeTab === 'backoffice' ? 'active' : ''}`}
              onClick={() => setActiveTab('backoffice')}>
              <i className="fa-solid fa-sliders"></i> Admin de Impacto
            </button>
          </nav>

          <section className="panel-content">
            
            {/* TELA DE PITCH / APRESENTAÇÃO INICIAL */}
            {activeTab === 'pitch' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass-card glow-gold" style={{ padding: '30px', background: 'rgba(214, 168, 58, 0.02)', border: '1px solid rgba(214, 168, 58, 0.15)' }}>
                  <span className="demo-badge-pluggable" style={{ marginBottom: '14px', display: 'inline-block' }}>Manifesto do Piloto</span>
                  
                  <h2 style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: '1.15', marginBottom: '16px', color: '#ffffff' }}>
                    Seu corre agora também conta para sua faculdade.
                  </h2>
                  
                  <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '20px' }}>
                    O <strong>Crédito de Jornada</strong> é uma infraestrutura ESG plugável voltada para conectar logística de entregas, mobilidade e sustentabilidade corporativa a caminhos reais de inclusão educacional para entregadores negros e de periferia.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', margin: '24px 0' }}>
                    <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <h4 style={{ color: 'var(--gold)', marginBottom: '6px' }}>1. Compre créditos</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Empresas patrocinam mensalidades de entregadores e cumprem metas ESG de impacto social.</p>
                    </div>
                    <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <h4 style={{ color: 'var(--green)', marginBottom: '6px' }}>2. Colete métricas</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>O motoboy roda seu trajeto diário, e o sistema estima redução de CO₂ com base na sua rota e veículo.</p>
                    </div>
                    <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <h4 style={{ color: '#ffffff', marginBottom: '6px' }}>3. Financie Educação</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>O recurso vai direto à faculdade parceira para subsidiar cursos tecnólogos de ADS ou Logística.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                    <button className="btn-premium btn-gold" onClick={() => setActiveTab('sponsor')} style={{ width: 'auto' }}>
                      Iniciar Simulador ESG <i className="fa-solid fa-arrow-right" style={{ marginLeft: '4px' }}></i>
                    </button>
                    <button className="btn-premium btn-secondary" onClick={() => setActiveTab('university')} style={{ width: 'auto' }}>
                      Ver Faculdades Parceiras
                    </button>
                  </div>
                </div>

                <ComplianceNotice />
              </div>
            )}

            {/* DASHBOARD ESG E COMPRA DO PATROCINADOR */}
            {activeTab === 'sponsor' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Stats do Patrocinador */}
                <div className="metric-grid">
                  <div className="metric-item">
                    <span className="metric-lbl">Total Investido</span>
                    <span className="metric-val gold">R$ {creditsTotalSpent(creditos).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-lbl">Repassado à Educação</span>
                    <span className="metric-val">R$ {totalRepassadoEducacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-lbl">Bolsistas Apoiados</span>
                    <span className="metric-val">{countUniqueBolsistas(creditos)}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-lbl">Redução CO₂ Estimada</span>
                    <span className="metric-val green">{totalCO2Reduzido} kg</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  
                  {/* Formulário de Compra de Cotas */}
                  <div className="glass-card">
                    <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '16px' }}>Comprar Créditos de Jornada</h3>
                    <form onSubmit={handleComprarCotas} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="form-input-group">
                        <label className="form-label">Selecione o plano da cota</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                          {[
                            { value: '150', name: 'Start', price: 'R$150/mês' },
                            { value: '300', name: 'Growth', price: 'R$300/mês' },
                            { value: '500', name: 'Impact', price: 'R$500/mês' }
                          ].map(opt => (
                            <label key={opt.value} style={{
                              border: cotaCheckout === opt.value ? '2px solid var(--gold)' : '1px solid var(--border)',
                              background: 'var(--bg)',
                              borderRadius: '8px',
                              padding: '10px 4px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              display: 'block'
                            }}>
                              <input 
                                type="radio" 
                                name="cota" 
                                value={opt.value} 
                                checked={cotaCheckout === opt.value} 
                                onChange={() => setCotaCheckout(opt.value)} 
                                style={{ display: 'none' }}
                              />
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, display: 'block', color: '#ffffff' }}>{opt.name}</span>
                              <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>{opt.price}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="form-input-group">
                        <label className="form-label">Quantidade de Entregadores para Apoiar</label>
                        <input 
                          type="number" 
                          className="form-text" 
                          value={quantidadeCheckout} 
                          onChange={(e) => setQuantidadeCheckout(e.target.value)} 
                          min="1" 
                          max="20" 
                          required 
                        />
                      </div>

                      <div className="form-input-group">
                        <label className="form-label">Sua Empresa (Razão Social)</label>
                        <input 
                          type="text" 
                          className="form-text" 
                          value={empresaInput} 
                          onChange={(e) => setEmpresaInput(e.target.value)} 
                          placeholder="Logística Z Leste Ltda"
                        />
                      </div>

                      <button type="submit" className="btn-premium btn-primary">
                        Efetuar Patrocínio
                      </button>
                    </form>
                  </div>

                  {/* Certificados & Comprovante ativo */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="flex-between">
                      <h3 style={{ fontSize: '1.15rem', color: '#ffffff' }}>Rastreabilidade de Crédito</h3>
                      <select 
                        className="form-select" 
                        value={selectedCreditoId} 
                        onChange={(e) => setSelectedCreditoId(e.target.value)}
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                        {creditos.map(c => (
                          <option key={c.id} value={c.id}>{c.id} ({c.status})</option>
                        ))}
                      </select>
                    </div>

                    <DocumentoCredito cred={activeCredito} />
                  </div>

                </div>

                <ComplianceNotice />
              </div>
            )}

            {/* CATÁLOGO DE FACULDADES PARCEIRAS */}
            {activeTab === 'university' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ textAlign: 'left' }}>
                  <span className="demo-badge-pluggable" style={{ marginBottom: '8px' }}>Ecossistema de Ensino</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>Rede de Educação Parceira</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Faculdades integradas ao piloto, oferecendo mensalidades flexíveis EAD e cursos tecnólogos de ADS e Logística com foco em alta empregabilidade.
                  </p>
                </div>

                <UniversityPartners />

                <ComplianceNotice />
              </div>
            )}

            {/* ADMINISTRATIVO E CONTROLE DE ESTADOS */}
            {activeTab === 'backoffice' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                <div style={{ textAlign: 'left' }}>
                  <span className="demo-badge-pluggable" style={{ marginBottom: '8px' }}>Gestor de Controles</span>
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>Backoffice de Créditos</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Utilize os botões abaixo para simular a mudança de estados do ciclo de vida dos créditos cadastrados.
                  </p>
                </div>

                <ImpactCreditLifecycle currentStatus={activeCredito?.status || 'reservado'} />

                {/* Tabela de Créditos para Modificação */}
                <div className="glass-card">
                  <h4 style={{ fontSize: '0.9rem', color: '#ffffff', marginBottom: '12px' }}>Orquestrar Status dos Créditos</h4>
                  
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                          <th style={{ padding: '10px' }}>ID</th>
                          <th style={{ padding: '10px' }}>Membro</th>
                          <th style={{ padding: '10px' }}>Faculdade</th>
                          <th style={{ padding: '10px' }}>Valor</th>
                          <th style={{ padding: '10px' }}>Emissões</th>
                          <th style={{ padding: '10px' }}>Status</th>
                          <th style={{ padding: '10px', textAlign: 'right' }}>Ações de Simulação</th>
                        </tr>
                      </thead>
                      <tbody>
                        {creditos.map(c => (
                          <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                            <td style={{ padding: '10px', fontWeight: 700, color: 'var(--gold)' }}>{c.id}</td>
                            <td style={{ padding: '10px', color: '#ffffff' }}>{c.membro || <span style={{ color: 'var(--text-secondary)' }}>Não vinculado</span>}</td>
                            <td style={{ padding: '10px' }}>{c.faculdade || '—'}</td>
                            <td style={{ padding: '10px' }}>R$ {c.valor}</td>
                            <td style={{ padding: '10px', color: 'var(--green)' }}>-{c.reducaoCO2} kg</td>
                            <td style={{ padding: '10px' }}>
                              <span className={`badge-status ${c.status === 'aposentado' ? 'neutral' : (c.status === 'bolsa_ativa' || c.status === 'verificado' ? 'green' : 'gold')}`}>
                                {c.status}
                              </span>
                            </td>
                            <td style={{ padding: '10px', textAlign: 'right', display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                              
                              {!c.membro && (
                                <button 
                                  onClick={() => handleVincularMembro(c.id, 'João Silva', 'Faculdade Unifac')}
                                  style={{ padding: '4px 8px', fontSize: '0.65rem', background: 'rgba(214, 168, 58, 0.1)', color: 'var(--gold)', border: '1px solid var(--gold)', borderRadius: '4px', cursor: 'pointer' }}>
                                  Vincular João
                                </button>
                              )}

                              {c.status === 'financiado' && c.membro && (
                                <button 
                                  onClick={() => handleAtualizarStatusCredito(c.id, 'bolsa_ativa')}
                                  style={{ padding: '4px 8px', fontSize: '0.65rem', background: 'var(--green-glow)', color: 'var(--green)', border: '1px solid var(--green)', borderRadius: '4px', cursor: 'pointer' }}>
                                  Ativar Bolsa
                                </button>
                              )}

                              {c.status === 'vinculado' && (
                                <button 
                                  onClick={() => handleAtualizarStatusCredito(c.id, 'bolsa_ativa')}
                                  style={{ padding: '4px 8px', fontSize: '0.65rem', background: 'var(--green-glow)', color: 'var(--green)', border: '1px solid var(--green)', borderRadius: '4px', cursor: 'pointer' }}>
                                  Ativar Bolsa
                                </button>
                              )}

                              {c.status === 'bolsa_ativa' && (
                                <button 
                                  onClick={() => handleAtualizarStatusCredito(c.id, 'verificado')}
                                  style={{ padding: '4px 8px', fontSize: '0.65rem', background: 'rgba(255,255,255,0.05)', color: '#ffffff', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}>
                                  Verificar
                                </button>
                              )}

                              {c.status === 'verificado' && (
                                <button 
                                  onClick={() => handleAtualizarStatusCredito(c.id, 'reportado')}
                                  style={{ padding: '4px 8px', fontSize: '0.65rem', background: 'rgba(25, 195, 125, 0.1)', color: 'var(--green)', border: '1px solid var(--green)', borderRadius: '4px', cursor: 'pointer' }}>
                                  Reportar
                                </button>
                              )}

                              {c.status === 'reportado' && (
                                <button 
                                  onClick={() => handleAtualizarStatusCredito(c.id, 'aposentado')}
                                  style={{ padding: '4px 8px', fontSize: '0.65rem', background: 'rgba(168,162,154,0.1)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: '4px', cursor: 'pointer' }}>
                                  Aposentar
                                </button>
                              )}

                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Reset button for simulator demo */}
                <div style={{ textAlign: 'left' }}>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('cj_creditos');
                      window.location.reload();
                    }}
                    style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }}>
                    Reiniciar Dados da Simulação
                  </button>
                </div>

              </div>
            )}

          </section>

        </main>

      </div>
    </div>
  );
}

// ==========================================================================
// 3. FUNÇÕES AUXILIARES DE CÁLCULO
// ==========================================================================

function creditsTotalSpent(list) {
  return list.reduce((sum, c) => sum + c.valor, 0);
}

function countUniqueBolsistas(list) {
  const activeMembers = list
    .filter(c => c.membro !== '')
    .map(c => c.membro);
  return new Set(activeMembers).size;
}
