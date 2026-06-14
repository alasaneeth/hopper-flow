import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import inventoryReducer from '../features/inventory/inventorySlice'
import themeReducer from '../store/themeSlice'
import productionReducer from '../features/production/productionSlice'
import salesReducer from '../features/sales/salesSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    theme: themeReducer,
    production: productionReducer,
     sales: salesReducer,
  },
})

export default store