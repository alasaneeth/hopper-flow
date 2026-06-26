import authReducer, { setAuth, logout, selectIsAdmin, selectCanEdit, selectRole } from '../authSlice'

describe('authSlice', () => {
  beforeEach(() => {
    // localStorage fresh-ah set pannurom every test ku
    localStorage.clear()
  })

  it('should return the initial state when no token/user in localStorage', () => {
    const state = authReducer(undefined, { type: 'unknown' })
    expect(state).toEqual({ token: null, user: null })
  })

  it('setAuth should update token & user, and persist to localStorage', () => {
    const initialState = { token: null, user: null }
    const payload = {
      token: 'abc123',
      user: { fullName: 'Kamal', role: 'Admin', expiresAt: '2026-12-31' },
    }

    const newState = authReducer(initialState, setAuth(payload))

    expect(newState.token).toBe('abc123')
    expect(newState.user).toEqual(payload.user)
    // localStorage la save aaguthu nu check pannurom
    expect(localStorage.getItem('token')).toBe('abc123')
    expect(JSON.parse(localStorage.getItem('user'))).toEqual(payload.user)
  })

  it('logout should clear token, user, and localStorage', () => {
    localStorage.setItem('token', 'abc123')
    localStorage.setItem('user', JSON.stringify({ fullName: 'Kamal', role: 'Admin' }))

    const stateBefore = { token: 'abc123', user: { fullName: 'Kamal', role: 'Admin' } }
    const newState = authReducer(stateBefore, logout())

    expect(newState.token).toBeNull()
    expect(newState.user).toBeNull()
    expect(localStorage.getItem('token')).toBeNull()
    expect(localStorage.getItem('user')).toBeNull()
  })

  describe('selectors', () => {
    it('selectIsAdmin returns true only when role is Admin', () => {
      expect(selectIsAdmin({ auth: { user: { role: 'Admin' } } })).toBe(true)
      expect(selectIsAdmin({ auth: { user: { role: 'Manager' } } })).toBe(false)
      expect(selectIsAdmin({ auth: { user: null } })).toBe(false)
    })

    it('selectCanEdit returns true only when role is Admin', () => {
      expect(selectCanEdit({ auth: { user: { role: 'Admin' } } })).toBe(true)
      expect(selectCanEdit({ auth: { user: { role: 'Cashier' } } })).toBe(false)
    })

    it('selectRole returns the current user role or undefined', () => {
      expect(selectRole({ auth: { user: { role: 'HR' } } })).toBe('HR')
      expect(selectRole({ auth: { user: null } })).toBeUndefined()
    })
  })
})
