import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { MdCloudUpload, MdClose, MdSettings, MdSecurity, MdCreditCard, MdNotifications } from 'react-icons/md'

export default function Settings() {
  const navigate = useNavigate()
  const [orgName, setOrgName] = useState(localStorage.getItem('organizationName') || 'Acme Corporation')
  const [orgLogo, setOrgLogo] = useState(localStorage.getItem('organizationLogo') || '')
  const [activeTab, setActiveTab] = useState('general')
  const [saved, setSaved] = useState(false)
  const fileRef = useRef(null)
  
  const [selectedPlan, setSelectedPlan] = useState(() => {
    try {
      const p = localStorage.getItem('selectedPlan')
      return p ? JSON.parse(p) : { name: 'Starter', price: 'Free', period: '', sub: 'Basic organization management' }
    } catch {
      return { name: 'Starter', price: 'Free', period: '', sub: 'Basic organization management' }
    }
  })

  function handleLogoChange(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onloadend = () => setOrgLogo(reader.result)
    reader.readAsDataURL(file)
  }

  function handleSave() {
    localStorage.setItem('organizationName', orgName)
    if (orgLogo) localStorage.setItem('organizationLogo', orgLogo)
    else localStorage.removeItem('organizationLogo')
    
    // Trigger event for other components to sync
    window.dispatchEvent(new Event('orgUpdate'))
    
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  function handleDeleteOrg() {
    if (!confirm('Are you sure you want to delete this organization? All data will be permanently removed.')) return
    localStorage.removeItem('organizationName')
    localStorage.removeItem('organizationLogo')
    localStorage.removeItem('orgMembers')
    localStorage.removeItem('orgProjects')
    localStorage.removeItem('orgTasks')
    localStorage.removeItem('adminName')
    localStorage.removeItem('userRole')
    navigate('/register')
  }

  const memberCount = (() => { try { return JSON.parse(localStorage.getItem('orgMembers') || '[]').length } catch { return 0 } })()
  const projectCount = (() => { try { return JSON.parse(localStorage.getItem('orgProjects') || '[]').length } catch { return 0 } })()

  return (
    <div style={{ padding: '30px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '30px', textAlign: 'center' }}>
        <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: '600', color: '#1a202c' }}>Settings</h1>
        <p style={{ margin: '0', fontSize: '14px', color: '#718096' }}>Manage your organization settings and preferences</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: '1px solid #e1e4e8', marginBottom: '30px', justifyContent: 'center' }}>
        {[
          { id: 'general', label: 'General', icon: <MdSettings /> },
          { id: 'security', label: 'Security', icon: <MdSecurity /> },
          { id: 'billing', label: 'Billing', icon: <MdCreditCard /> },
          { id: 'notifications', label: 'Notifications', icon: <MdNotifications /> }
        ].map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: '12px 20px', border: 'none', backgroundColor: 'transparent', borderBottom: activeTab === tab.id ? '3px solid #22863a' : 'none', color: activeTab === tab.id ? '#22863a' : '#586069', fontWeight: activeTab === tab.id ? '600' : '500', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'flex', alignItems: 'center', fontSize: '16px' }}>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* General */}
      {activeTab === 'general' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>Organization Details</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1a202c', marginBottom: '6px' }}>Organization Name</label>
                <input type="text" value={orgName} onChange={(e) => setOrgName(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1a202c', marginBottom: '6px' }}>Organization Logo</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  {orgLogo ? (
                    <div style={{ position: 'relative' }}>
                      <img src={orgLogo} alt="Logo" style={{ width: '52px', height: '52px', borderRadius: '8px', objectFit: 'contain', background: '#f9fafb', border: '1px solid #e5e7eb' }} />
                      <button onClick={() => { setOrgLogo(''); if (fileRef.current) fileRef.current.value = '' }} style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#fee2e2', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#dc2626', fontSize: '12px' }}><MdClose size={12} /></button>
                    </div>
                  ) : (
                    <div style={{ width: '52px', height: '52px', borderRadius: '8px', background: '#f3f4f6', border: '2px dashed #d1d5db', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }} onClick={() => fileRef.current?.click()}>
                      <MdCloudUpload size={20} color="#9ca3af" />
                    </div>
                  )}
                  <button onClick={() => fileRef.current?.click()} style={{ padding: '7px 14px', border: '1px solid #d1d5db', borderRadius: '6px', background: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '500', color: '#374151' }}>
                    {orgLogo ? 'Change Logo' : 'Upload Logo'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleLogoChange} style={{ display: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1a202c', marginBottom: '6px' }}>Organization URL</label>
                <div style={{ display: 'flex', gap: '0' }}>
                  <input type="text" value={orgName.toLowerCase().replace(/\s+/g, '-')} readOnly
                    style={{ flex: 1, padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px 0 0 6px', fontSize: '13px', boxSizing: 'border-box', background: '#f6f8fa', color: '#586069' }} />
                  <div style={{ padding: '10px', backgroundColor: '#f6f8fa', border: '1px solid #e1e4e8', borderLeft: 'none', borderRadius: '0 6px 6px 0', fontSize: '13px', color: '#586069' }}>.fiftytask.com</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button onClick={handleSave} style={{ padding: '10px 24px', backgroundColor: '#22863a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
                  Save Changes
                </button>
                {saved && <span style={{ fontSize: '13px', color: '#22863a', fontWeight: '500' }}>✓ Saved successfully!</span>}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>Organization Stats</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div style={{ paddingBottom: '15px', borderBottom: '1px solid #e1e4e8' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#718096' }}>Active Projects</p>
                  <p style={{ margin: '0', fontSize: '24px', fontWeight: '700', color: '#1a202c' }}>{projectCount}</p>
                </div>
                <div style={{ paddingBottom: '15px', borderBottom: '1px solid #e1e4e8' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#718096' }}>Team Members</p>
                  <p style={{ margin: '0', fontSize: '24px', fontWeight: '700', color: '#1a202c' }}>{memberCount}</p>
                </div>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '12px', color: '#718096' }}>Created On</p>
                  <p style={{ margin: '0', fontSize: '14px', color: '#1a202c' }}>March 1, 2026</p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div style={{ backgroundColor: '#fef2f2', padding: '24px', borderRadius: '8px', border: '1px solid #fecaca' }}>
              <h3 style={{ margin: '0 0 8px 0', fontSize: '15px', fontWeight: '700', color: '#dc2626' }}>Danger Zone</h3>
              <p style={{ margin: '0 0 14px 0', fontSize: '12px', color: '#991b1b', lineHeight: '1.5' }}>Deleting your organization will permanently remove all projects, members, and data.</p>
              <button onClick={handleDeleteOrg}
                style={{ padding: '9px 18px', backgroundColor: '#dc2626', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px' }}>
                Delete Organization
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Security */}
      {activeTab === 'security' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', maxWidth: '600px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>Security Settings</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ paddingBottom: '20px', borderBottom: '1px solid #e1e4e8' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600' }}>Two-Factor Authentication</h4>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#718096' }}>Add an extra layer of security to your account</p>
              <button style={{ padding: '8px 16px', backgroundColor: '#0366d6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '12px' }}>Enable 2FA</button>
            </div>
            <div style={{ paddingBottom: '20px', borderBottom: '1px solid #e1e4e8' }}>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600' }}>Change Password</h4>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#718096' }}>Update your password regularly for better security</p>
              <button style={{ padding: '8px 16px', backgroundColor: '#0366d6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '12px' }}>Change Password</button>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600' }}>Active Sessions</h4>
              <p style={{ margin: '0 0 15px 0', fontSize: '12px', color: '#718096' }}>Manage your active sessions across devices</p>
              <div style={{ backgroundColor: '#f6f8fa', padding: '12px', borderRadius: '6px' }}>
                <p style={{ margin: '0 0 5px 0', fontSize: '12px', fontWeight: '500' }}>Current Session - Chrome on Windows</p>
                <p style={{ margin: '0', fontSize: '11px', color: '#718096' }}>Last active: now</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Billing */}
      {activeTab === 'billing' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', maxWidth: '600px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>Billing & Plan</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#f6f8fa', padding: '15px', borderRadius: '6px', border: '1px solid #e1e4e8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ margin: '0 0 5px 0', fontSize: '14px', fontWeight: '600' }}>{selectedPlan.name} Plan</h4>
                  <p style={{ margin: '0', fontSize: '12px', color: '#718096' }}>{selectedPlan.sub}</p>
                </div>
                <div style={{ fontSize: '20px', fontWeight: '700', color: '#22863a' }}>{selectedPlan.price}{selectedPlan.period}</div>
              </div>
            </div>
            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600' }}>Billing Information</h4>
              <p style={{ margin: '0 0 10px 0', fontSize: '12px', color: '#718096' }}>Next billing date: April 1, 2026</p>
              <button style={{ padding: '8px 16px', backgroundColor: '#0366d6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '12px' }}>Manage Billing</button>
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', maxWidth: '600px' }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>Notification Preferences</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {[
              { label: 'Project Updates', description: 'Get notified about project changes and milestones' },
              { label: 'Task Assignments', description: 'Receive notifications when new tasks are assigned' },
              { label: 'Team Activity', description: 'Updates from your team members' },
              { label: 'Weekly Digest', description: 'Summary email every Sunday' }
            ].map((notif, idx) => (
              <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '15px', borderBottom: idx < 3 ? '1px solid #e1e4e8' : 'none' }}>
                <div>
                  <p style={{ margin: '0 0 5px 0', fontSize: '13px', fontWeight: '500', color: '#1a202c' }}>{notif.label}</p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#718096' }}>{notif.description}</p>
                </div>
                <input type="checkbox" defaultChecked style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: '#22863a' }} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
