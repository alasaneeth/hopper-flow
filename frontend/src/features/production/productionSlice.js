import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  batches: [],
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
  },
})

export const {
  setLoading, setError, setBatches, addBatch, removeBatch
} = productionSlice.actions

export default productionSlice.reducer