import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
import {
  MdEmail,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
  MdArrowForward,
  MdCheckCircle,
  MdDashboard,
  MdPerson,
} from 'react-icons/md'
import './LoginPage.css'
import { login, forgotPassword } from '../../services/authService'
import { isAuthenticated, getDashboardRoute, getRole } from '../../utils/auth'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '', remember: false })
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [forgotSent, setForgotSent] = useState(false)
  const [showForgot, setShowForgot] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotError, setForgotError] = useState('')

  // If already logged in, go to the right dashboard
  if (isAuthenticated()) {
    return <Navigate to={getDashboardRoute(getRole())} replace />
  }

  function validate() {
    const errs = {}
    if (!form.username) errs.username = 'Username is required'
    if (!form.password) errs.password = 'Password is required'
    else if (form.password.length < 6) errs.password = 'Password must be at least 6 characters'
    return errs
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setApiError('')
    setLoading(true)
    try {
      const data = await login(form.username, form.password)

      if (data.must_change_password) {
        navigate('/set-password')
        return
      }

      navigate(getDashboardRoute(data.role))
    } catch (err) {
      const detail = err.data
      if (typeof detail === 'object') {
        // Flatten DRF validation errors
        const msgs = Object.values(detail).flat().join(' ')
        setApiError(msgs)
      } else {
        setApiError(detail || 'Login failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleForgot(e) {
    e.preventDefault()
    if (!forgotEmail) return
    setForgotLoading(true)
    setForgotError('')
    try {
      await forgotPassword(forgotEmail)
      setForgotSent(true)
    } catch (err) {
      const detail = err.data
      setForgotError(
        typeof detail === 'object'
          ? Object.values(detail).flat().join(' ')
          : detail || 'Something went wrong.'
      )
    } finally {
      setForgotLoading(false)
    }
  }

  return (
    <div className="lp-shell">
      {/* ── Left panel ── */}
      <div className="lp-left">
        <div className="lp-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ backgroundColor: '#fff', padding: '6px 12px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="50 Tasks" style={{ height: '36px' }} />
          </div>
          <span className="lp-logo-text" style={{ fontSize: '28px', fontWeight: '800', color: '#fff', letterSpacing: '0.05em' }}>50 TASKS</span>
        </div>

        <div className="lp-hero">
          <h1 className="lp-hero-title">Manage your work, <br />smarter &amp; faster.</h1>
          <p className="lp-hero-sub">
            The all-in-one project management platform trusted by thousands of teams worldwide.
          </p>
        </div>
      </div>

      {/* ── Right panel ── */}
      <div className="lp-right">
        {/* Forgot Password overlay */}
        {showForgot && (
          <div className="lp-forgot-overlay">
            <div className="lp-forgot-box">
              {!forgotSent ? (
                <>
                  <h3 className="lp-forgot-title">Reset Password</h3>
                  <p className="lp-forgot-sub">Enter your email address and we'll send you a temporary password.</p>
                  <form onSubmit={handleForgot}>
                    <input
                      type="email"
                      className="lp-input"
                      placeholder="you@example.com"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      required
                      autoFocus
                    />
                    {forgotError && <p style={{ color: '#dc2626', fontSize: '13px', margin: '6px 0 0' }}>{forgotError}</p>}
                    <div className="lp-forgot-actions">
                      <button type="button" className="lp-forgot-cancel" onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); setForgotError('') }}>
                        Cancel
                      </button>
                      <button type="submit" className="lp-submit-btn" style={{ flex: 1, marginTop: 0 }} disabled={forgotLoading}>
                        {forgotLoading ? <span className="lp-spinner" /> : 'Send Temporary Password'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="lp-forgot-success">
                  <MdCheckCircle size={44} color="#16a34a" />
                  <h3 className="lp-forgot-title">Check your inbox!</h3>
                  <p className="lp-forgot-sub">A temporary password was sent to <strong>{forgotEmail}</strong></p>
                  <button className="lp-submit-btn" style={{ marginTop: 16 }} onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail('') }}>
                    Back to Login
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="lp-card">
          {/* Card header */}
          <div className="lp-card-top">
            <div className="lp-card-icon"><MdDashboard size={26} color="#16a34a" /></div>
            <h2 className="lp-card-title">Welcome Back!</h2>
            <p className="lp-card-sub">Enter your credentials to access your workspace</p>
          </div>

          {/* API-level error banner */}
          {apiError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', color: '#dc2626', fontSize: '13px' }}>
              {apiError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Username */}
            <div className="lp-field">
              <label className="lp-label">Username</label>
              <div className="lp-input-wrap">
                <MdPerson className="lp-input-icon" />
                <input
                  type="text"
                  className={'lp-input lp-input-icon-pad' + (errors.username ? ' lp-input-error' : '')}
                  placeholder="your.username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  autoComplete="username"
                />
              </div>
              {errors.username && <span className="lp-error-msg">{errors.username}</span>}
            </div>

            {/* Password */}
            <div className="lp-field">
              <label className="lp-label">Password</label>
              <div className="lp-input-wrap">
                <MdLock className="lp-input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className={'lp-input lp-input-icon-pad lp-input-icon-pad-r' + (errors.password ? ' lp-input-error' : '')}
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  autoComplete="current-password"
                />
                <button type="button" className="lp-eye-btn" onClick={() => setShowPass(!showPass)}>
                  {showPass ? <MdVisibilityOff size={18} /> : <MdVisibility size={18} />}
                </button>
              </div>
              {errors.password && <span className="lp-error-msg">{errors.password}</span>}
            </div>

            {/* Remember & Forgot */}
            <div className="lp-row-between">
              <label className="lp-remember">
                <input
                  type="checkbox"
                  checked={form.remember}
                  onChange={(e) => setForm({ ...form, remember: e.target.checked })}
                  className="lp-checkbox"
                />
                <span>Remember me</span>
              </label>
              <button type="button" className="lp-forgot-link" onClick={() => setShowForgot(true)}>
                Forgot password?
              </button>
            </div>

            {/* Submit */}
            <button type="submit" className={'lp-submit-btn' + (loading ? ' lp-btn-loading' : '')} disabled={loading}>
              {loading ? (
                <span className="lp-spinner" />
              ) : (
                <>Sign In To Workspace <MdArrowForward size={18} /></>
              )}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '13px', color: '#6b7280' }}>
            Don't have an account?{' '}
            <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register') }} style={{ color: '#16a34a', fontWeight: '600', textDecoration: 'none' }}>
              Create one
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
