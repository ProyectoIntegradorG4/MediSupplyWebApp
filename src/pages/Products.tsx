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
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import FileUploadModal from '../components/FileUploadModal';
import ProductCreateModal from '../components/ProductCreateModal';
import { productsApi } from '../services/api';
import { Spinner, Center } from '@chakra-ui/react';

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('10');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: productsApi.getProducts,
  });

  const filteredProducts = (products || []).filter(product =>
    product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg" mb={6}>Ventas y Proveedores</Heading>
        <Tabs position="relative" variant="unstyled" mb={6}>
          <TabList>
            <Tab _selected={{ color: 'blue.500', fontWeight: 'bold' }}>
              <Box as="span" mr={2}>★</Box>
              PROVEEDORES
            </Tab>
            <Tab _selected={{ color: 'blue.500', fontWeight: 'bold' }}>
              <Box as="span" mr={2}>☆</Box>
              PRODUCTOS
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
          <Box w="300px">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="SKU"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Box>
          <HStack>
            <Button 
              variant="outline" 
              onClick={() => {
                setIsCreateModalOpen(true);
              }}
              bg={isCreateModalOpen ? 'red.100' : 'white'}
            >
              CARGA INDIVIDUAL {isCreateModalOpen ? '(OPEN)' : ''}
            </Button>
            <Button colorScheme="blue" onClick={() => setIsUploadModalOpen(true)}>
              CARGA MASIVA
            </Button>
          </HStack>
        </HStack>
        
        <FileUploadModal 
          isOpen={isUploadModalOpen}
          onClose={() => setIsUploadModalOpen(false)}
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
              <Th>Category</Th>
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
            ) : filteredProducts.length === 0 ? (
              <Tr>
                <Td colSpan={5}>
                  <Center py={4}>
                    <Text color="gray.500">No products found</Text>
                  </Center>
                </Td>
              </Tr>
            ) : (
              filteredProducts.map((product) => (
                <Tr key={product.sku}>
                  <Td>{product.sku}</Td>
                  <Td>{product.name}</Td>
                  <Td>{product.category}</Td>
                  <Td isNumeric>{product.stock}</Td>
                  <Td>{product.location}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      <HStack spacing={4} justify="flex-end" mt={4}>
        <Text>Rows per page:</Text>
        <Select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(e.target.value)}
          w="70px"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </Select>
        <Text>1-5 of 13</Text>
      </HStack>
    </Container>
  );
};

export default Products;
