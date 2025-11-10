import {
  Box,
  Button,
  Container,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  InputGroup,
  InputLeftElement,
  Heading,
  HStack,
  Text,
  Select,
  Tabs,
  TabList,
  Tab,
  TabIndicator,
  Spinner,
  Center,
  IconButton,
} from '@chakra-ui/react';
import { SearchIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import FileUploadModal from '../components/FileUploadModal';
import ProductCreateModal from '../components/ProductCreateModal';
import { productsApi } from '../services/api';

const Products = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('10');
  const [currentPage, setCurrentPage] = useState(1);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getProducts,
  });

  const handleUploadSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  };

  const filteredProducts = (products || []).filter(product => {
    const matchesSku = product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = locationFilter === '' || product.location.toLowerCase().includes(locationFilter.toLowerCase());
    return matchesSku && matchesLocation;
  });

  const itemsPerPage = parseInt(rowsPerPage);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage: string) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1);
  };

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg" mb={6}>{t('products.title')}</Heading>
        <Tabs position="relative" variant="unstyled" mb={6} defaultIndex={1}>
          <TabList>
            <Tab
              _selected={{ color: 'blue.500', fontWeight: 'bold' }}
              onClick={() => navigate('/providers')}
            >
              <Box as="span" mr={2}>★</Box>
              {t('nav.providers').toUpperCase()}
            </Tab>
            <Tab _selected={{ color: 'blue.500', fontWeight: 'bold' }}>
              <Box as="span" mr={2}>☆</Box>
              {t('nav.products').toUpperCase()}
            </Tab>
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="blue.500"
            borderRadius="1px"
          />
        </Tabs>
        <HStack spacing={4} justify="space-between">
          <HStack spacing={4}>
            <Box w="250px">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder={t('products.sku')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Box>
            <Box w="250px">
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <SearchIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  placeholder={t('products.location')}
                  value={locationFilter}
                  onChange={(e) => setLocationFilter(e.target.value)}
                />
              </InputGroup>
            </Box>
          </HStack>
          <HStack>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreateModalOpen(true);
              }}
              bg={isCreateModalOpen ? 'red.100' : 'white'}
            >
              {t('products.createProduct').toUpperCase()}
            </Button>
            <Button colorScheme="blue" onClick={() => setIsUploadModalOpen(true)}>
              {t('products.uploadCsv').toUpperCase()}
            </Button>
          </HStack>
        </HStack>
        
        <FileUploadModal
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
          onUploadSuccess={handleUploadSuccess}
        />
        <ProductCreateModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
        />
      </Box>

      <Box overflowX="auto" position="relative">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>SKU</Th>
              <Th>Name</Th>
              <Th>Ubicación</Th>
              <Th isNumeric>Stock</Th>
              <Th>Location</Th>
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={5}>
                  <Center py={4}>
                    <Spinner size="md" color="blue.500" />
                  </Center>
                </Td>
              </Tr>
            ) : isError ? (
              <Tr>
                <Td colSpan={5}>
                  <Center py={4}>
                    <Text color="red.500">Error loading products. Please try again later.</Text>
                  </Center>
                </Td>
              </Tr>
            ) : displayedProducts.length === 0 ? (
              <Tr>
                <Td colSpan={5}>
                  <Center py={4}>
                    <Text color="gray.500">No products found</Text>
                  </Center>
                </Td>
              </Tr>
            ) : (
              displayedProducts.map((product, index) => (
                <Tr key={product.productoId} bg={index % 2 === 1 ? 'gray.50' : 'white'}>
                  <Td>{product.sku}</Td>
                  <Td>{product.nombre}</Td>
                  <Td>{product.ubicacion}</Td>
                  <Td isNumeric>{product.stock}</Td>
                  <Td>{product.location}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      <HStack spacing={4} justify="space-between" mt={4}>
        <HStack spacing={2}>
          <IconButton
            aria-label="Previous page"
            icon={<ChevronLeftIcon />}
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
            size="sm"
          />
          <Text fontSize="sm" color="gray.600">
            Page {currentPage} of {totalPages || 1}
          </Text>
          <IconButton
            aria-label="Next page"
            icon={<ChevronRightIcon />}
            onClick={() => handlePageChange(currentPage + 1)}
            isDisabled={currentPage >= totalPages}
            size="sm"
          />
        </HStack>
        <HStack spacing={4}>
          <Text fontSize="sm" color="gray.600">Rows per page:</Text>
          <Select
            value={rowsPerPage}
            onChange={(e) => handleRowsPerPageChange(e.target.value)}
            w="70px"
            size="sm"
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="20">20</option>
          </Select>
          <Text fontSize="sm" color="gray.600">
            {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length}
          </Text>
        </HStack>
      </HStack>
    </Container>
  );
};

export default Products;
