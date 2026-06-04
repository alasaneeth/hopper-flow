import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/authSlice'
import inventoryReducer from '../features/inventory/inventorySlice'
import themeReducer from '../store/themeSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    inventory: inventoryReducer,
    theme: themeReducer,
  },
})

export default store