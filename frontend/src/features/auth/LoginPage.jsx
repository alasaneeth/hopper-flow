import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import useAuth from './useAuth'
import { toggleTheme } from '../../store/themeSlice'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuth()
  const dispatch = useDispatch()
  const isDark = useSelector(state => state.theme.isDark)

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300
      ${isDark ? 'bg-[#0f0f0f]' : 'bg-gray-50'}`}>

      {/* Theme toggle — top right */}
      <button
        onClick={() => dispatch(toggleTheme())}
        className={`fixed top-4 right-4 p-2 rounded-lg transition-colors
          ${isDark
            ? 'text-gray-500 hover:text-white hover:bg-[#1a1a1a]'
            : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'}`}
      >
        {isDark ? '☀️' : '🌙'}
      </button>

      <div className={`p-8 rounded-2xl shadow-md w-full max-w-md
        ${isDark
          ? 'bg-[#141414] border border-[#232323]'
          : 'bg-white'}`}>

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-500">HopperFlow</h1>
          <p className={`text-sm mt-1
            ${isDark ? 'text-gray-500' : 'text-gray-500'}`}>
            String Hopper Business Management
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hopperflow.com"
              required
              className={`w-full px-4 py-2.5 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-green-500/50
                text-sm transition-colors
                ${isDark
                  ? 'bg-[#0f0f0f] border-[#2a2a2a] text-white placeholder-gray-700'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className={`w-full px-4 py-2.5 border rounded-lg
                focus:outline-none focus:ring-2 focus:ring-green-500/50
                text-sm transition-colors
                ${isDark
                  ? 'bg-[#0f0f0f] border-[#2a2a2a] text-white placeholder-gray-700'
                  : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'}`}
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-2.5 rounded-lg">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white
                       font-medium py-2.5 rounded-lg transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

        </form>

        {/* Footer */}
        <p className={`text-center text-xs mt-6
          ${isDark ? 'text-gray-700' : 'text-gray-400'}`}>
          HopperFlow v1.0 — Sprint 6
        </p>
      </div>
    </div>
  )
}

export default LoginPage