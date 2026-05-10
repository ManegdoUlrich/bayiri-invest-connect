import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/lib/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function Login() {
  const { login, isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState(null)
  const [loading, setLoading] = useState(false)

  // Déjà connecté → rediriger selon le rôle
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-sm space-y-8">
        {/* Logo */}
        <div className="text-center">
          <Link to="/">
            <span className="text-2xl font-heading font-bold text-primary">Bayiri Invest</span>
          </Link>
          <p className="text-muted-foreground mt-2 text-sm">Connectez-vous à votre espace</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-card rounded-2xl border border-border/50 p-6 space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              required
            />
          </div>

          {error && (
            <p className="text-sm text-destructive bg-destructive/10 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Connexion…' : 'Se connecter'}
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ?{' '}
          <Link to="/" className="text-primary hover:underline">
            Contactez-nous
          </Link>
        </p>
      </div>
    </div>
  )
}
