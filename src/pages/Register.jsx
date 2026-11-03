import { useState } from 'react'
import { useNavigate, Link, Navigate } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { ArrowLeft, ArrowRight, Eye, EyeOff, Mail } from 'lucide-react'

const HERO_IMG = "https://d8j0ntlcm91z4.cloudfront.net/user_3Ecsq627sStwKzm5HgcVNMBPKAy/hf_20261102_231909_7e626f56-7232-44de-b0c2-bcc0bc859ec0.png"

export default function Register() {
  const { register, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]     = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [error, setError]   = useState(null)
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState('')
  const [showPwd, setShowPwd] = useState(false)

  if (isAuthenticated && user) {
    const dest = user.role === 'admin' ? '/admin'
               : user.role === 'agent' ? '/agent'
               : '/dashboard'
    return <Navigate to={dest} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    if (form.password !== form.confirm) return setError('Les mots de passe ne correspondent pas')
    if (form.password.length < 8) return setError('Le mot de passe doit contenir au moins 8 caractères')
    setLoading(true)
    try {
      await register(form.email, form.password, form.fullName)
      setRegisteredEmail(form.email)
      setConfirmed(true)
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  // ── Confirmation email ──────────────────────────────────────────
  if (confirmed) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'hsl(0,0%,3%)', padding: '40px 24px' }}>
        <div style={{ width: '100%', maxWidth: 400, textAlign: 'center' }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 28px' }}>
            <Mail size={26} color="white" />
          </div>
          <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.75rem', color: 'white', letterSpacing: '-0.02em', marginBottom: 10 }}>Compte créé !</h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, marginBottom: 6 }}>
            Un email de confirmation a été envoyé à
          </p>
          <p style={{ fontSize: 15, fontWeight: 600, color: 'white', marginBottom: 12 }}>{registeredEmail}</p>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 36 }}>
            Vérifiez votre boîte de réception (et vos spams). Vous pouvez continuer sans confirmer votre email.
          </p>
          <button
            onClick={() => navigate('/onboarding', { replace: true })}
            style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px 32px', borderRadius: 8, background: 'white', color: 'hsl(0,0%,5%)', fontSize: 15, fontWeight: 700, border: 'none', cursor: 'pointer', width: '100%' }}
          >
            Continuer la configuration <ArrowRight size={16} />
          </button>
        </div>
      </div>
    )
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
            <p style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
              Diaspora · Investissement · Burkina Faso
            </p>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: 'clamp(1.8rem, 2.5vw, 2.6rem)', color: 'white', lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: 20 }}>
              Votre projet au pays<br />commence ici.
            </h2>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, maxWidth: 360 }}>
              Inscription gratuite. Agent dédié. Suivi photo en temps réel. Contrats sécurisés.
            </p>
            <div style={{ marginTop: 36, display: 'flex', flexDirection: 'column', gap: 12 }}>
              {['Aucun frais cachés', 'Agent certifié sur le terrain', 'Contrats vérifiés juridiquement'].map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: 'white', fontSize: 11, fontWeight: 700 }}>✓</span>
                  </div>
                  <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.2)' }}>© 2026 Bayiri Invest</p>
        </div>
      </div>

      {/* ── Panneau droit — formulaire ── */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 24px', overflowY: 'auto' }}>
        {/* Mobile logo */}
        <Link to="/" style={{ textDecoration: 'none', marginBottom: 32 }}>
          <img src="https://media.base44.com/images/public/69d849ec4fe9ac315bfd5840/9fa7d583d_Logo_transparent.png" alt="Bayiri Invest" style={{ height: 32, filter: 'brightness(2)', display: 'block' }} />
        </Link>

        <div style={{ width: '100%', maxWidth: 400 }}>
          <Link to="/login" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.4)', textDecoration: 'none', marginBottom: 28 }}
            onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}>
            <ArrowLeft size={14} /> Retour à la connexion
          </Link>

          <h1 style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '1.75rem', color: 'white', letterSpacing: '-0.02em', marginBottom: 6 }}>
            Créer un compte
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 32 }}>
            Rejoignez la diaspora qui investit au pays
          </p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {[
              { label: 'Nom complet', field: 'fullName', type: 'text', placeholder: 'Jean Dupont' },
              { label: 'Email', field: 'email', type: 'email', placeholder: 'votre@email.com' },
            ].map(({ label, field, type, placeholder }) => (
              <div key={field}>
                <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 7 }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[field]}
                  onChange={set(field)}
                  required
                  autoFocus={field === 'fullName'}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: 15, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.35)'}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
                />
              </div>
            ))}

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 7 }}>Mot de passe</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="8 caractères minimum"
                  value={form.password}
                  onChange={set('password')}
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

            <div>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 7 }}>Confirmer le mot de passe</label>
              <input
                type="password"
                placeholder="••••••••"
                value={form.confirm}
                onChange={set('confirm')}
                required
                style={{ width: '100%', padding: '12px 14px', borderRadius: 8, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontSize: 15, outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.15s' }}
                onFocus={e => e.target.style.borderColor = 'rgba(255,255,255,0.35)'}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.12)'}
              />
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: 8, padding: '10px 14px', fontSize: 14, color: 'rgb(252,165,165)' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '14px', borderRadius: 8, background: 'white', color: 'hsl(0,0%,5%)', fontSize: 15, fontWeight: 700, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s', marginTop: 4 }}
              onMouseEnter={e => { if (!loading) e.currentTarget.style.opacity = '0.88' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = loading ? '0.7' : '1' }}
            >
              {loading ? 'Création…' : <><span>Créer mon compte</span> <ArrowRight size={16} /></>}
            </button>
          </form>

          <p style={{ textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.4)', marginTop: 24 }}>
            Déjà un compte ?{' '}
            <Link to="/login" style={{ color: 'white', fontWeight: 600, textDecoration: 'none' }}>Se connecter</Link>
          </p>

          <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 16, lineHeight: 1.6 }}>
            En créant un compte, vous acceptez nos{' '}
            <Link to="/cgu" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline' }}>CGU</Link>
            {' '}et nos{' '}
            <Link to="/mentions-legales" style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline' }}>mentions légales</Link>.
          </p>
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
