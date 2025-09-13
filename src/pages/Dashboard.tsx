import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react'

function Dashboard() {
  return (
    <Box>
      <Heading mb={6} color="medisupply.300">Dashboard</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Stat
          p={6}
          bg="white"
          borderRadius="lg"
          shadow="sm"
          border="1px"
          borderColor="medisupply.50"
        >
          <StatLabel color="medisupply.200">Total Items</StatLabel>
          <StatNumber color="medisupply.300">1,024</StatNumber>
          <StatHelpText color="medisupply.100">In inventory</StatHelpText>
        </Stat>
        <Stat
          p={6}
          bg="white"
          borderRadius="lg"
          shadow="sm"
          border="1px"
          borderColor="medisupply.50"
        >
          <StatLabel color="medisupply.200">Low Stock Items</StatLabel>
          <StatNumber color="medisupply.300">12</StatNumber>
          <StatHelpText color="medisupply.100">Below minimum threshold</StatHelpText>
        </Stat>
        <Stat
          p={6}
          bg="white"
          borderRadius="lg"
          shadow="sm"
          border="1px"
          borderColor="medisupply.50"
        >
          <StatLabel color="medisupply.200">Pending Orders</StatLabel>
          <StatNumber color="medisupply.300">8</StatNumber>
          <StatHelpText color="medisupply.100">Awaiting processing</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  )
}

export default Dashboard