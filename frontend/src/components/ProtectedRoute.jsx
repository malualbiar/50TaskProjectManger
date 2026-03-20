import { Navigate } from 'react-router-dom'
import { isAuthenticated, getRole, getDashboardRoute } from '../utils/auth'

/**
 * ProtectedRoute – wraps routes that require authentication.
 *
 * Props:
 *   requiredRole  – 'OWNER' | 'MANAGER' | 'MEMBER' | undefined
 *                   If provided, also checks the user's role.
 *   children      – JSX to render when access is granted.
 *
 * Behaviour:
 *   - Not authenticated  → redirect to /login
 *   - Wrong role         → redirect to correct dashboard for the user's actual role
 *   - OK                 → render children
 */
export default function ProtectedRoute({ children, requiredRole }) {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />
  }

  const role = getRole()

  if (requiredRole && role !== requiredRole) {
    // User is logged in but wrong role – send them to their own dashboard
    return <Navigate to={getDashboardRoute(role)} replace />
  }

  return children
}
