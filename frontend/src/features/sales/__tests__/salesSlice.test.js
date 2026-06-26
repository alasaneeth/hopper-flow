import salesReducer, {
  setLoading,
  setError,
  setCustomers,
  removeCustomer,
  setOrders,
  removeOrder,
} from '../salesSlice'

const initialState = {
  customers: [],
  orders: [],
  loading: false,
  error: null,
}

describe('salesSlice', () => {
  // ─── Initial State ───────────────────────────────────────────────────────────
  it('should return initial state for unknown action', () => {
    const state = salesReducer(undefined, { type: 'unknown' })
    expect(state).toEqual(initialState)
  })

  // ─── setLoading ──────────────────────────────────────────────────────────────
  describe('setLoading', () => {
    it('should set loading to true', () => {
      const state = salesReducer(initialState, setLoading(true))
      expect(state.loading).toBe(true)
    })

    it('should set loading to false', () => {
      const state = salesReducer({ ...initialState, loading: true }, setLoading(false))
      expect(state.loading).toBe(false)
    })
  })

  // ─── setError ────────────────────────────────────────────────────────────────
  describe('setError', () => {
    it('should set error message and reset loading', () => {
      const state = salesReducer(
        { ...initialState, loading: true },
        setError('Something went wrong')
      )
      expect(state.error).toBe('Something went wrong')
      expect(state.loading).toBe(false)
    })
  })

  // ─── setCustomers ────────────────────────────────────────────────────────────
  describe('setCustomers', () => {
    const customers = [
      { id: 1, name: 'Ravi Kumar', phone: '9876543210' },
      { id: 2, name: 'Priya Sharma', phone: '9123456780' },
    ]

    it('should set customers array', () => {
      const state = salesReducer(initialState, setCustomers(customers))
      expect(state.customers).toEqual(customers)
    })

    it('should reset loading and error after setting customers', () => {
      const prevState = { ...initialState, loading: true, error: 'Old error' }
      const state = salesReducer(prevState, setCustomers(customers))
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })

    it('should handle empty customer list', () => {
      const state = salesReducer(initialState, setCustomers([]))
      expect(state.customers).toEqual([])
    })
  })

  // ─── removeCustomer ──────────────────────────────────────────────────────────
  describe('removeCustomer', () => {
    const customers = [
      { id: 1, name: 'Ravi Kumar' },
      { id: 2, name: 'Priya Sharma' },
      { id: 3, name: 'Anbu Selvan' },
    ]

    it('should remove the customer with matching id', () => {
      const state = salesReducer({ ...initialState, customers }, removeCustomer(2))
      expect(state.customers).toHaveLength(2)
      expect(state.customers.find(c => c.id === 2)).toBeUndefined()
    })

    it('should not change state if id does not match', () => {
      const state = salesReducer({ ...initialState, customers }, removeCustomer(99))
      expect(state.customers).toHaveLength(3)
    })

    it('should handle empty array gracefully', () => {
      const state = salesReducer(initialState, removeCustomer(1))
      expect(state.customers).toEqual([])
    })
  })

  // ─── setOrders ───────────────────────────────────────────────────────────────
  describe('setOrders', () => {
    const orders = [
      { id: 101, customerId: 1, total: 500 },
      { id: 102, customerId: 2, total: 1200 },
    ]

    it('should set orders array', () => {
      const state = salesReducer(initialState, setOrders(orders))
      expect(state.orders).toEqual(orders)
    })

    it('should reset loading and error after setting orders', () => {
      const prevState = { ...initialState, loading: true, error: 'Fetch failed' }
      const state = salesReducer(prevState, setOrders(orders))
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  // ─── removeOrder ─────────────────────────────────────────────────────────────
  describe('removeOrder', () => {
    const orders = [
      { id: 101, customerId: 1 },
      { id: 102, customerId: 2 },
    ]

    it('should remove the order with matching id', () => {
      const state = salesReducer({ ...initialState, orders }, removeOrder(101))
      expect(state.orders).toHaveLength(1)
      expect(state.orders.find(o => o.id === 101)).toBeUndefined()
    })

    it('should leave orders intact if id not found', () => {
      const state = salesReducer({ ...initialState, orders }, removeOrder(999))
      expect(state.orders).toHaveLength(2)
    })
  })
})
