/**
 * Central API client.
 * - Always sends Authorization: Bearer <access> header.
 * - On 401, tries to refresh once using the refresh token.
 * - On refresh failure, clears tokens and redirects to /login.
 */
import { getAccessToken, getRefreshToken, setTokens, clearTokens } from '../utils/auth'

const BASE_URL = '/api'

let isRefreshing = false
let pendingRequests = []

function processPending(error, token = null) {
  pendingRequests.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  pendingRequests = []
}

async function refreshAccessToken() {
  const refresh = getRefreshToken()
  if (!refresh) throw new Error('No refresh token')

  const res = await fetch(`${BASE_URL}/auth/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh }),
  })

  if (!res.ok) throw new Error('Refresh failed')

  const data = await res.json()
  // Rotate: backend returns new access (and sometimes a new refresh)
  setTokens(data.access, data.refresh ?? refresh)
  return data.access
}

export async function apiRequest(path, options = {}) {
  const url = `${BASE_URL}${path}`

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  const access = getAccessToken()
  if (access) headers['Authorization'] = `Bearer ${access}`

  const response = await fetch(url, { ...options, headers })

  // ── 401: attempt silent token refresh ──────────────────────────────────────
  if (response.status === 401) {
    if (isRefreshing) {
      // Queue this request until refresh completes
      return new Promise((resolve, reject) => {
        pendingRequests.push({ resolve, reject })
      }).then((newToken) => {
        return apiRequest(path, {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
        })
      })
    }

    isRefreshing = true
    try {
      const newToken = await refreshAccessToken()
      processPending(null, newToken)
      isRefreshing = false
      // Retry original request with new token
      return apiRequest(path, options)
    } catch (err) {
      processPending(err)
      isRefreshing = false
      clearTokens()
      window.location.href = '/login'
      throw err
    }
  }

  // ── Parse and return ────────────────────────────────────────────────────────
  const text = await response.text()
  let data
  try { data = JSON.parse(text) } catch { data = text }

  if (!response.ok) {
    const error = new Error('API Error')
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

// ── Convenience helpers ────────────────────────────────────────────────────── 
export const api = {
  get:    (path, opts = {}) => apiRequest(path, { method: 'GET',    ...opts }),
  post:   (path, body, opts = {}) => apiRequest(path, { method: 'POST',   body: JSON.stringify(body), ...opts }),
  patch:  (path, body, opts = {}) => apiRequest(path, { method: 'PATCH',  body: JSON.stringify(body), ...opts }),
  put:    (path, body, opts = {}) => apiRequest(path, { method: 'PUT',    body: JSON.stringify(body), ...opts }),
  delete: (path, opts = {}) => apiRequest(path, { method: 'DELETE',  ...opts }),
}
