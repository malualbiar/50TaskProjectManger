import { useState, useRef, useEffect } from 'react'
import { MdNotifications, MdCircle } from 'react-icons/md'

const MOCK_NOTIFS = [
  { id: 1, title: 'New Task Assigned', desc: 'You have been assigned to "Market Research"', time: '2m ago', unread: true },
  { id: 2, title: 'Project Updated', desc: 'Nexus Cloud Migration status changed to "On Track"', time: '1h ago', unread: true },
  { id: 3, title: 'Member Joined', desc: 'Alex Johnson joined the Team Member role', time: '5h ago', unread: false },
  { id: 4, title: 'System Alert', desc: 'Storage usage is at 85% of your plan limit', time: '1d ago', unread: false },
]

export default function NotificationDropdown({ children }) {
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState(MOCK_NOTIFS)
  const ref = useRef(null)

  const unreadCount = notifs.filter(n => n.unread).length

  useEffect(() => {
    function clickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', clickOutside)
    return () => document.removeEventListener('mousedown', clickOutside)
  }, [])

  const markAllRead = () => {
    setNotifs(notifs.map(n => ({ ...n, unread: false })))
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div onClick={() => setOpen(!open)} style={{ cursor: 'pointer', position: 'relative', display: 'flex', alignItems: 'center' }}>
        {children || <MdNotifications size={20} color="#6b7280" />}
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute', top: '-2px', right: '-2px',
            background: '#ef4444', color: '#fff', fontSize: '10px',
            fontWeight: '700', borderRadius: '50%', width: '16px', height: '16px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid #fff'
          }}>
            {unreadCount}
          </span>
        )}
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.12)', width: '320px', zIndex: 9999,
          overflow: 'hidden'
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4 style={{ margin: 0, fontSize: '15px', fontWeight: '700', color: '#111827' }}>Notifications</h4>
            {unreadCount > 0 && (
              <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: '#16a34a', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>
                Mark all as read
              </button>
            )}
          </div>
          <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
            {notifs.length === 0 ? (
              <div style={{ padding: '30px', textAlign: 'center', color: '#6b7280', fontSize: '13px' }}>No notifications</div>
            ) : (
              notifs.map(n => (
                <div key={n.id} style={{
                  padding: '14px 16px', borderBottom: '1px solid #f3f4f6', cursor: 'pointer',
                  background: n.unread ? '#f0fdf4' : '#fff', transition: 'background 0.2s'
                }} onMouseOver={e => e.currentTarget.style.background = '#f9fafb'} onMouseOut={e => e.currentTarget.style.background = n.unread ? '#f0fdf4' : '#fff'}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <div style={{ fontSize: '13px', fontWeight: '700', color: '#111827' }}>{n.title}</div>
                    <div style={{ fontSize: '11px', color: '#9ca3af' }}>{n.time}</div>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280', lineHeight: '1.4' }}>{n.desc}</div>
                  {n.unread && <div style={{ marginTop: '6px' }}><MdCircle size={8} color="#16a34a" /></div>}
                </div>
              ))
            )}
          </div>
          <div style={{ padding: '12px', textAlign: 'center', background: '#f9fafb', borderTop: '1px solid #e5e7eb' }}>
            <button style={{ background: 'none', border: 'none', color: '#374151', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>View All Notifications</button>
          </div>
        </div>
      )}
    </div>
  )
}
