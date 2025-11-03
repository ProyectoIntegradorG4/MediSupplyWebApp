import { Box, Flex, Heading, Spacer } from '@chakra-ui/react'

function Navbar() {
  return (
    <Box bg="blue.500" px={6} py={4} boxShadow="sm">
      <Flex alignItems="center">
        <Heading size="md" color="white">MediSupply</Heading>
        <Spacer />
      </Flex>
    </Box>
  )
}

export default Navbar