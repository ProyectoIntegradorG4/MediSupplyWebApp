import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Spinner,
  Center,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  HStack,
  VStack,
  Button,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { useTranslation } from 'react-i18next'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
} from 'chart.js'
import { dashboardApi } from '../services/api'

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
)

function Dashboard() {
  const { t } = useTranslation()

  // Estado para fechas - por defecto últimas 3 meses
  const today = new Date()
  const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate())

  const [dateFrom, setDateFrom] = useState(threeMonthsAgo.toISOString().split('T')[0])
  const [dateTo, setDateTo] = useState(today.toISOString().split('T')[0])

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['salesDashboard', dateFrom, dateTo],
    queryFn: () => dashboardApi.getSalesDashboard(dateFrom, dateTo),
    enabled: !!dateFrom && !!dateTo,
  })

  const handleFilter = () => {
    refetch()
  }

  const handleReset = () => {
    setDateFrom(threeMonthsAgo.toISOString().split('T')[0])
    setDateTo(today.toISOString().split('T')[0])
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('es-CO').format(value)
  }

  const getTrendIcon = (tendencia: 'up' | 'down' | 'neutral') => {
    switch (tendencia) {
      case 'up':
        return '📈'
      case 'down':
        return '📉'
      default:
        return '➡️'
    }
  }

  // Mapear labels del backend a claves de traducción
  const translateKPILabel = (label: string): string => {
    const labelMap: Record<string, string> = {
      'Ventas Totales': t('dashboard.totalSales'),
      'Unidades Vendidas': t('dashboard.unitsSold'),
      'Total Pedidos': t('dashboard.totalOrders'),
      'Cumplimiento Promedio': t('dashboard.averageCompletion'),
      // Agregar más mapeos si el backend envía otros labels
    }
    return labelMap[label] || label
  }

  // Traducir unidades
  const translateUnit = (unit: string): string => {
    const unitMap: Record<string, string> = {
      'COP': 'COP',
      'unidades': t('dashboard.units'),
      'pedidos': t('dashboard.orders'),
      '%': '%',
    }
    return unitMap[unit] || unit
  }

  const chartOptions: ChartOptions<'line' | 'bar'> = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Encabezado */}
      <Box mb={8}>
        <Heading size="lg" mb={6} color="medisupply.300">
          {t('dashboard.salesDashboard')}
        </Heading>

        {/* Selector de fechas */}
        <Box bg="white" p={6} borderRadius="lg" shadow="sm" border="1px" borderColor="medisupply.50" mb={6}>
          <FormControl>
            <HStack spacing={4} justify="flex-start">
              <Box flex={1}>
                <FormLabel fontSize="sm" fontWeight="bold">{t('dashboard.from')}</FormLabel>
                <Input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                />
              </Box>
              <Box flex={1}>
                <FormLabel fontSize="sm" fontWeight="bold">{t('dashboard.to')}</FormLabel>
                <Input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                />
              </Box>
              <VStack spacing={2} justify="flex-end">
                <Button colorScheme="blue" onClick={handleFilter} isDisabled={isLoading}>
                  {t('dashboard.filter')}
                </Button>
                <Button variant="outline" onClick={handleReset}>
                  {t('dashboard.reset')}
                </Button>
              </VStack>
            </HStack>
          </FormControl>
        </Box>
      </Box>

      {/* Estado de carga y errores */}
      {isLoading && (
        <Center py={10}>
          <Spinner size="lg" color="medisupply.300" thickness="4px" />
        </Center>
      )}

      {isError && (
        <Alert
          status="error"
          variant="subtle"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          height="200px"
          mb={6}
          borderRadius="lg"
        >
          <AlertIcon boxSize="40px" mr={0} />
          <AlertTitle mt={4} mb={1} fontSize="lg">
            {t('dashboard.errorLoadingData')}
          </AlertTitle>
          <AlertDescription maxWidth="sm">
            {error instanceof Error ? error.message : t('common.error')}
          </AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && data && (
        <>
          {/* KPIs */}
          <Box mb={8}>
            <Heading size="md" mb={4} color="medisupply.200">
              {t('dashboard.kpis')}
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
              {data.kpis.map((kpi, index) => (
                <Box
                  key={index}
                  p={6}
                  bg="white"
                  borderRadius="lg"
                  shadow="sm"
                  border="1px"
                  borderColor="medisupply.50"
                >
                  <HStack justify="space-between" mb={2}>
                    <Text fontSize="sm" color="medisupply.200" fontWeight="bold">
                      {translateKPILabel(kpi.label)}
                    </Text>
                    <Text fontSize="lg">{getTrendIcon(kpi.tendencia)}</Text>
                  </HStack>
                  <Text fontSize="2xl" fontWeight="bold" color="medisupply.300" mb={2}>
                    {kpi.unidad === 'COP' ? formatCurrency(kpi.valor) : formatNumber(kpi.valor)}
                  </Text>
                  <Text fontSize="xs" color="gray.500">
                    {translateUnit(kpi.unidad)}
                    {kpi.variacion !== null && ` (${kpi.variacion > 0 ? '+' : ''}${kpi.variacion}%)`}
                  </Text>
                </Box>
              ))}
            </SimpleGrid>
          </Box>

          {/* Gráficos */}
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6} mb={8}>
            {/* Gráfico de Tendencia (Line Chart) */}
            {data.grafico_tendencia.datasets.length > 0 && (
              <Box p={6} bg="white" borderRadius="lg" shadow="sm" border="1px" borderColor="medisupply.50">
                <Heading size="sm" mb={4} color="medisupply.200">
                  {t('dashboard.salesTrend')}
                </Heading>
                <Box height="300px">
                  <Line
                    data={data.grafico_tendencia as any}
                    options={chartOptions as ChartOptions<'line'>}
                  />
                </Box>
              </Box>
            )}

            {/* Gráfico de Vendedores (Bar Chart) */}
            {data.grafico_vendedores.datasets.length > 0 && (
              <Box p={6} bg="white" borderRadius="lg" shadow="sm" border="1px" borderColor="medisupply.50">
                <Heading size="sm" mb={4} color="medisupply.200">
                  {t('dashboard.sellerPerformance')}
                </Heading>
                <Box height="300px">
                  <Bar
                    data={data.grafico_vendedores as any}
                    options={chartOptions as ChartOptions<'bar'>}
                  />
                </Box>
              </Box>
            )}
          </SimpleGrid>

          {/* Gráfico de Cumplimiento (si tiene datos) */}
          {data.grafico_cumplimiento.datasets[0]?.data.length > 0 && (
            <Box p={6} bg="white" borderRadius="lg" shadow="sm" border="1px" borderColor="medisupply.50" mb={8}>
              <Heading size="sm" mb={4} color="medisupply.200">
                {t('dashboard.completionRate')}
              </Heading>
              <Box height="300px">
                <Bar
                  data={data.grafico_cumplimiento as any}
                  options={chartOptions as ChartOptions<'bar'>}
                />
              </Box>
            </Box>
          )}

          {/* Tabla de Top Vendedores */}
          {data.top_vendedores.length > 0 && (
            <Box mb={8} p={6} bg="white" borderRadius="lg" shadow="sm" border="1px" borderColor="medisupply.50">
              <Heading size="sm" mb={4} color="medisupply.200">
                {t('dashboard.topSellers')}
              </Heading>
              <Box overflowX="auto">
                <Table variant="simple" size="sm">
                  <Thead>
                    <Tr bg="gray.50">
                      <Th>{t('dashboard.position')}</Th>
                      <Th>{t('dashboard.seller')}</Th>
                      <Th isNumeric>{t('dashboard.sales')} (COP)</Th>
                      <Th isNumeric>{t('dashboard.units')}</Th>
                      <Th isNumeric>{t('dashboard.orders')}</Th>
                      <Th isNumeric>{t('dashboard.completion')} (%)</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {data.top_vendedores.map((vendedor, idx) => (
                      <Tr key={vendedor.vendedorId} bg={idx % 2 === 1 ? 'gray.50' : 'white'}>
                        <Td>
                          <Badge colorScheme="blue" fontSize="md">
                            {vendedor.posicion}
                          </Badge>
                        </Td>
                        <Td fontWeight="bold">{vendedor.nombre}</Td>
                        <Td isNumeric>{formatCurrency(vendedor.ventas_valor)}</Td>
                        <Td isNumeric>{formatNumber(vendedor.ventas_unidades)}</Td>
                        <Td isNumeric>{formatNumber(vendedor.pedidos)}</Td>
                        <Td isNumeric>
                          {vendedor.cumplimiento_valor !== null
                            ? `${vendedor.cumplimiento_valor.toFixed(1)}%`
                            : '—'}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </Box>
            </Box>
          )}

          {/* Alertas */}
          {data.alertas.length > 0 && (
            <Box>
              <Heading size="sm" mb={4} color="medisupply.200">
                {t('dashboard.alerts')}
              </Heading>
              <VStack spacing={3}>
                {data.alertas.map((alerta, idx) => (
                  <Alert
                    key={idx}
                    status="warning"
                    variant="subtle"
                    borderRadius="lg"
                  >
                    <AlertIcon />
                    <Box>
                      <AlertTitle>{alerta}</AlertTitle>
                    </Box>
                  </Alert>
                ))}
              </VStack>
            </Box>
          )}

          {data.alertas.length === 0 && (
            <Box p={4} bg="green.50" borderRadius="lg" border="1px" borderColor="green.200">
              <Text color="green.800" fontWeight="bold">
                ✅ {t('dashboard.noAlerts')}
              </Text>
            </Box>
          )}
        </>
      )}
    </Container>
  )
}

export default Dashboard