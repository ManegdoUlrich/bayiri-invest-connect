import { api } from './client'

export const missionsApi = {
  list:   (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return api.get(`/missions${qs ? `?${qs}` : ''}`)
  },
  get:    (id)       => api.get(`/missions/${id}`),
  create: (data)     => api.post('/missions', data),
  update: (id, data) => api.patch(`/missions/${id}`, data),
  delete: (id)       => api.delete(`/missions/${id}`),
}
