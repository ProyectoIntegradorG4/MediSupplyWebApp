import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Login from './pages/Login'
import Products from './pages/Products'

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
          <Route path="/products" element={<Products />} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Box>
    </Router>
  )
}

export default App