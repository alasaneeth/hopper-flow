import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./features/auth/LoginPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import Layout from "./components/common/Layout";
import SupplierPage from "./features/inventory/SupplierPage";
import PurchasePage from "./features/inventory/PurchasePage";
import StockPage from "./features/inventory/StockPage";
import ProductionPage from "./features/production/ProductionPage";
import PreparationPage from "./features/production/PreparationPage";
import CustomerPage from "./features/sales/CustomerPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <div className="text-white text-2xl font-semibold">
                  🎉 Welcome to HopperFlow!
                </div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/suppliers"
          element={
            <ProtectedRoute>
              <Layout>
                <SupplierPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/purchases"
          element={
            <ProtectedRoute>
              <Layout>
                <PurchasePage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/stocks"
          element={
            <ProtectedRoute>
              <Layout>
                <StockPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/preparation"
          element={
            <ProtectedRoute>
              <Layout>
                <PreparationPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/production"
          element={
            <ProtectedRoute>
              <Layout>
                <ProductionPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <Layout>
                <CustomerPage />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
