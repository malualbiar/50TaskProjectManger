import { useState, useEffect } from 'react'
import { MdFolderOpen, MdPeople } from 'react-icons/md'
import { RiShieldUserFill } from 'react-icons/ri'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { getOwnerProjects, getOwnerMetrics, getActivityLogs } from '../../services/projectService'

function statusClass(status) {
  if (status === 'IN_PROGRESS' || status === 'ACTIVE' || status === 'On Track') return 'ad-status-active'
  if (status === 'DELAYED' || status === 'At Risk') return 'ad-status-delayed'
  return 'ad-status-planning'
}

function progressPct(project) {
  if (!project.total_tasks || project.total_tasks === 0) return 0
  return Math.round((project.completed_tasks / project.total_tasks) * 100)
}

export default function AdminOverview() {
  const navigate = useNavigate()
  const { search = '' } = useOutletContext() || {}

  const [projects, setProjects] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const orgName = localStorage.getItem('organizationName') || 'My Organisation'

  const selectedPlan = (() => {
    try {
      const p = localStorage.getItem('selectedPlan')
      return p ? JSON.parse(p) : { name: 'Starter' }
    } catch { return { name: 'Starter' } }
  })()

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError('')
      try {
        const [proj, met, logs] = await Promise.all([
          getOwnerProjects(),
          getOwnerMetrics(),
          getActivityLogs().catch(() => []),  // logs non-critical
        ])
        setProjects(proj)
        setMetrics(met)
        setActivities(logs)
      } catch (err) {
        setError('Failed to load dashboard data. Please refresh.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const filteredProjects = projects.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.status || '').toLowerCase().includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '260px', color: '#6b7280', fontSize: '14px' }}>
        Loading dashboard…
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ padding: '24px', color: '#dc2626', background: '#fef2f2', borderRadius: '8px', fontSize: '14px' }}>
        {error}
      </div>
    )
  }

  return (
    <>
      {/* Workspace Banner */}
      <div style={{ background: 'linear-gradient(135deg, #022c16 0%, #0f3b21 100%)', borderRadius: '12px', padding: '22px 28px', display: 'flex', alignItems: 'center', gap: '18px', color: '#fff', marginBottom: '4px' }}>
        {localStorage.getItem('organizationLogo') ? (
          <img src={localStorage.getItem('organizationLogo')} alt="" style={{ height: '44px', borderRadius: '8px', background: '#fff', padding: '4px 8px', objectFit: 'contain' }} />
        ) : (
          <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700' }}>{orgName[0]}</div>
        )}
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '18px', fontWeight: '700' }}>{orgName}</div>
          <div style={{ fontSize: '12px', opacity: 0.75 }}>Organization Workspace</div>
        </div>
        <div style={{ display: 'flex', gap: '28px', fontSize: '13px' }}>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: '700' }}>{metrics?.total_projects ?? projects.length}</div><div style={{ opacity: 0.7 }}>Projects</div></div>
          <div style={{ textAlign: 'center' }}><div style={{ fontSize: '22px', fontWeight: '700' }}>{metrics?.total_tasks ?? '—'}</div><div style={{ opacity: 0.7 }}>Tasks</div></div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="ad-bottom-grid">
        
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
          {/* Stats */}
          <div className="ad-stats-row" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <div className="ad-stat-card">
              <div className="ad-stat-icon ad-stat-icon-green"><MdFolderOpen size={22} /></div>
              <span className="ad-stat-badge">Live</span>
              <div className="ad-stat-label">Total Projects</div>
              <div className="ad-stat-value">{metrics?.total_projects ?? projects.length}</div>
            </div>
            <div className="ad-stat-card">
              <div className="ad-stat-icon ad-stat-icon-blue"><MdPeople size={22} /></div>
              <span className="ad-stat-badge">{metrics?.in_progress_projects ?? 0} active</span>
              <div className="ad-stat-label">In Progress</div>
              <div className="ad-stat-value">{metrics?.in_progress_projects ?? '—'}</div>
            </div>
            <div className="ad-stat-card">
              <div className="ad-stat-icon ad-stat-icon-dark"><RiShieldUserFill size={22} /></div>
              <span className="ad-stat-badge-active">Active</span>
              <div className="ad-stat-label">Subscription Plan</div>
              <div className="ad-stat-value ad-stat-value-sm">{selectedPlan.name}</div>
            </div>
          </div>

          {/* Projects table */}
          <div className="ad-card">
            <div className="ad-card-head">
              <h2 className="ad-card-title">Active Projects Portfolio</h2>
            </div>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>PROJECT</th>
                  <th>MANAGER</th>
                  <th>STATUS</th>
                  <th>PROGRESS</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.slice(0, 5).map((p) => {
                  const pct = progressPct(p)
                  return (
                    <tr key={p.id} onClick={() => navigate(`projects/${p.id}`)} style={{ cursor: 'pointer' }}>
                      <td>
                        <div className="ad-proj-row">
                          <div className="ad-proj-avatar">{(p.name || '').slice(0, 2).toUpperCase()}</div>
                          <span className="ad-proj-name">{p.name}</span>
                        </div>
                      </td>
                      <td className="ad-proj-client">{p.created_by?.username || 'Unassigned'}</td>
                      <td>
                        <span className={'ad-status-pill ' + statusClass(p.status)}>{p.status}</span>
                      </td>
                      <td>
                        <div className="ad-prog-track">
                          <div
                            className={'ad-prog-fill ' + (p.status === 'PENDING' ? 'ad-prog-blue' : p.status === 'COMPLETED' ? 'ad-prog-green' : 'ad-prog-orange')}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
                {projects.length === 0 && (
                  <tr><td colSpan={4} style={{ textAlign: 'center', color: '#9ca3af', padding: '24px' }}>No projects yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column – Activity */}
        <div className="ad-right-col" style={{ height: '100%' }}>
          <div className="ad-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <h2 className="ad-card-title" style={{ marginBottom: 14 }}>Recent Activity</h2>
            <div className="ad-activity-list" style={{ flex: 1 }}>
              {activities.length === 0 && (
                <p style={{ fontSize: '13px', color: '#9ca3af' }}>No activity logs yet.</p>
              )}
              {activities.slice(0, 8).map((a, i) => (
                <div key={i} className="ad-activity-item">
                  <span className="ad-activity-dot" style={{ background: '#22c55e' }} />
                  <div className="ad-activity-body">
                    <p className="ad-activity-text">
                      <strong>{a.user || a.performed_by || 'System'}</strong>{' '}
                      {a.action || a.description}
                    </p>
                    <span className="ad-activity-time">
                      {a.created_at ? new Date(a.created_at).toLocaleString() : a.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions (Bottom) */}
      <div className="ad-card ad-actions-card" style={{ marginTop: '22px' }}>
        <h3 className="ad-actions-title">Project Stats</h3>
        <div className="ad-actions-row">
          <div style={{ fontSize: '13px', color: '#374151' }}>
            <strong>{metrics?.pending_projects ?? 0}</strong> Pending &nbsp;·&nbsp;
            <strong>{metrics?.in_progress_projects ?? 0}</strong> In Progress &nbsp;·&nbsp;
            <strong>{metrics?.completed_projects ?? 0}</strong> Completed
          </div>
        </div>
      </div>
    </>
  )
}
