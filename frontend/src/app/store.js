import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Sprint 2 — inventory: inventoryReducer,
    // Sprint 3 — production: productionReducer,
    // Sprint 4 — sales: salesReducer,
    // Sprint 5 — payroll: payrollReducer,
  },
})

export default store