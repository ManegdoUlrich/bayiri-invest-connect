import { api } from './client'

export const projectsApi = {
  list:   (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return api.get(`/projects${qs ? `?${qs}` : ''}`)
  },
  get:    (id)          => api.get(`/projects/${id}`),
  create: (data)        => api.post('/projects', data),
  update: (id, data)    => api.patch(`/projects/${id}`, data),
  delete: (id)          => api.delete(`/projects/${id}`),

  // Signature : envoie le PNG en multipart
  sign: (id, signatureBlob) => {
    const fd = new FormData()
    fd.append('signature', signatureBlob, 'signature.png')
    return api.upload(`/projects/${id}/signature`, fd)
  },

  // Photo de couverture / galerie
  addPhoto: (id, file, meta = {}) => {
    const fd = new FormData()
    fd.append('photo', file)
    if (meta.caption)  fd.append('caption', meta.caption)
    if (meta.location) fd.append('location', meta.location)
    if (meta.takenAt)  fd.append('takenAt', meta.takenAt)
    return api.upload(`/projects/${id}/photos`, fd)
  },

  updateMilestone: (projectId, milestoneId, data) =>
    api.patch(`/projects/${projectId}/milestones/${milestoneId}`, data),
}
