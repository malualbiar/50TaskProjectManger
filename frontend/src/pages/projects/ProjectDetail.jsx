import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MdArrowBack, MdPeople, MdCheckCircle, MdDateRange } from 'react-icons/md'

function loadProjects() {
  try {
    const raw = localStorage.getItem('orgProjects')
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function loadTasks() {
  try {
    const raw = localStorage.getItem('orgTasks')
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

function loadMembers() {
  try {
    const raw = localStorage.getItem('orgMembers')
    if (raw) return JSON.parse(raw)
  } catch {}
  return []
}

const statusColors = {
  'On Track': '#22863a',
  'At Risk': '#f59e0b',
  'Behind': '#cb2431'
}

const taskStatusColors = {
  'To Do': '#6b7280',
  'In Progress': '#3b82f6',
  'Done': '#22c55e'
}

export default function ProjectDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  
  const [project, setProject] = useState(null)
  const [tasks, setTasks] = useState([])
  const [team, setTeam] = useState([])

  useEffect(() => {
    const allProjects = loadProjects()
    const proj = allProjects.find(p => p.id.toString() === id)
    
    if (proj) {
      setProject(proj)
      
      const allTasks = loadTasks()
      const projTasks = allTasks.filter(t => t.projectId === proj.id)
      setTasks(projTasks)

      const allMembers = loadMembers()
      
      // Find members assigned to tasks in this project
      const assignedNames = [...new Set(projTasks.map(t => t.assignee).filter(Boolean))]
      
      // Also include the project manager if they exist
      if (proj.manager && proj.manager !== 'Unassigned' && !assignedNames.includes(proj.manager)) {
        assignedNames.push(proj.manager)
      }

      const projTeam = allMembers.filter(m => assignedNames.includes(m.name))
      setTeam(projTeam)
    }
  }, [id])

  if (!project) {
    return <div style={{ padding: '40px', color: '#6b7280' }}>Loading project details...</div>
  }

  // Calculate actual progress based on tasks
  const completedTasks = tasks.filter(t => t.status === 'Done').length
  const totalTasks = tasks.length
  const calculatedProgress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

  // Timeline helpers
  const today = new Date()
  const daysToShow = 14
  
  // Generate dates for timeline (7 days back, 7 days forward)
  const timelineDates = Array.from({ length: daysToShow }).map((_, i) => {
    const d = new Date(today)
    d.setDate(today.getDate() - 7 + i)
    return d
  })

  return (
    <div style={{ padding: '30px', maxWidth: '1200px', margin: '0 auto', fontFamily: '"Inter", sans-serif' }}>
      {/* Header Area */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px', marginBottom: '30px' }}>
        <button 
          onClick={() => navigate(-1)}
          style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4b5563', transition: 'all 0.2s', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#f9fafb'; e.currentTarget.style.borderColor = '#d1d5db' }}
          onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e5e7eb' }}
        >
          <MdArrowBack size={20} />
        </button>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <h1 style={{ margin: 0, fontSize: '28px', fontWeight: '800', color: '#111827', letterSpacing: '-0.02em' }}>{project.name}</h1>
            <span style={{ backgroundColor: (statusColors[project.status] || '#6b7280') + '15', color: statusColors[project.status] || '#6b7280', padding: '4px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: '700', letterSpacing: '0.02em' }}>
              {project.status.toUpperCase()}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '15px', color: '#6b7280' }}>Managed by <strong style={{ color: '#374151', fontWeight: '600' }}>{project.manager}</strong></p>
        </div>
      </div>

      {/* Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {/* Progress Card */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}><MdCheckCircle size={18}/> Progress</span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>{calculatedProgress}%</span>
          </div>
          <div style={{ width: '100%', height: '8px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ width: `${calculatedProgress}%`, height: '100%', background: '#22c55e', borderRadius: '999px', transition: 'width 0.5s ease-out' }} />
          </div>
        </div>

        {/* Team Card */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}><MdPeople size={18}/> Team Members</span>
            <span style={{ fontSize: '24px', fontWeight: '800', color: '#111827' }}>{team.length}</span>
          </div>
          <div style={{ display: 'flex', marginTop: '12px' }}>
            {team.slice(0, 5).map((member, i) => (
              <div key={member.name} title={member.name} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#dcfce7', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803d', fontSize: '12px', fontWeight: '700', marginLeft: i > 0 ? '-8px' : '0', zIndex: 10 - i }}>
                {member.name.charAt(0)}
              </div>
            ))}
            {team.length > 5 && (
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f3f4f6', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '11px', fontWeight: '700', marginLeft: '-8px', zIndex: 0 }}>
                +{team.length - 5}
              </div>
            )}
            {team.length === 0 && <span style={{ fontSize: '13px', color: '#9ca3af' }}>No members assigned yet</span>}
          </div>
        </div>

        {/* Due Date Card */}
        <div style={{ background: '#fff', borderRadius: '12px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #f3f4f6' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '6px' }}><MdDateRange size={18}/> Due Date</span>
          </div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#111827', marginTop: '4px' }}>
            {project.dueDate && project.dueDate !== 'TBD' ? new Date(project.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No Due Date'}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ background: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)', border: '1px solid #f3f4f6', overflow: 'hidden' }}>
        
        <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#111827' }}>Task Timeline</h2>
          <span style={{ fontSize: '13px', color: '#6b7280', fontWeight: '500' }}>{tasks.length} {tasks.length === 1 ? 'task' : 'tasks'} total</span>
        </div>

        {tasks.length === 0 ? (
          <div style={{ padding: '60px 40px', textAlign: 'center', color: '#6b7280' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600', color: '#374151' }}>No tasks found</h3>
            <p style={{ margin: 0, fontSize: '14px' }}>There are no tasks associated with this project yet.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto', padding: '20px' }}>
            <div style={{ minWidth: '800px' }}>
              
              {/* Timeline Header (Dates) */}
              <div style={{ display: 'flex', borderBottom: '1px solid #e5e7eb', paddingBottom: '12px', marginBottom: '16px' }}>
                <div style={{ width: '250px', flexShrink: 0, fontWeight: '600', color: '#6b7280', fontSize: '13px', paddingLeft: '8px' }}>
                  Task / Assignee
                </div>
                <div style={{ flex: 1, display: 'flex' }}>
                  {timelineDates.map((date, i) => (
                    <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '11px', color: date.toDateString() === today.toDateString() ? '#22c55e' : '#9ca3af', fontWeight: date.toDateString() === today.toDateString() ? '800' : '500' }}>
                      <div style={{ marginBottom: '4px' }}>{date.toLocaleDateString(undefined, { weekday: 'narrow' })}</div>
                      <div>{date.getDate()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Timeline Rows (Tasks) */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tasks.map(task => {
                  // Simulate random start/duration for visual effect since we don't store strict task start/end dates yet.
                  // Hash string to get consistent "random" values.
                  const strVal = task.title + task.id;
                  let hash = 0;
                  for (let i = 0; i < strVal.length; i++) hash = strVal.charCodeAt(i) + ((hash << 5) - hash);
                  
                  const startOffset = Math.abs(hash % 7); // 0 to 6 days offset
                  const duration = Math.abs((hash % 4) + 2); // 2 to 5 days duration
                  
                  const statusColor = taskStatusColors[task.status] || '#6b7280'

                  return (
                    <div key={task.id} style={{ display: 'flex', alignItems: 'center', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = '#f9fafb'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      
                      {/* Task Info Column */}
                      <div style={{ width: '250px', flexShrink: 0, paddingRight: '16px' }}>
                        <div style={{ fontSize: '14px', fontWeight: '600', color: '#111827', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {task.title}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '12px', color: '#6b7280' }}>{task.assignee || 'Unassigned'}</span>
                          <span style={{ fontSize: '10px', fontWeight: '700', padding: '2px 6px', borderRadius: '4px', backgroundColor: statusColor + '15', color: statusColor }}>
                            {task.status}
                          </span>
                        </div>
                      </div>

                      {/* Timeline Grid Column */}
                      <div style={{ flex: 1, display: 'flex', position: 'relative', height: '24px', alignItems: 'center' }}>
                        {/* Grid lines */}
                        {timelineDates.map((_, i) => (
                           <div key={i} style={{ flex: 1, height: '100%', borderLeft: '1px solid #f3f4f6' }} />
                        ))}
                        
                        {/* Gantt Bar */}
                        <div style={{ 
                          position: 'absolute', 
                          left: `${(startOffset / daysToShow) * 100}%`, 
                          width: `${(duration / daysToShow) * 100}%`, 
                          height: '16px', 
                          background: statusColor, 
                          borderRadius: '4px',
                          opacity: 0.9,
                          boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                        }} />
                      </div>
                      
                    </div>
                  )
                })}
              </div>

            </div>
          </div>
        )}
      </div>

    </div>
  )
}
