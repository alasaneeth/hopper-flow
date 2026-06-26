import payrollReducer, {
  setLoading,
  setError,
  setEmployees,
  setAttendance,
  setAdvances,
  removeAdvance,
  setPayrolls,
} from '../payrollSlice'

const initialState = {
  employees: [],
  attendance: [],
  advances: [],
  payrolls: [],
  loading: false,
  error: null,
}

describe('payrollSlice', () => {
  // ─── Initial State ───────────────────────────────────────────────────────────
  it('should return initial state for unknown action', () => {
    const state = payrollReducer(undefined, { type: 'unknown' })
    expect(state).toEqual(initialState)
  })

  // ─── setLoading ──────────────────────────────────────────────────────────────
  describe('setLoading', () => {
    it('should set loading to true', () => {
      const state = payrollReducer(initialState, setLoading(true))
      expect(state.loading).toBe(true)
    })

    it('should set loading to false', () => {
      const state = payrollReducer({ ...initialState, loading: true }, setLoading(false))
      expect(state.loading).toBe(false)
    })
  })

  // ─── setError ────────────────────────────────────────────────────────────────
  describe('setError', () => {
    it('should set error message and turn off loading', () => {
      const state = payrollReducer(
        { ...initialState, loading: true },
        setError('Server error')
      )
      expect(state.error).toBe('Server error')
      expect(state.loading).toBe(false)
    })
  })

  // ─── setEmployees ────────────────────────────────────────────────────────────
  describe('setEmployees', () => {
    const employees = [
      { id: 1, name: 'Arun', role: 'Baker', salary: 15000 },
      { id: 2, name: 'Meena', role: 'Cashier', salary: 12000 },
    ]

    it('should set employees list', () => {
      const state = payrollReducer(initialState, setEmployees(employees))
      expect(state.employees).toEqual(employees)
    })

    it('should reset loading and error', () => {
      const prev = { ...initialState, loading: true, error: 'Old error' }
      const state = payrollReducer(prev, setEmployees(employees))
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should handle empty employee list', () => {
      const state = payrollReducer(initialState, setEmployees([]))
      expect(state.employees).toEqual([])
    })
  })

  // ─── setAttendance ───────────────────────────────────────────────────────────
  describe('setAttendance', () => {
    const attendance = [
      { id: 1, employeeId: 1, date: '2025-06-01', status: 'Present' },
      { id: 2, employeeId: 2, date: '2025-06-01', status: 'Absent' },
    ]

    it('should set attendance list', () => {
      const state = payrollReducer(initialState, setAttendance(attendance))
      expect(state.attendance).toEqual(attendance)
    })

    it('should turn off loading', () => {
      const prev = { ...initialState, loading: true }
      const state = payrollReducer(prev, setAttendance(attendance))
      expect(state.loading).toBe(false)
    })
  })

  // ─── setAdvances ─────────────────────────────────────────────────────────────
  describe('setAdvances', () => {
    const advances = [
      { id: 1, employeeId: 1, amount: 2000, date: '2025-06-10' },
      { id: 2, employeeId: 2, amount: 1500, date: '2025-06-12' },
    ]

    it('should set advances list', () => {
      const state = payrollReducer(initialState, setAdvances(advances))
      expect(state.advances).toEqual(advances)
    })

    it('should turn off loading', () => {
      const prev = { ...initialState, loading: true }
      const state = payrollReducer(prev, setAdvances(advances))
      expect(state.loading).toBe(false)
    })
  })

  // ─── removeAdvance ───────────────────────────────────────────────────────────
  describe('removeAdvance', () => {
    const advances = [
      { id: 1, amount: 2000 },
      { id: 2, amount: 1500 },
      { id: 3, amount: 3000 },
    ]

    it('should remove advance with matching id', () => {
      const state = payrollReducer({ ...initialState, advances }, removeAdvance(2))
      expect(state.advances).toHaveLength(2)
      expect(state.advances.find(a => a.id === 2)).toBeUndefined()
    })

    it('should keep remaining advances intact', () => {
      const state = payrollReducer({ ...initialState, advances }, removeAdvance(2))
      expect(state.advances[0].id).toBe(1)
      expect(state.advances[1].id).toBe(3)
    })

    it('should not change list if id not found', () => {
      const state = payrollReducer({ ...initialState, advances }, removeAdvance(999))
      expect(state.advances).toHaveLength(3)
    })

    it('should handle empty advances gracefully', () => {
      const state = payrollReducer(initialState, removeAdvance(1))
      expect(state.advances).toEqual([])
    })
  })

  // ─── setPayrolls ─────────────────────────────────────────────────────────────
  describe('setPayrolls', () => {
    const payrolls = [
      { id: 1, employeeId: 1, month: '2025-06', netPay: 13000 },
      { id: 2, employeeId: 2, month: '2025-06', netPay: 10500 },
    ]

    it('should set payrolls list', () => {
      const state = payrollReducer(initialState, setPayrolls(payrolls))
      expect(state.payrolls).toEqual(payrolls)
    })

    it('should turn off loading', () => {
      const prev = { ...initialState, loading: true }
      const state = payrollReducer(prev, setPayrolls(payrolls))
      expect(state.loading).toBe(false)
    })

    it('should handle empty payrolls list', () => {
      const state = payrollReducer(initialState, setPayrolls([]))
      expect(state.payrolls).toEqual([])
    })
  })
})
