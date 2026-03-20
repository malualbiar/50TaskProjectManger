import { useState, useMemo } from 'react'
import { useOutletContext } from 'react-router-dom'
import { MdFilterList, MdChevronLeft, MdChevronRight, MdFolderOpen } from 'react-icons/md'
import './TimelineView.css'

function loadLS(key, fallback = []) {
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback } catch { return fallback }
}

const statusColors = {
  'To Do': '#e2e8f0',
  'In Progress': '#3b82f6',
  'Done': '#22c55e',
}

export default function TimelineView() {
  const { search = '' } = useOutletContext() || {}
  const allProjects = loadLS('orgProjects')
  const allTasks = loadLS('orgTasks')

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedProject, setSelectedProject] = useState('all')

  // Generate 14 days starting from a few days ago
  const days = useMemo(() => {
    const d = new Date(currentDate)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - 3) // Start 3 days before the "current" view date
    const result = []
    for (let i = 0; i < 14; i++) {
      result.push(new Date(d))
      d.setDate(d.getDate() + 1)
    }
    return result
  }, [currentDate])

  const viewMonths = useMemo(() => {
    const months = []
    days.forEach(d => {
      const m = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      if (!months.find(x => x.name === m)) {
        months.push({ name: m, count: 1 })
      } else {
        months.find(x => x.name === m).count++
      }
    })
    return months
  }, [days])

  const startDate = days[0]
  const endDate = days[days.length - 1]

  const shiftLeft = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() - 7)
    setCurrentDate(d)
  }

  const shiftRight = () => {
    const d = new Date(currentDate)
    d.setDate(d.getDate() + 7)
    setCurrentDate(d)
  }

  const resetToday = () => {
    setCurrentDate(new Date())
  }

  // Filter projects & tasks
  const displayProjects = useMemo(() => {
    let base = allProjects
    if (selectedProject !== 'all') base = allProjects.filter(p => String(p.id) === String(selectedProject))
    
    return base.filter(p => 
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      allTasks.some(t => String(t.projectId) === String(p.id) && t.title.toLowerCase().includes(search.toLowerCase()))
    )
  }, [allProjects, selectedProject, search, allTasks])



  return (
    <div className="tlv-page">
      {/* Header */}
      <div className="tlv-header">
        <div>
          <h1 className="tlv-title">Timeline View</h1>
          <p className="tlv-sub">Plan and track overall project schedules and tasks.</p>
        </div>
        <div className="tlv-actions">
          <div className="tlv-filter-wrap">
            <MdFolderOpen size={16} />
            <select className="tlv-select" value={selectedProject} onChange={(e) => setSelectedProject(e.target.value)}>
              <option value="all">All Projects</option>
              {allProjects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
          <div className="tlv-nav-group">
            <button className="tlv-nav-btn" onClick={shiftLeft}><MdChevronLeft size={20} /></button>
            <button className="tlv-btn-today" onClick={resetToday}>Today</button>
            <button className="tlv-nav-btn" onClick={shiftRight}><MdChevronRight size={20} /></button>
          </div>
        </div>
      </div>

      <div className="tlv-card">
        {displayProjects.length === 0 ? (
          <div className="tlv-empty">No projects found.</div>
        ) : (
          <div className="tlv-board">
            
            {/* Timeline Header (Months & Days) */}
            <div className="tlv-grid-header-months">
              <div className="tlv-row-title-col" style={{ background: '#fff' }}></div>
              <div className="tlv-months-row">
                {viewMonths.map((m, i) => (
                  <div key={i} className="tlv-month-label" style={{ flex: m.count }}>
                    {m.name}
                  </div>
                ))}
              </div>
            </div>

            <div className="tlv-grid-header">
              <div className="tlv-row-title-col">Project / Task</div>
              <div className="tlv-days-grid">
                {days.map((d, i) => {
                  const isToday = d.toDateString() === new Date().toDateString()
                  return (
                    <div key={i} className={`tlv-day-col ${isToday ? 'tlv-today-col' : ''}`}>
                      <div className="tlv-day-name">{d.toLocaleDateString('en-US', { weekday: 'short' })[0]}</div>
                      <div className={`tlv-day-num ${isToday ? 'tlv-today-num' : ''}`}>
                        {d.getDate()}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Timelines */}
            <div className="tlv-content">
              {displayProjects.map(proj => {
                const projTasks = allTasks.filter(t => String(t.projectId) === String(proj.id))
                return (
                  <div key={proj.id} className="tlv-project-group">
                    {/* Project Row */}
                    <div className="tlv-proj-row">
                      <div className="tlv-row-title-col">
                        <div className="tlv-proj-name">{proj.name}</div>
                        <div className="tlv-proj-meta">{projTasks.length} tasks</div>
                      </div>
                      <div className="tlv-days-grid tlv-grid-lines">
                        {days.map((d, i) => (
                           <div key={i} className={`tlv-grid-line ${d.toDateString() === new Date().toDateString() ? 'tlv-today-line' : ''}`} />
                        ))}

                        {/* Project Summary Bar (Mock spanning for now based on tasks) */}
                        {projTasks.length > 0 && (
                          <div className="tlv-proj-summary-bar" style={{
                            gridColumn: '1 / 15', // Simple full span for project group visual
                            opacity: 0.15,
                            backgroundColor: '#22c55e'
                          }} />
                        )}
                      </div>
                    </div>

                    {/* Task Rows */}
                    {projTasks.map(task => {
                      // Calculate positions
                      let barStyle = { display: 'none' }
                      
                      const taskStart = task.startDate ? new Date(task.startDate + 'T00:00:00') : (task.due || task.endDate ? new Date((task.due || task.endDate) + 'T00:00:00') : null)
                      const taskEnd = task.endDate ? new Date(task.endDate + 'T00:00:00') : (task.due ? new Date(task.due + 'T00:00:00') : taskStart)

                      if (taskStart && taskEnd) {
                        const msPerDay = 1000 * 60 * 60 * 24
                        const colStart = Math.floor((taskStart - startDate) / msPerDay) + 1
                        const colEnd = Math.floor((taskEnd - startDate) / msPerDay) + 2

                        if (colEnd > 1 && colStart <= 14) {
                          barStyle = {
                            gridColumn: `${Math.max(1, colStart)} / ${Math.min(15, colEnd)}`,
                            background: statusColors[task.status] || '#cbd5e1',
                            color: task.status === 'To Do' ? '#334155' : '#fff',
                            display: 'flex'
                          }
                        }
                      }

                      return (
                        <div key={task.id} className="tlv-task-row">
                          <div className="tlv-row-title-col tlv-task-title-col">
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div className="tlv-task-avatar">{(task.assignee || 'U')[0]}</div>
                              <div>
                                <div className="tlv-task-title">{task.title}</div>
                                <div className="tlv-task-assignee">{task.assignee || 'Unassigned'}</div>
                              </div>
                            </div>
                          </div>
                          <div className="tlv-days-grid tlv-grid-lines">
                            {days.map((d, i) => (
                              <div key={i} className={`tlv-grid-line ${d.toDateString() === new Date().toDateString() ? 'tlv-today-line' : ''}`} />
                            ))}
                            
                            {/* Task Bar */}
                            {barStyle.display !== 'none' && (
                              <div className="tlv-task-bar" style={barStyle}>
                                <div className="tlv-task-bar-progress" style={{ width: task.status === 'Done' ? '100%' : task.status === 'In Progress' ? '50%' : '5%' }} />
                                <span className="tlv-task-bar-text">{task.status}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              })}
            </div>

          </div>
        )}
      </div>
    </div>
  )
}
