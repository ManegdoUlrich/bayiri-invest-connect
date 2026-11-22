import { api } from './client'

export const partnersApi = {
  list:   (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return api.get(`/partners${qs ? `?${qs}` : ''}`)
  },
  get:    (id)       => api.get(`/partners/${id}`),
  create: (data)     => api.post('/partners', data),
  update: (id, data) => api.patch(`/partners/${id}`, data),
  delete: (id)       => api.delete(`/partners/${id}`),

  selectForProject: (projectId, partnerId) =>
    api.post(`/partners/projects/${projectId}/select`, { partnerId }),
}
