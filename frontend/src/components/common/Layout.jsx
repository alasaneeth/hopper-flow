import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../features/auth/authSlice'
import { toggleTheme } from '../../store/themeSlice'
import { ChevronDown, ChevronRight } from 'lucide-react'

const navItems = [
  { path: '/', label: 'Dashboard', icon: '▦' },
    {
    label: 'Sales', icon: '🧾',
    children: [
    { path: '/sales', label: 'Sales Orders', icon: '📝' },
    { path: '/invoices', label: 'Invoices', icon: '🧾' },
     { path: '/customers', label: 'Customers', icon: '👥' },
    ]
  },
  
 
  { path: '/suppliers', label: 'Suppliers', icon: '🏭' },
  { path: '/purchases', label: 'Purchases', icon: '🛒' },
  { path: '/stocks', label: 'Stock', icon: '📦' },
  {
    label: 'Payroll', icon: '💰',
    children: [
      { path: '/employees', label: 'Employees', icon: '👨‍🏭' },
      { path: '/attendance', label: 'Attendance', icon: '📅' },
      { path: '/advances', label: 'Advances', icon: '💵' },
      { path: '/payroll', label: 'Salary', icon: '💰' },
    ]
  },
  {
    label: 'Production', icon: '⚙️',
    children: [
      { path: '/preparation', label: 'Preparation', icon: '🧪' },
      { path: '/production', label: 'String Hoppers', icon: '🍜' },
    ]
  },
]

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [openMenu, setOpenMenu] = useState('Production') // default open
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(state => state.auth.user)
  const isDark = useSelector(state => state.theme.isDark)

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

const isParentActive = (item) => 
  item.children?.some(child => location.pathname === child.path)

  return (
    <div className={`flex h-screen overflow-hidden transition-colors duration-300
      ${isDark ? 'bg-[#0f0f0f] text-white' : 'bg-gray-50 text-gray-900'}`}>

      {/* Sidebar */}
      <aside className={`flex flex-col justify-between transition-all duration-300
        ${isDark
          ? 'bg-[#141414] border-r border-[#232323]'
          : 'bg-white border-r border-gray-200'}
        ${collapsed ? 'w-16' : 'w-56'}`}>

        {/* Top */}
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo */}
          <div className={`flex items-center justify-between px-4 py-5 flex-shrink-0
            ${isDark ? 'border-b border-[#232323]' : 'border-b border-gray-100'}`}>
            {!collapsed && (
              <span className="text-green-500 font-bold text-lg tracking-tight">
                HopperFlow
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className={`ml-auto transition-colors
                ${isDark
                  ? 'text-gray-600 hover:text-white'
                  : 'text-gray-400 hover:text-gray-900'}`}
            >
              {collapsed ? '→' : '←'}
            </button>
          </div>

          {/* Nav */}
          <nav className={`mt-4 px-2 space-y-1 overflow-y-auto min-h-0 flex-1
            ${isDark ? 'sidebar-scroll-dark' : 'sidebar-scroll-light'}`}>
            {navItems.map(item => {
              // Parent with children
              if (item.children) {
                const isOpen = openMenu === item.label
                return (
                  <div key={item.label}>
                    {/* Parent button */}
                    <button
                      onClick={() => setOpenMenu(isOpen ? '' : item.label)}
                      className={`flex items-center justify-between w-full
                        px-3 py-2.5 rounded-lg text-sm transition-all
                        ${isParentActive(item)
                          ? isDark
                            ? 'text-white'
                            : 'text-gray-900'
                          : isDark
                            ? 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
                            : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                        }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">{item.icon}</span>
                        {!collapsed && <span>{item.label}</span>}
                      </div>
                      {!collapsed && (
                        isOpen
                          ? <ChevronDown size={14} className="text-gray-500" />
                          : <ChevronRight size={14} className="text-gray-500" />
                      )}
                    </button>

                    {/* Children */}
                    {isOpen && !collapsed && (
                      <div className="ml-4 mt-1 space-y-1 border-l-2
                        border-[#232323] pl-2">
                        {item.children.map(child => (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            className={({ isActive }) =>
                              `flex items-center gap-3 px-3 py-2 rounded-lg
                               text-sm transition-all
                               ${isActive
                                ? isDark
                                  ? 'bg-[#1f1f1f] text-white font-medium'
                                  : 'bg-gray-100 text-gray-900 font-medium'
                                : isDark
                                  ? 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
                                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                              }`
                            }
                          >
                            <span className="text-sm">{child.icon}</span>
                            <span>{child.label}</span>
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }

              // Regular nav item
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-lg
                     text-sm transition-all duration-150
                     ${isActive
                      ? isDark
                        ? 'bg-[#1f1f1f] text-white font-medium'
                        : 'bg-gray-100 text-gray-900 font-medium'
                      : isDark
                        ? 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                    }`
                  }
                >
                  <span className="text-base">{item.icon}</span>
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div className={`px-2 pb-4 pt-4 flex-shrink-0
          ${isDark ? 'border-t border-[#232323]' : 'border-t border-gray-100'}`}>

          {/* Theme toggle */}
          <button
            onClick={() => dispatch(toggleTheme())}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg
                       text-sm w-full mb-1 transition-all
                       ${isDark
                        ? 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}
          >
            <span>{isDark ? '☀️' : '🌙'}</span>
            {!collapsed && (
              <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
            )}
          </button>

          {/* User info */}
          {!collapsed && (
            <div className={`px-3 mb-2 py-2 rounded-lg
              ${isDark ? 'bg-[#1a1a1a]' : 'bg-gray-50'}`}>
              <p className={`text-xs ${isDark ? 'text-gray-600' : 'text-gray-400'}`}>
                Logged in as
              </p>
              <p className={`text-sm font-medium truncate
                ${isDark ? 'text-white' : 'text-gray-900'}`}>
                {user?.fullName}
              </p>
              <p className="text-xs text-green-500">{user?.role}</p>
            </div>
          )}

          {/* Logout */}
          <button
            onClick={handleLogout}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg
                       text-sm w-full transition-all
                       ${isDark
                        ? 'text-gray-500 hover:text-red-400 hover:bg-[#1a1a1a]'
                        : 'text-gray-500 hover:text-red-500 hover:bg-red-50'}`}
          >
            <span>⎋</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className={`sticky top-0 z-10 px-8 py-4 border-b
          ${isDark
            ? 'bg-[#0f0f0f] border-[#232323]'
            : 'bg-gray-50 border-gray-200'}`}>
          <p className={`text-xs ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>
            HopperFlow — String Hopper Business Management
          </p>
        </div>
        <div className="px-8 py-6">{children}</div>
      </main>

      {/* Scrollbar styling for sidebar nav */}
      <style>{`
        .sidebar-scroll-dark::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-scroll-dark::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll-dark::-webkit-scrollbar-thumb {
          background-color: #2a2a2a;
          border-radius: 10px;
        }
        .sidebar-scroll-dark::-webkit-scrollbar-thumb:hover {
          background-color: #3a3a3a;
        }
        .sidebar-scroll-light::-webkit-scrollbar {
          width: 6px;
        }
        .sidebar-scroll-light::-webkit-scrollbar-track {
          background: transparent;
        }
        .sidebar-scroll-light::-webkit-scrollbar-thumb {
          background-color: #e5e7eb;
          border-radius: 10px;
        }
        .sidebar-scroll-light::-webkit-scrollbar-thumb:hover {
          background-color: #d1d5db;
        }
      `}</style>
    </div>
  )
}

export default Layout