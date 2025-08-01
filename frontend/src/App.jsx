import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import ProductsPage from './pages/ProductsPage'
import Layout from './components/Layout'

const isAuthenticated = () => !!localStorage.getItem('token')

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={isAuthenticated() ? '/products' : '/login'} />}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/products"
        element={
          isAuthenticated() ? (
            <Layout>
              <ProductsPage />
            </Layout>
          ) : (
            <Navigate to="/login" />
          )
        }
      />
    </Routes>
  )
}

export default App
