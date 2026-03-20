import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md'
import { setNewPassword } from '../../services/authService'
import { getUser, getDashboardRoute } from '../../utils/auth'
import './LoginPage.css'

/**
 * SetPasswordPage – shown when a user logs in and must_change_password === true.
 * Calls POST /api/auth/set-password/ then redirects to the appropriate dashboard.
 */
export default function SetPasswordPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ new_password: '', confirm_new_password: '' })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const user = getUser()

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    if (form.new_password !== form.confirm_new_password) {
      setError('Passwords do not match.')
      return
    }
    if (form.new_password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }
    setLoading(true)
    try {
      await setNewPassword(form.new_password, form.confirm_new_password)
      setSuccess(true)
      setTimeout(() => navigate(getDashboardRoute(user?.role)), 1500)
    } catch (err) {
      const detail = err.data
      setError(
        typeof detail === 'object'
          ? Object.values(detail).flat().join(' ')
          : detail || 'Failed to set password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="lp-shell">
      <div className="lp-left">
        <div className="lp-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ backgroundColor: '#fff', padding: '6px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="50 Tasks" style={{ height: '36px' }} />
          </div>
          <span className="lp-logo-text" style={{ fontSize: '28px', fontWeight: '800', color: '#fff', letterSpacing: '0.05em' }}>50 TASKS</span>
        </div>
        <div className="lp-hero">
          <h1 className="lp-hero-title">Set Your<br />New Password</h1>
          <p className="lp-hero-sub">Your account requires a password change before you can continue.</p>
        </div>
      </div>

      <div className="lp-right">
        <div className="lp-card">
          <div className="lp-card-top">
            <div className="lp-card-icon"><MdLock size={26} color="#16a34a" /></div>
            <h2 className="lp-card-title">Create New Password</h2>
            <p className="lp-card-sub">Choose a strong password for your account</p>
          </div>

          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', color: '#dc2626', fontSize: '13px' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', color: '#16a34a', fontSize: '13px' }}>
              Password updated successfully! Redirecting…
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="lp-field">
              <label className="lp-label">New Password</label>
              <div className="lp-input-wrap">
                <MdLock className="lp-input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="lp-input lp-input-icon-pad lp-input-icon-pad-r"
                  placeholder="••••••••"
                  value={form.new_password}
                  onChange={(e) => setForm({ ...form, new_password: e.target.value })}
                  autoComplete="new-password"
                  required
                />
                <button type="button" className="lp-eye-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
            </div>

            <div className="lp-field">
              <label className="lp-label">Confirm New Password</label>
              <div className="lp-input-wrap">
                <MdLock className="lp-input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="lp-input lp-input-icon-pad"
                  placeholder="••••••••"
                  value={form.confirm_new_password}
                  onChange={(e) => setForm({ ...form, confirm_new_password: e.target.value })}
                  autoComplete="new-password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className={'lp-submit-btn' + (loading ? ' lp-btn-loading' : '')}
              disabled={loading || success}
            >
              {loading ? <span className="lp-spinner" /> : 'Set New Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
