import { useState, useMemo } from 'react'
import { apiFetch } from '../../models/api.js'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

function validateEmail(v) {
  if (!v) return null
  return EMAIL_RE.test(v.trim())
}

function validateSenha(v) {
  return {
    minLen:  v.length >= 6,
    hasLetr: /[a-zA-ZÀ-ú]/.test(v),
    hasNum:  /[0-9]/.test(v),
  }
}

const reqIcon = (ok) => ok
  ? <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)', fontSize: '0.65rem' }} />
  : <i className="fa-solid fa-circle" style={{ color: 'rgba(255,255,255,0.18)', fontSize: '0.65rem' }} />

export function LoginScreen({ onLogin }) {
  const [tab, setTab]     = useState('entrar')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome,  setNome]  = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [touched, setTouched] = useState({ email: false, senha: false })

  const emailOk  = useMemo(() => validateEmail(email), [email])
  const senhaReqs = useMemo(() => validateSenha(senha), [senha])
  const senhaOk  = senhaReqs.minLen && senhaReqs.hasLetr && senhaReqs.hasNum

  const touch = (field) => setTouched((t) => ({ ...t, [field]: true }))
  const reset = () => { setError(''); setTouched({ email: false, senha: false }) }

  const canSubmitEntrar = emailOk && senha.length >= 1
  const canSubmitCriar  = emailOk && senhaOk && nome.trim().length >= 2

  const handleEntrar = async (e) => {
    e.preventDefault()
    setTouched({ email: true, senha: true })
    if (!emailOk) { setError('Informe um e-mail válido.'); return }
    setError('')
    setLoading(true)
    try {
      const { usuario } = await apiFetch('/abias/auth/login', { method: 'POST', body: { email: email.trim(), senha } })
      onLogin(usuario.role, usuario)
    } catch (err) {
      setError(err.message === 'Email ou senha incorretos' ? 'E-mail ou senha incorretos.' : err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCriar = async (e) => {
    e.preventDefault()
    setTouched({ email: true, senha: true })
    if (!nome.trim()) { setError('Informe seu nome.'); return }
    if (!emailOk)     { setError('Informe um e-mail válido.'); return }
    if (!senhaOk)     { setError('A senha não atende aos requisitos.'); return }
    setError('')
    setLoading(true)
    try {
      const { usuario } = await apiFetch('/abias/auth/registrar', { method: 'POST', body: { email: email.trim(), senha, nome } })
      onLogin(usuario.role, usuario)
    } catch (err) {
      if (err.message?.toLowerCase().includes('já cadastrado') || err.message?.includes('409')) {
        setError('Este e-mail já está em uso. Tente entrar ou use outro e-mail.')
      } else {
        setError(err.message)
      }
    } finally {
      setLoading(false)
    }
  }

  const emailBorder = !touched.email || email === '' ? 'var(--border-color)'
    : emailOk ? 'rgba(16,185,129,0.6)' : 'rgba(239,68,68,0.6)'

  const senhaBorder = !touched.senha || senha === '' ? 'var(--border-color)'
    : senhaOk ? 'rgba(16,185,129,0.6)' : 'rgba(239,68,68,0.6)'

  return (
    <div style={{ minHeight: '100%', background: 'var(--bg-primary)', display: 'flex', flexDirection: 'column', padding: '40px 24px 24px' }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.6rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>ABI</span>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.6rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--color-gold)' }}>AS</span>
        <p style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
          Onde o asfalto reconhece o seu valor.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', marginBottom: '28px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px' }}>
        {[['entrar', 'Entrar'], ['criar', 'Criar conta']].map(([t, label]) => (
          <button key={t} onClick={() => { setTab(t); reset() }} style={{
            flex: 1, padding: '10px', border: 'none', borderRadius: '8px',
            background: tab === t ? 'var(--bg-card)' : 'transparent',
            color: tab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
            fontWeight: tab === t ? 800 : 500, fontSize: '0.82rem', cursor: 'pointer',
            boxShadow: tab === t ? '0 1px 6px rgba(0,0,0,0.5)' : 'none',
            transition: 'all 0.2s ease'
          }}>{label}</button>
        ))}
      </div>

      <form onSubmit={tab === 'criar' ? handleCriar : handleEntrar} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {tab === 'criar' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <input
              type="text" value={nome} placeholder="Nome completo"
              onChange={(e) => { setNome(e.target.value); setError('') }}
              required style={inputStyle()}
            />
          </div>
        )}

        {/* Email */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="email" value={email} placeholder="seu@email.com" autoFocus required
              onChange={(e) => { setEmail(e.target.value); setError('') }}
              onBlur={() => touch('email')}
              style={inputStyle(touched.email && email !== '' ? emailBorder : undefined)}
            />
            {touched.email && email !== '' && (
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem' }}>
                {emailOk
                  ? <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)' }} />
                  : <i className="fa-solid fa-circle-xmark" style={{ color: 'rgba(239,68,68,0.8)' }} />}
              </span>
            )}
          </div>
          {touched.email && email !== '' && !emailOk && (
            <p style={{ fontSize: '0.65rem', color: 'rgba(239,68,68,0.9)', paddingLeft: '2px' }}>
              Formato inválido — ex: nome@dominio.com
            </p>
          )}
        </div>

        {/* Senha */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <div style={{ position: 'relative' }}>
            <input
              type="password" value={senha} placeholder="Senha" required
              onChange={(e) => { setSenha(e.target.value); setError('') }}
              onBlur={() => touch('senha')}
              style={inputStyle(touched.senha && senha !== '' ? senhaBorder : undefined)}
            />
            {touched.senha && senha !== '' && (
              <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem' }}>
                {senhaOk
                  ? <i className="fa-solid fa-circle-check" style={{ color: 'var(--success)' }} />
                  : <i className="fa-solid fa-circle-xmark" style={{ color: 'rgba(239,68,68,0.8)' }} />}
              </span>
            )}
          </div>

          {/* Requisitos — só no cadastro */}
          {tab === 'criar' && senha.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px 10px', background: 'rgba(255,255,255,0.03)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.06)' }}>
              {[
                [senhaReqs.minLen,  'Mínimo 6 caracteres'],
                [senhaReqs.hasLetr, 'Pelo menos uma letra'],
                [senhaReqs.hasNum,  'Pelo menos um número'],
              ].map(([ok, label]) => (
                <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                  {reqIcon(ok)}
                  <span style={{ fontSize: '0.68rem', color: ok ? 'var(--success)' : 'var(--text-secondary)', transition: 'color 0.2s' }}>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {error && (
          <p style={{ fontSize: '0.73rem', color: 'var(--danger)', textAlign: 'center', padding: '4px 0' }}>
            {error}
          </p>
        )}

        <button type="submit" disabled={loading || (tab === 'criar' ? !canSubmitCriar : !canSubmitEntrar)}
          style={{
            marginTop: '2px', background: 'var(--color-magenta)', border: 'none',
            borderRadius: '8px', padding: '14px', color: '#fff',
            fontWeight: 800, fontSize: '0.88rem', letterSpacing: '0.04em',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: (loading || (tab === 'criar' ? !canSubmitCriar : !canSubmitEntrar)) ? 0.55 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
            transition: 'opacity 0.2s'
          }}>
          {loading && <i className="fa-solid fa-circle-notch fa-spin" />}
          {loading ? 'Aguarde...' : tab === 'criar' ? 'Criar conta' : 'Entrar'}
        </button>
      </form>

      <div style={{ marginTop: 'auto', paddingTop: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
          Ambiente piloto • Hackathon Afrocapital 2026
        </p>
      </div>
    </div>
  )
}

const inputStyle = (borderColor) => ({
  background: 'rgba(255,255,255,0.04)',
  border: `1px solid ${borderColor ?? 'var(--border-color)'}`,
  borderRadius: '8px', padding: '14px 40px 14px 16px',
  color: 'var(--text-primary)', fontSize: '0.9rem',
  outline: 'none', width: '100%',
  transition: 'border-color 0.2s',
})
