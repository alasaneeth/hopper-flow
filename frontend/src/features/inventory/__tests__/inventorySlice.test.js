import inventoryReducer, {
  setLoading,
  setError,
  setSuppliers,
  addSupplier,
  updateSupplier,
  removeSupplier,
  setPurchases,
  addPurchase,
  setStocks,
} from '../inventorySlice'

const initialState = {
  suppliers: [],
  purchases: [],
  stocks: [],
  loading: false,
  error: null,
}

describe('inventorySlice', () => {
  // ─── Initial State ───────────────────────────────────────────────────────────
  it('should return initial state for unknown action', () => {
    const state = inventoryReducer(undefined, { type: 'unknown' })
    expect(state).toEqual(initialState)
  })

  // ─── setLoading ──────────────────────────────────────────────────────────────
  describe('setLoading', () => {
    it('should set loading to true', () => {
      const state = inventoryReducer(initialState, setLoading(true))
      expect(state.loading).toBe(true)
    })

    it('should set loading to false', () => {
      const state = inventoryReducer({ ...initialState, loading: true }, setLoading(false))
      expect(state.loading).toBe(false)
    })
  })

  // ─── setError ────────────────────────────────────────────────────────────────
  describe('setError', () => {
    it('should set error and reset loading', () => {
      const state = inventoryReducer(
        { ...initialState, loading: true },
        setError('Network error')
      )
      expect(state.error).toBe('Network error')
      expect(state.loading).toBe(false)
    })
  })

  // ─── Suppliers ───────────────────────────────────────────────────────────────
  describe('setSuppliers', () => {
    const suppliers = [
      { id: 1, name: 'Sri Murugan Traders', city: 'Coimbatore' },
      { id: 2, name: 'Lakshmi Stores', city: 'Chennai' },
    ]

    it('should set suppliers list', () => {
      const state = inventoryReducer(initialState, setSuppliers(suppliers))
      expect(state.suppliers).toEqual(suppliers)
    })

    it('should clear loading and error', () => {
      const prev = { ...initialState, loading: true, error: 'Old error' }
      const state = inventoryReducer(prev, setSuppliers(suppliers))
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('addSupplier', () => {
    it('should append new supplier to the list', () => {
      const existing = [{ id: 1, name: 'A Traders' }]
      const newSupplier = { id: 2, name: 'B Traders' }
      const state = inventoryReducer(
        { ...initialState, suppliers: existing },
        addSupplier(newSupplier)
      )
      expect(state.suppliers).toHaveLength(2)
      expect(state.suppliers[1]).toEqual(newSupplier)
    })

    it('should work on empty suppliers list', () => {
      const state = inventoryReducer(initialState, addSupplier({ id: 1, name: 'New' }))
      expect(state.suppliers).toHaveLength(1)
    })
  })

  describe('updateSupplier', () => {
    const suppliers = [
      { id: 1, name: 'Old Name', city: 'Chennai' },
      { id: 2, name: 'Another', city: 'Madurai' },
    ]

    it('should update supplier with matching id', () => {
      const updated = { id: 1, name: 'New Name', city: 'Trichy' }
      const state = inventoryReducer(
        { ...initialState, suppliers },
        updateSupplier(updated)
      )
      expect(state.suppliers[0]).toEqual(updated)
      expect(state.suppliers[1]).toEqual(suppliers[1]) // unchanged
    })

    it('should not modify list if id not found', () => {
      const state = inventoryReducer(
        { ...initialState, suppliers },
        updateSupplier({ id: 99, name: 'Ghost' })
      )
      expect(state.suppliers).toEqual(suppliers)
    })
  })

  describe('removeSupplier', () => {
    const suppliers = [
      { id: 1, name: 'A' },
      { id: 2, name: 'B' },
      { id: 3, name: 'C' },
    ]

    it('should remove supplier with matching id', () => {
      const state = inventoryReducer({ ...initialState, suppliers }, removeSupplier(2))
      expect(state.suppliers).toHaveLength(2)
      expect(state.suppliers.find(s => s.id === 2)).toBeUndefined()
    })

    it('should not change list if id does not match', () => {
      const state = inventoryReducer({ ...initialState, suppliers }, removeSupplier(99))
      expect(state.suppliers).toHaveLength(3)
    })
  })

  // ─── Purchases ───────────────────────────────────────────────────────────────
  describe('setPurchases', () => {
    const purchases = [
      { id: 1, supplierId: 1, amount: 5000 },
      { id: 2, supplierId: 2, amount: 3000 },
    ]

    it('should set purchases list', () => {
      const state = inventoryReducer(initialState, setPurchases(purchases))
      expect(state.purchases).toEqual(purchases)
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('addPurchase', () => {
    it('should prepend new purchase to the front of the list', () => {
      const existing = [{ id: 1, amount: 1000 }]
      const newPurchase = { id: 2, amount: 2000 }
      const state = inventoryReducer(
        { ...initialState, purchases: existing },
        addPurchase(newPurchase)
      )
      expect(state.purchases[0]).toEqual(newPurchase)
      expect(state.purchases).toHaveLength(2)
    })

    it('should unshift into empty purchases list', () => {
      const state = inventoryReducer(initialState, addPurchase({ id: 1, amount: 500 }))
      expect(state.purchases).toHaveLength(1)
    })
  })

  // ─── Stocks ──────────────────────────────────────────────────────────────────
  describe('setStocks', () => {
    const stocks = [
      { id: 1, itemName: 'Flour', quantity: 200 },
      { id: 2, itemName: 'Sugar', quantity: 100 },
    ]

    it('should set stocks list', () => {
      const state = inventoryReducer(initialState, setStocks(stocks))
      expect(state.stocks).toEqual(stocks)
      expect(state.loading).toBe(false)
    })

    it('should handle empty stocks', () => {
      const state = inventoryReducer(initialState, setStocks([]))
      expect(state.stocks).toEqual([])
    })
  })
})
