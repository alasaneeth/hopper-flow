import { useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ChevronDown, ChevronRight } from 'lucide-react'
import { logout } from '../../features/auth/authSlice'
import { toggleTheme } from '../../store/themeSlice'
import useRole from '../../hooks/useRole'

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false)
  const [openMenu, setOpenMenu] = useState('Production')
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const user = useSelector(state => state.auth.user)
  const isDark = useSelector(state => state.theme.isDark)

  const {
    isAdmin, canViewInventory, canViewProduction,
    canViewSales, canViewPayroll
  } = useRole()

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const isProductionActive =
    location.pathname === '/preparation' ||
    location.pathname === '/production'

  // ===== Nav Structure =====
  const navSections = []

  // Dashboard — everyone
  navSections.push({
    items: [{ path: '/', label: 'Dashboard', icon: '▦' }]
  })

  // Inventory
  if (canViewInventory) {
    navSections.push({
      label: 'INVENTORY',
      items: [
        { path: '/suppliers', label: 'Suppliers', icon: '🏭' },
        { path: '/purchases', label: 'Purchases', icon: '🛒' },
        { path: '/stocks', label: 'Stock', icon: '📦' },
      ]
    })
  }

  // Production
  if (canViewProduction) {
    navSections.push({
      label: 'PRODUCTION',
      items: [
        {
          label: 'Production', icon: '⚙️',
          children: [
            { path: '/preparation', label: 'Preparation', icon: '🧪' },
            { path: '/production', label: 'String Hoppers', icon: '🍜' },
          ]
        }
      ]
    })
  }

  // Sales
  if (canViewSales) {
    navSections.push({
      label: 'SALES',
      items: [
        { path: '/customers', label: 'Customers', icon: '👥' },
        { path: '/sales', label: 'Sales Orders', icon: '📝' },
        { path: '/invoices', label: 'Invoices', icon: '🧾' },
      ]
    })
  }

  // Payroll
  if (canViewPayroll) {
    navSections.push({
      label: 'PAYROLL',
      items: [
        { path: '/employees', label: 'Employees', icon: '👨‍🏭' },
        { path: '/attendance', label: 'Attendance', icon: '📅' },
        { path: '/advances', label: 'Advances', icon: '💵' },
        { path: '/payroll', label: 'Payroll', icon: '💰' },
      ]
    })
  }

  // ===== Nav Item Component =====
  const NavItem = ({ item }) => {
    // Sub-menu item
    if (item.children) {
      const isOpen = openMenu === item.label
      return (
        <div>
          <button
            onClick={() => setOpenMenu(isOpen ? '' : item.label)}
            className={`flex items-center justify-between w-full
              px-3 py-2.5 rounded-lg text-sm transition-all
              ${isProductionActive
                ? isDark ? 'text-white' : 'text-gray-900'
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

          {isOpen && !collapsed && (
            <div className={`ml-4 mt-1 space-y-1 border-l-2 pl-2
              ${isDark ? 'border-[#232323]' : 'border-gray-200'}`}>
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
  }

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
        <div className="overflow-y-auto flex-1">
          {/* Logo */}
          <div className={`flex items-center justify-between px-4 py-5
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

          {/* Nav Sections */}
          <nav className="mt-2 px-2">
            {navSections.map((section, sIdx) => (
              <div key={sIdx} className="mb-2">
                {/* Section label */}
                {section.label && !collapsed && (
                  <p className="text-xs text-gray-600 font-medium px-3 py-2 uppercase tracking-wider">
                    {section.label}
                  </p>
                )}
                {/* Section items */}
                <div className="space-y-0.5">
                  {section.items.map((item, iIdx) => (
                    <NavItem key={iIdx} item={item} />
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>

        {/* Bottom */}
        <div className={`px-2 pb-4 pt-4
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
    </div>
  )
}

export default Layout