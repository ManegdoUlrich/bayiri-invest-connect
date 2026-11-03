import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { ArrowRight, Eye, EyeOff } from 'lucide-react'

const HERO_IMG = "https://d8j0ntlcm91z4.cloudfront.net/user_3Ecsq627sStwKzm5HgcVNMBPKAy/hf_20261102_231909_7e626f56-7232-44de-b0c2-bcc0bc859ec0.png"

export default function Login() {
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  if (isAuthenticated && user) {
    const dest = user.role === 'admin' ? '/admin'
               : user.role === 'agent' ? '/agent'
               : '/dashboard'
    navigate(dest, { replace: true })
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const u = await login(form.email, form.password)
      const dest = u.onboardingComplete === false && u.role === 'client'
        ? '/onboarding'
        : u.role === 'admin' ? '/admin'
        : u.role === 'agent' ? '/agent'
        : '/dashboard'
      navigate(dest, { replace: true })
    } catch (err) {
      setError(err.message || 'Email ou mot de passe incorrect')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'hsl(0,0%,3%)' }}>

      {/* ── Panneau gauche — branding ── */}
      <div style={{ display: 'none', flex: '0 0 48%', position: 'relative', overflow: 'hidden' }} className="auth-left">
        <div style={{ position: 'absolute', inset: 0, backgroundImage: `url('${HERO_IMG}')`, backgroundSize: 'cover', backgroundPosition: 'center 30%', opacity: 0.35 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 100%)' }} />
        <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', padding: '48px 52px' }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <img src="https://media.base44.com/images/public/69d849ec4fe9ac315bfd5840/9fa7d583d_Logo_transparent.png" alt="Bayiri Invest" style={{ height: 36, filter: 'brightness(2)' }} />
          </Link>
          <div>
            <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 16, fontFamily: 'var(--font-heading)' }}>
              Diaspora · Investissement · Burkina Faso
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(1.8rem, 2.5vw, 2.6rem)', color: 'white', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Investissez au pays<br />en toute confiance.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 360 }}>
              Agents certifiés, suivi en temps réel et contrats sécurisés — tout ce qu'il faut pour investir depuis l'étranger.
            </p>
            <div style={{ display: 'flex', gap: 28, marginTop: 40 }}>
              {[{ value: '127', label: 'investisseurs' }, { value: '3×', label: 'rendement moy.' }, { value: '100%', label: 'sécurisé' }].map((s, i) => (
                <div key={i}>
                  <p style={{ fontSize: 20, fontWeight: 700, color: 'white', margin: 0, fontFamily: 'var(--font-heading)' }}>{s.value}</p>
                  <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', margin: '2px 0 0' }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2026 Bayiri Invest</p>
        </div>
      </div>

      {/* ── Panneau droit — formulaire ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', position: 'relative' }}>
        {/* Mobile logo */}
        <Link to="/" style={{ textDecoration: 'none', marginBottom: 32 }}>
          <img src="https://media.base44.com/images/public/69d849ec4fe9ac315bfd5840/9fa7d583d_Logo_transparent.png" alt="Bayiri Invest" style={{ height: 32, filter: 'brightness(2)', display: 'block' }} />
        </Link>

        <div style={{ width: '100%', maxWidth: 400 }}>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.75rem', color: 'white', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Bon retour
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 36 }}>
            Connectez-vous à votre espace Bayiri
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Email */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 7, letterSpacing: '0.01em' }}>
                Email
              </label>
              <input
                type="email"
                placeholder="votre@email.com"
                value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                required
                autoFocus
                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: 15, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.35)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 7, letterSpacing: '0.01em' }}>
                Mot de passe
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  required
                  style={{ width: '100%', padding: '12px 42px 12px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: 15, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.35)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
                <button type="button" onClick={() => setShowPwd(v => !v)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', display: 'flex' }}>
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'rgb(252,165,165)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 8, background: 'white', color: 'hsl(0,0%,5%)', fontSize: 15, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s, transform 0.15s', marginTop: 4 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = loading ? '0.7' : '1' }}
            >
              {loading ? 'Connexion…' : <><span>Se connecter</span> <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 28 }}>
            Pas encore de compte ?{' '}
            <Link to="/register" style={{ color: 'white', fontWeight: 600, textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.opacity = '0.7'}
              onMouseLeave={e => e.target.style.opacity = '1'}>
              Créer un compte
            </Link>
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginTop: 20 }}>
            {[{ to: '/cgu', label: 'CGU' }, { to: '/mentions-legales', label: 'Mentions légales' }].map(l => (
              <Link key={l.to} to={l.to} style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', textDecoration: 'none' }}
                onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.5)'}
                onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.25)'}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .auth-left { display: flex !important; }
        }
      `}</style>
    </div>
  )
}
