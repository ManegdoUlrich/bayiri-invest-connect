import { api } from './client'

export const reportsApi = {
  list:   (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return api.get(`/reports${qs ? `?${qs}` : ''}`)
  },
  get:    (id)       => api.get(`/reports/${id}`),
  create: (data)     => api.post('/reports', data),
  update: (id, data) => api.patch(`/reports/${id}`, data),

  addPhoto: (id, file, caption) => {
    const fd = new FormData()
    fd.append('photo', file)
    if (caption) fd.append('caption', caption)
    return api.upload(`/reports/${id}/photos`, fd)
  },

  addAudio: (id, file) => {
    const fd = new FormData()
    fd.append('audio', file)
    return api.upload(`/reports/${id}/audio`, fd)
  },
}
