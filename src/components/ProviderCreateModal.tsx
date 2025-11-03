import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  VStack,
  HStack,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { providersApi } from '../services/api';

interface ProviderCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface FormData {
  razon_social: string;
  nit: string;
  tipo_proveedor: string;
  email: string;
  telefono: string;
  direccion: string;
  ciudad: string;
  pais: string;
  estado: string;
}

const ProviderCreateModal = ({ isOpen, onClose }: ProviderCreateModalProps) => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [isActivo, setIsActivo] = useState(true);
  const [formData, setFormData] = useState<FormData>({
    razon_social: '',
    nit: '',
    tipo_proveedor: 'distribuidor',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
    pais: 'colombia',
    estado: 'activo',
  });

  const createMutation = useMutation({
    mutationFn: providersApi.createProvider,
    onSuccess: () => {
      toast({
        title: 'Proveedor creado',
        description: 'El proveedor ha sido creado exitosamente',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: 'Error',
        description: `Error al crear el proveedor: ${error.message}`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  const handleClose = () => {
    setFormData({
      razon_social: '',
      nit: '',
      tipo_proveedor: 'distribuidor',
      email: '',
      telefono: '',
      direccion: '',
      ciudad: '',
      pais: 'colombia',
      estado: 'activo',
    });
    setIsActivo(true);
    onClose();
  };

  const handleSubmit = () => {
    const newProvider = {
      razon_social: formData.razon_social,
      nit: formData.nit,
      tipo_proveedor: formData.tipo_proveedor,
      email: formData.email,
      telefono: formData.telefono,
      direccion: formData.direccion,
      ciudad: formData.ciudad,
      pais: formData.pais,
      certificaciones: [],
      estado: isActivo ? 'activo' : 'inactivo',
      validacion_regulatoria: 'en_revision',
      calificacion: null,
      tiempo_entrega_promedio: null,
    };

    createMutation.mutate(newProvider);
  };

  const isFormValid = () => {
    return (
      formData.razon_social.trim() !== '' &&
      formData.nit.trim() !== '' &&
      formData.pais.trim() !== ''
    );
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="2xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize="2xl" fontWeight="normal">
          Creación de Proveedor
        </ModalHeader>
        <ModalBody>
          <VStack spacing={6}>
            <HStack spacing={4} width="100%">
              <FormControl isRequired>
                <FormLabel>Razón Social</FormLabel>
                <Input
                  placeholder="Razón Social"
                  value={formData.razon_social}
                  onChange={(e) =>
                    setFormData({ ...formData, razon_social: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Tipo de Proveedor</FormLabel>
                <Select
                  value={formData.tipo_proveedor}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo_proveedor: e.target.value })
                  }
                >
                  <option value="distribuidor">Distribuidor</option>
                  <option value="fabricante">Fabricante</option>
                  <option value="importador">Importador</option>
                </Select>
              </FormControl>
            </HStack>

            <HStack spacing={4} width="100%">
              <FormControl isRequired>
                <FormLabel>NIT</FormLabel>
                <Input
                  placeholder="NIT"
                  value={formData.nit}
                  onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input
                  type="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </FormControl>
            </HStack>

            <HStack spacing={4} width="100%">
              <FormControl isRequired>
                <FormLabel>País</FormLabel>
                <Select
                  value={formData.pais}
                  onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                >
                  <option value="colombia">Colombia</option>
                  <option value="mexico">México</option>
                  <option value="argentina">Argentina</option>
                  <option value="chile">Chile</option>
                  <option value="peru">Perú</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>Ciudad</FormLabel>
                <Input
                  placeholder="Ciudad"
                  value={formData.ciudad}
                  onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                />
              </FormControl>
            </HStack>

            <HStack spacing={4} width="100%">
              <FormControl>
                <FormLabel>Teléfono</FormLabel>
                <Input
                  placeholder="Teléfono"
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>Dirección</FormLabel>
                <Input
                  placeholder="Dirección"
                  value={formData.direccion}
                  onChange={(e) =>
                    setFormData({ ...formData, direccion: e.target.value })
                  }
                />
              </FormControl>
            </HStack>

            <HStack spacing={4} width="100%" justifyContent="flex-start">
              <Checkbox
                isChecked={isActivo}
                onChange={(e) => setIsActivo(e.target.checked)}
                colorScheme="blue"
              >
                ¿Está Activo?
              </Checkbox>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={handleClose}>
            CANCELAR
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isDisabled={!isFormValid()}
            isLoading={createMutation.isPending}
          >
            ACEPTAR
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProviderCreateModal;
