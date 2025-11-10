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
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { salesmenApi, salesPlansApi } from '../services/api';
import { Spinner, Center } from '@chakra-ui/react';

const People = () => {
  const { t } = useTranslation();
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
        title: t('people.sellerCreated'),
        description: t('people.sellerCreatedSuccess'),
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
        title: t('people.error'),
        description: error.response?.data?.detail || t('people.createSellerError'),
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
          {activeTab === 0 ? t('people.salesPlansInfo') : t('people.sellersInfo')}
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
              {t('people.salesPlansTab')}
            </Tab>
            <Tab _selected={{ color: 'blue.500', fontWeight: 'bold' }}>
              <Box as="span" mr={2}>{activeTab === 1 ? '★' : '☆'}</Box>
              {t('people.sellersTab')}
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
              <Text mb={2} fontSize="sm" color="gray.600">{t('people.search')}</Text>
              <Input
                placeholder={t('people.name')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                w="300px"
              />
            </Box>

            <Box>
              <Text mb={2} fontSize="sm" color="gray.600">{t('people.startDate')}</Text>
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
              <Text mb={2} fontSize="sm" color="gray.600">{t('people.endDate')}</Text>
              <Input
                type="date"
                placeholder="MM/DD/YYYY"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                w="200px"
              />
            </Box>

            <Button colorScheme="blue" ml="auto">
              {t('people.uploadSalesPlan')}
            </Button>
          </HStack>
        ) : (
          <HStack spacing={4} mb={6} align="flex-end">
            <Box>
              <Text mb={2} fontSize="sm" color="gray.600">{t('people.search')}</Text>
              <Input
                placeholder={t('people.name')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                w="300px"
              />
            </Box>
            <Button colorScheme="blue" ml="auto" onClick={onOpen}>
              {t('people.addSeller')}
            </Button>
          </HStack>
        )}
      </Box>

      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>{t('people.id')}</Th>
              <Th>{t('people.name')}</Th>
              {activeTab === 0 ? (
                <>
                  <Th>{t('people.period')}</Th>
                  <Th>{t('people.status')}</Th>
                  <Th isNumeric>{t('people.quantity')}</Th>
                </>
              ) : (
                <>
                  <Th>{t('people.email')}</Th>
                  <Th>{t('people.country')}</Th>
                  <Th>{t('people.territory')}</Th>
                  <Th>{t('people.status')}</Th>
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
                    <Text color="red.500">{t('people.errorLoadingData')}</Text>
                  </Center>
                </Td>
              </Tr>
            ) : activeTab === 0 ? (
              filteredPlans.length === 0 ? (
                <Tr>
                  <Td colSpan={5}>
                    <Center py={4}>
                      <Text color="gray.500">{t('people.noSalesPlansFound')}</Text>
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
                    <Text color="gray.500">{t('people.noSellersFound')}</Text>
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
        <Text fontSize="sm">{t('people.rowsPerPage')}</Text>
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
          <ModalHeader>{t('people.addNewSeller')}</ModalHeader>
          <ModalCloseButton />
          <form onSubmit={handleSubmit}>
            <ModalBody>
              <VStack spacing={4}>
                <HStack spacing={4} w="100%">
                  <FormControl isRequired>
                    <FormLabel>{t('people.firstName')}</FormLabel>
                    <Input
                      name="nombres"
                      value={formData.nombres}
                      onChange={handleInputChange}
                      placeholder={t('people.firstName')}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>{t('people.lastName')}</FormLabel>
                    <Input
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleInputChange}
                      placeholder={t('people.lastName')}
                    />
                  </FormControl>
                </HStack>

                <HStack spacing={4} w="100%">
                  <FormControl isRequired>
                    <FormLabel>{t('people.documentType')}</FormLabel>
                    <Select
                      name="tipoDocumento"
                      value={formData.tipoDocumento}
                      onChange={handleInputChange}
                    >
                      <option value="CC">{t('people.cc')}</option>
                      <option value="CE">{t('people.ce')}</option>
                      <option value="PAS">{t('people.pas')}</option>
                    </Select>
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel>{t('people.documentNumber')}</FormLabel>
                    <Input
                      name="numeroDocumento"
                      value={formData.numeroDocumento}
                      onChange={handleInputChange}
                      placeholder="123456789"
                    />
                  </FormControl>
                </HStack>

                <FormControl isRequired>
                  <FormLabel>{t('people.email')}</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="correo@ejemplo.com"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('people.phone')}</FormLabel>
                  <Input
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                    placeholder="+57 300 1234567"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('people.country')}</FormLabel>
                  <Input
                    name="pais"
                    value={formData.pais}
                    onChange={handleInputChange}
                    placeholder="Colombia"
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel>{t('people.territoryId')}</FormLabel>
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
                {t('people.cancel')}
              </Button>
              <Button
                colorScheme="blue"
                type="submit"
                isLoading={createSalesmanMutation.isPending}
              >
                {t('people.createSeller')}
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default People;
