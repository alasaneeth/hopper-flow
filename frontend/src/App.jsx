import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './features/auth/LoginPage'
import ProtectedRoute from './routes/ProtectedRoute'
import Layout from './components/common/Layout'
import SupplierPage from './features/inventory/SupplierPage'
import PurchasePage from './features/inventory/PurchasePage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={
          <ProtectedRoute>
            <Layout>
              <div className="text-white text-2xl font-semibold">
                🎉 Welcome to HopperFlow!
              </div>
            </Layout>
          </ProtectedRoute>
        } />
        <Route path="/suppliers" element={
          <ProtectedRoute>
            <Layout><SupplierPage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="/purchases" element={
          <ProtectedRoute>
            <Layout><PurchasePage /></Layout>
          </ProtectedRoute>
        } />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App