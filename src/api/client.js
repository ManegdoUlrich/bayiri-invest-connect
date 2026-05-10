const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

const getToken = () => localStorage.getItem('token')

const request = async (method, path, data) => {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    body: data !== undefined ? JSON.stringify(data) : undefined,
  })

  if (res.status === 204) return null

  const json = await res.json().catch(() => ({ error: 'Erreur réseau' }))

  if (!res.ok) {
    const err = new Error(json.error || 'Erreur serveur')
    err.status = res.status
    throw err
  }

  return json
}

// Upload multipart/form-data (photos, signatures, audio, avatars)
const upload = async (path, formData) => {
  const token = getToken()
  const res = await fetch(`${BASE_URL}${path}`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
  const json = await res.json().catch(() => ({ error: 'Erreur réseau' }))
  if (!res.ok) {
    const err = new Error(json.error || 'Erreur upload')
    err.status = res.status
    throw err
  }
  return json
}

export const api = {
  get:    (path)        => request('GET',    path),
  post:   (path, data)  => request('POST',   path, data),
  patch:  (path, data)  => request('PATCH',  path, data),
  delete: (path)        => request('DELETE', path),
  upload,
}
