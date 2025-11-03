import { Box, useDisclosure } from '@chakra-ui/react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box minHeight="100vh">
      <Navbar onMenuClick={onOpen} />
      <Sidebar isOpen={isOpen} onClose={onClose} />
      <Box p={6}>
        {children}
      </Box>
    </Box>
  )
}

export default Layout