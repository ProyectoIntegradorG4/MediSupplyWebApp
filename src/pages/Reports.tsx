import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  TabIndicator,
  Spinner,
  Center,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  HStack,
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
  Select,
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
import { reportsApi } from '../services/api'

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

const Reports = () => {
  const { t } = useTranslation()

  // Estado para fechas - últimas 3 meses por defecto
  const today = new Date()
  const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate())

  // Tab KPI Vendedor
  const [sellerDateFrom, setSellerDateFrom] = useState(threeMonthsAgo.toISOString().split('T')[0])
  const [sellerDateTo, setSellerDateTo] = useState(today.toISOString().split('T')[0])
  const [selectedSeller, setSelectedSeller] = useState('3')
  const [sellerTerritory, setSellerTerritory] = useState('')
  const [sellerProduct, setSellerProduct] = useState('')

  // Tab Reporte Regional
  const [regionDateFrom, setRegionDateFrom] = useState(threeMonthsAgo.toISOString().split('T')[0])
  const [regionDateTo, setRegionDateTo] = useState(today.toISOString().split('T')[0])
  const [selectedRegion, setSelectedRegion] = useState('TERR-NORTE-BOG')
  const [regionProduct, setRegionProduct] = useState('')

  // Tab Resumen Rápido
  const [summaryDateFrom, setSummaryDateFrom] = useState(threeMonthsAgo.toISOString().split('T')[0])
  const [summaryDateTo, setSummaryDateTo] = useState(today.toISOString().split('T')[0])
  const [summarySeller, setSummarySeller] = useState('5')

  // Queries
  const { data: sellerKPI, isLoading: sellerLoading, isError: sellerError, refetch: refetchSeller } = useQuery({
    queryKey: ['sellerKPI', selectedSeller, sellerDateFrom, sellerDateTo, sellerTerritory, sellerProduct],
    queryFn: () => reportsApi.getSellerKPI(selectedSeller, sellerDateFrom, sellerDateTo, sellerTerritory, sellerProduct),
    enabled: !!selectedSeller && !!sellerDateFrom && !!sellerDateTo,
  })

  const { data: regionReport, isLoading: regionLoading, isError: regionError, refetch: refetchRegion } = useQuery({
    queryKey: ['regionReport', selectedRegion, regionDateFrom, regionDateTo, regionProduct],
    queryFn: () => reportsApi.getRegionReport(selectedRegion, regionDateFrom, regionDateTo, regionProduct),
    enabled: !!selectedRegion && !!regionDateFrom && !!regionDateTo,
  })

  const { data: kpiSummary, isLoading: summaryLoading, isError: summaryError, refetch: refetchSummary } = useQuery({
    queryKey: ['kpiSummary', summarySeller, summaryDateFrom, summaryDateTo],
    queryFn: () => reportsApi.getKPISummary(summarySeller, summaryDateFrom, summaryDateTo),
    enabled: !!summarySeller && !!summaryDateFrom && !!summaryDateTo,
  })

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

  // Preparar datos para gráfico de tendencia
  const prepareTrendChart = (tendencia: any[]) => {
    if (!tendencia || tendencia.length === 0) return null

    const labels = tendencia.map((t) => {
      const date = new Date(t.fecha)
      return date.toLocaleDateString('es-CO', { year: 'numeric', month: 'short' })
    })

    return {
      labels,
      datasets: [
        {
          label: t('reports.salesValue'),
          data: tendencia.map((t) => t.valor),
          borderColor: 'rgb(75, 192, 192)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          tension: 0.1,
          fill: true,
        },
      ],
    }
  }

  // Preparar datos para gráfico de ranking
  const prepareRankingChart = (ranking: any[]) => {
    if (!ranking || ranking.length === 0) return null

    return {
      labels: ranking.map((r) => r.nombre),
      datasets: [
        {
          label: t('reports.salesValue'),
          data: ranking.map((r) => r.ventas_valor),
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1,
        },
      ],
    }
  }

  return (
    <Container maxW="container.xl" py={8}>
      <Heading size="lg" mb={6} color="medisupply.300">
        {t('reports.title')}
      </Heading>

      <Tabs position="relative" variant="unstyled" mb={6}>
        <TabList>
          <Tab _selected={{ color: 'blue.500', fontWeight: 'bold' }}>
            {t('reports.sellerKPI')}
          </Tab>
          <Tab _selected={{ color: 'blue.500', fontWeight: 'bold' }}>
            {t('reports.regionReport')}
          </Tab>
          <Tab _selected={{ color: 'blue.500', fontWeight: 'bold' }}>
            {t('reports.kpiSummary')}
          </Tab>
        </TabList>
        <TabIndicator mt="-1.5px" height="2px" bg="blue.500" borderRadius="1px" />

        <TabPanels>
          {/* Tab 1: KPI Vendedor */}
          <TabPanel>
            <Box mb={6}>
              <Heading size="md" mb={4} color="medisupply.200">
                {t('reports.sellerKPI')}
              </Heading>

              {/* Filtros */}
              <Box bg="white" p={6} borderRadius="lg" shadow="sm" border="1px" borderColor="medisupply.50" mb={6}>
                <SimpleGrid columns={{ base: 1, md: 3, lg: 6 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      {t('reports.seller')}
                    </FormLabel>
                    <Select value={selectedSeller} onChange={(e) => setSelectedSeller(e.target.value)}>
                      <option value="3">Vendedor 3</option>
                      <option value="4">Vendedor 4</option>
                      <option value="5">Vendedor 5</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      {t('dashboard.from')}
                    </FormLabel>
                    <Input type="date" value={sellerDateFrom} onChange={(e) => setSellerDateFrom(e.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      {t('dashboard.to')}
                    </FormLabel>
                    <Input type="date" value={sellerDateTo} onChange={(e) => setSellerDateTo(e.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      {t('reports.territory')}
                    </FormLabel>
                    <Input
                      placeholder="TERR-NORTE-BOG"
                      value={sellerTerritory}
                      onChange={(e) => setSellerTerritory(e.target.value)}
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      {t('reports.product')}
                    </FormLabel>
                    <Input placeholder="ID del Producto" value={sellerProduct} onChange={(e) => setSellerProduct(e.target.value)} />
                  </FormControl>

                  <HStack spacing={2} justify="flex-end" align="flex-end">
                    <Button colorScheme="blue" onClick={() => refetchSeller()} isDisabled={sellerLoading}>
                      {t('dashboard.filter')}
                    </Button>
                  </HStack>
                </SimpleGrid>
              </Box>

              {/* Contenido */}
              {sellerLoading && (
                <Center py={10}>
                  <Spinner size="lg" color="medisupply.300" />
                </Center>
              )}

              {sellerError && (
                <Alert status="error" borderRadius="lg">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>{t('reports.error')}</AlertTitle>
                    <AlertDescription>{t('reports.errorLoadingData')}</AlertDescription>
                  </Box>
                </Alert>
              )}

              {!sellerLoading && !sellerError && sellerKPI && (
                <>
                  {/* KPIs del Vendedor */}
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
                    <Box p={4} bg="white" borderRadius="lg" shadow="sm">
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        {t('reports.salesValue')}
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="medisupply.300">
                        {formatCurrency(sellerKPI.ventas_valor)}
                      </Text>
                    </Box>

                    <Box p={4} bg="white" borderRadius="lg" shadow="sm">
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        {t('reports.unitsSold')}
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="medisupply.300">
                        {formatNumber(sellerKPI.ventas_unidades)}
                      </Text>
                    </Box>

                    <Box p={4} bg="white" borderRadius="lg" shadow="sm">
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        {t('reports.orders')}
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="medisupply.300">
                        {formatNumber(sellerKPI.pedidos)}
                      </Text>
                    </Box>

                    <Box p={4} bg="white" borderRadius="lg" shadow="sm">
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        {t('reports.completion')}
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="medisupply.300">
                        {sellerKPI.cumplimiento_valor !== null ? `${sellerKPI.cumplimiento_valor.toFixed(1)}%` : 'N/A'}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {/* Gráfico de Tendencia */}
                  {sellerKPI.tendencia.length > 0 && (
                    <Box p={6} bg="white" borderRadius="lg" shadow="sm" border="1px" borderColor="medisupply.50" mb={6}>
                      <Heading size="sm" mb={4} color="medisupply.200">
                        {t('reports.trend')}
                      </Heading>
                      <Box height="300px">
                        <Line data={prepareTrendChart(sellerKPI.tendencia) as any} options={chartOptions as ChartOptions<'line'>} />
                      </Box>
                    </Box>
                  )}
                </>
              )}
            </Box>
          </TabPanel>

          {/* Tab 2: Reporte Regional */}
          <TabPanel>
            <Box mb={6}>
              <Heading size="md" mb={4} color="medisupply.200">
                {t('reports.regionReport')}
              </Heading>

              {/* Filtros */}
              <Box bg="white" p={6} borderRadius="lg" shadow="sm" border="1px" borderColor="medisupply.50" mb={6}>
                <SimpleGrid columns={{ base: 1, md: 3, lg: 5 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      {t('reports.territory')}
                    </FormLabel>
                    <Select value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)}>
                      <option value="TERR-NORTE-BOG">TERR-NORTE-BOG</option>
                      <option value="TERR-ANTIOQUIA">TERR-ANTIOQUIA</option>
                      <option value="TERR-PACIFICO">TERR-PACIFICO</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      {t('dashboard.from')}
                    </FormLabel>
                    <Input type="date" value={regionDateFrom} onChange={(e) => setRegionDateFrom(e.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      {t('dashboard.to')}
                    </FormLabel>
                    <Input type="date" value={regionDateTo} onChange={(e) => setRegionDateTo(e.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      {t('reports.product')}
                    </FormLabel>
                    <Input placeholder="ID del Producto" value={regionProduct} onChange={(e) => setRegionProduct(e.target.value)} />
                  </FormControl>

                  <HStack spacing={2} justify="flex-end" align="flex-end">
                    <Button colorScheme="blue" onClick={() => refetchRegion()} isDisabled={regionLoading}>
                      {t('dashboard.filter')}
                    </Button>
                  </HStack>
                </SimpleGrid>
              </Box>

              {/* Contenido */}
              {regionLoading && (
                <Center py={10}>
                  <Spinner size="lg" color="medisupply.300" />
                </Center>
              )}

              {regionError && (
                <Alert status="error" borderRadius="lg">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>{t('reports.error')}</AlertTitle>
                    <AlertDescription>{t('reports.errorLoadingData')}</AlertDescription>
                  </Box>
                </Alert>
              )}

              {!regionLoading && !regionError && regionReport && (
                <>
                  {/* Resumen Regional */}
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4} mb={6}>
                    <Box p={4} bg="white" borderRadius="lg" shadow="sm">
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        {t('reports.salesValue')}
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="medisupply.300">
                        {formatCurrency(regionReport.resumen.ventas_valor)}
                      </Text>
                    </Box>

                    <Box p={4} bg="white" borderRadius="lg" shadow="sm">
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        {t('reports.unitsSold')}
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="medisupply.300">
                        {formatNumber(regionReport.resumen.ventas_unidades)}
                      </Text>
                    </Box>

                    <Box p={4} bg="white" borderRadius="lg" shadow="sm">
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        {t('reports.orders')}
                      </Text>
                      <Text fontSize="2xl" fontWeight="bold" color="medisupply.300">
                        {formatNumber(regionReport.resumen.pedidos)}
                      </Text>
                    </Box>

                    <Box p={4} bg="white" borderRadius="lg" shadow="sm">
                      <Text fontSize="sm" color="gray.600" mb={1}>
                        {t('reports.regionName')}
                      </Text>
                      <Text fontSize="lg" fontWeight="bold" color="medisupply.300">
                        {regionReport.territorio.nombre}
                      </Text>
                    </Box>
                  </SimpleGrid>

                  {/* Gráfico de Tendencia Regional */}
                  {regionReport.tendencia.length > 0 && (
                    <Box p={6} bg="white" borderRadius="lg" shadow="sm" border="1px" borderColor="medisupply.50" mb={6}>
                      <Heading size="sm" mb={4} color="medisupply.200">
                        {t('reports.trend')}
                      </Heading>
                      <Box height="300px">
                        <Line data={prepareTrendChart(regionReport.tendencia) as any} options={chartOptions as ChartOptions<'line'>} />
                      </Box>
                    </Box>
                  )}

                  {/* Ranking de Vendedores en la Región */}
                  {regionReport.ranking.length > 0 && (
                    <>
                      {/* Gráfico de Ranking */}
                      <Box p={6} bg="white" borderRadius="lg" shadow="sm" border="1px" borderColor="medisupply.50" mb={6}>
                        <Heading size="sm" mb={4} color="medisupply.200">
                          {t('reports.sellerRanking')}
                        </Heading>
                        <Box height="300px">
                          <Bar data={prepareRankingChart(regionReport.ranking) as any} options={chartOptions as ChartOptions<'bar'>} />
                        </Box>
                      </Box>

                      {/* Tabla de Ranking */}
                      <Box p={6} bg="white" borderRadius="lg" shadow="sm" border="1px" borderColor="medisupply.50">
                        <Heading size="sm" mb={4} color="medisupply.200">
                          {t('reports.rankingDetails')}
                        </Heading>
                        <Box overflowX="auto">
                          <Table variant="simple" size="sm">
                            <Thead>
                              <Tr bg="gray.50">
                                <Th>{t('reports.position')}</Th>
                                <Th>{t('reports.seller')}</Th>
                                <Th isNumeric>{t('reports.salesValue')}</Th>
                                <Th isNumeric>{t('reports.unitsSold')}</Th>
                                <Th isNumeric>{t('reports.orders')}</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {regionReport.ranking.map((seller, idx) => (
                                <Tr key={seller.vendedorId} bg={idx % 2 === 1 ? 'gray.50' : 'white'}>
                                  <Td>
                                    <Badge colorScheme="blue">{seller.posicion}</Badge>
                                  </Td>
                                  <Td fontWeight="bold">{seller.nombre}</Td>
                                  <Td isNumeric>{formatCurrency(seller.ventas_valor)}</Td>
                                  <Td isNumeric>{formatNumber(seller.ventas_unidades)}</Td>
                                  <Td isNumeric>{formatNumber(seller.pedidos)}</Td>
                                </Tr>
                              ))}
                            </Tbody>
                          </Table>
                        </Box>
                      </Box>
                    </>
                  )}
                </>
              )}
            </Box>
          </TabPanel>

          {/* Tab 3: Resumen Rápido KPI */}
          <TabPanel>
            <Box mb={6}>
              <Heading size="md" mb={4} color="medisupply.200">
                {t('reports.kpiSummary')}
              </Heading>

              {/* Filtros */}
              <Box bg="white" p={6} borderRadius="lg" shadow="sm" border="1px" borderColor="medisupply.50" mb={6}>
                <SimpleGrid columns={{ base: 1, md: 4 }} spacing={4}>
                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      {t('reports.seller')}
                    </FormLabel>
                    <Select value={summarySeller} onChange={(e) => setSummarySeller(e.target.value)}>
                      <option value="3">Vendedor 3</option>
                      <option value="4">Vendedor 4</option>
                      <option value="5">Vendedor 5</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      {t('dashboard.from')}
                    </FormLabel>
                    <Input type="date" value={summaryDateFrom} onChange={(e) => setSummaryDateFrom(e.target.value)} />
                  </FormControl>

                  <FormControl>
                    <FormLabel fontSize="sm" fontWeight="bold">
                      {t('dashboard.to')}
                    </FormLabel>
                    <Input type="date" value={summaryDateTo} onChange={(e) => setSummaryDateTo(e.target.value)} />
                  </FormControl>

                  <HStack spacing={2} justify="flex-end" align="flex-end">
                    <Button colorScheme="blue" onClick={() => refetchSummary()} isDisabled={summaryLoading}>
                      {t('dashboard.filter')}
                    </Button>
                  </HStack>
                </SimpleGrid>
              </Box>

              {/* Contenido */}
              {summaryLoading && (
                <Center py={10}>
                  <Spinner size="lg" color="medisupply.300" />
                </Center>
              )}

              {summaryError && (
                <Alert status="error" borderRadius="lg">
                  <AlertIcon />
                  <Box>
                    <AlertTitle>{t('reports.error')}</AlertTitle>
                    <AlertDescription>{t('reports.errorLoadingData')}</AlertDescription>
                  </Box>
                </Alert>
              )}

              {!summaryLoading && !summaryError && kpiSummary && (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                  <Box p={8} bg="white" borderRadius="lg" shadow="md" border="2px" borderColor="blue.200">
                    <Text fontSize="sm" color="gray.600" mb={2} fontWeight="bold">
                      {t('reports.salesValue')}
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="medisupply.300">
                      {formatCurrency(kpiSummary.ventas_valor)}
                    </Text>
                  </Box>

                  <Box p={8} bg="white" borderRadius="lg" shadow="md" border="2px" borderColor="blue.200">
                    <Text fontSize="sm" color="gray.600" mb={2} fontWeight="bold">
                      {t('reports.unitsSold')}
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="medisupply.300">
                      {formatNumber(kpiSummary.ventas_unidades)}
                    </Text>
                  </Box>

                  <Box p={8} bg="white" borderRadius="lg" shadow="md" border="2px" borderColor="blue.200">
                    <Text fontSize="sm" color="gray.600" mb={2} fontWeight="bold">
                      {t('reports.orders')}
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="medisupply.300">
                      {formatNumber(kpiSummary.pedidos)}
                    </Text>
                  </Box>

                  <Box p={8} bg="white" borderRadius="lg" shadow="md" border="2px" borderColor="blue.200">
                    <Text fontSize="sm" color="gray.600" mb={2} fontWeight="bold">
                      {t('reports.completion')}
                    </Text>
                    <Text fontSize="3xl" fontWeight="bold" color="medisupply.300">
                      {kpiSummary.cumplimiento_porcentaje !== null
                        ? `${kpiSummary.cumplimiento_porcentaje.toFixed(1)}%`
                        : 'N/A'}
                    </Text>
                  </Box>
                </SimpleGrid>
              )}
            </Box>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Container>
  )
}

export default Reports
