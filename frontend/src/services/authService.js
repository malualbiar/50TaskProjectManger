import { api } from './api'
import { setTokens, setUser, clearTokens } from '../utils/auth'

/**
 * Login with username + password.
 * On success: persists tokens and user data to localStorage.
 * Returns the full response object so the caller can read `role`, etc.
 */
export async function login(username, password) {
  const data = await api.post('/auth/login/', { username, password })

  // Persist tokens
  setTokens(data.access, data.refresh)

  // Persist user info for UI use
  setUser({
    role: data.role,
    organization: data.organization,
    must_change_password: data.must_change_password,
    username,
  })

  // Also keep the organisation name in the existing localStorage key
  // so sidebar/header code that reads 'organizationName' continues to work
  if (data.organization) {
    localStorage.setItem('organizationName', data.organization)
  }

  return data
}

/**
 * Register a new organisation + owner account.
 * Backend sends a verification email – we do NOT auto-navigate after this.
 */
export async function register({ username, email, password, password_confirmation, organization_name }) {
  return api.post('/auth/register/', {
    username,
    email,
    password,
    password_confirmation,
    organization_name,
  })
}

/**
 * Forgot password – backend sends a temporary password to the email.
 */
export async function forgotPassword(email) {
  return api.post('/auth/forgot-password/', { email })
}

/**
 * Set a new password (for must_change_password users).
 */
export async function setNewPassword(new_password, confirm_new_password) {
  return api.post('/auth/set-password/', { new_password, confirm_new_password })
}

/**
 * Change password (for authenticated users who know their current password).
 */
export async function changePassword(current_password, new_password, confirm_password) {
  return api.post('/auth/change-password/', {
    current_password,
    new_password,
    confirm_password,
  })
}

/**
 * Create a user inside the owner's organisation (OWNER only).
 */
export async function createOrganizationUser({ username, email, role }) {
  return api.post('/auth/create-users/', { username, email, role })
}

/**
 * Logout: clear local token data and redirect.
 */
export function logout() {
  clearTokens()
  // Remove legacy localStorage keys used by earlier frontend code
  localStorage.removeItem('userRole')
  localStorage.removeItem('adminName')
  window.location.href = '/login'
}
