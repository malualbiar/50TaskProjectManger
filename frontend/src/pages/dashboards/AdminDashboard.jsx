import { useState, useEffect } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import {
  MdDashboard,
  MdFolderOpen,
  MdPeople,
  MdCreditCard,
  MdSettings,
  MdNotifications,
  MdPersonAdd,
  MdDownload,
  MdSearch,
} from 'react-icons/md'
import { RiShieldUserFill } from 'react-icons/ri'
import ProfileDropdown from '../../components/ProfileDropdown'
import NotificationDropdown from '../../components/NotificationDropdown'
import { getUser } from '../../utils/auth'
import './AdminDashboard.css'

const navItems = [
  { path: '/dashboard/admin', label: 'Dashboard', icon: <MdDashboard /> },
  { path: '/dashboard/admin/projects', label: 'All Projects', icon: <MdFolderOpen /> },
  { path: '/dashboard/admin/teams', label: 'Member Management', icon: <MdPeople /> },
  { path: '/dashboard/admin/settings', label: 'Organization Settings', icon: <MdSettings /> },
]



export default function AdminDashboard() {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const currentUser = getUser()
  const orgName = currentUser?.organization || localStorage.getItem('organizationName') || 'My Organisation'
  const adminName = currentUser?.username || localStorage.getItem('adminName') || 'Admin'

  const [orgBrand, setOrgBrand] = useState({
    name: orgName,
    logo: localStorage.getItem('organizationLogo')
  })

  useEffect(() => {
    const syncBrand = () => {
      setOrgBrand({
        name: currentUser?.organization || localStorage.getItem('organizationName') || 'My Organisation',
        logo: localStorage.getItem('organizationLogo')
      })
    }
    window.addEventListener('orgUpdate', syncBrand)
    return () => window.removeEventListener('orgUpdate', syncBrand)
  }, [])

  const initials = adminName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)



  function handleInvite(e) {
    e.preventDefault()
    alert(`Admin invite sent to: ${inviteEmail}`)
    setInviteEmail('')
    setShowInviteModal(false)
  }



  return (
    <div className="ad-shell">
      {/* Sidebar */}
      <aside className="ad-sidebar">
        <div className="ad-sidebar-brand" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => window.location.href = '/'}>
          <img 
            src={orgBrand.logo || '/logo.png'} 
            alt={orgBrand.name} 
            style={{ 
              height: '34px', 
              backgroundColor: '#fff', 
              padding: '4px 8px', 
              borderRadius: '6px',
              display: 'block',
              objectFit: 'contain',
              maxWidth: '60px'
            }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '16px', fontWeight: '800', color: '#fff', letterSpacing: '0.03em', lineHeight: '1.2' }}>{orgBrand.name}</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>Admin Panel</span>
          </div>
        </div>

        <nav className="ad-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={'ad-nav-link' + (location.pathname === item.path ? ' ad-nav-active' : '')}
            >
              <span className="ad-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>


      </aside>

      {/* Main */}
      <div className="ad-main">
        {/* Top bar */}
        <header className="ad-topbar">
          <h1 className="ad-topbar-title">Organization Overview</h1>
          <div className="ad-topbar-search">
            <MdSearch className="ad-search-icon" />
            <input
              type="text"
              placeholder="Search resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ad-search-input"
            />
          </div>
          <div className="ad-topbar-right">
            <div className="ad-topbar-role">
              <span className="ad-role-dot" />
              {currentUser?.role?.replace('_', ' ') || 'ORGANIZATION ADMIN'}
            </div>
            <NotificationDropdown>
              <button className="ad-icon-btn"><MdNotifications size={20} /></button>
            </NotificationDropdown>
            <ProfileDropdown 
              userName={adminName} 
              userEmail={currentUser?.email || 'admin@fiftytask.com'} 
              userRole={currentUser?.role?.replace('_', ' ') || 'ORGANIZATION ADMIN'}
            >
              <div className="ad-avatar" title={adminName}>{initials}</div>
            </ProfileDropdown>
          </div>
        </header>

        <div className="ad-content">
          <Outlet context={{ search }} />
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="ad-modal-overlay" onClick={() => setShowInviteModal(false)}>
          <div className="ad-modal" onClick={(e) => e.stopPropagation()}>
            <h3 className="ad-modal-title">Invite Admin</h3>
            <p className="ad-modal-sub">Enter the email address of the person you want to invite as admin.</p>
            <form onSubmit={handleInvite}>
              <input
                type="email"
                className="ad-modal-input"
                placeholder="admin@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                required
              />
              <div className="ad-modal-actions">
                <button type="button" className="ad-modal-cancel" onClick={() => setShowInviteModal(false)}>Cancel</button>
                <button type="submit" className="ad-modal-submit">Send Invite</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
