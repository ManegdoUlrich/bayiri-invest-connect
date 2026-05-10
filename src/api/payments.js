import { api } from './client'

export const paymentsApi = {
  list:   ()         => api.get('/payments'),
  create: (data)     => api.post('/payments', data),
  update: (id, data) => api.patch(`/payments/${id}`, data),
  delete: (id)       => api.delete(`/payments/${id}`),
}
