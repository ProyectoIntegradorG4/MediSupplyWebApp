import { Box, Flex, Heading, Spacer } from '@chakra-ui/react'

function Navbar() {
  return (
    <Box bg="medisupply.200" px={4} py={3} boxShadow="sm">
      <Flex alignItems="center">
        <Heading size="md" color="medisupply.50">MediSupply</Heading>
        <Spacer />
      </Flex>
    </Box>
  )
}

export default Navbar