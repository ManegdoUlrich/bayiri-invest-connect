import { useState } from 'react'
import { paymentsApi } from '@/api/payments'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CreditCard, Smartphone, Loader2, AlertTriangle } from 'lucide-react'

const OPERATEURS = [
  { value: 'ORANGE_BF', label: 'Orange Money (Burkina)' },
  { value: 'MOOV_BF',   label: 'Moov Money (Burkina)' },
  { value: 'WAVE_CI',   label: 'Wave' },
]

export default function PaymentModal({ payment, open, onClose }) {
  const [stripeLoading, setStripeLoading] = useState(false)
  const [stripeError, setStripeError]     = useState(null)

  const [phone, setPhone]         = useState('+226 ')
  const [operateur, setOperateur] = useState('')
  const [mmLoading, setMmLoading] = useState(false)
  const [mmError, setMmError]     = useState(null)

  if (!payment) return null

  const isSubscription =
    payment.subscriptionType === 'mensuel_engagement' ||
    payment.subscriptionType === 'mensuel_sans_engagement'

  const amountLabel = payment.amount
    ? `${payment.amount.toLocaleString('fr-FR')} €`
    : '—'

  // ---- Stripe ----
  async function handleStripeCheckout() {
    setStripeLoading(true)
    setStripeError(null)
    try {
      const successUrl = window.location.href.split('?')[0] + '?success=1'
      const cancelUrl  = window.location.href.split('?')[0] + '?cancel=1'
      const { url } = await paymentsApi.stripeCheckout(payment.id, successUrl, cancelUrl)
      window.location.href = url
    } catch (err) {
      setStripeError(
        err.status === 503
          ? 'Le paiement par carte n\'est pas encore disponible. Veuillez contacter Bayiri Invest.'
          : (err.message || 'Une erreur est survenue.')
      )
      setStripeLoading(false)
    }
  }

  // ---- Mobile Money ----
  async function handleMobileMoneyPay() {
    if (!phone || !operateur) {
      setMmError('Veuillez renseigner votre numéro et sélectionner un opérateur.')
      return
    }
    setMmLoading(true)
    setMmError(null)
    try {
      const { payment_url } = await paymentsApi.mobileMoneyInitiate(payment.id, phone, operateur)
      if (payment_url) {
        window.location.href = payment_url
      } else {
        setMmError('Impossible de récupérer l\'URL de paiement CinetPay.')
        setMmLoading(false)
      }
    } catch (err) {
      setMmError(
        err.status === 503
          ? 'Le paiement Mobile Money n\'est pas encore disponible. Veuillez contacter Bayiri Invest.'
          : (err.message || 'Une erreur est survenue.')
      )
      setMmLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Payer</DialogTitle>
          <DialogDescription>
            {payment.description || 'Règlement Bayiri Invest'}
            {payment.amount && (
              <span className="block mt-1 text-lg font-semibold text-foreground">
                {amountLabel}
                {isSubscription && (
                  <span className="text-sm font-normal text-muted-foreground ml-1">/ mois</span>
                )}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="carte" className="mt-2">
          <TabsList className="w-full">
            <TabsTrigger value="carte" className="flex-1 gap-2">
              <CreditCard className="w-4 h-4" /> Carte bancaire
            </TabsTrigger>
            <TabsTrigger value="mobile_money" className="flex-1 gap-2">
              <Smartphone className="w-4 h-4" /> Mobile Money
            </TabsTrigger>
          </TabsList>

          {/* ---- Onglet Carte ---- */}
          <TabsContent value="carte" className="space-y-4 pt-4">
            {isSubscription && (
              <p className="text-sm text-muted-foreground bg-primary/5 rounded-lg p-3 border border-primary/20">
                Prélèvement mensuel automatique de {amountLabel} via Stripe Checkout.
              </p>
            )}

            {stripeError && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                {stripeError}
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleStripeCheckout}
              disabled={stripeLoading}
            >
              {stripeLoading
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirection en cours…</>
                : `Payer par carte — ${amountLabel}`}
            </Button>
          </TabsContent>

          {/* ---- Onglet Mobile Money ---- */}
          <TabsContent value="mobile_money" className="space-y-4 pt-4">
            <div className="space-y-1">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+226 70 00 00 00"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <Label>Opérateur</Label>
              <Select value={operateur} onValueChange={setOperateur}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisir un opérateur" />
                </SelectTrigger>
                <SelectContent>
                  {OPERATEURS.map((op) => (
                    <SelectItem key={op.value} value={op.value}>
                      {op.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {mmError && (
              <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
                <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
                {mmError}
              </div>
            )}

            <Button
              className="w-full"
              onClick={handleMobileMoneyPay}
              disabled={mmLoading}
            >
              {mmLoading
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Redirection en cours…</>
                : `Payer — ${amountLabel}`}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
