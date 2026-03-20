import { useState, useMemo } from 'react'
import { MdDownload, MdPieChart, MdBarChart, MdTimeline, MdFilterList, MdPeople, MdFolderOpen, MdCheckCircle, MdWarning } from 'react-icons/md'
import './Reports.css'

function loadLS(key, fallback = []) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback } catch { return fallback }
}

export default function Reports() {
  const projects = loadLS('orgProjects')
  const tasks = loadLS('orgTasks')
  const members = loadLS('orgMembers')
  const [activeTab, setActiveTab] = useState('overview')
  const [dateRange, setDateRange] = useState('all')

  // ── Computed stats ──
  const totalProjects = projects.length
  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'Done').length
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length
  const todoTasks = tasks.filter(t => t.status === 'To Do').length
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  // Task distribution by priority
  const highPriority = tasks.filter(t => t.priority === 'High').length
  const medPriority = tasks.filter(t => t.priority === 'Medium').length
  const lowPriority = tasks.filter(t => t.priority === 'Low').length

  // Per-project breakdown
  const projectBreakdown = useMemo(() => {
    return projects.map(p => {
      const projTasks = tasks.filter(t => String(t.projectId) === String(p.id))
      const done = projTasks.filter(t => t.status === 'Done').length
      const total = projTasks.length
      const progress = total > 0 ? Math.round((done / total) * 100) : 0
      return { ...p, taskCount: total, doneCount: done, progress }
    })
  }, [projects, tasks])

  // Per-member workload
  const memberWorkload = useMemo(() => {
    return members.filter(m => m.role !== 'Organization Admin').map(m => {
      const assigned = tasks.filter(t => t.assignee === m.name)
      const done = assigned.filter(t => t.status === 'Done').length
      const active = assigned.filter(t => t.status !== 'Done').length
      return { ...m, totalTasks: assigned.length, done, active }
    })
  }, [members, tasks])

  // ── CSV Exports ──
  function exportProjectCSV() {
    const lines = ['Project,Manager,Status,Tasks,Completed,Progress,Due Date',
      ...projectBreakdown.map(p => `"${p.name}","${p.manager}","${p.status}",${p.taskCount},${p.doneCount},${p.progress}%,"${p.dueDate || 'N/A'}"`)
    ]
    downloadCSV(lines, 'project_report.csv')
  }

  function exportTaskCSV() {
    const lines = ['Task,Project,Assignee,Status,Priority,Due',
      ...tasks.map(t => {
        const proj = projects.find(p => p.id === t.projectId)
        return `"${t.title}","${proj?.name || 'N/A'}","${t.assignee || 'Unassigned'}","${t.status}","${t.priority}","${t.due || 'N/A'}"`
      })
    ]
    downloadCSV(lines, 'task_report.csv')
  }

  function exportMemberCSV() {
    const lines = ['Member,Role,Total Tasks,Completed,Active',
      ...memberWorkload.map(m => `"${m.name}","${m.role}",${m.totalTasks},${m.done},${m.active}`)
    ]
    downloadCSV(lines, 'member_workload_report.csv')
  }

  function downloadCSV(lines, filename) {
    const blob = new Blob([lines.join('\n')], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = filename; a.click()
    URL.revokeObjectURL(url)
  }

  // Bar helper
  function Bar({ value, max, color, label }) {
    const pct = max > 0 ? Math.round((value / max) * 100) : 0
    return (
      <div className="rp-bar-row">
        <span className="rp-bar-label">{label}</span>
        <div className="rp-bar-track">
          <div className="rp-bar-fill" style={{ width: `${pct}%`, background: color }} />
        </div>
        <span className="rp-bar-value">{value}</span>
      </div>
    )
  }

  return (
    <div className="rp-shell">
      {/* Header */}
      <div className="rp-header">
        <div>
          <h1 className="rp-title">Reports & Analytics</h1>
          <p className="rp-sub">Comprehensive insights into your projects, tasks, and team performance.</p>
        </div>
        <div className="rp-header-actions">
          <div className="rp-filter-group">
            <MdFilterList size={16} />
            <select className="rp-filter-select" value={dateRange} onChange={e => setDateRange(e.target.value)}>
              <option value="all">All Time</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="rp-tabs">
        {[
          { key: 'overview', label: 'Overview', icon: <MdPieChart size={16} /> },
          { key: 'projects', label: 'Projects', icon: <MdFolderOpen size={16} /> },
          { key: 'team', label: 'Team', icon: <MdPeople size={16} /> },
        ].map(tab => (
          <button key={tab.key} className={`rp-tab ${activeTab === tab.key ? 'rp-tab-active' : ''}`} onClick={() => setActiveTab(tab.key)}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* ══════════ OVERVIEW TAB ══════════ */}
      {activeTab === 'overview' && (
        <>
          {/* Summary Cards */}
          <div className="rp-summary-row">
            <div className="rp-summary-card">
              <div className="rp-summary-icon" style={{ background: '#dcfce7', color: '#16a34a' }}><MdFolderOpen size={22} /></div>
              <div><div className="rp-summary-label">Total Projects</div><div className="rp-summary-value">{totalProjects}</div></div>
            </div>
            <div className="rp-summary-card">
              <div className="rp-summary-icon" style={{ background: '#dbeafe', color: '#2563eb' }}><MdBarChart size={22} /></div>
              <div><div className="rp-summary-label">Total Tasks</div><div className="rp-summary-value">{totalTasks}</div></div>
            </div>
            <div className="rp-summary-card">
              <div className="rp-summary-icon" style={{ background: '#d1fae5', color: '#059669' }}><MdCheckCircle size={22} /></div>
              <div><div className="rp-summary-label">Completed</div><div className="rp-summary-value">{completedTasks}</div></div>
            </div>
            <div className="rp-summary-card">
              <div className="rp-summary-icon" style={{ background: '#fef3c7', color: '#d97706' }}><MdWarning size={22} /></div>
              <div><div className="rp-summary-label">Completion Rate</div><div className="rp-summary-value">{completionRate}%</div></div>
            </div>
          </div>

          <div className="rp-grid-2">
            {/* Task Status Distribution */}
            <div className="rp-card">
              <div className="rp-card-header">
                <h3 className="rp-card-title">Task Status Distribution</h3>
              </div>
              <div className="rp-donut-wrap">
                <div className="rp-donut">
                  <svg viewBox="0 0 36 36" className="rp-donut-svg">
                    <circle className="rp-donut-bg" cx="18" cy="18" r="15.9" />
                    {totalTasks > 0 && (
                      <>
                        <circle className="rp-donut-seg" cx="18" cy="18" r="15.9"
                          stroke="#22c55e"
                          strokeDasharray={`${(completedTasks / totalTasks) * 100} ${100 - (completedTasks / totalTasks) * 100}`}
                          strokeDashoffset="25" />
                        <circle className="rp-donut-seg" cx="18" cy="18" r="15.9"
                          stroke="#3b82f6"
                          strokeDasharray={`${(inProgressTasks / totalTasks) * 100} ${100 - (inProgressTasks / totalTasks) * 100}`}
                          strokeDashoffset={`${25 - (completedTasks / totalTasks) * 100}`} />
                        <circle className="rp-donut-seg" cx="18" cy="18" r="15.9"
                          stroke="#9ca3af"
                          strokeDasharray={`${(todoTasks / totalTasks) * 100} ${100 - (todoTasks / totalTasks) * 100}`}
                          strokeDashoffset={`${25 - (completedTasks / totalTasks) * 100 - (inProgressTasks / totalTasks) * 100}`} />
                      </>
                    )}
                  </svg>
                  <div className="rp-donut-center">
                    <span className="rp-donut-num">{totalTasks}</span>
                    <span className="rp-donut-label">Tasks</span>
                  </div>
                </div>
                <div className="rp-legend">
                  <div className="rp-legend-item"><span className="rp-legend-dot" style={{ background: '#22c55e' }} /> Done ({completedTasks})</div>
                  <div className="rp-legend-item"><span className="rp-legend-dot" style={{ background: '#3b82f6' }} /> In Progress ({inProgressTasks})</div>
                  <div className="rp-legend-item"><span className="rp-legend-dot" style={{ background: '#9ca3af' }} /> To Do ({todoTasks})</div>
                </div>
              </div>
            </div>

            {/* Priority Breakdown */}
            <div className="rp-card">
              <div className="rp-card-header">
                <h3 className="rp-card-title">Priority Breakdown</h3>
              </div>
              <div className="rp-bars">
                <Bar value={highPriority} max={totalTasks} color="#ef4444" label="High" />
                <Bar value={medPriority} max={totalTasks} color="#f59e0b" label="Medium" />
                <Bar value={lowPriority} max={totalTasks} color="#3b82f6" label="Low" />
              </div>
            </div>
          </div>

          {/* Export section */}
          <div className="rp-card rp-export-card">
            <div className="rp-card-header">
              <h3 className="rp-card-title">Export Reports</h3>
              <p className="rp-card-sub">Download detailed CSV reports for offline analysis.</p>
            </div>
            <div className="rp-export-row">
              <button className="rp-export-btn" onClick={exportProjectCSV}><MdDownload size={18} /> Project Report</button>
              <button className="rp-export-btn" onClick={exportTaskCSV}><MdDownload size={18} /> Task Report</button>
              <button className="rp-export-btn" onClick={exportMemberCSV}><MdDownload size={18} /> Team Workload</button>
            </div>
          </div>
        </>
      )}

      {/* ══════════ PROJECTS TAB ══════════ */}
      {activeTab === 'projects' && (
        <>
          <div className="rp-card">
            <div className="rp-card-header">
              <h3 className="rp-card-title">Project Performance</h3>
              <button className="rp-export-btn rp-export-btn-sm" onClick={exportProjectCSV}><MdDownload size={14} /> Export CSV</button>
            </div>
            {projectBreakdown.length === 0 ? (
              <div className="rp-empty">No projects found. Create projects from the PM Dashboard.</div>
            ) : (
              <div className="rp-table-wrap">
                <table className="rp-table">
                  <thead>
                    <tr>
                      <th>Project</th>
                      <th>Manager</th>
                      <th>Status</th>
                      <th>Tasks</th>
                      <th>Completed</th>
                      <th>Progress</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {projectBreakdown.map(p => (
                      <tr key={p.id}>
                        <td className="rp-cell-name">{p.name}</td>
                        <td>{p.manager}</td>
                        <td>
                          <span className={`rp-status-badge rp-status-${p.status === 'On Track' ? 'green' : p.status === 'At Risk' ? 'amber' : 'red'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td>{p.taskCount}</td>
                        <td>{p.doneCount}</td>
                        <td>
                          <div className="rp-prog-wrap">
                            <div className="rp-prog-track"><div className="rp-prog-fill" style={{ width: `${p.progress}%` }} /></div>
                            <span className="rp-prog-pct">{p.progress}%</span>
                          </div>
                        </td>
                        <td>{p.dueDate || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}

      {/* ══════════ TEAM TAB ══════════ */}
      {activeTab === 'team' && (
        <>
          <div className="rp-card">
            <div className="rp-card-header">
              <h3 className="rp-card-title">Team Workload</h3>
              <button className="rp-export-btn rp-export-btn-sm" onClick={exportMemberCSV}><MdDownload size={14} /> Export CSV</button>
            </div>
            {memberWorkload.length === 0 ? (
              <div className="rp-empty">No team members found. Add members from the Admin Dashboard.</div>
            ) : (
              <div className="rp-member-grid">
                {memberWorkload.map(m => {
                  const loadPct = m.totalTasks > 0 ? Math.round((m.done / m.totalTasks) * 100) : 0
                  return (
                    <div key={m.id} className="rp-member-card">
                      <div className="rp-member-top">
                        <div className="rp-member-avatar">{(m.name || '?')[0]}</div>
                        <div className="rp-member-info">
                          <div className="rp-member-name">{m.name}</div>
                          <div className="rp-member-role">{m.role}</div>
                        </div>
                      </div>
                      <div className="rp-member-stats">
                        <div className="rp-member-stat">
                          <span className="rp-member-stat-val">{m.totalTasks}</span>
                          <span className="rp-member-stat-label">Total</span>
                        </div>
                        <div className="rp-member-stat">
                          <span className="rp-member-stat-val" style={{ color: '#22c55e' }}>{m.done}</span>
                          <span className="rp-member-stat-label">Done</span>
                        </div>
                        <div className="rp-member-stat">
                          <span className="rp-member-stat-val" style={{ color: '#3b82f6' }}>{m.active}</span>
                          <span className="rp-member-stat-label">Active</span>
                        </div>
                      </div>
                      <div className="rp-member-prog">
                        <div className="rp-prog-track"><div className="rp-prog-fill" style={{ width: `${loadPct}%` }} /></div>
                        <span className="rp-member-prog-label">{loadPct}% completed</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
