import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './features/auth/LoginPage'
import ProtectedRoute from './routes/ProtectedRoute'
import SupplierPage from './features/inventory/SupplierPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/suppliers" element={
          <ProtectedRoute>
            <SupplierPage />
          </ProtectedRoute>
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <div className="p-8 text-2xl font-bold text-green-600">
              🎉 Welcome to HopperFlow!
            </div>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App