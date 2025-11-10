import { Box, Heading, SimpleGrid, Stat, StatLabel, StatNumber, StatHelpText } from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'

function Dashboard() {
  const { t } = useTranslation();
  return (
    <Box>
      <Heading mb={6} color="medisupply.300">{t('dashboard.title')}</Heading>
      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
        <Stat
          p={6}
          bg="white"
          borderRadius="lg"
          shadow="sm"
          border="1px"
          borderColor="medisupply.50"
        >
          <StatLabel color="medisupply.200">{t('dashboard.totalItems')}</StatLabel>
          <StatNumber color="medisupply.300">{t('dashboard.totalItemsValue')}</StatNumber>
          <StatHelpText color="medisupply.100">{t('dashboard.inInventory')}</StatHelpText>
        </Stat>
        <Stat
          p={6}
          bg="white"
          borderRadius="lg"
          shadow="sm"
          border="1px"
          borderColor="medisupply.50"
        >
          <StatLabel color="medisupply.200">{t('dashboard.lowStockItems')}</StatLabel>
          <StatNumber color="medisupply.300">{t('dashboard.lowStockItemsValue')}</StatNumber>
          <StatHelpText color="medisupply.100">{t('dashboard.belowMinimumThreshold')}</StatHelpText>
        </Stat>
        <Stat
          p={6}
          bg="white"
          borderRadius="lg"
          shadow="sm"
          border="1px"
          borderColor="medisupply.50"
        >
          <StatLabel color="medisupply.200">{t('dashboard.pendingOrders')}</StatLabel>
          <StatNumber color="medisupply.300">{t('dashboard.pendingOrdersValue')}</StatNumber>
          <StatHelpText color="medisupply.100">{t('dashboard.awaitingProcessing')}</StatHelpText>
        </Stat>
      </SimpleGrid>
    </Box>
  )
}

export default Dashboard