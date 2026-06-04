import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  suppliers: [],
  purchases: [],
  stocks: [],
  loading: false,
  error: null,
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    // Loading
    setLoading: (state, action) => {
      state.loading = action.payload
    },

    // Error
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },

    // Suppliers
    setSuppliers: (state, action) => {
      state.suppliers = action.payload
      state.loading = false
      state.error = null
    },
    addSupplier: (state, action) => {
      state.suppliers.push(action.payload)
    },
    updateSupplier: (state, action) => {
      const index = state.suppliers.findIndex(
        s => s.id === action.payload.id
      )
      if (index !== -1) state.suppliers[index] = action.payload
    },
    removeSupplier: (state, action) => {
      state.suppliers = state.suppliers.filter(
        s => s.id !== action.payload
      )
    },

    // Purchases
    setPurchases: (state, action) => {
      state.purchases = action.payload
      state.loading = false
      state.error = null
    },
    addPurchase: (state, action) => {
      state.purchases.unshift(action.payload)
    },

    // Stocks
    setStocks: (state, action) => {
      state.stocks = action.payload
      state.loading = false
      state.error = null
    },
  },
})

export const {
  setLoading,
  setError,
  setSuppliers,
  addSupplier,
  updateSupplier,
  removeSupplier,
  setPurchases,
  addPurchase,
  setStocks,
} = inventorySlice.actions

export default inventorySlice.reducer