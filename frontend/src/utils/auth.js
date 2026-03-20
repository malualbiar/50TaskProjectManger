// ── Token storage keys ──────────────────────────────────────────────────────
const ACCESS_KEY = 'accessToken'
const REFRESH_KEY = 'refreshToken'
const USER_KEY = 'userData'

// ── Token getters / setters ─────────────────────────────────────────────────
export function getAccessToken() {
  return localStorage.getItem(ACCESS_KEY)
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_KEY)
}

export function setTokens(access, refresh) {
  localStorage.setItem(ACCESS_KEY, access)
  localStorage.setItem(REFRESH_KEY, refresh)
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_KEY)
  localStorage.removeItem(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
}

// ── User data (stored after login) ──────────────────────────────────────────
export function setUser(userData) {
  localStorage.setItem(USER_KEY, JSON.stringify(userData))
}

export function getUser() {
  try {
    const raw = localStorage.getItem(USER_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

// ── Role helpers ─────────────────────────────────────────────────────────────
export function getRole() {
  const user = getUser()
  return user?.role || null
}

export function isAuthenticated() {
  return !!getAccessToken()
}

// ── Role → dashboard route mapping ───────────────────────────────────────────
export function getDashboardRoute(role) {
  switch (role) {
    case 'OWNER':   return '/dashboard/admin'
    case 'MANAGER': return '/dashboard/pm'
    case 'MEMBER':  return '/dashboard/team'
    default:        return '/login'
  }
}
