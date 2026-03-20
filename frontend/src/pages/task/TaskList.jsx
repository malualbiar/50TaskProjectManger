import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

function loadLS(key, fallback = []) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback } catch { return fallback } }
function saveLS(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

const statusColors = { 'To Do': '#6b7280', 'In Progress': '#0366d6', 'Done': '#22863a', 'Not Started': '#6b7280', 'Completed': '#22863a', 'Blocked': '#cb2431' }
const priorityColors = { 'Low': '#0366d6', 'Medium': '#f59e0b', 'High': '#cb2431' }

export default function TaskList() {
  const navigate = useNavigate()
  const { search = '' } = useOutletContext() || {}
  const [tasks, setTasks] = useState(() => loadLS('orgTasks'))
  const projects = loadLS('orgProjects')
  const members = loadLS('orgMembers')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [showNewTask, setShowNewTask] = useState(false)
  const [newTask, setNewTask] = useState({ title: '', projectId: '', assignee: '', due: '', priority: 'Medium' })

  useEffect(() => { saveLS('orgTasks', tasks) }, [tasks])

  function createTask(e) {
    e.preventDefault()
    setTasks([...tasks, { id: Date.now(), title: newTask.title, projectId: Number(newTask.projectId), assignee: newTask.assignee, due: newTask.due, status: 'To Do', priority: newTask.priority, comments: [] }])
    setNewTask({ title: '', projectId: '', assignee: '', due: '', priority: 'Medium' })
    setShowNewTask(false)
  }

  function updateStatus(id, status) {
    setTasks(tasks.map(t => t.id === id ? { ...t, status } : t))
  }

  function deleteTask(id) {
    if (!confirm('Delete this task?')) return
    setTasks(tasks.filter(t => t.id !== id))
  }

  function getProjectName(projId) {
    const p = projects.find(pr => pr.id === projId)
    return p ? p.name : 'Unknown'
  }

  const filteredTasks = tasks.filter(task =>
    (filterStatus === 'All' || task.status === filterStatus) &&
    (filterPriority === 'All' || task.priority === filterPriority) &&
    (task.title.toLowerCase().includes(search.toLowerCase()) || 
     (task.assignee || '').toLowerCase().includes(search.toLowerCase()) ||
     getProjectName(task.projectId).toLowerCase().includes(search.toLowerCase()))
  )

  return (
    <div style={{ padding: '20px 30px 30px 30px' }}>
      <div style={{ marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: '600', color: '#1a202c' }}>Tasks</h1>
          <p style={{ margin: '0', fontSize: '14px', color: '#718096' }}>Manage and track all tasks across projects</p>
        </div>

      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#586069', marginBottom: '6px', textTransform: 'uppercase' }}>Status</label>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px', backgroundColor: 'white' }}>
            <option value="All">All</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '12px', fontWeight: '600', color: '#586069', marginBottom: '6px', textTransform: 'uppercase' }}>Priority</label>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)}
            style={{ padding: '8px 12px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px', backgroundColor: 'white' }}>
            <option value="All">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      </div>

      {/* Tasks */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filteredTasks.length === 0 && <p style={{ color: '#9ca3af', fontSize: '13px' }}>No tasks found. Create one using the button above.</p>}
        {filteredTasks.map((task) => (
          <div key={task.id}
            style={{ backgroundColor: 'white', padding: '18px 20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', borderLeft: `4px solid ${statusColors[task.status] || '#6b7280'}`, transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`${task.id}`)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <h3 style={{ margin: '0', fontSize: '15px', fontWeight: '600', color: '#1a202c' }}>{task.title}</h3>
                  <span style={{ backgroundColor: (priorityColors[task.priority] || '#6b7280') + '20', color: priorityColors[task.priority] || '#6b7280', padding: '2px 8px', borderRadius: '3px', fontSize: '11px', fontWeight: '600' }}>
                    {task.priority}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#718096' }}>
                  <span>Project: <strong>{getProjectName(task.projectId)}</strong></span>
                  <span>Assignee: <strong>{task.assignee || 'Unassigned'}</strong></span>
                  {task.due && <span>Due: <strong>{task.due}</strong></span>}
                </div>
              </div>
              <select value={task.status} onChange={(e) => updateStatus(task.id, e.target.value)}
                style={{ padding: '6px 10px', border: '1px solid #e5e7eb', borderRadius: '5px', fontSize: '12px', cursor: 'pointer', fontWeight: '500', background: (statusColors[task.status] || '#6b7280') + '15', color: statusColors[task.status] || '#6b7280' }}>
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
              <button onClick={() => deleteTask(task.id)} title="Delete task"
                style={{ background: '#fee2e2', border: 'none', borderRadius: '6px', padding: '6px 10px', cursor: 'pointer', color: '#dc2626', fontSize: '12px', fontWeight: '500' }}>
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>



      {/* New Task Modal */}
      {showNewTask && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '28px', borderRadius: '12px', maxWidth: '440px', width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <h3 style={{ margin: '0 0 18px', fontSize: '17px', fontWeight: '700' }}>Create New Task</h3>
            <form onSubmit={createTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input type="text" placeholder="Task title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} required
                style={{ padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px' }} />
              <select value={newTask.projectId} onChange={(e) => setNewTask({ ...newTask, projectId: e.target.value })} required
                style={{ padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px' }}>
                <option value="">Select project...</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <select value={newTask.assignee} onChange={(e) => setNewTask({ ...newTask, assignee: e.target.value })}
                style={{ padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px' }}>
                <option value="">Assign to...</option>
                {members.map(m => <option key={m.id} value={m.name}>{m.name} ({m.role})</option>)}
              </select>
              <div style={{ display: 'flex', gap: '10px' }}>
                <select value={newTask.priority} onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
                  style={{ flex: 1, padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px' }}>
                  <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
                </select>
                <input type="date" value={newTask.due} onChange={(e) => setNewTask({ ...newTask, due: e.target.value })}
                  style={{ flex: 1, padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', background: '#22863a', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}>Create Task</button>
                <button type="button" onClick={() => setShowNewTask(false)} style={{ flex: 1, padding: '10px', background: '#f3f4f6', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
