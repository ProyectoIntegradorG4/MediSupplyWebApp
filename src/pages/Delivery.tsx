import { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  Input,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  FormControl,
  FormLabel,
  HStack,
  Select,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Delivery as DeliveryType } from '../types/api';
import { deliveriesApi } from '../services/api';
import GenerateRouteModal from '../components/GenerateRouteModal';

const Delivery = () => {
  const { t } = useTranslation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [deliveries, setDeliveries] = useState<DeliveryType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const data = await deliveriesApi.getDeliveries();
      setDeliveries(data);
    };
    fetchDeliveries();
  }, []);

  // Filter deliveries based on search term
  const filteredDeliveries = deliveries.filter((delivery) =>
    delivery.ruta_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    delivery.vehiculo_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentDeliveries = filteredDeliveries.slice(startIndex, endIndex);

  const handleGenerateRoutes = async (routeData: any) => {
    setIsGenerating(true);
    try {
      const result = await deliveriesApi.generateRoutes(routeData);
      toast({
        title: t('routes.routesGenerated'),
        description: t('routes.routesGeneratedSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      console.log('Generated routes:', result);
      onClose();
      // Refresh deliveries list
      const data = await deliveriesApi.getDeliveries();
      setDeliveries(data);
    } catch (error: any) {
      toast({
        title: t('common.error'),
        description: error.response?.data?.detail || t('routes.routesGeneratedError'),
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Box>
      <Heading size="lg" mb={6}>{t('delivery.title')}</Heading>

      {/* Search and Generate Routes Section */}
      <HStack spacing={4} mb={6} justify="space-between">
        <FormControl maxW="300px">
          <FormLabel fontSize="sm">{t('delivery.searchLabel')}</FormLabel>
          <Input
            placeholder={t('delivery.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          onClick={onOpen}
          alignSelf="flex-end"
        >
          {t('delivery.generateRoutes')}
        </Button>
      </HStack>

      {/* Deliveries Table */}
      <Box overflowX="auto" bg="white" borderRadius="md" shadow="sm">
        <Table variant="simple">
          <Thead bg="gray.50">
            <Tr>
              <Th>{t('delivery.routeId')}</Th>
              <Th>{t('delivery.vehicleId')}</Th>
              <Th>{t('delivery.status')}</Th>
              <Th isNumeric>{t('delivery.totalOrders')}</Th>
              <Th isNumeric>{t('delivery.totalDistance')}</Th>
              <Th isNumeric>{t('delivery.totalDuration')}</Th>
              <Th>{t('delivery.createdAt')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentDeliveries.map((delivery) => (
              <Tr key={delivery.ruta_id}>
                <Td>{delivery.ruta_id}</Td>
                <Td>{delivery.vehiculo_id}</Td>
                <Td>
                  <Text
                    px={2}
                    py={1}
                    borderRadius="md"
                    fontSize="sm"
                    display="inline-block"
                    bg={
                      delivery.estado === 'completada' ? 'green.100' :
                      delivery.estado === 'en_curso' ? 'blue.100' :
                      'gray.100'
                    }
                    color={
                      delivery.estado === 'completada' ? 'green.800' :
                      delivery.estado === 'en_curso' ? 'blue.800' :
                      'gray.800'
                    }
                  >
                    {delivery.estado}
                  </Text>
                </Td>
                <Td isNumeric>{delivery.total_pedidos}</Td>
                <Td isNumeric>{delivery.distancia_total_km.toFixed(2)} km</Td>
                <Td isNumeric>{delivery.duracion_total_minutos} min</Td>
                <Td>{new Date(delivery.fecha_creacion).toLocaleString()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {/* Pagination Controls */}
      <HStack mt={4} justify="space-between" align="center">
        <HStack spacing={2}>
          <Text fontSize="sm">{t('delivery.rowsPerPage')}</Text>
          <Select
            size="sm"
            w="80px"
            value={rowsPerPage}
            onChange={(e) => {
              setRowsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </Select>
        </HStack>
        <Text fontSize="sm">
          {startIndex + 1}-{Math.min(endIndex, filteredDeliveries.length)} of {filteredDeliveries.length}
        </Text>
      </HStack>

      <GenerateRouteModal
        isOpen={isOpen}
        onClose={onClose}
        onSubmit={handleGenerateRoutes}
        isLoading={isGenerating}
      />
    </Box>
  );
};

export default Delivery;
