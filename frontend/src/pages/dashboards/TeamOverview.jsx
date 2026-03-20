import { useState, useEffect, useRef } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'
import {
  MdCheckCircle, MdRadioButtonUnchecked, MdCalendarToday,
  MdChevronLeft, MdChevronRight, MdSend, MdComment
} from 'react-icons/md'
import { BsListTask } from 'react-icons/bs'

function loadLS(key, fallback = []) { try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : fallback } catch { return fallback } }
function saveLS(key, val) { localStorage.setItem(key, JSON.stringify(val)) }

const DAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const statusColors = { 'To Do': '#6b7280', 'In Progress': '#0366d6', 'Done': '#22863a' }
const priorityColors = { 'Low': '#0366d6', 'Medium': '#f59e0b', 'High': '#cb2431' }

function buildCalendar(year, month) {
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const days = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(d)
  return days
}

export default function TeamOverview() {
  const navigate = useNavigate()
  const { search = '' } = useOutletContext() || {}
  const [tasks, setTasks] = useState(() => loadLS('orgTasks'))
  const [expandedTask, setExpandedTask] = useState(null)
  const [commentText, setCommentText] = useState('')
  const projects = loadLS('orgProjects')
  const userName = localStorage.getItem('adminName') || 'You'

  useEffect(() => { saveLS('orgTasks', tasks) }, [tasks])

  // Calendar
  const today = new Date()
  const [calYear, setCalYear] = useState(today.getFullYear())
  const [calMonth, setCalMonth] = useState(today.getMonth())
  const calDays = buildCalendar(calYear, calMonth)

  function prevMonth() { if (calMonth === 0) { setCalMonth(11); setCalYear(calYear - 1) } else setCalMonth(calMonth - 1) }
  function nextMonth() { if (calMonth === 11) { setCalMonth(0); setCalYear(calYear + 1) } else setCalMonth(calMonth + 1) }

  // Only show tasks assigned to current user or all if no assignments match
  const myTasks = tasks.filter(t => t.assignee === userName || t.assignee === 'You')
  const baseTasks = myTasks.length > 0 ? myTasks : tasks
  const displayTasks = baseTasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()) || (t.status || '').toLowerCase().includes(search.toLowerCase()))

  const done = displayTasks.filter(t => t.status === 'Done').length
  const inProgress = displayTasks.filter(t => t.status === 'In Progress').length
  const toDo = displayTasks.filter(t => t.status === 'To Do').length

  function updateStatus(taskId, newStatus) {
    setTasks(tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t))
  }

  function addComment(taskId) {
    if (!commentText.trim()) return
    setTasks(tasks.map(t => {
      if (t.id !== taskId) return t
      const comments = [...(t.comments || []), { author: userName, text: commentText.trim(), time: new Date().toLocaleString() }]
      return { ...t, comments }
    }))
    setCommentText('')
  }

  function getProjectName(projId) {
    const p = projects.find(pr => pr.id === projId)
    return p ? p.name : 'Unknown Project'
  }

  return (
    <>
      <div className="tm-page-head">
        <div>
          <h1 className="tm-page-title">My Dashboard</h1>
          <p className="tm-page-sub">View and manage your assigned tasks.</p>
        </div>
      </div>



      <div className="tm-grid">
        {/* Tasks List */}
        <div className="tm-left-col">
          <div className="tm-card">
            <h2 className="tm-card-title">Assigned to Me</h2>
            <div className="tm-task-list">
              {displayTasks.length === 0 && <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', padding: '20px 0' }}>No tasks assigned yet. Ask your PM to create tasks for you!</p>}
              {displayTasks.map((task) => (
                <div key={task.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  {/* Task row */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 0', cursor: 'pointer' }} onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)}>
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', padding: 0 }}
                      onClick={(e) => { e.stopPropagation(); updateStatus(task.id, task.status === 'Done' ? 'To Do' : 'Done') }}>
                      {task.status === 'Done' ? <MdCheckCircle size={22} color="#22c55e" /> : <MdRadioButtonUnchecked size={22} color="#d1d5db" />}
                    </button>
                    <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => navigate(`tasks/${task.id}`)}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: '600', fontSize: '13px', color: task.status === 'Done' ? '#9ca3af' : '#1a202c', textDecoration: task.status === 'Done' ? 'line-through' : 'none' }}>{task.title}</span>
                        <span style={{ padding: '2px 6px', borderRadius: '3px', fontSize: '10px', fontWeight: '600', background: (priorityColors[task.priority] || '#6b7280') + '18', color: priorityColors[task.priority] || '#6b7280' }}>{task.priority}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>
                        {getProjectName(task.projectId)} {task.due && <span>• Due: {task.due}</span>}
                      </div>
                    </div>
                    {/* Status dropdown */}
                    <select value={task.status} onClick={(e) => e.stopPropagation()} onChange={(e) => updateStatus(task.id, e.target.value)}
                      style={{ padding: '4px 8px', border: '1px solid #e5e7eb', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', background: (statusColors[task.status] || '#6b7280') + '15', color: statusColors[task.status], fontWeight: '500' }}>
                      <option value="To Do">To Do</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                    </select>
                    <MdComment size={16} color={expandedTask === task.id ? '#16a34a' : '#d1d5db'} />
                    {(task.comments || []).length > 0 && <span style={{ fontSize: '11px', color: '#9ca3af' }}>{task.comments.length}</span>}
                  </div>

                  {/* Comments section */}
                  {expandedTask === task.id && (
                    <div style={{ paddingLeft: '34px', paddingBottom: '14px' }}>
                      {/* Existing comments */}
                      {(task.comments || []).map((c, i) => (
                        <div key={i} style={{ background: '#f9fafb', borderRadius: '8px', padding: '10px 12px', marginBottom: '6px', fontSize: '12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <span style={{ fontWeight: '600', color: '#1a202c' }}>{c.author}</span>
                            <span style={{ color: '#9ca3af', fontSize: '10px' }}>{c.time}</span>
                          </div>
                          <p style={{ margin: 0, color: '#374151', lineHeight: '1.4' }}>{c.text}</p>
                        </div>
                      ))}
                      {/* Add comment */}
                      <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <input type="text" placeholder="Write a comment..." value={expandedTask === task.id ? commentText : ''} onChange={(e) => setCommentText(e.target.value)}
                          onKeyDown={(e) => { if (e.key === 'Enter') addComment(task.id) }}
                          style={{ flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '12px', outline: 'none' }} />
                        <button onClick={() => addComment(task.id)}
                          style={{ padding: '8px 12px', background: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                          <MdSend size={14} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right - Calendar */}
        <div className="tm-right-col">
          <div className="tm-card">
            <div className="tm-card-head"><h2 className="tm-card-title">Deadlines</h2><div className="tm-cal-nav"><button onClick={prevMonth}><MdChevronLeft /></button><button onClick={nextMonth}><MdChevronRight /></button></div></div>
            <div className="tm-cal-month">{MONTHS[calMonth]} {calYear}</div>
            <div className="tm-cal-grid">
              {DAYS.map((d, i) => <div key={i} className="tm-cal-day-label">{d}</div>)}
              {calDays.map((d, i) => <div key={i} className={'tm-cal-day' + (!d ? ' tm-cal-empty' : '') + (d === today.getDate() && calMonth === today.getMonth() && calYear === today.getFullYear() ? ' tm-cal-today' : '')}>{d || ''}</div>)}
            </div>
          </div>

          {/* Quick summary */}
          <div className="tm-card">
            <h2 className="tm-card-title" style={{ marginBottom: '12px' }}>Task Summary</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {Object.entries(statusColors).map(([status, color]) => {
                const count = displayTasks.filter(t => t.status === status).length
                return (
                  <div key={status} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                      <span style={{ color: '#374151' }}>{status}</span>
                    </div>
                    <span style={{ fontWeight: '700', color: '#1a202c' }}>{count}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
