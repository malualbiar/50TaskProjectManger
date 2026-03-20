import { useState, useEffect } from 'react'
import { useNavigate, useOutletContext } from 'react-router-dom'

const DEFAULT_PROJECTS = [
  { id: 1, name: 'Q4 Product Launch', manager: 'Sarah Chen', team: 5, tasks: 24, status: 'On Track', progress: 75, dueDate: '2026-04-15' },
  { id: 2, name: 'Mobile App Redesign', manager: 'Mike Ross', team: 3, tasks: 18, status: 'At Risk', progress: 45, dueDate: '2026-05-01' },
  { id: 3, name: 'Security Audit 2024', manager: 'Alex Johnson', team: 2, tasks: 12, status: 'On Track', progress: 85, dueDate: '2026-03-30' },
]

function loadProjects() {
  try {
    const raw = localStorage.getItem('orgProjects')
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_PROJECTS
}

function saveProjects(p) {
  localStorage.setItem('orgProjects', JSON.stringify(p))
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

export default function ProjectList() {
  const navigate = useNavigate()
  const { search = '' } = useOutletContext() || {}
  const [projects, setProjects] = useState(loadProjects)
  const [showNewModal, setShowNewModal] = useState(false)
  const [newProj, setNewProj] = useState({ name: '', manager: '', status: 'On Track', dueDate: '' })
  const members = loadMembers()

  useEffect(() => { saveProjects(projects) }, [projects])

  const handleCreate = (e) => {
    e.preventDefault()
    setProjects([...projects, {
      id: Date.now(),
      name: newProj.name,
      manager: newProj.manager || 'Unassigned',
      team: 0,
      tasks: 0,
      status: newProj.status,
      progress: 0,
      dueDate: newProj.dueDate || 'TBD'
    }])
    setNewProj({ name: '', manager: '', status: 'On Track', dueDate: '' })
    setShowNewModal(false)
  }

  const handleDelete = (id, e) => {
    e.stopPropagation()
    if (!confirm('Are you sure you want to delete this project?')) return
    setProjects(projects.filter(p => p.id !== id))
  }

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.manager || '').toLowerCase().includes(search.toLowerCase()) ||
    (p.status || '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '30px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: '600', color: '#1a202c' }}>Projects</h1>
          <p style={{ margin: '0', fontSize: '14px', color: '#718096' }}>Manage all your organization projects</p>
        </div>
        <button onClick={() => setShowNewModal(true)}
          style={{ backgroundColor: '#22863a', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>
          + New Project
        </button>
      </div>

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '20px', marginBottom: '30px' }}>
        {filteredProjects.map((project) => (
          <div key={project.id} onClick={() => navigate(`${project.id}`)}
            style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s ease', border: '1px solid #e1e4e8', position: 'relative' }}
            onMouseEnter={(e) => { e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.12)'; e.currentTarget.style.transform = 'translateY(-2px)' }}
            onMouseLeave={(e) => { e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'; e.currentTarget.style.transform = 'none' }}>
            {/* Delete button */}
            <button onClick={(e) => handleDelete(project.id, e)} title="Delete project"
              style={{ position: 'absolute', top: '10px', right: '10px', background: '#fee2e2', border: 'none', borderRadius: '50%', width: '26px', height: '26px', cursor: 'pointer', fontSize: '14px', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
              🗑
            </button>
            <div style={{ padding: '20px', borderBottom: '1px solid #e1e4e8' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '10px', paddingRight: '30px' }}>
                <h3 style={{ margin: '0', fontSize: '16px', fontWeight: '600', color: '#1a202c' }}>{project.name}</h3>
                <span style={{ backgroundColor: (statusColors[project.status] || '#6b7280') + '20', color: statusColors[project.status] || '#6b7280', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: '600' }}>
                  {project.status}
                </span>
              </div>
              <p style={{ margin: '0', fontSize: '12px', color: '#718096' }}>Manager: {project.manager}</p>
            </div>
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <p style={{ margin: '0', fontSize: '12px', color: '#718096' }}>Progress</p>
                  <p style={{ margin: '0', fontSize: '12px', fontWeight: '600', color: '#1a202c' }}>{project.progress}%</p>
                </div>
                <div style={{ width: '100%', height: '6px', backgroundColor: '#e1e4e8', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ width: `${project.progress}%`, height: '100%', backgroundColor: statusColors[project.status] || '#6b7280', borderRadius: '3px' }} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px' }}>
                <div><p style={{ margin: '0 0 2px', fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '600' }}>Team</p><p style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>{project.team}</p></div>
                <div><p style={{ margin: '0 0 2px', fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '600' }}>Tasks</p><p style={{ margin: '0', fontSize: '16px', fontWeight: '700', color: '#1a202c' }}>{project.tasks}</p></div>
                <div><p style={{ margin: '0 0 2px', fontSize: '11px', color: '#718096', textTransform: 'uppercase', fontWeight: '600' }}>Due</p><p style={{ margin: '0', fontSize: '13px', fontWeight: '500', color: '#1a202c' }}>{project.dueDate}</p></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Project Modal */}
      {showNewModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '440px', width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>Create New Project</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#6b7280' }}>Set up a new project for your team.</p>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Project Name</label>
                <input type="text" placeholder="e.g. Website Redesign" value={newProj.name} onChange={(e) => setNewProj({ ...newProj, name: e.target.value })} required
                  style={{ width: '100%', padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Project Manager</label>
                <select value={newProj.manager} onChange={(e) => setNewProj({ ...newProj, manager: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}>
                  <option value="">Select a manager...</option>
                  {members.filter(m => m.role === 'Project Manager' || m.role === 'Organization Admin').map(m => (
                    <option key={m.id} value={m.name}>{m.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Status</label>
                <select value={newProj.status} onChange={(e) => setNewProj({ ...newProj, status: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}>
                  <option value="On Track">On Track</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Behind">Behind</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Due Date</label>
                <input type="date" value={newProj.dueDate} onChange={(e) => setNewProj({ ...newProj, dueDate: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#22863a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Create Project</button>
                <button type="button" onClick={() => setShowNewModal(false)} style={{ flex: 1, padding: '10px', backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
