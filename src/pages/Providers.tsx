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
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { providersApi } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Providers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('10');
  const navigate = useNavigate();

  const { data: providers, isLoading, isError } = useQuery({
    queryKey: ['providers'],
    queryFn: providersApi.getProviders,
  });

  const filteredProviders = (providers || []).filter(provider =>
    provider.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedProviders = filteredProviders.slice(0, parseInt(rowsPerPage));
  const totalProviders = filteredProviders.length;
  const displayCount = Math.min(displayedProviders.length, totalProviders);

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg" mb={6}>Proveedores y Productos</Heading>
        <Tabs position="relative" variant="unstyled" mb={6} defaultIndex={0}>
          <TabList>
            <Tab _selected={{ color: 'blue.500', fontWeight: 'bold' }}>
              <Box as="span" mr={2}>★</Box>
              PROVEEDORES
            </Tab>
            <Tab
              _selected={{ color: 'blue.500', fontWeight: 'bold' }}
              onClick={() => navigate('/products')}
            >
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
                placeholder="Nombre"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Box>
          <HStack>
            <Button colorScheme="blue">
              AGREGAR PROVEEDOR
            </Button>
          </HStack>
        </HStack>
      </Box>

      <Box overflowX="auto" position="relative">
        <Table variant="simple">
          <Thead>
            <Tr bg="gray.50">
              <Th>ID</Th>
              <Th>Nombre</Th>
              <Th>País</Th>
              <Th>Rating</Th>
              <Th>Activo</Th>
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
                    <Text color="red.500">Error loading providers. Please try again later.</Text>
                  </Center>
                </Td>
              </Tr>
            ) : displayedProviders.length === 0 ? (
              <Tr>
                <Td colSpan={5}>
                  <Center py={4}>
                    <Text color="gray.500">No providers found</Text>
                  </Center>
                </Td>
              </Tr>
            ) : (
              displayedProviders.map((provider, index) => (
                <Tr key={provider.id} bg={index % 2 === 1 ? 'gray.50' : 'white'}>
                  <Td>{provider.id}</Td>
                  <Td>{provider.nombre}</Td>
                  <Td>{provider.pais}</Td>
                  <Td>{provider.rating.toFixed(1)}</Td>
                  <Td>{provider.activo ? 'Sí' : 'No'}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      <HStack spacing={4} justify="flex-end" mt={4}>
        <Text fontSize="sm" color="gray.600">Rows per page:</Text>
        <Select
          value={rowsPerPage}
          onChange={(e) => setRowsPerPage(e.target.value)}
          w="70px"
          size="sm"
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
        </Select>
        <Text fontSize="sm" color="gray.600">
          1-{displayCount} of {totalProviders}
        </Text>
      </HStack>
    </Container>
  );
};

export default Providers;
