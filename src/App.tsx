import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Layout from './components/Layout'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Products from './pages/Products'
import Providers from './pages/Providers'
import Delivery from './pages/Delivery'
import People from './pages/People'
import Reports from './pages/Reports'

// Health check component for AWS ECS
function HealthCheck() {
  return (
    <Box p={4} textAlign="center">
      <h1>OK</h1>
      <p>MediSupply Web App is running</p>
    </Box>
  )
}

function App() {
  return (
    <Router>
      <Box minH="100vh" bg="gray.50">
        <Routes>
          <Route path="/health" element={<HealthCheck />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/products" element={<Layout><Products /></Layout>} />
          <Route path="/providers" element={<Layout><Providers /></Layout>} />
          <Route path="/delivery" element={<Layout><Delivery /></Layout>} />
          <Route path="/people" element={<Layout><People /></Layout>} />
          <Route path="/reports" element={<Layout><Reports /></Layout>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Box>
    </Router>
  )
}

export default App