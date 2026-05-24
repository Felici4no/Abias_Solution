import { useState } from 'react'
import { apiFetch } from '../../models/api.js'

export function LoginScreen({ onLogin }) {
  const [tab, setTab] = useState('entrar')  // 'entrar' | 'criar'
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const reset = () => { setError('') }

  const handleEntrar = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { usuario } = await apiFetch('/abias/auth/login', {
        method: 'POST',
        body: { email, senha }
      })
      onLogin(usuario.role, usuario)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleCriar = async (e) => {
    e.preventDefault()
    setError('')
    if (!nome.trim()) { setError('Informe seu nome.'); return }
    setLoading(true)
    try {
      const { usuario } = await apiFetch('/abias/auth/registrar', {
        method: 'POST',
        body: { email, senha, nome }
      })
      onLogin(usuario.role, usuario)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100%',
      background: 'var(--bg-primary)',
      display: 'flex',
      flexDirection: 'column',
      padding: '40px 24px 24px'
    }}>
      {/* Logo */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.6rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--text-primary)' }}>ABI</span>
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '2.6rem', fontWeight: 900, letterSpacing: '-0.04em', color: 'var(--color-gold)' }}>AS</span>
        <p style={{ fontFamily: 'var(--font-italic)', fontStyle: 'italic', fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
          Onde o asfalto reconhece o seu valor.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', marginBottom: '28px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '4px' }}>
        {[['entrar', 'Entrar'], ['criar', 'Criar conta']].map(([t, label]) => (
          <button
            key={t}
            onClick={() => { setTab(t); reset() }}
            style={{
              flex: 1, padding: '10px', border: 'none', borderRadius: '8px',
              background: tab === t ? 'var(--bg-card)' : 'transparent',
              color: tab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: tab === t ? 800 : 500,
              fontSize: '0.82rem', cursor: 'pointer',
              boxShadow: tab === t ? '0 1px 6px rgba(0,0,0,0.5)' : 'none',
              transition: 'all 0.2s ease'
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Form */}
      <form onSubmit={tab === 'criar' ? handleCriar : handleEntrar} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {tab === 'criar' && (
          <input
            type="text"
            value={nome}
            onChange={(e) => { setNome(e.target.value); reset() }}
            placeholder="Nome completo"
            required
            style={inputStyle}
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); reset() }}
          placeholder="E-mail"
          autoFocus
          required
          style={inputStyle}
        />
        <input
          type="password"
          value={senha}
          onChange={(e) => { setSenha(e.target.value); reset() }}
          placeholder="Senha"
          required
          style={inputStyle}
        />

        {error && (
          <p style={{ fontSize: '0.73rem', color: 'var(--danger)', textAlign: 'center', padding: '4px 0' }}>
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            marginTop: '4px',
            background: 'var(--color-magenta)',
            border: 'none', borderRadius: '8px',
            padding: '14px', color: '#fff',
            fontWeight: 800, fontSize: '0.88rem',
            cursor: loading ? 'not-allowed' : 'pointer',
            letterSpacing: '0.04em',
            opacity: loading ? 0.7 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
          }}>
          {loading && <i className="fa-solid fa-circle-notch fa-spin"></i>}
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

const inputStyle = {
  background: 'rgba(255,255,255,0.04)',
  border: '1px solid var(--border-color)',
  borderRadius: '8px',
  padding: '14px 16px',
  color: 'var(--text-primary)',
  fontSize: '0.9rem',
  outline: 'none',
  width: '100%'
}
