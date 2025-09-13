import { Box, Container } from '@chakra-ui/react'
import Navbar from './Navbar'

interface LayoutProps {
  children: React.ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <Box>
      <Navbar />
      <Container maxW="container.xl" py={6}>
        {children}
      </Container>
    </Box>
  )
}

export default Layout