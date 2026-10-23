import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'

export default function Register() {
  const { register, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]     = useState({ fullName: '', email: '', password: '', confirm: '' })
  const [error, setError]   = useState(null)
  const [loading, setLoading] = useState(false)

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

    if (form.password !== form.confirm) {
      return setError('Les mots de passe ne correspondent pas')
    }
    if (form.password.length < 8) {
      return setError('Le mot de passe doit contenir au moins 8 caractères')
    }

    setLoading(true)
    try {
      await register(form.email, form.password, form.fullName)
      navigate('/onboarding', { replace: true })
    } catch (err) {
      setError(err.message || 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }))

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Bouton retour */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Retour à la connexion
        </Link>

        <div className="text-center">
          <Link to="/">
            <span className="text-2xl font-heading font-bold text-primary">Bayiri Invest</span>
          </Link>
          <p className="text-muted-foreground mt-2 text-sm">Créez votre compte investisseur</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border/50 p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="fullName">Nom complet</Label>
            <Input
              id="fullName"
              type="text"
              placeholder="Jean Dupont"
              value={form.fullName}
              onChange={set('fullName')}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={form.email}
              onChange={set('email')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="8 caractères minimum"
              value={form.password}
              onChange={set('password')}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm">Confirmer le mot de passe</Label>
            <Input
              id="confirm"
              type="password"
              placeholder="••••••••"
              value={form.confirm}
              onChange={set('confirm')}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Création…' : 'Créer mon compte'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Se connecter
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground/60">
          En créant un compte, vous acceptez nos{' '}
          <Link to="/cgu" className="hover:text-muted-foreground underline transition-colors">CGU</Link>
          {' '}et nos{' '}
          <Link to="/mentions-legales" className="hover:text-muted-foreground underline transition-colors">mentions légales</Link>.
        </p>
      </div>
    </div>
  )
}
