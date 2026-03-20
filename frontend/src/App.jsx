import { useState } from 'react'
import { Outlet, Link, useLocation } from 'react-router-dom'
import {
  FiLayout,
  FiFolder,
  FiCheckSquare,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiBell,
  FiHelpCircle
} from 'react-icons/fi'
import './layout/AppLayout.css'
import ProfileDropdown from './components/ProfileDropdown'
import NotificationDropdown from './components/NotificationDropdown'

function App() {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const orgName = localStorage.getItem('organizationName') || 'Workspace'

  const navItems = [
    { path: '/', label: 'Dashboard', icon: <FiLayout /> },
    { path: '/projects', label: 'Projects', icon: <FiFolder /> },
    { path: '/tasks', label: 'Tasks', icon: <FiCheckSquare /> },
    { path: '/teams', label: 'Team Members', icon: <FiUsers /> },
    { path: '/reports', label: 'Reports', icon: <FiBarChart2 /> },
    { path: '/settings', label: 'Settings', icon: <FiSettings /> }
  ]

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="app-sidebar">
        <div className="app-sidebar-header" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => window.location.href = '/'}>
          <img 
            src="/logo.png" 
            alt="50 Tasks" 
            style={{ 
              height: '36px', 
              backgroundColor: '#fff', 
              padding: '4px 8px', 
              borderRadius: '8px',
              display: 'block'
            }} 
          />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '18px', fontWeight: '800', color: '#fff', letterSpacing: '0.05em', lineHeight: '1.2' }}>50 TASKS</span>
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>{orgName}</span>
          </div>
        </div>

        <nav className="app-nav">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={
                'app-nav-link' +
                (location.pathname === item.path ? ' app-nav-link-active' : '')
              }
            >
              <span className="app-nav-link-icon">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="app-sidebar-footer">
          <div className="storage-label">Storage Details</div>
          <div className="storage-row">
            <span>Storage</span>
            <span>68.3 GB of 118 used</span>
          </div>
          <div className="storage-bar">
            <div className="storage-bar-fill" />
          </div>
          <button className="storage-upgrade-btn">Upgrade Storage</button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="app-main">
        {/* Header */}
        <header className="app-header">
          <div className="app-org-name">{orgName}</div>
          <div className="app-search-wrapper">
            <input
              type="text"
              placeholder="Search projects, tasks, or team members..."
              className="app-search-input"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="app-header-actions">
            <NotificationDropdown>
              <button className="icon-button" aria-label="Notifications">
                <FiBell />
              </button>
            </NotificationDropdown>
            <button className="icon-button" aria-label="Help">
              <FiHelpCircle />
            </button>
            <button className="new-project-btn">+ New Project</button>
            <ProfileDropdown 
              userName="Member" 
              userEmail="user@fiftytask.com" 
              userRole="USER"
            >
              <div className="app-avatar" />
            </ProfileDropdown>
          </div>
        </header>

        {/* Page Content */}
        <main className="app-page-content">
          <Outlet context={{ search }} />
        </main>
      </div>
    </div>
  )
}

export default App
