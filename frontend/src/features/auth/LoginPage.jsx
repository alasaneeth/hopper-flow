import { useState } from 'react'
import useAuth from './useAuth'

const LoginPage = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await login(email, password)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-600">HopperFlow</h1>
          <p className="text-gray-500 text-sm mt-1">
            String Hopper Business Management
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@hopperflow.com"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-green-500
                         text-sm"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-green-500
                         text-sm"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-2.5 rounded-lg">
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
        <p className="text-center text-xs text-gray-400 mt-6">
          HopperFlow v1.0 — Sprint 1
        </p>

      </div>
    </div>
  )
}

export default LoginPage