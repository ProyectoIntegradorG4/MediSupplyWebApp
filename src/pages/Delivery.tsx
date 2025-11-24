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
} from '@chakra-ui/react';
import { useTranslation } from 'react-i18next';
import { Delivery as DeliveryType } from '../types/api';
import { deliveriesApi } from '../services/api';

const Delivery = () => {
  const { t } = useTranslation();
  const [deliveries, setDeliveries] = useState<DeliveryType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchDeliveries = async () => {
      const data = await deliveriesApi.getDeliveries();
      setDeliveries(data);
    };
    fetchDeliveries();
  }, []);

  // Filter deliveries based on search term
  const filteredDeliveries = deliveries.filter((delivery) =>
    delivery.id.toString().includes(searchTerm)
  );

  // Pagination logic
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentDeliveries = filteredDeliveries.slice(startIndex, endIndex);

  const handleGenerateRoutes = () => {
    // TODO: Implement route generation logic
    console.log('Generate delivery routes');
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
          onClick={handleGenerateRoutes}
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
              <Th>{t('delivery.id')}</Th>
              <Th>{t('delivery.associatedClient')}</Th>
              <Th>{t('delivery.destination')}</Th>
              <Th>{t('delivery.eta')}</Th>
              <Th>{t('delivery.associatedSeller')}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {currentDeliveries.map((delivery) => (
              <Tr key={delivery.id}>
                <Td>{delivery.id}</Td>
                <Td>{delivery.clienteAsociado}</Td>
                <Td>{delivery.destino}</Td>
                <Td>{delivery.eta}</Td>
                <Td>{delivery.vendedorAsociado}</Td>
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
    </Box>
  );
};

export default Delivery;
