import { useNavigate } from 'react-router-dom'
import { useState, useRef } from 'react'
import { MdCloudUpload, MdClose, MdCheckCircle } from 'react-icons/md'
import './LoginPage.css'
import './RegisterPage.css'
import { register } from '../../services/authService'

export default function RegisterPage() {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [logoPreview, setLogoPreview] = useState(null)
  const fileRef = useRef(null)
  const [formData, setFormData] = useState({
    organizationName: '',
    username: '',
    email: '',
    fullName: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  })
  const [loading, setLoading] = useState(false)
  const [apiError, setApiError] = useState('')
  const [success, setSuccess] = useState(false)

  function handleLogoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setLogoPreview(reader.result)
    reader.readAsDataURL(file)
  }

  function removeLogo() {
    setLogoPreview(null)
    if (fileRef.current) fileRef.current.value = ''
  }

  const handleNext = (e) => {
    e.preventDefault()
    if (step === 1 && formData.organizationName) {
      // Store logo locally for display purposes only
      if (logoPreview) localStorage.setItem('organizationLogo', logoPreview)
      else localStorage.removeItem('organizationLogo')
      setStep(2)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setApiError('Passwords do not match.')
      return
    }
    if (!formData.acceptTerms) {
      setApiError('You must accept the Terms of Service.')
      return
    }
    setLoading(true)
    setApiError('')
    try {
      await register({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
        organization_name: formData.organizationName,
      })
      // Store org name for display on success screen
      localStorage.setItem('organizationName', formData.organizationName)
      setSuccess(true)
    } catch (err) {
      const detail = err.data
      if (typeof detail === 'object') {
        const msgs = Object.entries(detail)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : v}`)
          .join('\n')
        setApiError(msgs)
      } else {
        setApiError(detail || 'Registration failed. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (success) {
    return (
      <div className="lp-shell">
        <div className="lp-left">
          <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }} onClick={() => navigate('/')}>
            <div style={{ backgroundColor: '#fff', padding: '6px 12px', borderRadius: '12px', display: 'flex', alignItems: 'center' }}>
              <img src="/logo.png" alt="50 Tasks Logo" style={{ height: '36px' }} />
            </div>
            <span style={{ fontSize: '28px', fontWeight: '800', color: '#fff', letterSpacing: '0.05em' }}>50 TASKS</span>
          </div>
        </div>
        <div className="lp-right">
          <div className="lp-card" style={{ textAlign: 'center' }}>
            <MdCheckCircle size={56} color="#16a34a" style={{ marginBottom: '16px' }} />
            <h2 className="rp-form-title">Account Created!</h2>
            <p className="rp-form-sub" style={{ marginBottom: '20px' }}>
              We sent a verification email to <strong>{formData.email}</strong>.<br />
              Please verify your email before logging in.
            </p>
            <button className="rp-submit-btn" onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="lp-shell">
      {/* Left Section */}
      <div className="lp-left">
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
          <div style={{ marginBottom: 'auto', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '14px' }} onClick={() => navigate('/')}>
            <div style={{ backgroundColor: '#fff', padding: '6px 12px', borderRadius: '12px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center' }}>
              <img src="/logo.png" alt="50 Tasks Logo" style={{ height: '36px' }} />
            </div>
            <span style={{ fontSize: '28px', fontWeight: '800', color: '#fff', letterSpacing: '0.05em' }}>50 TASKS</span>
          </div>

          <div style={{ marginTop: '40px' }}>
            <h1 className="rp-hero-title">Start Your<br />Journey</h1>
            <p className="rp-hero-desc">
              Join thousands of teams using<br />
              FiftyTask to manage their projects<br />
              and collaborate effectively in real-<br />
              time.
            </p>
            <div className="rp-steps-container">
              {[
                { stepNum: 1, title: 'Create Organization', desc: 'You become the Organization Admin\nwith full control over settings.' },
                { stepNum: 2, title: 'Invite Team Members', desc: 'Add your team and assign roles like\nProject Manager or Member.' },
                { stepNum: 3, title: 'Start Managing Projects', desc: 'Create projects, tasks, and\ncollaborate instantly with your team.' }
              ].map((item) => {
                const isActive = step === item.stepNum
                return (
                  <div key={item.stepNum} className="rp-step-item">
                    <div className={`rp-step-circle ${isActive ? 'active' : 'inactive'}`}>{item.stepNum}</div>
                    <div className="rp-step-content">
                      <h4 className={`rp-step-title ${isActive ? 'active' : 'inactive'}`}>{item.title}</h4>
                      <p className={`rp-step-desc ${isActive ? 'active' : 'inactive'}`}>{item.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Right Section */}
      <div className="lp-right">
        <div className="lp-card">
          <h2 className="rp-form-title">
            {step === 1 ? 'Create Your Organization' : 'Create Admin Account'}
          </h2>
          <p className="rp-form-sub">
            {step === 1 ? 'Step 1 of 2: Organization Setup' : 'Step 2 of 2: Admin Account'}
          </p>

          {/* API error banner */}
          {apiError && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '8px', padding: '10px 14px', marginBottom: '12px', color: '#dc2626', fontSize: '13px', whiteSpace: 'pre-line' }}>
              {apiError}
            </div>
          )}

          <form onSubmit={step === 1 ? handleNext : handleSubmit} className="rp-form">
            {step === 1 ? (
              <>
                <div className="rp-field-wrapper">
                  <label className="rp-label">Organization Name</label>
                  <input
                    type="text"
                    placeholder="Acme Corporation"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    className="rp-input"
                    required
                  />
                  <p className="rp-helper-text">You will become the Organization Admin</p>
                </div>

                {/* Logo Upload */}
                <div className="rp-field-wrapper">
                  <label className="rp-label">Company Logo <span style={{ color: '#718096', fontWeight: 400 }}>(optional)</span></label>
                  {logoPreview ? (
                    <div className="rp-logo-preview-wrap">
                      <img src={logoPreview} alt="Logo preview" className="rp-logo-preview-img" />
                      <button type="button" className="rp-logo-remove" onClick={removeLogo}><MdClose size={16} /></button>
                      <span className="rp-logo-change" onClick={() => fileRef.current?.click()}>Change</span>
                    </div>
                  ) : (
                    <div className="rp-logo-dropzone" onClick={() => fileRef.current?.click()}>
                      <MdCloudUpload size={28} color="#9ca3af" />
                      <span className="rp-logo-dropzone-text">Click to upload your logo</span>
                      <span className="rp-logo-dropzone-hint">PNG, JPG, SVG up to 2 MB</span>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
                </div>
              </>
            ) : (
              <>
                <div className="rp-field-wrapper">
                  <label className="rp-label">Username</label>
                  <input type="text" placeholder="john_doe" value={formData.username} onChange={(e) => setFormData({ ...formData, username: e.target.value })} className="rp-input" required />
                </div>
                <div className="rp-field-wrapper">
                  <label className="rp-label">Full Name <span style={{ color: '#718096', fontWeight: 400 }}>(display)</span></label>
                  <input type="text" placeholder="John Doe" value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} className="rp-input" />
                </div>
                <div className="rp-field-wrapper">
                  <label className="rp-label">Email Address</label>
                  <input type="email" placeholder="you@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="rp-input" required />
                </div>
                <div className="rp-field-wrapper">
                  <label className="rp-label">Password</label>
                  <input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} className="rp-input" required />
                </div>
                <div className="rp-field-wrapper">
                  <label className="rp-label">Confirm Password</label>
                  <input type="password" placeholder="••••••••" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} className="rp-input" required />
                </div>
                <label className="rp-checkbox-label">
                  <input type="checkbox" className="rp-checkbox" checked={formData.acceptTerms} onChange={(e) => setFormData({ ...formData, acceptTerms: e.target.checked })} />
                  <span>I agree to the Terms of Service and Privacy Policy</span>
                </label>
              </>
            )}

            <button type="submit" className="rp-submit-btn" disabled={loading}>
              {loading ? 'Please wait...' : step === 1 ? 'Next' : 'Create Account'}
            </button>
          </form>

          {step === 2 && (
            <button onClick={() => setStep(1)} className="rp-back-btn">Back</button>
          )}

          <div className="rp-footer">
            <p className="rp-footer-text">
              Already have an account?{' '}
              <a href="#" onClick={() => navigate('/login')} className="rp-link">Sign In</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
