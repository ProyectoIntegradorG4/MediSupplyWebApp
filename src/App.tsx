import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Box } from '@chakra-ui/react'
import Login from './pages/Login'
import Products from './pages/Products'

function App() {
  return (
    <Router>
      <Box minH="100vh" bg="gray.50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/products" element={<Products />} />
          <Route path="/" element={<Navigate to="/products" />} />
        </Routes>
      </Box>
    </Router>
  )
}

export default App