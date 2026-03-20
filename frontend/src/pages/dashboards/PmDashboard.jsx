import { useState, useEffect } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import {
  MdDashboard,
  MdFolderCopy,
  MdBarChart,
  MdPeople,
  MdCalendarToday,
  MdSettings,
  MdSearch,
  MdNotifications,
} from 'react-icons/md'
import { RiShieldUserFill } from 'react-icons/ri'
import ProfileDropdown from '../../components/ProfileDropdown'
import NotificationDropdown from '../../components/NotificationDropdown'
import { getUser } from '../../utils/auth'
import './PmDashboard.css'

const navItems = [
  { path: '/dashboard/pm', label: 'Dashboard', icon: <MdDashboard /> },
  { path: '/dashboard/pm/projects', label: 'Project Portfolios', icon: <MdFolderCopy /> },
  { path: '/dashboard/pm/reports', label: 'Reports', icon: <MdBarChart /> },
]

const planningItems = [
  { path: '/dashboard/pm/teams', label: 'Resource Allocation', icon: <MdPeople /> },
  { path: '/dashboard/pm/timeline', label: 'Timeline View', icon: <MdCalendarToday /> },
]


export default function PmDashboard() {
  const location = useLocation()
  const [orgBrand, setOrgBrand] = useState({
    name: localStorage.getItem('organizationName') || 'Workspace',
    logo: localStorage.getItem('organizationLogo')
  })

  useEffect(() => {
    const syncBrand = () => {
      setOrgBrand({
        name: localStorage.getItem('organizationName') || 'Workspace',
        logo: localStorage.getItem('organizationLogo')
      })
    }
    window.addEventListener('orgUpdate', syncBrand)
    return () => window.removeEventListener('orgUpdate', syncBrand)
  }, [])

  const [search, setSearch] = useState('')

  const currentUser = getUser()
  const adminName = currentUser?.username || localStorage.getItem('adminName') || 'PM'
  const initials = adminName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)



  return (
    <div className="pm-shell">
      {/* Sidebar */}
      <aside className="pm-sidebar">
        <div className="pm-sidebar-brand" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => window.location.href = '/'}>
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
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>PM Center</span>
          </div>
        </div>

        <div className="pm-nav-section-label">MAIN MENU</div>
        <nav className="pm-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={'pm-nav-link' + (location.pathname === item.path ? ' pm-nav-active' : '')}
            >
              <span className="pm-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="pm-nav-section-label" style={{ marginTop: 18 }}>PLANNING</div>
        <nav className="pm-nav">
          {planningItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={'pm-nav-link' + (location.pathname === item.path ? ' pm-nav-active' : '')}
            >
              <span className="pm-nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>


      </aside>

      {/* Main */}
      <div className="pm-main">
        {/* Top bar */}
        <header className="pm-topbar">
          <h1 className="pm-topbar-title">PM Center</h1>
          <div className="pm-topbar-search">
            <MdSearch className="pm-search-icon" />
            <input
              type="text"
              placeholder="Search projects, tasks, or resources..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pm-search-input"
            />
          </div>
          <div className="pm-topbar-right">
            <div className="pm-topbar-role">
              <span className="pm-role-dot" />
              {currentUser?.role?.replace('_', ' ') || 'PROJECT MANAGER'}
            </div>
            <NotificationDropdown>
              <button className="pm-icon-btn"><MdNotifications size={20} /></button>
            </NotificationDropdown>
            <ProfileDropdown 
              userName={adminName || 'Project Manager'} 
              userEmail={currentUser?.email || 'pm@fiftytask.com'} 
              userRole={currentUser?.role?.replace('_', ' ') || 'PROJECT MANAGER'}
            >
              <div className="pm-avatar" title={adminName}>{initials}</div>
            </ProfileDropdown>
          </div>
        </header>

        <div className="pm-content">
          <Outlet context={{ search }} />
        </div>
      </div>


    </div>
  )
}
