import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { paymentsApi } from '@/api/payments'
import { useLang } from '@/lib/LangContext'
import { translations } from '@/lib/i18n'
import {
  CheckCircle,
  AlertCircle,
  CalendarClock,
  Repeat,
  FileText,
  CreditCard,
  Loader2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import PaymentModal from '@/components/PaymentModal'

const statusConfig = {
  a_jour:                { key: 'status_a_jour',   color: 'text-green-600 border-green-500/30 bg-green-500/5',   icon: CheckCircle },
  en_retard:             { key: 'status_en_retard', color: 'text-red-600 border-red-500/30 bg-red-500/5',         icon: AlertCircle },
  suspendu:              { key: 'status_suspendu',  color: 'text-orange-600 border-orange-500/30 bg-orange-500/5', icon: AlertCircle },
  en_attente_validation: { key: 'status_en_retard', color: 'text-yellow-600 border-yellow-500/30 bg-yellow-500/5', icon: AlertCircle },
}

export default function ClientPayments() {
  const { lang }   = useLang()
  const tx         = translations[lang].payments
  const { toast }  = useToast()
  const [searchParams, setSearchParams] = useSearchParams()

  const [payments, setPayments]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [selectedPayment, setSelected]  = useState(null)
  const [portalLoading, setPortalLoading] = useState(false)

  // Chargement initial + détection ?success=1
  useEffect(() => {
    async function load() {
      const pays = await paymentsApi.list()
      setPayments(pays)
      setLoading(false)
    }
    load()
  }, [])

  useEffect(() => {
    if (searchParams.get('success') === '1') {
      toast({
        title: 'Paiement confirmé',
        description: 'Votre paiement a bien été enregistré. Merci !',
      })
      // Nettoie le paramètre URL
      setSearchParams({})
    }
    if (searchParams.get('status') === 'success') {
      toast({
        title: 'Paiement Mobile Money confirmé',
        description: 'Votre paiement Mobile Money est en cours de traitement.',
      })
      setSearchParams({})
    }
  }, [searchParams, setSearchParams, toast])

  async function handleStripePortal() {
    setPortalLoading(true)
    try {
      const { url } = await paymentsApi.stripePortal()
      window.location.href = url
    } catch (err) {
      toast({
        title: 'Portail Stripe indisponible',
        description: err.message || 'Impossible d\'accéder au portail Stripe.',
        variant: 'destructive',
      })
      setPortalLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    )
  }

  const abonnements = payments.filter(
    (p) =>
      p.subscriptionType === 'mensuel_engagement' ||
      p.subscriptionType === 'mensuel_sans_engagement'
  )
  const forfaits = payments.filter((p) => p.subscriptionType === 'forfait')
  const aJour    = payments.filter((p) => p.status === 'a_jour').length

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-heading font-bold">{tx.title}</h1>

      {/* Résumé */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl border border-border/50 p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center">
            <Repeat className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{tx.subscriptions}</p>
            <p className="text-2xl font-heading font-bold">{abonnements.length}</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border/50 p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-secondary/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-secondary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{tx.packages}</p>
            <p className="text-2xl font-heading font-bold">{forfaits.length}</p>
          </div>
        </div>
        <div className="bg-card rounded-2xl border border-border/50 p-5 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{tx.up_to_date}</p>
            <p className="text-2xl font-heading font-bold">{aJour}/{payments.length}</p>
          </div>
        </div>
      </div>

      {/* Liste */}
      <div className="space-y-3">
        {payments.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">{tx.no_data}</div>
        )}

        {payments.map((pay) => {
          const sc = statusConfig[pay.status] || statusConfig.a_jour
          const isSubscription =
            pay.subscriptionType === 'mensuel_engagement' ||
            pay.subscriptionType === 'mensuel_sans_engagement'
          const typeLabel = isSubscription ? tx.type_monthly : tx.type_package
          const Icon = sc.icon
          const canPay = pay.status !== 'a_jour'
          const hasActiveSubscription = pay.status === 'a_jour' && isSubscription

          return (
            <div
              key={pay.id}
              className="bg-card rounded-xl border border-border/50 p-5 flex items-center gap-4"
            >
              <div
                className={`w-11 h-11 rounded-xl flex items-center justify-center ${
                  isSubscription ? 'bg-primary/10' : 'bg-secondary/15'
                }`}
              >
                {isSubscription
                  ? <Repeat className="w-5 h-5 text-primary" />
                  : <FileText className="w-5 h-5 text-secondary" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold">{typeLabel}</p>
                  <Badge variant="outline" className={sc.color}>
                    <Icon className="w-3 h-3 mr-1" /> {tx[sc.key]}
                  </Badge>
                </div>
                {pay.description && (
                  <p className="text-sm text-muted-foreground mt-0.5 truncate">{pay.description}</p>
                )}
                {pay.nextDueDate && (
                  <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                    <CalendarClock className="w-3 h-3" />
                    {tx.next_due} :{' '}
                    {new Date(pay.nextDueDate).toLocaleDateString(lang === 'fr' ? 'fr-FR' : 'en-GB')}
                  </p>
                )}
              </div>

              {pay.amount && (
                <div className="text-right shrink-0">
                  <p className="font-heading font-bold text-lg">
                    {pay.amount.toLocaleString('fr-FR')} €
                  </p>
                  {isSubscription && (
                    <p className="text-xs text-muted-foreground">{tx.per_month}</p>
                  )}
                </div>
              )}

              {/* Boutons d'action */}
              <div className="flex flex-col gap-2 shrink-0">
                {canPay && (
                  <Button
                    size="sm"
                    onClick={() => setSelected(pay)}
                    className="gap-1.5"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    Payer
                  </Button>
                )}
                {hasActiveSubscription && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleStripePortal}
                    disabled={portalLoading}
                    className="gap-1.5 text-xs"
                  >
                    {portalLoading
                      ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      : <Repeat className="w-3.5 h-3.5" />}
                    Gérer abonnement
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal de paiement */}
      <PaymentModal
        payment={selectedPayment}
        open={!!selectedPayment}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
