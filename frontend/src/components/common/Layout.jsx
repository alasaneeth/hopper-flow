import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'

const navItems = [
  { path: '/', label: 'Dashboard', icon: '▦' },
  { path: '/suppliers', label: 'Suppliers', icon: '🏭' },
  { path: '/purchases', label: 'Purchases', icon: '🛒' },
  { path: '/stocks', label: 'Stock', icon: '📦' },
]

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector(state => state.auth.user)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-[#0f0f0f] text-white overflow-hidden">

      {/* Sidebar */}
      <aside className={`flex flex-col justify-between
        bg-[#141414] border-r border-[#232323]
        transition-all duration-300
        ${collapsed ? 'w-16' : 'w-56'}`}>

        {/* Top */}
        <div>
          {/* Logo */}
          <div className="flex items-center justify-between px-4 py-5 
                          border-b border-[#232323]">
            {!collapsed && (
              <span className="text-green-400 font-bold text-lg tracking-tight">
                HopperFlow
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-gray-500 hover:text-white transition-colors ml-auto"
            >
              {collapsed ? '→' : '←'}
            </button>
          </div>

          {/* Nav */}
          <nav className="mt-4 px-2 space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg
                   text-sm transition-all duration-150
                   ${isActive
                    ? 'bg-[#1f1f1f] text-white font-medium'
                    : 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
                  }`
                }
              >
                <span className="text-base">{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom — User + Logout */}
        <div className="px-2 pb-4 border-t border-[#232323] pt-4">
          {!collapsed && (
            <div className="px-3 mb-3">
              <p className="text-xs text-gray-500">Logged in as</p>
              <p className="text-sm text-white font-medium truncate">
                {user?.fullName}
              </p>
              <p className="text-xs text-green-400">{user?.role}</p>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg
                       text-sm text-gray-500 hover:text-red-400 
                       hover:bg-[#1a1a1a] transition-all w-full"
          >
            <span>⎋</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>

      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#0f0f0f]">

        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-[#0f0f0f] border-b 
                        border-[#232323] px-8 py-4">
          <p className="text-xs text-gray-600">
            HopperFlow — String Hopper Business Management
          </p>
        </div>

        {/* Page content */}
        <div className="px-8 py-6">
          {children}
        </div>

      </main>

    </div>
  )
}

export default Layout