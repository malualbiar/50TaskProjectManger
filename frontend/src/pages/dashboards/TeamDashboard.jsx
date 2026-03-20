import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import { MdWork, MdInbox, MdTimeline, MdSearch, MdNotifications, MdAdd, MdCalendarToday, MdComment, MdCheckBox, MdPersonAdd, MdCheckCircle, MdRadioButtonUnchecked, MdPlayArrow, MdStop, MdChevronLeft, MdChevronRight } from 'react-icons/md'
import { BsListTask } from 'react-icons/bs'
import ProfileDropdown from '../../components/ProfileDropdown'
import NotificationDropdown from '../../components/NotificationDropdown'
import { getUser } from '../../utils/auth'
import './TeamDashboard.css'

// ─── Static data ───────────────────────────────────────────────────────


const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']



// ─── Component ────────────────────────────────────────────────────────
export default function TeamDashboard() {
  const location = useLocation()
  const [search, setSearch] = useState('')
  const currentUser = getUser()
  const memberName = currentUser?.username || 'Team Member'
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

  // Real unread logic would go here
  const unread = 0

  return (
    <div className="tm-shell">
      {/* Sidebar */}
      <aside className="tm-sidebar">
        <div className="tm-sidebar-brand" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => window.location.href = '/'}>
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
            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '600' }}>Team Portal</span>
          </div>
        </div>

        <div className="tm-nav-section-label">MAIN MENU</div>
        <nav className="tm-nav">
          <Link to="/dashboard/team" className={'tm-nav-link' + (location.pathname === '/dashboard/team' ? ' tm-nav-active' : '')}>
            <span className="tm-nav-icon"><MdWork /></span>
            My Work
          </Link>
          <Link to="/dashboard/team/tasks" className="tm-nav-link tm-nav-sub">
            <span className="tm-nav-icon"><MdInbox /></span>
            Inbox
            {unread > 0 && <span className="tm-badge-count">{unread}</span>}
          </Link>
          <Link to="/dashboard/team/timeline" className="tm-nav-link tm-nav-sub">
            <span className="tm-nav-icon"><MdTimeline /></span>
            Timeline
          </Link>
        </nav>




      </aside>

      {/* Main */}
      <div className="tm-main">
        {/* Top bar */}
        <header className="tm-topbar">
          <div className="tm-topbar-search">
            <MdSearch className="tm-search-icon" />
            <input type="text" placeholder="Search tasks..." className="tm-search-input" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <div className="tm-topbar-right">
            <NotificationDropdown>
              <button className="tm-icon-btn"><MdNotifications size={20} /></button>
            </NotificationDropdown>

            <ProfileDropdown 
              userName={memberName} 
              userEmail={currentUser?.email || 'member@fiftytask.com'} 
              userRole={currentUser?.role?.replace('_', ' ') || 'TEAM MEMBER'}
            >
              <div className="tm-avatar" />
            </ProfileDropdown>
          </div>
        </header>

        <div className="tm-content">
          <Outlet context={{ search }} />
        </div>
      </div>

    </div>
  )
}
