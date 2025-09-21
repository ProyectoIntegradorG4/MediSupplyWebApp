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
import FileUploadModal from '../components/FileUploadModal';

interface Product {
  sku: string;
  name: string;
  category: string;
  stock: number;
  location: string;
}

const initialProducts: Product[] = [
  { sku: '123', name: 'Producto 1', category: 'Categoría', stock: 1, location: 'Bodega 1' },
  { sku: '234', name: 'Producto 2', category: 'Categoría', stock: 1, location: 'Bodega 1' },
  { sku: '345', name: 'Producto 3', category: 'Categoría', stock: 1, location: 'Bodega 1' },
  { sku: '456', name: 'Producto 4', category: 'Categoría', stock: 1, location: 'Bodega 1' },
  { sku: '567', name: 'Producto 5', category: 'Categoría', stock: 1, location: 'Bodega 1' },
  { sku: '678', name: 'Producto 6', category: 'Categoría', stock: 1, location: 'Bodega 1' },
  { sku: '789', name: 'Producto 7', category: 'Categoría', stock: 1, location: 'Bodega 1' },
  { sku: '890', name: 'Producto 8', category: 'Categoría', stock: 1, location: 'Bodega 1' },
];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [products] = useState<Product[]>(initialProducts);
  const [rowsPerPage, setRowsPerPage] = useState('10');
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const filteredProducts = products.filter(product =>
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
            <Button variant="outline">CARGA INDIVIDUAL</Button>
            <Button colorScheme="blue" onClick={() => setIsUploadModalOpen(true)}>
              CARGA MASIVA
            </Button>
          </HStack>
          <FileUploadModal 
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
          />
        </HStack>
      </Box>

      <Box overflowX="auto">
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
            {filteredProducts.map((product) => (
              <Tr key={product.sku}>
                <Td>{product.sku}</Td>
                <Td>{product.name}</Td>
                <Td>{product.category}</Td>
                <Td isNumeric>{product.stock}</Td>
                <Td>{product.location}</Td>
              </Tr>
            ))}
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
