import { useState, useRef, useEffect } from 'react'
import { MdLogout } from 'react-icons/md'
import { logout } from '../services/authService'

export default function ProfileDropdown({ userName, userEmail, userRole, children }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function clickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', clickOutside)
    return () => document.removeEventListener('mousedown', clickOutside)
  }, [])

  function handleLogout() {
    logout()   // clears all tokens + redirects to /login
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <div onClick={() => setOpen(!open)} style={{ cursor: 'pointer', display: 'flex' }}>
        {children}
      </div>
      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', right: 0,
          background: '#fff', border: '1px solid #e5e7eb', borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', width: '220px', zIndex: 9999
        }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: '14px', fontWeight: '700', color: '#111827', marginBottom: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userName}</div>
            <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{userEmail}</div>
            <div style={{ display: 'inline-block', fontSize: '10px', background: '#f3f4f6', padding: '3px 8px', borderRadius: '4px', fontWeight: '700', color: '#374151', letterSpacing: '0.03em' }}>{userRole}</div>
          </div>
          <div style={{ padding: '8px' }}>
            <button
              onClick={handleLogout}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '8px',
                padding: '8px 12px', background: 'none', border: 'none',
                color: '#dc2626', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                borderRadius: '6px', textAlign: 'left', transition: 'background 0.15s'
              }}
              onMouseOver={e => e.currentTarget.style.background = '#fef2f2'}
              onMouseOut={e => e.currentTarget.style.background = 'none'}
            >
              <MdLogout size={16} /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
