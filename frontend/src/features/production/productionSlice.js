import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  batches: [],
  preparations: [],
  doughStocks: [],
  loading: false,
  error: null,
}

const productionSlice = createSlice({
  name: 'production',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    setBatches: (state, action) => {
      state.batches = action.payload
      state.loading = false
      state.error = null
    },
    addBatch: (state, action) => {
      state.batches.unshift(action.payload)
    },
    removeBatch: (state, action) => {
      state.batches = state.batches.filter(b => b.id !== action.payload)
    },
    setPreparations: (state, action) => {
      state.preparations = action.payload
      state.loading = false
      state.error = null
    },
    removePreparation: (state, action) => {
      state.preparations = state.preparations.filter(
        p => p.id !== action.payload
      )
    },
    setDoughStocks: (state, action) => {
      state.doughStocks = action.payload
      state.loading = false
    },
  },
})

export const {
  setLoading, setError,
  setBatches, addBatch, removeBatch,
  setPreparations, removePreparation,
  setDoughStocks,
} = productionSlice.actions

export default productionSlice.reducer