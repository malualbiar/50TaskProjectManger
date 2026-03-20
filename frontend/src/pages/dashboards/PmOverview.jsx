import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import { MdAdd, MdEdit, MdDelete } from 'react-icons/md'
import { createProject, createTask } from '../../services/projectService'
import { getUser } from '../../utils/auth'

function loadLS(key, fallback = []) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback } catch { return fallback } }
function saveLS(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

const statusColors = { 'On Track': '#22863a', 'At Risk': '#f59e0b', 'Behind': '#cb2431', 'Planning': '#6366f1' }
const priorityColors = { 'Low': '#0366d6', 'Medium': '#f59e0b', 'High': '#cb2431' }
const taskStatuses = ['To Do', 'In Progress', 'Done']

export default function PmOverview() {
  const navigate = useNavigate()
  const { search = '' } = useOutletContext() || {}
  const [projects, setProjects] = useState(() => loadLS('orgProjects'))
  const [tasks, setTasks] = useState(() => loadLS('orgTasks'))
  const members = loadLS('orgMembers')

  // Modals
  const [showNewProject, setShowNewProject] = useState(false)
  const [showNewTask, setShowNewTask] = useState(false)
  const [newProj, setNewProj] = useState({ name: '', start_date: '', end_date: '' })
  const [newTask, setNewTask] = useState({ title: '', projectId: '', assignee: '', start_date: '', end_date: '', priority: 'Medium' })
  const [projLoading, setProjLoading] = useState(false)
  const [taskLoading, setTaskLoading] = useState(false)
  const [projError, setProjError] = useState('')
  const [taskError, setTaskError] = useState('')

  useEffect(() => { saveLS('orgProjects', projects) }, [projects])
  useEffect(() => { saveLS('orgTasks', tasks) }, [tasks])

  // Computed
  function getProjectTasks(projId) { return tasks.filter(t => String(t.projectId) === String(projId)) }
  function calcProgress(projId) {
    const pt = getProjectTasks(projId)
    if (pt.length === 0) return 0
    return Math.round((pt.filter(t => t.status === 'Done').length / pt.length) * 100)
  }

  // Handlers
  async function createProjectHandler(e) {
    e.preventDefault()
    setProjError('')
    setProjLoading(true)
    try {
      const created = await createProject({
        name: newProj.name,
        start_date: newProj.start_date,
        end_date: newProj.end_date,
      })
      // Map backend response to local shape
      const localProj = {
        id: created.id,
        name: created.name,
        manager: getUser()?.username || 'PM',
        status: created.status || 'On Track', // Default to 'On Track' if not provided by API
        progress: 0,
        start_date: created.start_date,
        dueDate: created.end_date,
      }
      setProjects([...projects, localProj])
      setNewProj({ name: '', start_date: '', end_date: '' })
      setShowNewProject(false)
    } catch (err) {
      const detail = err.response?.data || err.message
      setProjError(
        typeof detail === 'object'
          ? Object.values(detail).flat().join(' ')
          : detail || 'Failed to create project.'
      )
    } finally {
      setProjLoading(false)
    }
  }

  function deleteProject(id) {
    if (!confirm('Delete this project and its tasks?')) return
    setProjects(projects.filter(p => p.id !== id))
    setTasks(tasks.filter(t => String(t.projectId) !== String(id)))
  }

  async function createTaskHandler(e) {
    e.preventDefault()
    setTaskError('')
    setTaskLoading(true)
    try {
      const created = await createTask({
        title: newTask.title,
        project: Number(newTask.projectId),
        assigned_to: Number(newTask.assignee), // Assuming assignee is member ID
        start_date: newTask.start_date,
        end_date: newTask.end_date,
        priority: newTask.priority,
      })
      // Map backend response to local shape
      const localTask = {
        id: created.id,
        title: created.title,
        projectId: created.project,
        assignee: newTask.assigneeLabel || '', // Use the label stored in state
        startDate: created.start_date,
        endDate: created.end_date,
        due: created.end_date,
        status: 'To Do', // Default status for new tasks
        priority: created.priority,
        comments: [],
      }
      setTasks([...tasks, localTask])
      setNewTask({ title: '', projectId: '', assignee: '', assigneeLabel: '', start_date: '', end_date: '', priority: 'Medium' })
      setShowNewTask(false)
    } catch (err) {
      const detail = err.response?.data || err.message
      setTaskError(
        typeof detail === 'object'
          ? Object.values(detail).flat().join(' ')
          : detail || 'Failed to create task.'
      )
    } finally {
      setTaskLoading(false)
    }
  }

  function updateTaskStatus(taskId, newStatus) {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
  }

  function deleteTask(taskId) {
    setTasks(tasks.filter(t => t.id !== taskId))
  }

  function updateDeadline(projId, newDate) {
    setProjects(projects.map(p => p.id === projId ? { ...p, dueDate: newDate } : p))
  }



  const totalTasks = tasks.length
  const completedTasks = tasks.filter(t => t.status === 'Done').length
  const avgLoad = members.length > 0 ? Math.round((tasks.filter(t => t.status !== 'Done').length / members.length) * 20) : 0

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.status || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div className="pm-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="pm-page-title">My Managed Projects</h1>
          <p className="pm-page-sub">Create projects, assign tasks, and manage deadlines.</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="pm-new-btn" onClick={() => setShowNewProject(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 16px', background: '#22863a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            <MdAdd size={16} /> New Project
          </button>
          <button className="pm-new-btn" onClick={() => setShowNewTask(true)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 16px', background: '#0366d6', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '13px' }}>
            <MdAdd size={16} /> New Task
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="pm-stats-row">
        <div className="pm-stat-card"><div className="pm-stat-label">Active Projects</div><div className="pm-stat-value">{projects.length}</div></div>
        <div className="pm-stat-card"><div className="pm-stat-label">Total Tasks</div><div className="pm-stat-value">{totalTasks}</div></div>
        <div className="pm-stat-card"><div className="pm-stat-label">Completed</div><div className="pm-stat-value">{completedTasks}</div></div>
        <div className="pm-stat-card"><div className="pm-stat-label">Avg Load</div><div className="pm-stat-value">{Math.min(avgLoad, 100)}%</div></div>
      </div>

      <div className="pm-grid">
        {/* Left - Projects & Tasks */}
        <div className="pm-left-col">
          <div className="pm-section-head"><h2 className="pm-section-title">Project Timelines & Tasks</h2></div>
          <div className="pm-timelines">
            {filteredProjects.length === 0 && <p style={{ color: '#9ca3af', fontSize: '13px' }}>{search ? 'No projects match your search.' : 'No projects yet. Click "New Project" above.'}</p>}
            {filteredProjects.map((p) => {
              const pt = getProjectTasks(p.id)
              const prog = calcProgress(p.id)
              return (
                <div key={p.id} className="pm-timeline-card" style={{ marginBottom: '16px' }}>
                  <div className="pm-tl-top">
                    <div style={{ flex: 1 }}>
                      <div className="pm-tl-name" onClick={() => navigate(`projects/${p.id}`)} style={{ cursor: 'pointer' }}>{p.name}</div>
                      <div className="pm-tl-meta" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        Due: <input type="date" value={p.dueDate || ''} onChange={(e) => updateDeadline(p.id, e.target.value)}
                          style={{ border: '1px solid #e5e7eb', borderRadius: '4px', padding: '2px 6px', fontSize: '11px', cursor: 'pointer' }} />
                      </div>
                    </div>
                    <span className={'pm-badge ' + (p.status === 'On Track' ? 'pm-badge-ontrack' : p.status === 'At Risk' ? 'pm-badge-atrisk' : 'pm-badge-planning')}>{p.status}</span>
                    <button onClick={() => deleteProject(p.id)} title="Delete project" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', marginLeft: '8px' }}><MdDelete size={18} /></button>
                  </div>
                  <div className="pm-prog-track"><div className="pm-prog-fill pm-prog-green" style={{ width: `${prog}%` }} /></div>
                  <div className="pm-tl-bottom"><span>{pt.length} task{pt.length !== 1 && 's'}</span><span>{prog}% Complete</span></div>

                  {/* Task list under project */}
                  {pt.length > 0 && (
                    <div style={{ marginTop: '10px', borderTop: '1px solid #f3f4f6', paddingTop: '10px' }}>
                      {pt.map(task => (
                        <div key={task.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: '1px solid #f9fafb', fontSize: '12px' }}>
                          <span style={{ flex: 1, fontWeight: '500', color: '#1a202c' }}>{task.title}</span>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', minWidth: '80px' }}>
                            <span style={{ fontSize: '11px', color: '#111827', fontWeight: '600' }}>{task.assignee || 'Unassigned'}</span>
                            <span style={{ fontSize: '10px', color: '#9ca3af' }}>{task.startDate || '—'} to {task.endDate || task.due || '—'}</span>
                          </div>
                          <select value={task.status} onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                            style={{ padding: '3px 6px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', background: task.status === 'Done' ? '#d1f2eb' : task.status === 'In Progress' ? '#dbeafe' : '#f3f4f6' }}>
                            {taskStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <span style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: '600', background: (priorityColors[task.priority] || '#6b7280') + '18', color: priorityColors[task.priority] || '#6b7280' }}>{task.priority}</span>
                          <button onClick={() => deleteTask(task.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '14px' }}>✕</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right */}
        <div className="pm-right-col">
          <div className="pm-card">
            <h3 className="pm-card-title">Allocations</h3>
            <div className="pm-resource-list">
              {members.filter(m => m.role !== 'Organization Admin').slice(0, 5).map((member) => {
                const memberTasks = tasks.filter(t => t.assignee === member.name && t.status !== 'Done').length
                const load = Math.min(memberTasks * 25, 100)
                return (
                  <div key={member.id} className="pm-resource-item">
                    <div className="pm-resource-avatar">{(member.name || '?')[0]}</div>
                    <div className="pm-resource-info">
                      <div className="pm-resource-name">{member.name}</div>
                      <div className="pm-resource-bar-wrap">
                        <div className="pm-resource-bar"><div className={'pm-resource-fill ' + (load > 80 ? 'pm-load-red' : 'pm-load-green')} style={{ width: `${load}%` }} /></div>
                        <span>{load}%</span>
                      </div>
                    </div>
                  </div>
                )
              })}
              {members.length <= 1 && <p style={{ fontSize: '12px', color: '#9ca3af' }}>No team members yet.</p>}
            </div>
          </div>

        </div>
      </div>

      {/* Create Project Modal */}
      {showNewProject && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', width: '90%', maxWidth: '420px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <h3 style={{ margin: '0 0 18px', fontSize: '17px', fontWeight: '700' }}>Create Project</h3>
            {projError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '8px 12px', marginBottom: '12px', color: '#dc2626', fontSize: '12px' }}>{projError}</div>}
            <form onSubmit={createProjectHandler} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" placeholder="Project name" value={newProj.name} onChange={(e) => setNewProj({ ...newProj, name: e.target.value })} required
                style={{ padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#718096' }}>Start Date</label>
                <input type="date" value={newProj.start_date} onChange={(e) => setNewProj({ ...newProj, start_date: e.target.value })} required
                  style={{ padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '11px', fontWeight: '600', color: '#718096' }}>End Date</label>
                <input type="date" value={newProj.end_date} onChange={(e) => setNewProj({ ...newProj, end_date: e.target.value })} required
                  style={{ padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={projLoading} style={{ flex: 1, padding: '10px', background: '#22863a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', opacity: projLoading ? 0.7 : 1 }}>{projLoading ? 'Creating…' : 'Create'}</button>
                <button type="button" onClick={() => { setShowNewProject(false); setProjError('') }} style={{ flex: 1, padding: '10px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showNewTask && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', padding: '28px', width: '90%', maxWidth: '440px', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <h3 style={{ margin: '0 0 18px', fontSize: '17px', fontWeight: '700' }}>Create Task</h3>
            {taskError && <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', padding: '8px 12px', marginBottom: '12px', color: '#dc2626', fontSize: '12px' }}>{taskError}</div>}
            <form onSubmit={createTaskHandler} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" placeholder="Task title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required
                style={{ padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px' }} />
              <select value={newTask.projectId} onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })} required
                style={{ padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px' }}>
                <option value="">Select project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select value={newTask.assignee} onChange={(e) => {
                const m = members.find(m => String(m.id) === e.target.value)
                setNewTask({ ...newTask, assignee: e.target.value, assigneeLabel: m?.name || '' })
              }}
                style={{ padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px' }}>
                <option value="">Assign to...</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name} ({m.role})</option>)}
              </select>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#718096' }}>Start Date</label>
                  <input type="date" value={newTask.start_date} onChange={(e) => setNewTask({ ...newTask, start_date: e.target.value })} required
                    style={{ width: '100%', padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label style={{ fontSize: '11px', fontWeight: '600', color: '#718096' }}>End Date</label>
                  <input type="date" value={newTask.end_date} onChange={(e) => setNewTask({ ...newTask, end_date: e.target.value })} required
                    style={{ width: '100%', padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
                </div>
              </div>
              <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                style={{ padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px' }}>
                <option value="Low">Low Priority</option><option value="Medium">Medium Priority</option><option value="High">High Priority</option>
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={taskLoading} style={{ flex: 1, padding: '10px', background: '#0366d6', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer', opacity: taskLoading ? 0.7 : 1 }}>{taskLoading ? 'Creating…' : 'Create Task'}</button>
                <button type="button" onClick={() => { setShowNewTask(false); setTaskError('') }} style={{ flex: 1, padding: '10px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
