import { useState, useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'

const ROLES = {
  'Organization Admin': { color: '#cb2431', description: 'Full control of organization' },
  'Project Manager': { color: '#f59e0b', description: 'Manage projects and teams' },
  'Team Member': { color: '#0366d6', description: 'Execute tasks and collaborate' }
}

const DEFAULT_MEMBERS = [
  { id: 1, name: 'You', email: 'admin@company.com', role: 'Organization Admin', joinedDate: '2026-03-01', status: 'Active' },
  { id: 2, name: 'Sarah Chen', email: 'sarah@company.com', role: 'Project Manager', joinedDate: '2026-03-02', status: 'Active' },
  { id: 3, name: 'Mike Ross', email: 'mike@company.com', role: 'Team Member', joinedDate: '2026-03-03', status: 'Active' },
  { id: 4, name: 'Alex Johnson', email: 'alex@company.com', role: 'Team Member', joinedDate: '2026-03-04', status: 'Pending' },
]

function loadMembers() {
  try {
    const raw = localStorage.getItem('orgMembers')
    if (raw) return JSON.parse(raw)
  } catch {}
  return DEFAULT_MEMBERS
}

function saveMembers(m) {
  localStorage.setItem('orgMembers', JSON.stringify(m))
}

export default function TeamList() {
  const [members, setMembers] = useState(loadMembers)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [editMember, setEditMember] = useState(null)
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState('Team Member')
  const { search = '' } = useOutletContext() || {}

  useEffect(() => { saveMembers(members) }, [members])

  const handleInvite = (e) => {
    e.preventDefault()
    if (!inviteEmail) return
    setMembers([...members, {
      id: Date.now(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Pending'
    }])
    setInviteEmail('')
    setInviteRole('Team Member')
    setShowInviteModal(false)
  }

  const handleRemove = (id) => {
    if (!confirm('Are you sure you want to remove this member? This action cannot be undone.')) return
    setMembers(members.filter(m => m.id !== id))
  }

  const handleRoleChange = (id, newRole) => {
    setMembers(members.map(m => m.id === id ? { ...m, role: newRole } : m))
  }

  const openEdit = (member) => {
    setEditMember({ ...member })
    setShowEditModal(true)
  }

  const handleEditSave = (e) => {
    e.preventDefault()
    setMembers(members.map(m => m.id === editMember.id ? editMember : m))
    setShowEditModal(false)
  }

  const filtered = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '30px' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: '0 0 5px 0', fontSize: '28px', fontWeight: '600', color: '#1a202c' }}>Team Members</h1>
          <p style={{ margin: '0', fontSize: '14px', color: '#718096' }}>Manage your organization's team and assign roles</p>
        </div>
        <button
          onClick={() => setShowInviteModal(true)}
          style={{ backgroundColor: '#22863a', color: 'white', padding: '10px 20px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '500', fontSize: '13px' }}
        >
          + Invite Members
        </button>
      </div>





      {/* Members Table */}
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ backgroundColor: '#f6f8fa', borderBottom: '1px solid #e1e4e8' }}>
            <tr>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#586069' }}>Name</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#586069' }}>Email</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#586069' }}>Role</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#586069' }}>Joined</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#586069' }}>Status</th>
              <th style={{ padding: '12px 20px', textAlign: 'left', fontSize: '12px', fontWeight: '600', color: '#586069' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((member) => (
              <tr key={member.id} style={{ borderBottom: '1px solid #e1e4e8' }}>
                <td style={{ padding: '15px 20px', fontSize: '13px', fontWeight: '500', color: '#1a202c' }}>{member.name}</td>
                <td style={{ padding: '15px 20px', fontSize: '13px', color: '#586069' }}>{member.email}</td>
                <td style={{ padding: '15px 20px', fontSize: '13px' }}>
                  {member.role === 'Organization Admin' ? (
                    <span style={{ backgroundColor: ROLES[member.role]?.color + '15', color: ROLES[member.role]?.color, padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                      {member.role}
                    </span>
                  ) : (
                    <select
                      value={member.role}
                      onChange={(e) => handleRoleChange(member.id, e.target.value)}
                      style={{ padding: '5px 8px', border: '1px solid #e1e4e8', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', color: ROLES[member.role]?.color, fontWeight: '500', background: ROLES[member.role]?.color + '10' }}
                    >
                      {Object.keys(ROLES).filter(r => r !== 'Organization Admin').map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  )}
                </td>
                <td style={{ padding: '15px 20px', fontSize: '13px', color: '#586069' }}>{member.joinedDate}</td>
                <td style={{ padding: '15px 20px', fontSize: '13px' }}>
                  <span style={{
                    backgroundColor: member.status === 'Active' ? '#d1f2eb' : '#fff3cd',
                    color: member.status === 'Active' ? '#22863a' : '#856404',
                    padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: '500'
                  }}>
                    {member.status}
                  </span>
                </td>
                <td style={{ padding: '15px 20px', fontSize: '13px' }}>
                  <button onClick={() => openEdit(member)} style={{ backgroundColor: 'transparent', border: 'none', color: '#0366d6', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Edit</button>
                  {member.role !== 'Organization Admin' && (
                    <>
                      <span style={{ margin: '0 5px', color: '#e1e4e8' }}>|</span>
                      <button onClick={() => handleRemove(member.id)} style={{ backgroundColor: 'transparent', border: 'none', color: '#cb2431', cursor: 'pointer', fontSize: '12px', fontWeight: '500' }}>Remove</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '420px', width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>Invite Team Member</h3>
            <p style={{ margin: '0 0 20px 0', fontSize: '13px', color: '#6b7280' }}>Send an invitation to join this organization.</p>
            <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1a202c', marginBottom: '6px' }}>Email Address</label>
                <input type="email" placeholder="member@example.com" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} required
                  style={{ width: '100%', padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', color: '#1a202c', marginBottom: '6px' }}>Role</label>
                <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}>
                  {Object.keys(ROLES).filter(r => r !== 'Organization Admin').map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#22863a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Send Invite</button>
                <button type="button" onClick={() => setShowInviteModal(false)} style={{ flex: 1, padding: '10px', backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editMember && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', maxWidth: '420px', width: '90%', boxShadow: '0 8px 32px rgba(0,0,0,0.18)' }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '700', color: '#1a202c' }}>Edit Member</h3>
            <form onSubmit={handleEditSave} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Name</label>
                <input type="text" value={editMember.name} onChange={(e) => setEditMember({ ...editMember, name: e.target.value })} required
                  style={{ width: '100%', padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Email</label>
                <input type="email" value={editMember.email} onChange={(e) => setEditMember({ ...editMember, email: e.target.value })} required
                  style={{ width: '100%', padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }} />
              </div>
              {editMember.role !== 'Organization Admin' && (
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Role</label>
                  <select value={editMember.role} onChange={(e) => setEditMember({ ...editMember, role: e.target.value })}
                    style={{ width: '100%', padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}>
                    {Object.keys(ROLES).filter(r => r !== 'Organization Admin').map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: '500', marginBottom: '6px' }}>Status</label>
                <select value={editMember.status} onChange={(e) => setEditMember({ ...editMember, status: e.target.value })}
                  style={{ width: '100%', padding: '10px', border: '1px solid #e1e4e8', borderRadius: '6px', fontSize: '13px', boxSizing: 'border-box' }}>
                  <option value="Active">Active</option>
                  <option value="Pending">Pending</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: '#22863a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>Save Changes</button>
                <button type="button" onClick={() => setShowEditModal(false)} style={{ flex: 1, padding: '10px', backgroundColor: 'white', color: '#374151', border: '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' }}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
