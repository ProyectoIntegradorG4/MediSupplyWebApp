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
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useState } from 'react';

interface Seller {
  id: string;
  nombre: string;
  pais: string;
  metaVentas: number;
  rendimiento: string;
}

const initialSellers: Seller[] = [
  { id: '123', nombre: 'Fernando Torres', pais: 'España', metaVentas: 15000, rendimiento: '50%' },
  { id: '234', nombre: 'Maximiliano Rodriguez', pais: 'Argentina', metaVentas: 12300, rendimiento: '10%' },
  { id: '345', nombre: 'Luis Diaz', pais: 'Colombia', metaVentas: 55000, rendimiento: '23%' },
  { id: '456', nombre: 'José Reina', pais: 'España', metaVentas: 55000, rendimiento: '59%' },
  { id: '567', nombre: 'Luis Suárez', pais: 'Uruguay', metaVentas: 69000, rendimiento: '33%' },
  { id: '678', nombre: 'José Enrique', pais: 'España', metaVentas: 87000, rendimiento: '76%' },
  { id: '789', nombre: 'Sebastián Coates', pais: 'Uruguay', metaVentas: 9300, rendimiento: '42%' },
  { id: '890', nombre: 'Darwin Núñez', pais: 'Uruguay', metaVentas: 110000, rendimiento: '80%' },
];

const Sellers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sellers] = useState<Seller[]>(initialSellers);
  const [rowsPerPage, setRowsPerPage] = useState('10');

  const filteredSellers = sellers.filter(seller =>
    seller.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg" mb={6}>Información de Vendedores</Heading>
        <HStack spacing={4} justify="space-between">
          <Box w="300px">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Box>
          <Button colorScheme="blue">
            CARGA DE PLAN DE VENTAS
          </Button>
        </HStack>
      </Box>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Nombre</Th>
              <Th>País</Th>
              <Th isNumeric>Meta de Ventas</Th>
              <Th isNumeric>Rendimiento</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredSellers.map((seller) => (
              <Tr key={seller.id}>
                <Td>{seller.id}</Td>
                <Td>{seller.nombre}</Td>
                <Td>{seller.pais}</Td>
                <Td isNumeric>{seller.metaVentas.toLocaleString()}</Td>
                <Td isNumeric>{seller.rendimiento}</Td>
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

export default Sellers;
