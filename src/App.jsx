import { useState, useEffect } from 'react'

// ==========================================================================
// 1. COMPONENTES REUTILIZÁVEIS E DE ALINHAMENTO
// ==========================================================================

const LogoJornada = ({ size = 28, color = 'var(--gold)' }) => (
  <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
    <circle cx="16" cy="16" r="13" stroke={color} strokeWidth="1.5" strokeDasharray="3 3" />
    <path d="M9 16.5L14 21.5L23 10.5" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 9H20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M16 9V14" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </svg>
)

// PolicyAlignmentCard: Alinhamento a Políticas Públicas e ESG
const PolicyAlignmentCard = () => {
  const axes = [
    { title: 'Permanência no Ensino Superior', desc: 'Combate à evasão de alunos de baixa renda por barreira de custos (ODS 4).', icon: 'fa-graduation-cap' },
    { title: 'Inclusão Produtiva e Trabalho Decente', desc: 'Reconhece o valor da jornada autônoma em reputação educacional (ODS 8).', icon: 'fa-briefcase' },
    { title: 'Mobilidade Urbana Sustentável', desc: 'Estimula a manutenção de frotas e incentiva transições para trajetos verdes (ODS 11).', icon: 'fa-route' },
    { title: 'Redução de Emissões Locais', desc: 'Monitoramento contínuo de emissões baseada em dados operacionais declarados (ODS 13).', icon: 'fa-leaf' }
  ];

  return (
    <div className="glass-card glow-green">
      <span className="demo-badge-pluggable" style={{ marginBottom: '10px', display: 'inline-block' }}>Diretrizes Governamentais</span>
      <h3 style={{ fontSize: '1.2rem', color: '#ffffff', marginBottom: '12px' }}>Alinhamento a Políticas Públicas & ESG</h3>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.4' }}>
        O Crédito de Jornada é estruturado para sincronizar a logística urbana com incentivos nacionais de qualificação profissional e redução de carbono:
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
        {axes.map((ax, idx) => (
          <div key={idx} style={{ background: 'var(--bg)', padding: '12px', border: '1px solid var(--border)', borderRadius: '10px' }}>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '6px' }}>
              <i className={`fa-solid ${ax.icon}`} style={{ color: 'var(--green)', fontSize: '0.85rem' }}></i>
              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#ffffff' }}>{ax.title}</span>
            </div>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>{ax.desc}</p>
          </div>
        ))}
      </div>

      <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '12px', fontSize: '0.68rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
        <i className="fa-solid fa-circle-info" style={{ color: 'var(--gold)', marginRight: '6px' }}></i>
        <strong>Termo de Impacto ESG:</strong> Crédito de Jornada baseado em diretrizes de impacto social, educação, mobilidade sustentável e redução estimada de emissões. No MVP experimental, não representa crédito de carbono regulado, ativos do mercado de capitais (CBIO) ou compensações oficiais auditadas.
      </div>
    </div>
  )
}

// TuitionEligibilityCard: Visualização de Bolsa Ativa do Motoboy
const TuitionEligibilityCard = ({ membro, score, sub }) => {
  const finalTuition = Math.max(0, 340 - sub);

  return (
    <div className="glass-card glow-gold">
      <div className="flex-between" style={{ marginBottom: '10px' }}>
        <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Matrícula & Subsídio</span>
        <span className="badge-status green" style={{ fontSize: '0.55rem' }}>Matrícula Ativa</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '12px' }}>
        <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Aluno Bolsista</span>
        <span style={{ fontSize: '0.95rem', fontWeight: 800, color: '#ffffff' }}>{membro.nome} ({membro.matricula})</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{membro.curso} — {membro.faculdade}</span>
      </div>

      {/* Demonstrativo da Fórmula */}
      <div style={{ background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid rgba(255,255,255,0.02)' }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.02em' }}>Cálculo de Bolsa do Corre</span>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.78rem' }}>
          <div className="flex-between">
            <span style={{ color: 'var(--text-secondary)' }}>Mensalidade cheia:</span>
            <span className="font-mono">R$ 340,00</span>
          </div>
          <div className="flex-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '4px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Subsídio pelo Score:</span>
            <span className="font-mono" style={{ color: 'var(--green)' }}>- R$ {sub.toFixed(2)}</span>
          </div>
          <div className="flex-between" style={{ paddingTop: '4px', fontWeight: 800 }}>
            <span style={{ color: '#ffffff' }}>Mensalidade final:</span>
            <span className="font-mono" style={{ color: 'var(--gold)' }}>R$ {finalTuition.toFixed(2)} / mês</span>
          </div>
        </div>
      </div>
    </div>
  )
}

// JornadaScoreCard: Visualizador Transparente e Positivo de Critérios
const JornadaScoreCard = ({ score, sub, membro }) => {
  const getProximoMarco = (sc) => {
    if (sc <= 400) return { pontos: 401 - sc, valor: 150 };
    if (sc <= 700) return { pontos: 701 - sc, valor: 220 };
    if (sc <= 900) return { pontos: 901 - sc, valor: 300 };
    return null;
  };

  const proximo = getProximoMarco(score);

  // Faixa de Elegibilidade
  const getFaixa = (sc) => {
    if (sc <= 400) return 'Acesso Start';
    if (sc <= 700) return 'Acesso Growth';
    if (sc <= 900) return 'Acesso Impact';
    return 'Acesso Integral';
  };

  return (
    <div className="glass-card" style={{ padding: '18px', background: 'var(--surface-elevated)' }}>
      <div className="flex-between" style={{ marginBottom: '12px' }}>
        <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Score de Jornada</span>
        <span className="badge-status gold" style={{ fontSize: '0.62rem', fontWeight: 800 }}>{getFaixa(score)}</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '2px' }}>
        <span style={{ fontSize: '2.4rem', fontWeight: 900, color: '#ffffff', lineHeight: 1 }}>{score}</span>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>/ 1000</span>
      </div>

      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
        Subsídio educacional ativo: <strong style={{ color: 'var(--green)' }}>R$ {sub.toFixed(2)}/mês</strong>
      </div>

      {/* Mensagem Positiva de Incentivo */}
      {proximo ? (
        <div style={{ background: 'var(--gold-glow)', border: '1px solid rgba(214, 168, 58, 0.2)', padding: '10px', borderRadius: '8px', fontSize: '0.7rem', color: 'var(--gold)', marginBottom: '14px', lineHeight: '1.3' }}>
          <i className="fa-solid fa-circle-arrow-up"></i> Você está a <strong>{proximo.pontos} pontos</strong> de liberar a faixa de subsídio de <strong>R$ {proximo.valor}/mês</strong>. Quanto mais seu corre é comprovado, maior pode ser seu acesso educacional!
        </div>
      ) : (
        <div style={{ background: 'var(--green-glow)', border: '1px solid rgba(25, 195, 125, 0.2)', padding: '10px', borderRadius: '8px', fontSize: '0.7rem', color: 'var(--green)', marginBottom: '14px' }}>
          <i className="fa-solid fa-circle-check"></i> Parabéns! Você atingiu a faixa máxima de subsídio do programa (Acesso Integral).
        </div>
      )}

      {/* Critérios do Score */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.72rem', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
        <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>Critérios que influenciam seu score</span>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
          <div style={{ color: '#ffffff' }}><i className="fa-solid fa-check text-success" style={{ marginRight: '4px', color: 'var(--green)' }}></i> Jornada: {membro.kmMensal} km</div>
          <div style={{ color: '#ffffff' }}><i className="fa-solid fa-check text-success" style={{ marginRight: '4px', color: 'var(--green)' }}></i> Matrícula: Ativa</div>
          <div style={{ color: '#ffffff' }}><i className="fa-solid fa-check text-success" style={{ marginRight: '4px', color: 'var(--green)' }}></i> Frequência: regular</div>
          <div style={{ color: 'var(--text-secondary)' }}><i className="fa-solid fa-circle-dot" style={{ marginRight: '4px', color: 'var(--gold)' }}></i> Combustível declared</div>
          <div style={{ color: 'var(--text-secondary)' }}><i className="fa-solid fa-circle-dot" style={{ marginRight: '4px', color: 'var(--gold)' }}></i> Moto regulada</div>
          <div style={{ color: 'var(--text-secondary)' }}><i className="fa-solid fa-circle-dot" style={{ marginRight: '4px', color: 'var(--gold)' }}></i> Impacto estimado</div>
        </div>
      </div>

      {/* Nota de Transparência Exigida */}
      <div style={{ borderTop: '1px dashed rgba(244, 241, 232, 0.08)', paddingTop: '8px', marginTop: '12px', fontSize: '0.6rem', color: 'var(--text-secondary)', lineHeight: '1.3' }}>
        <strong>Nota de Transparência:</strong> O Score de Jornada não avalia valor pessoal, renda ou mérito individual. Ele mede apenas evidências operacionais e acadêmicas necessárias para liberar subsídios do programa.
      </div>
    </div>
  )
}

// ==========================================================================
// 3. COMPONENTE ORQUESTRADOR CENTRAL (DASHBOARD SPLIT)
// ==========================================================================

export default function App() {
  // Navegação
  const [activeTab, setActiveTab] = useState('score'); // 'score' | 'sponsor' | 'university' | 'backoffice'
  const [activePhoneTab, setActivePhoneTab] = useState('carteira'); // 'carteira' | 'registrar' | 'academic'

  // Cadastro do Motoboy João Silva (dados mockados centrais)
  const [membro, setMembro] = useState({
    nome: 'João Silva',
    tempoCorre: '4 anos',
    veiculo: 'Moto a Combustão (150cc)',
    combustivel: 'Gasolina',
    frequenciaAcademica: 'Excelente', // 'Excelente' | 'Regular' | 'Baixa'
    curso: 'Análise e Desenvolvimento de Sistemas EAD',
    faculdade: 'Faculdade Unifac',
    matricula: 'UF-8032-2026',
    kmMensal: 1950,
    bolsaProgresso: 4,
    bolsaTotal: 24
  });

  // Lista de créditos e repasses mockados
  const [creditos, setCreditos] = useState([
    { id: '#CJ-201', status: 'aposentado', membro: 'João Silva', faculdade: 'Faculdade Unifac', valor: 300, veiculo: 'Moto a Gasolina', reducaoCO2: 12, hash: '0x3ef9a82cd819', alerta: 'Regular' },
    { id: '#CJ-202', status: 'reportado', membro: 'João Silva', faculdade: 'Faculdade Unifac', valor: 300, veiculo: 'Moto a Gasolina', reducaoCO2: 24, hash: '0xa871be82cd02', alerta: 'Regular' },
    { id: '#CJ-203', status: 'verificado', membro: 'Marcos Santos', faculdade: 'Instituto Politec', valor: 300, veiculo: 'Moto a Gasolina', reducaoCO2: 18, hash: '0xb2cd3489fe12', alerta: 'ausência de atualização por 15 dias' },
    { id: '#CJ-204', status: 'bolsa_ativa', membro: 'João Silva', faculdade: 'Faculdade Unifac', valor: 300, veiculo: 'Moto a Gasolina', reducaoCO2: 32, hash: '0xf92b7cd8014e', alerta: 'Regular' },
    { id: '#CJ-205', status: 'vinculado', membro: 'Aline Oliveira', faculdade: 'Instituto Politec', valor: 300, veiculo: 'Moto a Gasolina', reducaoCO2: 14, hash: '0x7e819bcf8211', alerta: 'matrícula sem confirmação recente' },
    { id: '#CJ-206', status: 'bolsa_ativa', membro: 'Paulo Costa', faculdade: 'Centro Acadêmico Leste', valor: 300, veiculo: 'Moto a Gasolina', reducaoCO2: 16, hash: '0x9d821abcde04', alerta: 'frequência acadêmica abaixo do combinado' }
  ]);

  // Inputs e controles
  const [kmInput, setKmInput] = useState('80');
  const [veiculoInput, setVeiculoInput] = useState('Moto a Combustão (150cc)');
  const [combustivelInput, setCombustivelInput] = useState('Gasolina');
  const [filtroFaculdade, setFiltroFaculdade] = useState('all');

  // Patrocinador ESG inputs
  const [qtyPatrocinio, setQtyPatrocinio] = useState('3');
  const [cotaPatrocinio, setCotaPatrocinio] = useState('300'); // '150' | '300' | '500'
  const [empresaPatrocinio, setEmpresaPatrocinio] = useState('Logística ZLeste');

  // Relógio do celular
  const [clockTime, setClockTime] = useState('12:20');
  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClockTime(`${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`);
    };
    update();
    const interval = setInterval(update, 20000);
    return () => clearInterval(interval);
  }, []);

  // --- Lógica de Cálculo do Score ---
  // Score = Km / 3.5 + Combustível Bônus + Frequência Bônus
  const getFatorCombustivel = (comb) => {
    if (comb === 'Eletricidade') return 250;
    if (comb === 'Etanol') return 100;
    return 0;
  };
  const getFatorFrequencia = (freq) => {
    if (freq === 'Excelente') return 200;
    if (freq === 'Regular') return 100;
    return 50;
  };

  const calculatedScore = Math.min(1000, Math.round(
    (membro.kmMensal / 3.5) + getFatorCombustivel(membro.combustivel) + getFatorFrequencia(membro.frequenciaAcademica)
  ));

  // --- Lógica de Subsídio baseado nas faixas oficiais ---
  const getSubsídioPeloScore = (sc) => {
    if (sc <= 400) return 80;
    if (sc <= 700) return 150;
    if (sc <= 900) return 220;
    return 300; // Acesso Integral
  };

  const activeSubsidy = getSubsídioPeloScore(calculatedScore);

  // --- Ações Simuladas ---

  // Motoboy registra km
  const handleRegistrarKm = (e) => {
    e.preventDefault();
    const km = parseFloat(kmInput);
    if (isNaN(km) || km <= 0) return;

    const updatedMembro = {
      ...membro,
      kmMensal: membro.kmMensal + km,
      veiculo: veiculoInput,
      combustivel: combustivelInput
    };
    setMembro(updatedMembro);

    // Incrementa CO2 no credito vinculado
    const isElectric = veiculoInput.includes('Elétrica') || combustivelInput === 'Eletricidade';
    const fatorReducao = isElectric ? 0.048 : 0.012; // kg CO2 por km

    setCreditos(prev => prev.map(c => {
      if (c.membro === 'João Silva' && c.status === 'bolsa_ativa') {
        return {
          ...c,
          veiculo: veiculoInput,
          reducaoCO2: Math.round(c.reducaoCO2 + (km * fatorReducao))
        };
      }
      return c;
    }));

    setKmInput('');
    alert(`Corre de ${km} km registrado! Seu Score de Jornada e subsídios foram atualizados em tempo real.`);
    setActivePhoneTab('carteira');
  };

  // Empresa patrocinadora fecha cotas
  const handleComprarPatrocinio = (e) => {
    e.preventDefault();
    const qty = parseInt(qtyPatrocinio);
    const valor = parseFloat(cotaPatrocinio);
    const novos = [];

    for (let i = 0; i < qty; i++) {
      const id = `#CJ-${Math.floor(210 + Math.random() * 800)}`;
      const hash = '0x' + Array.from({length: 12}, () => Math.floor(Math.random()*16).toString(16)).join('');
      novas = [...novas, {
        id,
        status: 'financiado',
        membro: '',
        faculdade: '',
        valor: valor,
        veiculo: 'Moto a Gasolina',
        reducaoCO2: 12,
        hash,
        alerta: 'Regular'
      }];
    }

    setCreditos(prev => [...prev, ...novas]);
    alert(`Mensalidades patrocinadas! Você gerou ${qty} novos Créditos de Jornada no valor de R$ ${valor}/mês. Aloque-os para entregadores na aba Admin.`);
    setActiveTab('backoffice');
  };

  // Admin manipula status do ciclo de vida
  const handleAdminStatusChange = (id, newStatus) => {
    setCreditos(prev => prev.map(c => {
      if (c.id === id) {
        if (newStatus === 'bolsa_ativa' && c.membro === 'João Silva' && c.status !== 'bolsa_ativa') {
          setMembro(m => ({ ...m, bolsaProgresso: Math.min(m.bolsaTotal, m.bolsaProgresso + 1) }));
        }
        return { ...c, status: newStatus };
      }
      return c;
    }));
  };

  // Admin vincula entregador pendente
  const handleAdminVincular = (id, nomeMembro, faculdadeNome) => {
    setCreditos(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'vinculado',
          membro: nomeMembro,
          faculdade: faculdadeNome
        };
      }
      return c;
    }));
    alert(`Crédito ${id} vinculado com sucesso a ${nomeMembro}.`);
  };

  // --- Catálogo de Faculdades ---
  const faculdadesList = [
    { name: 'Faculdade Unifac', modality: 'EAD', course: 'ADS EAD', price: 340, region: 'Zona Leste', tags: ['tecnologia'], status: 'Disponível' },
    { name: 'Instituto Politec', modality: 'Semipresencial', course: 'Logística de Distribuição', price: 290, region: 'Zona Sul', tags: ['logística'], status: 'Disponível' },
    { name: 'Centro Acadêmico Leste', modality: 'Presencial', course: 'Empreendedorismo e Gestão', price: 420, region: 'Zona Norte', tags: ['administração'], status: 'Lista de espera' },
    { name: 'Faculdade Metropolitana', modality: 'EAD', course: 'Gestão Comercial Digital', price: 250, region: 'Centro', tags: ['administração'], status: 'Disponível' },
    { name: 'Instituto Politec', modality: 'EAD', course: 'Segurança de Banco de Dados', price: 380, region: 'Zona Sul', tags: ['tecnologia'], status: 'Em validação' }
  ];

  // Filtros aplicados
  const filteredFaculdades = faculdadesList.filter(f => {
    if (filtroFaculdade === 'all') return true;
    if (filtroFaculdade === 'ead') return f.modality === 'EAD';
    return f.tags.includes(filtroFaculdade);
  });

  return (
    <div className="demo-viewport">
      
      {/* HEADER PRINCIPAL */}
      <header className="demo-header">
        <div className="demo-logo-section">
          <LogoJornada size={30} color="var(--gold)" />
          <div>
            <h1 className="demo-title" style={{ fontSize: '1.6rem', lineHeight: 1.1 }}>Corre pra Faculdade</h1>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block', marginTop: '2px' }}>
              “Seu Score de Jornada pode reduzir sua mensalidade.”
            </span>
          </div>
          <span className="demo-badge-pluggable" style={{ marginLeft: '12px' }}>API Integrável</span>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className={`panel-tab-btn ${activeTab === 'score' ? 'active' : ''}`} onClick={() => setActiveTab('score')}>
            <i className="fa-solid fa-graduation-cap"></i> Score & Bolsa
          </button>
          <button className={`panel-tab-btn ${activeTab === 'sponsor' ? 'active' : ''}`} onClick={() => setActiveTab('sponsor')}>
            <i className="fa-solid fa-building-user"></i> Patrocinador ESG
          </button>
          <button className={`panel-tab-btn ${activeTab === 'university' ? 'active' : ''}`} onClick={() => setActiveTab('university')}>
            <i className="fa-solid fa-school"></i> Faculdades Parceiras
          </button>
          <button className={`panel-tab-btn ${activeTab === 'backoffice' ? 'active' : ''}`} onClick={() => setActiveTab('backoffice')}>
            <i className="fa-solid fa-sliders"></i> Admin de Impacto
          </button>
        </div>
      </header>

      {/* DUAL PANE WRAPPER */}
      <div className="demo-workspace">
        
        {/* LADO ESQUERDO: SMARTPHONE SIMULATOR */}
        <section className="phone-simulator-frame">
          <div className="phone-screen">
            <div className="phone-notch"></div>

            {/* Simulated Phone Bar */}
            <div style={{ height: '36px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px 0 20px', fontSize: '0.72rem', fontWeight: 800 }}>
              <span>{clockTime}</span>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                <i className="fa-solid fa-signal"></i>
                <span style={{ fontSize: '0.6rem' }}>5G</span>
                <i className="fa-solid fa-battery-three-quarters"></i>
              </div>
            </div>

            {/* Phone App Header */}
            <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <LogoJornada size={18} color="var(--gold)" />
                <span style={{ fontSize: '0.82rem', fontWeight: 900, color: '#ffffff' }}>Corre pra Faculdade</span>
              </div>
              <span className="badge-status green" style={{ fontSize: '0.52rem' }}>Matrícula Ativa</span>
            </div>

            {/* Phone Internal Area */}
            <div className="phone-content">
              
              {activePhoneTab === 'carteira' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Membro Logado</span>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>Salve, {membro.nome.split(' ')[0]}.</h3>
                  </div>

                  {/* Componente TuitionEligibilityCard */}
                  <TuitionEligibilityCard membro={membro} score={calculatedScore} sub={activeSubsidy} />

                  {/* Componente JornadaScoreCard */}
                  <JornadaScoreCard score={calculatedScore} sub={activeSubsidy} membro={membro} />

                  {/* Métricas rápidas */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div style={{ background: 'var(--surface-elevated)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', display: 'block' }}>Trajeto Mensal</span>
                      <strong style={{ fontSize: '0.9rem', color: '#ffffff' }}>{membro.kmMensal} km</strong>
                    </div>
                    <div style={{ background: 'var(--surface-elevated)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', display: 'block' }}>Potencial Verde</span>
                      <strong style={{ fontSize: '0.9rem', color: 'var(--green)' }}>
                        <i className="fa-solid fa-leaf"></i> {creditos.find(c => c.membro === 'João Silva' && c.status === 'bolsa_ativa')?.reducaoCO2 || 12} kg
                      </strong>
                    </div>
                  </div>

                  {/* CTA's */}
                  <button className="btn-premium btn-primary" onClick={() => setActivePhoneTab('registrar')} style={{ padding: '10px 16px', fontSize: '0.78rem' }}>
                    <i className="fa-solid fa-route"></i> Registrar Jornada
                  </button>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button className="btn-premium btn-secondary" onClick={() => { setActivePhoneTab('academic'); }} style={{ padding: '8px 12px', fontSize: '0.65rem' }}>
                      <i className="fa-solid fa-file-invoice"></i> Ver Matrícula
                    </button>
                    <button className="btn-premium btn-secondary" onClick={() => { setActiveTab('university'); }} style={{ padding: '8px 12px', fontSize: '0.65rem' }}>
                      <i className="fa-solid fa-magnifying-glass"></i> Ver Faculdades
                    </button>
                  </div>
                </div>
              )}

              {activePhoneTab === 'registrar' && (
                <form onSubmit={handleRegistrarKm} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button type="button" className="btn-back" onClick={() => setActivePhoneTab('carteira')} style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <i className="fa-solid fa-arrow-left"></i> Voltar
                    </button>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Comprove Jornada</span>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>Cadastrar Rota de Hoje</h3>

                  <div className="form-input-group">
                    <label className="form-label">Quilômetros Rodados</label>
                    <input 
                      type="number" 
                      className="form-text" 
                      value={kmInput} 
                      onChange={(e) => setKmInput(e.target.value)} 
                      placeholder="Ex: 100" 
                      required 
                    />
                  </div>

                  <div className="form-input-group">
                    <label className="form-label">Veículo Utilizado</label>
                    <select className="form-select" value={veiculoInput} onChange={(e) => setVeiculoInput(e.target.value)}>
                      <option value="Moto a Combustão (150cc)">Moto a Combustão (Regular)</option>
                      <option value="Scooter Elétrica">Scooter Elétrica (Transição Verde)</option>
                      <option value="Bike Elétrica">Bicicleta Elétrica (Carbono Zero)</option>
                    </select>
                  </div>

                  <div className="form-input-group">
                    <label className="form-label">Tipo de Combustível Declarado</label>
                    <select className="form-select" value={combustivelInput} onChange={(e) => setCombustivelInput(e.target.value)}>
                      <option value="Gasolina">Gasolina (Combustão Comum)</option>
                      <option value="Etanol">Etanol (Menor emissão estimada)</option>
                      <option value="Eletricidade">Bateria Recarregável (Critério Ecológico)</option>
                    </select>
                  </div>

                  <button type="submit" className="btn-premium btn-primary">
                    Enviar para Validação
                  </button>
                </form>
              )}

              {activePhoneTab === 'academic' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button type="button" className="btn-back" onClick={() => setActivePhoneTab('carteira')} style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.85rem' }}>
                      <i className="fa-solid fa-arrow-left"></i> Voltar
                    </button>
                    <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Secretaria Digital</span>
                  </div>

                  <div className="glass-card" style={{ padding: '14px' }}>
                    <h4 style={{ fontSize: '0.78rem', color: '#ffffff', marginBottom: '8px' }}>Comprovante EAD Ativo</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '8px' }}>
                      <p><strong>Curso:</strong> {membro.curso}</p>
                      <p><strong>Instituição:</strong> {membro.faculdade}</p>
                      <p><strong>Código de Matrícula:</strong> {membro.matricula}</p>
                      <p><strong>Frequência Escolar:</strong> {membro.frequenciaAcademica} (Repasse ativo)</p>
                    </div>
                  </div>

                  <div className="glass-card" style={{ padding: '14px', borderColor: 'var(--green)' }}>
                    <h4 style={{ fontSize: '0.78rem', color: 'var(--green)', marginBottom: '8px' }}>Subsídios Educacionais Pagos</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', fontSize: '0.7rem' }}>
                      {[
                        { mes: 'Maio/2026', valor: 'R$ 220,00', status: 'Repassado' },
                        { mes: 'Abril/2026', valor: 'R$ 220,00', status: 'Repassado' },
                        { mes: 'Março/2026', valor: 'R$ 220,00', status: 'Repassado' },
                        { mes: 'Fevereiro/2026', valor: 'R$ 220,00', status: 'Repassado' }
                      ].map((item, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.02)', paddingBottom: '4px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>{item.mes}</span>
                          <span style={{ color: '#ffffff', fontWeight: 700 }}>{item.valor} <span style={{ color: 'var(--green)' }}>(✓)</span></span>
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
              background: 'rgba(18, 17, 15, 0.9)',
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
                <i className="fa-solid fa-graduation-cap"></i>
                <span style={{ fontSize: '0.55rem', fontWeight: 800 }}>Minha Bolsa</span>
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
                <i className="fa-solid fa-receipt"></i>
                <span style={{ fontSize: '0.55rem', fontWeight: 800 }}>Matrícula</span>
              </button>
            </div>

          </div>
        </section>

        {/* LADO DIREITO: DESKTOP PANEL */}
        <main className="desktop-panel">
          <section className="panel-content">
            
            {/* ABA 1: SCORE & BOLSA (Visão Operacional Principal) */}
            {activeTab === 'score' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div className="glass-card glow-gold" style={{ padding: '26px' }}>
                  <span className="demo-badge-pluggable" style={{ marginBottom: '10px', display: 'inline-block' }}>Acesso Educacional</span>
                  <h2 style={{ fontSize: '2.1rem', fontWeight: 800, color: '#ffffff', marginBottom: '8px' }}>
                    Seu Score de Jornada pode reduzir sua mensalidade.
                  </h2>
                  <p style={{ fontSize: '0.92rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                    O Crédito de Jornada converte dados operacionais do trajeto diário de motoboys e indicadores acadêmicos em subsídio financeiro direto na faculdade. Empresas patrocinadoras financiam a cota ESG e adquirem os relatórios de impacto.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', margin: '20px 0' }}>
                    <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Passo 1</span>
                      <h4 style={{ color: 'var(--gold)', fontSize: '0.9rem', margin: '4px 0' }}>Comprove jornada e impacto</h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>O entregador registra rotas no aplicativo, declarando combustível e mantendo revisões.</p>
                    </div>
                    <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Passo 2</span>
                      <h4 style={{ color: 'var(--green)', fontSize: '0.9rem', margin: '4px 0' }}>Score de Elegibilidade</h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>O score calcula a faixa (Start/Growth/Impact/Integral) e libera até R$ 300/mês de subsídio.</p>
                    </div>
                    <div style={{ background: 'var(--bg)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', display: 'block', textTransform: 'uppercase' }}>Passo 3</span>
                      <h4 style={{ color: '#ffffff', fontSize: '0.9rem', margin: '4px 0' }}>Repasse para Faculdade</h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>O valor é descontado na mensalidade cheia de faculdades parceiras EAD ou semipresenciais.</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-premium btn-gold" onClick={() => setActiveTab('sponsor')} style={{ width: 'auto' }}>
                      Simulador de Patrocínio ESG
                    </button>
                    <button className="btn-premium btn-secondary" onClick={() => setActiveTab('university')} style={{ width: 'auto' }}>
                      Visualizar Faculdades e Cursos
                    </button>
                  </div>
                </div>

                <PolicyAlignmentCard />
              </div>
            )}

            {/* ABA 2: PATROCINADOR ESG (SIMULADOR DE MENSALIDADES) */}
            {activeTab === 'sponsor' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                
                {/* Indicadores do Patrocinador */}
                <div className="metric-grid">
                  <div className="metric-item">
                    <span className="metric-lbl">Total Investido</span>
                    <span className="metric-val gold">R$ {creditsTotalSpent(creditos).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-lbl">Alocado em Educação</span>
                    <span className="metric-val">R$ {totalRepassadoEducacao.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-lbl">Bolsistas Beneficiados</span>
                    <span className="metric-val">{countUniqueBolsistas(creditos)} motoboys</span>
                  </div>
                  <div className="metric-item">
                    <span className="metric-lbl">Redução de Emissão CO₂</span>
                    <span className="metric-val green">{totalCO2Reduzido} kg (estimado)</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  
                  {/* Simulador de Patrocínio Educacional */}
                  <div className="glass-card">
                    <h3 style={{ fontSize: '1.15rem', color: '#ffffff', marginBottom: '4px' }}>Patrocinar Mensalidades</h3>
                    <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '16px' }}>
                      Defina o volume de entregadores e a cota ESG para gerar os créditos de impacto:
                    </span>
                    
                    <form onSubmit={handleComprarPatrocinio} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="form-input-group">
                        <label className="form-label">Sua Empresa (Razão Social Patrocinadora)</label>
                        <input 
                          type="text" 
                          className="form-text" 
                          value={empresaPatrocinio} 
                          onChange={(e) => setEmpresaPatrocinio(e.target.value)} 
                          placeholder="Ex: Logística ZLeste Ltda"
                        />
                      </div>

                      <div className="form-input-group">
                        <label className="form-label">Quantos motoboys sua empresa quer colocar na faculdade este mês?</label>
                        <input 
                          type="number" 
                          className="form-text" 
                          value={qtyPatrocinio} 
                          onChange={(e) => setQtyPatrocinio(e.target.value)} 
                          min="1" 
                          max="50" 
                          required 
                        />
                      </div>

                      <div className="form-input-group">
                        <label className="form-label">Escolha a Cota Mensal por Entregador</label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                          {[
                            { value: '150', name: 'Start', price: 'R$150/mês' },
                            { value: '300', name: 'Growth', price: 'R$300/mês' },
                            { value: '500', name: 'Impact', price: 'R$500/mês' }
                          ].map(opt => (
                            <label key={opt.value} style={{
                              border: cotaPatrocinio === opt.value ? '2px solid var(--gold)' : '1px solid var(--border)',
                              background: 'var(--bg)',
                              borderRadius: '8px',
                              padding: '10px 4px',
                              textAlign: 'center',
                              cursor: 'pointer',
                              display: 'block'
                            }}>
                              <input 
                                type="radio" 
                                name="cotaPatrocinio" 
                                value={opt.value} 
                                checked={cotaPatrocinio === opt.value} 
                                onChange={() => setCotaPatrocinio(opt.value)} 
                                style={{ display: 'none' }}
                              />
                              <span style={{ fontSize: '0.75rem', fontWeight: 800, display: 'block', color: '#ffffff' }}>{opt.name}</span>
                              <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)' }}>{opt.price}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      {/* Resumo da compra */}
                      <div style={{ background: 'var(--bg)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border)', fontSize: '0.75rem' }}>
                        <div className="flex-between" style={{ marginBottom: '4px' }}>
                          <span>Apoio total mensal:</span>
                          <strong>R$ {(parseInt(qtyPatrocinio || 0) * parseFloat(cotaPatrocinio || 0)).toFixed(2)}</strong>
                        </div>
                        <div className="flex-between">
                          <span>Destinado diretamente à faculdade:</span>
                          <strong style={{ color: 'var(--green)' }}>R$ {((parseInt(qtyPatrocinio || 0) * parseFloat(cotaPatrocinio || 0) * 220) / 300).toFixed(2)}</strong>
                        </div>
                      </div>

                      <button type="submit" className="btn-premium btn-gold">
                        Patrocinar mensalidades
                      </button>
                    </form>
                  </div>

                  {/* Recibo e Rastreabilidade */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div className="flex-between">
                      <h3 style={{ fontSize: '1.1rem', color: '#ffffff' }}>Recibo de Impacto Educacional</h3>
                      <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>ID do Crédito</span>
                    </div>

                    <DocumentoCredito cred={creditos[3]} />
                  </div>

                </div>

                <ComplianceNotice />
              </div>
            )}

            {/* ABA 3: CATÁLOGO DE FACULDADES COMPATÍVEIS */}
            {activeTab === 'university' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ textAlign: 'left' }}>
                  <span className="demo-badge-pluggable" style={{ marginBottom: '8px' }}>Universidades Conectadas</span>
                  <h3 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Rede de Acesso Educacional</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Com base no seu **Score de Jornada ({calculatedScore} pontos)**, calculamos abaixo as mensalidades finais correspondentes:
                  </p>
                </div>

                {/* Filtros */}
                <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border)', paddingBottom: '10px' }}>
                  {[
                    { key: 'all', name: 'Todos os Cursos' },
                    { key: 'tecnologia', name: 'Tecnologia' },
                    { key: 'logística', name: 'Logística' },
                    { key: 'ead', name: 'Apenas EAD' }
                  ].map(f => (
                    <button 
                      key={f.key} 
                      className={`panel-tab-btn ${filtroFaculdade === f.key ? 'active' : ''}`}
                      onClick={() => setFiltroFaculdade(f.key)}
                      style={{ fontSize: '0.78rem', padding: '4px 12px' }}>
                      {f.name}
                    </button>
                  ))}
                </div>

                {/* Lista de Match */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
                  {filteredFaculdades.map((fac, i) => {
                    const localSubsidy = getSubsídioPeloScore(calculatedScore);
                    const finalPrice = Math.max(0, fac.price - localSubsidy);
                    const isHighlyCompatible = finalPrice <= 120;

                    return (
                      <div key={i} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div className="flex-between">
                          <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#ffffff' }}>{fac.name}</span>
                          <span className={`badge-status ${fac.status === 'Disponível' ? 'green' : 'neutral'}`}>{fac.status}</span>
                        </div>
                        
                        <div>
                          <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>{fac.modality}</span>
                          <h4 style={{ fontSize: '0.85rem', color: 'var(--gold)', fontWeight: 700 }}>{fac.course}</h4>
                        </div>

                        {/* Comparativo de Preço com Cálculo */}
                        <div style={{ background: 'var(--bg)', padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '0.72rem' }}>
                          <div className="flex-between">
                            <span style={{ color: 'var(--text-secondary)' }}>Mensalidade cheia:</span>
                            <span className="font-mono">R$ {fac.price},00</span>
                          </div>
                          <div className="flex-between">
                            <span style={{ color: 'var(--text-secondary)' }}>Subsídio pelo seu Score:</span>
                            <span className="font-mono" style={{ color: 'var(--green)' }}>- R$ {localSubsidy},00</span>
                          </div>
                          <div className="flex-between" style={{ borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: '6px', paddingTop: '4px', fontWeight: 700 }}>
                            <span style={{ color: '#ffffff' }}>Valor final para você:</span>
                            <span className="font-mono" style={{ color: 'var(--gold)' }}>R$ {finalPrice},00 / mês</span>
                          </div>
                        </div>

                        <div className="flex-between" style={{ fontSize: '0.65rem', borderTop: '1px solid rgba(255,255,255,0.02)', paddingTop: '6px' }}>
                          <span style={{ color: 'var(--text-secondary)' }}>Compatibilidade: <strong style={{ color: isHighlyCompatible ? 'var(--green)' : 'var(--gold)' }}>{isHighlyCompatible ? 'Alta' : 'Média'}</strong></span>
                          <span style={{ color: 'var(--text-secondary)' }}><i className="fa-solid fa-location-dot"></i> {fac.region}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

              </div>
            )}

            {/* ABA 4: ADMIN DE IMPACTO (BACKOFFICE) */}
            {activeTab === 'backoffice' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ textAlign: 'left' }}>
                  <span className="demo-badge-pluggable" style={{ marginBottom: '8px' }}>Mesa de Auditoria</span>
                  <h3 style={{ fontSize: '1.4rem', color: '#ffffff' }}>Backoffice de Impacto</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    Monitore a frequência de estudos dos bolsistas, verifique a quilometragem e atenda aos **alertas de acompanhamento** acadêmicos.
                  </p>
                </div>

                {/* Tabela de Controle */}
                <div className="glass-card">
                  <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.78rem' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                          <th style={{ padding: '10px' }}>Crédito</th>
                          <th style={{ padding: '10px' }}>Bolsista</th>
                          <th style={{ padding: '10px' }}>Score</th>
                          <th style={{ padding: '10px' }}>Faculdade / Curso</th>
                          <th style={{ padding: '10px' }}>Mensalidade</th>
                          <th style={{ padding: '10px' }}>Alertas de Acompanhamento</th>
                          <th style={{ padding: '10px', textAlign: 'right' }}>Ação ESG</th>
                        </tr>
                      </thead>
                      <tbody>
                        {creditos.map(c => {
                          const isWarning = c.alerta !== 'Regular';
                          
                          return (
                            <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                              <td style={{ padding: '10px', fontWeight: 700, color: 'var(--gold)' }}>{c.id}</td>
                              <td style={{ padding: '10px', fontWeight: 700, color: '#ffffff' }}>{c.membro || <span style={{ color: 'var(--text-secondary)' }}>Não Alocado</span>}</td>
                              <td style={{ padding: '10px' }}>{c.membro === 'João Silva' ? calculatedScore : (c.membro ? '680' : '—')}</td>
                              <td style={{ padding: '10px' }}>
                                <span style={{ display: 'block', fontWeight: 600, color: '#ffffff' }}>{c.faculdade || '—'}</span>
                                <span style={{ display: 'block', fontSize: '0.65rem', color: 'var(--text-secondary)' }}>{c.curso || '—'}</span>
                              </td>
                              <td style={{ padding: '10px', fontFamily: 'var(--font-mono)' }}>R$ {c.valor}</td>
                              <td style={{ padding: '10px' }}>
                                {isWarning ? (
                                  <span style={{ color: 'var(--danger)', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                    <i className="fa-solid fa-triangle-exclamation"></i> {c.alerta}
                                  </span>
                                ) : (
                                  <span style={{ color: 'var(--green)', fontWeight: 600 }}>
                                    <i className="fa-solid fa-circle-check"></i> Frequência Regular
                                  </span>
                                )}
                              </td>
                              <td style={{ padding: '10px', textAlign: 'right' }}>
                                {!c.membro ? (
                                  <button 
                                    className="btn-premium btn-primary"
                                    onClick={() => handleAdminVincular(c.id, 'Marcos Santos', 'Instituto Politec')}
                                    style={{ padding: '4px 8px', fontSize: '0.65rem', width: 'auto' }}>
                                    Vincular
                                  </button>
                                ) : (
                                  <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                    {c.status === 'financiado' && (
                                      <button 
                                        className="btn-premium btn-primary"
                                        onClick={() => handleAdminStatusChange(c.id, 'bolsa_ativa')}
                                        style={{ padding: '4px 8px', fontSize: '0.65rem', width: 'auto' }}>
                                        Ativar Bolsa
                                      </button>
                                    )}
                                    {c.status === 'bolsa_ativa' && (
                                      <button 
                                        className="btn-premium btn-secondary"
                                        onClick={() => handleAdminStatusChange(c.id, 'verificado')}
                                        style={{ padding: '4px 8px', fontSize: '0.65rem', width: 'auto', borderColor: 'var(--green)', color: 'var(--green)' }}>
                                        Auditar
                                      </button>
                                    )}
                                    {c.status === 'verificado' && (
                                      <button 
                                        className="btn-premium btn-primary"
                                        onClick={() => handleAdminStatusChange(c.id, 'reportado')}
                                        style={{ padding: '4px 8px', fontSize: '0.65rem', width: 'auto' }}>
                                        Reportar
                                      </button>
                                    )}
                                    {c.status === 'reportado' && (
                                      <span className="badge-status neutral">Reportado</span>
                                    )}
                                    {c.status === 'aposentado' && (
                                      <span className="badge-status neutral">Aposentado</span>
                                    )}
                                  </div>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Reset button */}
                <div style={{ textAlign: 'left' }}>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('cj_creditos');
                      window.location.reload();
                    }}
                    style={{ padding: '8px 16px', background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', borderRadius: '6px', fontSize: '0.72rem', cursor: 'pointer' }}>
                    Reiniciar Simulador
                  </button>
                </div>

              </div>
            )}

          </section>
        </main>

      </div>
    </div>
  )
}

// Helper calculation
function creditsTotalSpent(list) {
  return list.reduce((sum, c) => sum + c.valor, 0);
}

function countUniqueBolsistas(list) {
  const active = list.filter(c => c.membro !== '').map(c => c.membro);
  return new Set(active).size;
}
