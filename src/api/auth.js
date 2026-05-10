import { api } from './client'

export const authApi = {
  login:    (email, password)  => api.post('/auth/login',    { email, password }),
  register: (email, password, fullName, role) =>
                                   api.post('/auth/register', { email, password, fullName, role }),
  me:       ()                 => api.get('/auth/me'),
}
