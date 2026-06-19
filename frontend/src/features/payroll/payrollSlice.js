import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  employees: [],
  attendance: [],
  advances: [],
  payrolls: [],
  loading: false,
  error: null,
}

const payrollSlice = createSlice({
  name: 'payroll',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    setEmployees: (state, action) => {
      state.employees = action.payload
      state.loading = false
      state.error = null
    },
    setAttendance: (state, action) => {
      state.attendance = action.payload
      state.loading = false
    },
    setAdvances: (state, action) => {
      state.advances = action.payload
      state.loading = false
    },
    removeAdvance: (state, action) => {
      state.advances = state.advances.filter(a => a.id !== action.payload)
    },
    setPayrolls: (state, action) => {
      state.payrolls = action.payload
      state.loading = false
    },
  },
})

export const {
  setLoading, setError,
  setEmployees,
  setAttendance,
  setAdvances, removeAdvance,
  setPayrolls,
} = payrollSlice.actions

export default payrollSlice.reducer