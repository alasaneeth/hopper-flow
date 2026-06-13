import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  customers: [],
  orders: [],
  loading: false,
  error: null,
}

const salesSlice = createSlice({
  name: 'sales',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    setCustomers: (state, action) => {
      state.customers = action.payload
      state.loading = false
      state.error = null
    },
    removeCustomer: (state, action) => {
      state.customers = state.customers.filter(c => c.id !== action.payload)
    },
    setOrders: (state, action) => {
      state.orders = action.payload
      state.loading = false
      state.error = null
    },
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(o => o.id !== action.payload)
    },
  },
})

export const {
  setLoading, setError,
  setCustomers, removeCustomer,
  setOrders, removeOrder,
} = salesSlice.actions

export default salesSlice.reducer