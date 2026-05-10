import { api } from './client'

export const usersApi = {
  list:   (params = {}) => {
    const qs = new URLSearchParams(params).toString()
    return api.get(`/users${qs ? `?${qs}` : ''}`)
  },
  get:    (id)       => api.get(`/users/${id}`),
  update: (id, data) => api.patch(`/users/${id}`, data),

  // Crée un compte avec mot de passe temporaire — retourne { user, tempPassword }
  invite: (email, role) => api.post('/users/invite', { email, role }),

  uploadAvatar: (id, file) => {
    const fd = new FormData()
    fd.append('avatar', file)
    return api.upload(`/users/${id}/avatar`, fd)
  },
}
