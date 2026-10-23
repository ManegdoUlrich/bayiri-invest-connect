import { api } from './client'

export const paymentsApi = {
  list:   ()         => api.get('/payments'),
  create: (data)     => api.post('/payments', data),
  update: (id, data) => api.patch(`/payments/${id}`, data),
  delete: (id)       => api.delete(`/payments/${id}`),

  // Stripe Checkout — crée une session et retourne l'URL de redirection
  stripeCheckout: (paymentId, successUrl, cancelUrl) =>
    api.post('/payments/stripe/checkout', { paymentId, successUrl, cancelUrl }),

  // Portail Stripe — permet au client de gérer son abonnement
  stripePortal: () => api.get('/payments/stripe/portal'),

  // Mobile Money via CinetPay
  mobileMoneyInitiate: (paymentId, phoneNumber, operateur) =>
    api.post('/payments/cinetpay/initiate', { paymentId, phoneNumber, operateur }),
}
