import { Box, Flex } from '@chakra-ui/react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <Flex minHeight="100vh">
      <Sidebar />
      <Box flex="1" ml={{ base: 0, md: '240px' }}>
        <Navbar />
        <Box p={6}>
          {children}
        </Box>
      </Box>
    </Flex>
  )
}

export default Layout