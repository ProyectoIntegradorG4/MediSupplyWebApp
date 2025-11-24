import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  HStack,
  Box,
  Text,
  IconButton,
  Select,
  Checkbox,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

interface Vehiculo {
  id: string;
  capacidad_volumen: number;
  capacidad_peso: number;
  cadena_frio: boolean;
  depot: {
    lat: number;
    lon: number;
  };
  duracion_maxima_minutos: number;
}

interface Pedido {
  id: string;
  lat: number;
  lon: number;
  ventana_inicio: string;
  ventana_fin: string;
  tiempo_servicio_minutos: number;
  requiere_frio: boolean;
  volumen: number;
  peso: number;
}

interface GenerateRouteFormData {
  objetivo: string;
  vehiculos: Vehiculo[];
  pedidos: Pedido[];
}

interface GenerateRouteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: GenerateRouteFormData) => void;
  isLoading?: boolean;
}

const GenerateRouteModal = ({ isOpen, onClose, onSubmit, isLoading }: GenerateRouteModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<GenerateRouteFormData>({
    objetivo: 'min_distancia',
    vehiculos: [{
      id: '',
      capacidad_volumen: 50,
      capacidad_peso: 1000,
      cadena_frio: true,
      depot: {
        lat: 4.6097,
        lon: -74.0817,
      },
      duracion_maxima_minutos: 480,
    }],
    pedidos: [{
      id: '',
      lat: 4.6351,
      lon: -74.0703,
      ventana_inicio: '08:00',
      ventana_fin: '12:00',
      tiempo_servicio_minutos: 15,
      requiere_frio: true,
      volumen: 5,
      peso: 50,
    }],
  });

  const handleVehiculoChange = (index: number, field: keyof Vehiculo | 'depot.lat' | 'depot.lon', value: any) => {
    const newVehiculos = [...formData.vehiculos];
    if (field.startsWith('depot.')) {
      const depotField = field.split('.')[1] as 'lat' | 'lon';
      newVehiculos[index] = {
        ...newVehiculos[index],
        depot: {
          ...newVehiculos[index].depot,
          [depotField]: Number(value),
        },
      };
    } else {
      newVehiculos[index] = { ...newVehiculos[index], [field]: value };
    }
    setFormData(prev => ({ ...prev, vehiculos: newVehiculos }));
  };

  const handlePedidoChange = (index: number, field: keyof Pedido, value: any) => {
    const newPedidos = [...formData.pedidos];
    newPedidos[index] = { ...newPedidos[index], [field]: value };
    setFormData(prev => ({ ...prev, pedidos: newPedidos }));
  };

  const addVehiculo = () => {
    setFormData(prev => ({
      ...prev,
      vehiculos: [...prev.vehiculos, {
        id: '',
        capacidad_volumen: 50,
        capacidad_peso: 1000,
        cadena_frio: true,
        depot: { lat: 4.6097, lon: -74.0817 },
        duracion_maxima_minutos: 480,
      }],
    }));
  };

  const removeVehiculo = (index: number) => {
    if (formData.vehiculos.length > 1) {
      setFormData(prev => ({
        ...prev,
        vehiculos: prev.vehiculos.filter((_, i) => i !== index),
      }));
    }
  };

  const addPedido = () => {
    setFormData(prev => ({
      ...prev,
      pedidos: [...prev.pedidos, {
        id: '',
        lat: 4.6351,
        lon: -74.0703,
        ventana_inicio: '08:00',
        ventana_fin: '12:00',
        tiempo_servicio_minutos: 15,
        requiere_frio: true,
        volumen: 5,
        peso: 50,
      }],
    }));
  };

  const removePedido = (index: number) => {
    if (formData.pedidos.length > 1) {
      setFormData(prev => ({
        ...prev,
        pedidos: prev.pedidos.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      objetivo: 'min_distancia',
      vehiculos: [{
        id: '',
        capacidad_volumen: 50,
        capacidad_peso: 1000,
        cadena_frio: true,
        depot: { lat: 4.6097, lon: -74.0817 },
        duracion_maxima_minutos: 480,
      }],
      pedidos: [{
        id: '',
        lat: 4.6351,
        lon: -74.0703,
        ventana_inicio: '08:00',
        ventana_fin: '12:00',
        tiempo_servicio_minutos: 15,
        requiere_frio: true,
        volumen: 5,
        peso: 50,
      }],
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>{t('routes.generateRoutes')}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* Objective */}
              <FormControl isRequired>
                <FormLabel>{t('routes.objective')}</FormLabel>
                <Select
                  value={formData.objetivo}
                  onChange={(e) => setFormData(prev => ({ ...prev, objetivo: e.target.value }))}
                >
                  <option value="min_distancia">{t('routes.minDistance')}</option>
                  <option value="min_tiempo">{t('routes.minTime')}</option>
                  <option value="max_eficiencia">{t('routes.maxEfficiency')}</option>
                </Select>
              </FormControl>

              {/* Vehicles Section */}
              <Box>
                <HStack justify="space-between" mb={3}>
                  <FormLabel mb={0}>{t('routes.vehicles')}</FormLabel>
                  <Button size="sm" leftIcon={<AddIcon />} onClick={addVehiculo}>
                    {t('routes.addVehicle')}
                  </Button>
                </HStack>
                <VStack spacing={4} align="stretch">
                  {formData.vehiculos.map((vehiculo, index) => (
                    <Box key={index} p={4} borderWidth="1px" borderRadius="md" bg="gray.50">
                      <HStack justify="space-between" mb={3}>
                        <Text fontWeight="semibold">{t('routes.vehicle')} {index + 1}</Text>
                        <IconButton
                          aria-label="Remove vehicle"
                          icon={<DeleteIcon />}
                          size="sm"
                          onClick={() => removeVehiculo(index)}
                          isDisabled={formData.vehiculos.length === 1}
                        />
                      </HStack>
                      <VStack spacing={3}>
                        <HStack spacing={3} w="100%">
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('routes.vehicleId')}</FormLabel>
                            <Input
                              value={vehiculo.id}
                              onChange={(e) => handleVehiculoChange(index, 'id', e.target.value)}
                              placeholder="VEH-001"
                            />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('routes.volumeCapacity')}</FormLabel>
                            <Input
                              type="number"
                              step="0.1"
                              value={vehiculo.capacidad_volumen}
                              onChange={(e) => handleVehiculoChange(index, 'capacidad_volumen', Number(e.target.value))}
                            />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('routes.weightCapacity')}</FormLabel>
                            <Input
                              type="number"
                              step="0.1"
                              value={vehiculo.capacidad_peso}
                              onChange={(e) => handleVehiculoChange(index, 'capacidad_peso', Number(e.target.value))}
                            />
                          </FormControl>
                        </HStack>
                        <HStack spacing={3} w="100%">
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('routes.depotLat')}</FormLabel>
                            <Input
                              type="number"
                              step="0.0001"
                              value={vehiculo.depot.lat}
                              onChange={(e) => handleVehiculoChange(index, 'depot.lat', e.target.value)}
                            />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('routes.depotLon')}</FormLabel>
                            <Input
                              type="number"
                              step="0.0001"
                              value={vehiculo.depot.lon}
                              onChange={(e) => handleVehiculoChange(index, 'depot.lon', e.target.value)}
                            />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('routes.maxDuration')}</FormLabel>
                            <Input
                              type="number"
                              value={vehiculo.duracion_maxima_minutos}
                              onChange={(e) => handleVehiculoChange(index, 'duracion_maxima_minutos', Number(e.target.value))}
                            />
                          </FormControl>
                        </HStack>
                        <FormControl display="flex" alignItems="center">
                          <Checkbox
                            isChecked={vehiculo.cadena_frio}
                            onChange={(e) => handleVehiculoChange(index, 'cadena_frio', e.target.checked)}
                          >
                            {t('routes.coldChain')}
                          </Checkbox>
                        </FormControl>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </Box>

              {/* Orders Section */}
              <Box>
                <HStack justify="space-between" mb={3}>
                  <FormLabel mb={0}>{t('routes.orders')}</FormLabel>
                  <Button size="sm" leftIcon={<AddIcon />} onClick={addPedido}>
                    {t('routes.addOrder')}
                  </Button>
                </HStack>
                <VStack spacing={4} align="stretch">
                  {formData.pedidos.map((pedido, index) => (
                    <Box key={index} p={4} borderWidth="1px" borderRadius="md" bg="blue.50">
                      <HStack justify="space-between" mb={3}>
                        <Text fontWeight="semibold">{t('routes.order')} {index + 1}</Text>
                        <IconButton
                          aria-label="Remove order"
                          icon={<DeleteIcon />}
                          size="sm"
                          onClick={() => removePedido(index)}
                          isDisabled={formData.pedidos.length === 1}
                        />
                      </HStack>
                      <VStack spacing={3}>
                        <HStack spacing={3} w="100%">
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('routes.orderId')}</FormLabel>
                            <Input
                              value={pedido.id}
                              onChange={(e) => handlePedidoChange(index, 'id', e.target.value)}
                              placeholder="PED-001"
                            />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('routes.latitude')}</FormLabel>
                            <Input
                              type="number"
                              step="0.0001"
                              value={pedido.lat}
                              onChange={(e) => handlePedidoChange(index, 'lat', Number(e.target.value))}
                            />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('routes.longitude')}</FormLabel>
                            <Input
                              type="number"
                              step="0.0001"
                              value={pedido.lon}
                              onChange={(e) => handlePedidoChange(index, 'lon', Number(e.target.value))}
                            />
                          </FormControl>
                        </HStack>
                        <HStack spacing={3} w="100%">
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('routes.windowStart')}</FormLabel>
                            <Input
                              type="time"
                              value={pedido.ventana_inicio}
                              onChange={(e) => handlePedidoChange(index, 'ventana_inicio', e.target.value)}
                            />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('routes.windowEnd')}</FormLabel>
                            <Input
                              type="time"
                              value={pedido.ventana_fin}
                              onChange={(e) => handlePedidoChange(index, 'ventana_fin', e.target.value)}
                            />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('routes.serviceTime')}</FormLabel>
                            <Input
                              type="number"
                              value={pedido.tiempo_servicio_minutos}
                              onChange={(e) => handlePedidoChange(index, 'tiempo_servicio_minutos', Number(e.target.value))}
                            />
                          </FormControl>
                        </HStack>
                        <HStack spacing={3} w="100%">
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('routes.volume')}</FormLabel>
                            <Input
                              type="number"
                              step="0.1"
                              value={pedido.volumen}
                              onChange={(e) => handlePedidoChange(index, 'volumen', Number(e.target.value))}
                            />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('routes.weight')}</FormLabel>
                            <Input
                              type="number"
                              step="0.1"
                              value={pedido.peso}
                              onChange={(e) => handlePedidoChange(index, 'peso', Number(e.target.value))}
                            />
                          </FormControl>
                          <FormControl display="flex" alignItems="flex-end" pb={2}>
                            <Checkbox
                              isChecked={pedido.requiere_frio}
                              onChange={(e) => handlePedidoChange(index, 'requiere_frio', e.target.checked)}
                            >
                              {t('routes.requiresCold')}
                            </Checkbox>
                          </FormControl>
                        </HStack>
                      </VStack>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={handleClose}>
              {t('common.cancel')}
            </Button>
            <Button colorScheme="blue" type="submit" isLoading={isLoading}>
              {t('routes.generate')}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default GenerateRouteModal;
