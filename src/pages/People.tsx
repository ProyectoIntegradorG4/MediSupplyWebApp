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
  Heading,
  HStack,
  Text,
  Select,
  Tabs,
  TabList,
  Tab,
  TabIndicator,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
  FormLabel,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesmenApi, salesPlansApi } from '../services/api';
import { Spinner, Center } from '@chakra-ui/react';

const People = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState('10');
  const [activeTab, setActiveTab] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    tipoDocumento: 'CC',
    numeroDocumento: '',
    email: '',
    telefono: '',
    pais: '',
    territorioId: '',
  });

  const { data: salesPlans, isLoading: isLoadingPlans, isError: isErrorPlans } = useQuery({
    queryKey: ['salesPlans'],
    queryFn: salesPlansApi.getSalesPlans,
  });

  const { data: salesmen, isLoading: isLoadingSalesmen, isError: isErrorSalesmen } = useQuery({
    queryKey: ['salesmen'],
    queryFn: salesmenApi.getSalesmen,
  });

  const createSalesmanMutation = useMutation({
    mutationFn: salesmenApi.createSalesman,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesmen'] });
      toast({
        title: 'Vendedor creado',
        description: 'El vendedor ha sido creado exitosamente.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      setFormData({
        nombres: '',
        apellidos: '',
        tipoDocumento: 'CC',
        numeroDocumento: '',
        email: '',
        telefono: '',
        pais: '',
        territorioId: '',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.response?.data?.detail || 'Error al crear el vendedor',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createSalesmanMutation.mutate(formData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const filteredPlans = Array.isArray(salesPlans)
    ? salesPlans.filter(plan =>
        plan.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const filteredSellers = Array.isArray(salesmen)
    ? salesmen.filter(seller => {
        const fullName = `${seller.nombres} ${seller.apellidos}`.toLowerCase();
        return fullName.includes(searchTerm.toLowerCase());
      })
    : [];

  const isLoading = activeTab === 0 ? isLoadingPlans : isLoadingSalesmen;
  const isError = activeTab === 0 ? isErrorPlans : isErrorSalesmen;

  return (
    <Container maxW="container.xl" py={8}>
      <Box mb={8}>
        <Heading size="lg" mb={6}>
          {activeTab === 0 ? 'Información de Planes de Ventas' : 'Información de Vendedores'}
        </Heading>

        <Tabs
          position="relative"
          variant="unstyled"
          mb={6}
          defaultIndex={0}
          onChange={(index) => setActiveTab(index)}
        >
          <TabList>
            <Tab _selected={{ color: 'blue.500', fontWeight: 'bold' }}>
              <Box as="span" mr={2}>{activeTab === 0 ? '★' : '☆'}</Box>
              PLANES DE VENTA
            </Tab>
            <Tab _selected={{ color: 'blue.500', fontWeight: 'bold' }}>
              <Box as="span" mr={2}>{activeTab === 1 ? '★' : '☆'}</Box>
              VENDEDORES
            </Tab>
          </TabList>
          <TabIndicator
            mt="-1.5px"
            height="2px"
            bg="blue.500"
            borderRadius="1px"
          />
        </Tabs>

        {activeTab === 0 ? (
          <HStack spacing={4} mb={6} align="flex-end">
            <Box>
              <Text mb={2} fontSize="sm" color="gray.600">Buscar</Text>
              <Input
                placeholder="Nombre"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                w="300px"
              />
            </Box>

            <Box>
              <Text mb={2} fontSize="sm" color="gray.600">Start date</Text>
              <Input
                type="date"
                placeholder="MM/DD/YYYY"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                w="200px"
              />
            </Box>

            <Box mx={2} mb={2}>
              <Text>—</Text>
            </Box>

            <Box>
              <Text mb={2} fontSize="sm" color="gray.600">End date</Text>
              <Input
                type="date"
                placeholder="MM/DD/YYYY"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                w="200px"
              />
            </Box>

            <Button colorScheme="blue" ml="auto">
              CARGA DE PLAN DE VENTAS
            </Button>
          </HStack>
        ) : (
          <HStack spacing={4} mb={6} align="flex-end">
            <Box>
              <Text mb={2} fontSize="sm" color="gray.600">Buscar</Text>
              <Input
                placeholder="Nombre"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                w="300px"
              />
            </Box>
            <Button colorScheme="blue" ml="auto" onClick={onOpen}>
              AGREGAR VENDEDOR
            </Button>
          </HStack>
        )}
      </Box>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>ID</Th>
              <Th>Nombre</Th>
              {activeTab === 0 ? (
                <>
                  <Th>Periodo</Th>
                  <Th>Estado</Th>
                  <Th isNumeric>Cantidad</Th>
                </>
              ) : (
                <>
                  <Th>Email</Th>
                  <Th>País</Th>
                  <Th>Territorio</Th>
                  <Th>Estado</Th>
                </>
              )}
            </Tr>
          </Thead>
          <Tbody>
            {isLoading ? (
              <Tr>
                <Td colSpan={activeTab === 0 ? 5 : 6}>
                  <Center py={4}>
                    <Spinner size="md" color="blue.500" />
                  </Center>
                </Td>
              </Tr>
            ) : isError ? (
              <Tr>
                <Td colSpan={activeTab === 0 ? 5 : 6}>
                  <Center py={4}>
                    <Text color="red.500">Error loading data.</Text>
                  </Center>
                </Td>
              </Tr>
            ) : activeTab === 0 ? (
              filteredPlans.length === 0 ? (
                <Tr>
                  <Td colSpan={5}>
                    <Center py={4}>
                      <Text color="gray.500">No sales plans found</Text>
                    </Center>
                  </Td>
                </Tr>
              ) : (
                filteredPlans.map((plan, index) => (
                  <Tr key={plan.id} bg={index % 2 === 0 ? 'gray.50' : 'white'}>
                    <Td>{plan.id}</Td>
                    <Td>{plan.nombre}</Td>
                    <Td>{plan.periodo}</Td>
                    <Td>{plan.estado}</Td>
                    <Td isNumeric>{plan.cantidad.toLocaleString()}</Td>
                  </Tr>
                ))
              )
            ) : filteredSellers.length === 0 ? (
              <Tr>
                <Td colSpan={6}>
                  <Center py={4}>
                    <Text color="gray.500">No sellers found</Text>
                  </Center>
                </Td>
              </Tr>
            ) : (
              filteredSellers.map((seller, index) => (
                <Tr key={seller.vendedorId} bg={index % 2 === 0 ? 'gray.50' : 'white'}>
                  <Td>{seller.vendedorId}</Td>
                  <Td>{`${seller.nombres} ${seller.apellidos}`}</Td>
                  <Td>{seller.email}</Td>
                  <Td>{seller.pais}</Td>
                  <Td>{seller.territorioId}</Td>
                  <Td>{seller.estado}</Td>
                </Tr>
              ))
            )}
          </Tbody>
        </Table>
      </Box>

      <HStack spacing={4} justify="flex-end" mt={4}>
        <Text fontSize="sm">Rows per page:</Text>
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
        <Text fontSize="sm">1-5 of 13</Text>
      </HStack>

      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Agregar Nuevo Vendedor</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <HStack spacing={4} w="100%">
                  <FormControl isRequired>
                    <FormLabel>Nombres</FormLabel>
                    <Input
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleInputChange}
                      placeholder="Nombres"
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Apellidos</FormLabel>
                    <Input
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleInputChange}
                      placeholder="Apellidos"
                    />
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="100%">
                  <FormControl isRequired>
                    <FormLabel>Tipo de Documento</FormLabel>
                    <Select
                      name="tipoDocumento"
                      value={formData.tipoDocumento}
                      onChange={handleInputChange}
                    >
                      <option value="CC">Cédula de Ciudadanía</option>
                      <option value="CE">Cédula de Extranjería</option>
                      <option value="PAS">Pasaporte</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>Número de Documento</FormLabel>
                    <Input
                      name="numeroDocumento"
                      value={formData.numeroDocumento}
                      onChange={handleInputChange}
                      placeholder="123456789"
                    />
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="correo@ejemplo.com"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Teléfono</FormLabel>
                  <Input
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+57 300 1234567"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>País</FormLabel>
                  <Input
                    name="pais"
                    value={formData.pais}
                    onChange={handleInputChange}
                    placeholder="Colombia"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>Territorio ID</FormLabel>
                  <Input
                    name="territorioId"
                    value={formData.territorioId}
                    onChange={handleInputChange}
                    placeholder="BOGOTA-CENTRO"
                  />
                </FormControl>
              </VStack>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={createSalesmanMutation.isPending}
              >
                Crear Vendedor
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default People;
