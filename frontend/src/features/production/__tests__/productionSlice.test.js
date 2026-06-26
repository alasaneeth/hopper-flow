import productionReducer, {
  setLoading,
  setError,
  setBatches,
  addBatch,
  removeBatch,
  setPreparations,
  removePreparation,
  setDoughStocks,
} from '../productionSlice'

const initialState = {
  batches: [],
  preparations: [],
  doughStocks: [],
  loading: false,
  error: null,
}

describe('productionSlice', () => {
  // ─── Initial State ───────────────────────────────────────────────────────────
  it('should return initial state for unknown action', () => {
    const state = productionReducer(undefined, { type: 'unknown' })
    expect(state).toEqual(initialState)
  })

  // ─── setLoading ──────────────────────────────────────────────────────────────
  describe('setLoading', () => {
    it('should set loading to true', () => {
      const state = productionReducer(initialState, setLoading(true))
      expect(state.loading).toBe(true)
    })

    it('should set loading to false', () => {
      const state = productionReducer({ ...initialState, loading: true }, setLoading(false))
      expect(state.loading).toBe(false)
    })
  })

  // ─── setError ────────────────────────────────────────────────────────────────
  describe('setError', () => {
    it('should set error and reset loading', () => {
      const state = productionReducer(
        { ...initialState, loading: true },
        setError('Production fetch failed')
      )
      expect(state.error).toBe('Production fetch failed')
      expect(state.loading).toBe(false)
    })
  })

  // ─── Batches ─────────────────────────────────────────────────────────────────
  describe('setBatches', () => {
    const batches = [
      { id: 1, product: 'White Bread', quantity: 100, date: '2025-06-01' },
      { id: 2, product: 'Brown Bread', quantity: 50, date: '2025-06-01' },
    ]

    it('should set batches list', () => {
      const state = productionReducer(initialState, setBatches(batches))
      expect(state.batches).toEqual(batches)
    })

    it('should reset loading and error', () => {
      const prev = { ...initialState, loading: true, error: 'Old error' }
      const state = productionReducer(prev, setBatches(batches))
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('addBatch', () => {
    it('should prepend new batch to the front of the list', () => {
      const existing = [{ id: 1, product: 'White Bread' }]
      const newBatch = { id: 2, product: 'Bun' }
      const state = productionReducer(
        { ...initialState, batches: existing },
        addBatch(newBatch)
      )
      expect(state.batches[0]).toEqual(newBatch)
      expect(state.batches).toHaveLength(2)
    })

    it('should unshift into empty batches list', () => {
      const state = productionReducer(initialState, addBatch({ id: 1, product: 'Roti' }))
      expect(state.batches).toHaveLength(1)
      expect(state.batches[0].product).toBe('Roti')
    })
  })

  describe('removeBatch', () => {
    const batches = [
      { id: 1, product: 'White Bread' },
      { id: 2, product: 'Brown Bread' },
      { id: 3, product: 'Bun' },
    ]

    it('should remove batch with matching id', () => {
      const state = productionReducer({ ...initialState, batches }, removeBatch(2))
      expect(state.batches).toHaveLength(2)
      expect(state.batches.find(b => b.id === 2)).toBeUndefined()
    })

    it('should keep other batches intact after removal', () => {
      const state = productionReducer({ ...initialState, batches }, removeBatch(2))
      expect(state.batches[0].id).toBe(1)
      expect(state.batches[1].id).toBe(3)
    })

    it('should not change list if id not found', () => {
      const state = productionReducer({ ...initialState, batches }, removeBatch(999))
      expect(state.batches).toHaveLength(3)
    })

    it('should handle empty batches gracefully', () => {
      const state = productionReducer(initialState, removeBatch(1))
      expect(state.batches).toEqual([])
    })
  })

  // ─── Preparations ────────────────────────────────────────────────────────────
  describe('setPreparations', () => {
    const preparations = [
      { id: 1, item: 'Dough Mix A', quantity: 30 },
      { id: 2, item: 'Dough Mix B', quantity: 20 },
    ]

    it('should set preparations list', () => {
      const state = productionReducer(initialState, setPreparations(preparations))
      expect(state.preparations).toEqual(preparations)
    })

    it('should reset loading and error', () => {
      const prev = { ...initialState, loading: true, error: 'Failed' }
      const state = productionReducer(prev, setPreparations(preparations))
      expect(state.loading).toBe(false)
      expect(state.error).toBeNull()
    })
  })

  describe('removePreparation', () => {
    const preparations = [
      { id: 1, item: 'Dough A' },
      { id: 2, item: 'Dough B' },
    ]

    it('should remove preparation with matching id', () => {
      const state = productionReducer(
        { ...initialState, preparations },
        removePreparation(1)
      )
      expect(state.preparations).toHaveLength(1)
      expect(state.preparations.find(p => p.id === 1)).toBeUndefined()
    })

    it('should not change list if id not found', () => {
      const state = productionReducer(
        { ...initialState, preparations },
        removePreparation(99)
      )
      expect(state.preparations).toHaveLength(2)
    })
  })

  // ─── DoughStocks ─────────────────────────────────────────────────────────────
  describe('setDoughStocks', () => {
    const doughStocks = [
      { id: 1, type: 'White Dough', kg: 50 },
      { id: 2, type: 'Wheat Dough', kg: 30 },
    ]

    it('should set doughStocks list', () => {
      const state = productionReducer(initialState, setDoughStocks(doughStocks))
      expect(state.doughStocks).toEqual(doughStocks)
    })

    it('should turn off loading', () => {
      const prev = { ...initialState, loading: true }
      const state = productionReducer(prev, setDoughStocks(doughStocks))
      expect(state.loading).toBe(false)
    })

    it('should handle empty dough stocks', () => {
      const state = productionReducer(initialState, setDoughStocks([]))
      expect(state.doughStocks).toEqual([])
    })
  })
})
