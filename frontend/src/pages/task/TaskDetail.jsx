import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  MdArrowBack, 
  MdCalendarToday, 
  MdPerson, 
  MdFlag, 
  MdCheckCircle, 
  MdRadioButtonUnchecked,
  MdComment,
  MdSend,
  MdDeleteOutline,
  MdFolder
} from 'react-icons/md'

function loadLS(key, fallback = []) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback } catch { return fallback } }
function saveLS(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

const statusColors = { 'To Do': '#6b7280', 'In Progress': '#0366d6', 'Done': '#22863a', 'Not Started': '#6b7280', 'Completed': '#22863a', 'Blocked': '#cb2431' }
const priorityColors = { 'Low': '#0366d6', 'Medium': '#f59e0b', 'High': '#cb2431' }

export default function TaskDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const taskId = Number(id)
  
  const [tasks, setTasks] = useState(() => loadLS('orgTasks'))
  const projects = loadLS('orgProjects')
  const task = tasks.find(t => t.id === taskId)
  
  const [comment, setComment] = useState('')
  const userName = localStorage.getItem('adminName') || 'You'

  useEffect(() => {
    saveLS('orgTasks', tasks)
  }, [tasks])

  if (!task) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Task not found</h2>
        <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: '#16a34a', cursor: 'pointer', fontWeight: '600' }}>Go Back</button>
      </div>
    )
  }

  const project = projects.find(p => p.id === task.projectId) || { name: 'Unknown Project' }

  function updateStatus(newStatus) {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
  }

  function toggleDone() {
    updateStatus(task.status === 'Done' ? 'To Do' : 'Done')
  }

  function addComment(e) {
    e.preventDefault()
    if (!comment.trim()) return
    const newComment = {
      author: userName,
      text: comment.trim(),
      time: new Date().toLocaleString()
    }
    setTasks(tasks.map(t => t.id === taskId ? { ...t, comments: [...(t.comments || []), newComment] } : t))
    setComment('')
  }

  function deleteTask() {
    if (!confirm('Are you sure you want to delete this task?')) return
    saveLS('orgTasks', tasks.filter(t => t.id !== taskId))
    navigate(-1)
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '30px' }}>
      {/* Header Navigation */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <button onClick={() => navigate(-1)} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#374151' }}>
          <MdArrowBack size={20} />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#6b7280' }}>
            <MdFolder size={16} />
            <span>{project.name}</span>
            <span>/</span>
            <span>Task-{taskId}</span>
          </div>
        </div>
        <button onClick={deleteTask} style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '6px', padding: '8px 12px', color: '#dc2626', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <MdDeleteOutline size={18} /> Delete Task
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: '30px' }}>
        {/* Left Column: Content */}
        <div>
          <div style={{ background: '#fff', padding: '30px', borderRadius: '12px', border: '1px solid #e5e7eb', marginBottom: '30px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', marginBottom: '20px' }}>
              <button onClick={toggleDone} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', marginTop: '2px' }}>
                {task.status === 'Done' ? <MdCheckCircle size={28} color="#22c55e" /> : <MdRadioButtonUnchecked size={28} color="#d1d5db" />}
              </button>
              <h1 style={{ margin: 0, fontSize: '24px', fontWeight: '700', color: '#111827', textDecoration: task.status === 'Done' ? 'line-through' : 'none', opacity: task.status === 'Done' ? 0.6 : 1 }}>
                {task.title}
              </h1>
            </div>

            <div style={{ fontSize: '15px', color: '#4b5563', lineHeight: '1.6', marginBottom: '30px' }}>
              {task.description || "No description provided for this task."}
            </div>

            {/* Comments Section */}
            <div style={{ borderTop: '1px solid #f3f4f6', paddingTop: '30px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#111827', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MdComment size={20} color="#16a34a" /> 
                Comments {(task.comments || []).length > 0 && `(${(task.comments || []).length})`}
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {(task.comments || []).map((c, i) => (
                  <div key={i} style={{ display: 'flex', gap: '12px' }}>
                    <div style={{ width: '32px', height: '32px', background: '#f3f4f6', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', color: '#374151' }}>
                      {c.author[0]}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'baseline', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '700', fontSize: '13px', color: '#111827' }}>{c.author}</span>
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>{c.time}</span>
                      </div>
                      <div style={{ fontSize: '13px', color: '#374151', background: '#f9fafb', padding: '10px 14px', borderRadius: '0 12px 12px 12px', border: '1px solid #f3f4f6' }}>
                        {c.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={addComment} style={{ display: 'flex', gap: '12px' }}>
                <div style={{ width: '32px', height: '32px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px', color: '#16a34a' }}>
                  {userName[0]}
                </div>
                <div style={{ flex: 1, position: 'relative' }}>
                  <textarea 
                    placeholder="Write a comment..." 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    style={{ width: '100%', padding: '12px 45px 12px 14px', border: '1px solid #e5e7eb', borderRadius: '10px', fontSize: '13px', outline: 'none', resize: 'none', height: '80px', boxSizing: 'border-box' }}
                  />
                  <button type="submit" style={{ position: 'absolute', bottom: '10px', right: '10px', background: '#16a34a', border: 'none', borderRadius: '6px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', cursor: 'pointer' }}>
                    <MdSend size={18} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar Stats */}
        <div>
          <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e5e7eb', position: 'sticky', top: '30px' }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Status</label>
              <select 
                value={task.status} 
                onChange={(e) => updateStatus(e.target.value)}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', fontWeight: '600', color: statusColors[task.status], background: (statusColors[task.status] || '#6b7280') + '10', cursor: 'pointer' }}
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px' }}>Assignee</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><MdPerson size={14} color="#6b7280" /></div>
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{task.assignee || 'Unassigned'}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px' }}>Start Date</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MdCalendarToday size={14} color="#6b7280" />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{task.startDate || 'No date set'}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px' }}>End Date</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MdCalendarToday size={14} color="#6b7280" />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: '#111827' }}>{task.endDate || task.due || 'No date set'}</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '11px', fontWeight: '700', color: '#9ca3af', textTransform: 'uppercase', marginBottom: '6px' }}>Priority</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MdFlag size={14} color={priorityColors[task.priority]} />
                  <span style={{ fontSize: '13px', fontWeight: '600', color: priorityColors[task.priority] }}>{task.priority}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
