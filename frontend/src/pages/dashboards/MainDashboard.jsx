import { useOutletContext } from 'react-router-dom'
import './MainDashboard.css'

export default function MainDashboard() {
  const { search = '' } = useOutletContext() || {}
  return (
    <div className="dashboard">
      {/* Header Section */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">Organization Overview</h1>
          <p className="dash-subtitle">Real-time insights across 24 active projects.</p>
        </div>
        <button className="dash-header-btn">
          + New Project
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-row">
        <div className="stat-card">
          <div className="stat-head">
            <p className="stat-label">Active Projects</p>
            <span className="stat-pill stat-pill-positive">+12%</span>
          </div>
          <h2 className="stat-value">24</h2>
        </div>

        <div className="stat-card">
          <div className="stat-head">
            <p className="stat-label">Team Members</p>
            <span className="stat-pill stat-pill-positive">+5%</span>
          </div>
          <h2 className="stat-value">156</h2>
        </div>

        <div className="stat-card">
          <div className="stat-head">
            <p className="stat-label">Tasks Completed</p>
            <span className="stat-pill stat-pill-negative">-2%</span>
          </div>
          <h2 className="stat-value">842</h2>
        </div>

        <div className="stat-card">
          <div className="stat-head">
            <p className="stat-label">Avg. Velocity</p>
            <span className="stat-pill stat-pill-positive">+4%</span>
          </div>
          <h2 className="stat-value">92%</h2>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="main-row">
        {/* Active Projects Section */}
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Active Projects</h3>
            <a href="#" className="card-link">View All</a>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Project Name</th>
                <th>Status</th>
                <th>Team</th>
                <th>Progress</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Q4 Product Launch', dept: 'Marketing', status: 'On Track', team: 3, progress: 75 },
                { name: 'Mobile App Redesign', dept: 'Design', status: 'At Risk', team: 2, progress: 45 },
                { name: 'Security Audit 2024', dept: 'Infrastructure', status: 'On Track', team: 2, progress: 85 }
              ].filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.dept.toLowerCase().includes(search.toLowerCase())).map((project) => (
                <tr key={project.name}>
                  <td>
                    <div style={{ fontWeight: '500', color: '#1a202c' }}>{project.name}</div>
                    <div style={{ fontSize: '12px', color: '#718096' }}>{project.dept}</div>
                  </td>
                  <td>
                    <span
                      className={
                        'status-pill ' +
                        (project.status === 'On Track'
                          ? 'status-ok'
                          : 'status-warn')
                      }
                    >
                      {project.status}
                    </span>
                  </td>
                  <td>
                    <div className="team-avatars">
                      {[...Array(project.team)].map((_, i) => (
                        <div
                          key={i}
                          className="team-avatar"
                          style={{ backgroundColor: ['#d1f2eb', '#d1f1f5', '#e1f5ff'][i] }}
                        />
                      ))}
                    </div>
                  </td>
                  <td>
                    <div className="progress-track">
                      <div
                        className={
                          project.status === 'On Track'
                            ? 'progress-ok'
                            : 'progress-warn'
                        }
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity Section */}
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Recent Activity</h3>
          </div>

          <div className="card-body activity-list">
            {[
              { user: 'Sarah Chen', action: 'edited task', detail: '"Landing Page Design"', time: '2 hours ago', color: '#fee2e2' },
              { user: 'Mike Ross', action: 'completed', detail: '"Database Migration"', time: '5 hours ago', color: '#dcfce7' },
              { user: 'System', action: 'New Critical Risk in', detail: '"Security Audit"', time: 'Yesterday', color: '#fef9c3' },
              { user: 'Admin', action: 'invited 2 new members to', detail: '"Marketing"', time: 'Yesterday', color: '#e0f2fe' },
              { user: 'James Wilson', action: 'left a comment on', detail: '"Budget review"', time: '2 days ago', color: '#ede9fe' }
            ].filter(a => a.user.toLowerCase().includes(search.toLowerCase()) || a.detail.toLowerCase().includes(search.toLowerCase())).map((activity, idx) => {
              const initials = activity.user
                .split(' ')
                .map((part) => part[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)

              return (
                <div key={activity.user + idx} className="activity-row">
                  <div
                    className="activity-avatar"
                    style={{ backgroundColor: activity.color }}
                  >
                    {initials}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p className="activity-user">
                      <strong>{activity.user}</strong> {activity.action}
                    </p>
                    <p className="activity-detail">
                      "{activity.detail.replace(/"/g, '')}"
                    </p>
                    <p className="activity-time">{activity.time}</p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="card-footer">
            <a href="#" className="card-link">
              View All Activity
            </a>
          </div>
        </div>
      </div>

      {/* Upcoming Deadlines Section */}
      <div className="deadlines-wrap">
        <div className="card">
          <div className="card-head">
            <h3 className="card-title">Upcoming Deadlines</h3>
          </div>

          <div className="deadlines-grid">
            {[
              { date: 'OCT 12', title: 'Final Beta Testing', dept: 'Mobile App Redesign' },
              { date: 'OCT 15', title: 'Legal Contract Approval', dept: 'Partnership Integration' },
              { date: 'OCT 18', title: 'Asset Handover', dept: 'Q4 Product Launch' },
              { date: 'OCT 22', title: 'Post-mortem Meeting', dept: 'Infrastructure Security' }
            ].filter(d => d.title.toLowerCase().includes(search.toLowerCase()) || d.dept.toLowerCase().includes(search.toLowerCase())).map((deadline) => (
              <div key={deadline.title}>
                <div className="deadline-date">{deadline.date}</div>
                <h4 className="deadline-title">{deadline.title}</h4>
                <p className="deadline-subtitle">{deadline.dept}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

