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
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        title: t('providers.createSuccess'),
        description: t('providers.createSuccess'),
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ['providers'] });
      handleClose();
    },
    onError: (error) => {
      toast({
        title: t('common.error'),
        description: `${t('providers.createError')}: ${error.message}`,
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
          {t('providers.createProvider')}
        </ModalHeader>
        <ModalBody>
          <VStack spacing={6}>
            <HStack spacing={4} width="100%">
              <FormControl isRequired>
                <FormLabel>{t('providers.businessName')}</FormLabel>
                <Input
                  placeholder={t('providers.businessName')}
                  value={formData.razon_social}
                  onChange={(e) =>
                    setFormData({ ...formData, razon_social: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t('providers.providerType')}</FormLabel>
                <Select
                  value={formData.tipo_proveedor}
                  onChange={(e) =>
                    setFormData({ ...formData, tipo_proveedor: e.target.value })
                  }
                >
                  <option value="distribuidor">{t('providers.distributor')}</option>
                  <option value="laboratorio">{t('providers.laboratory')}</option>
                  <option value="importador">{t('providers.importer')}</option>
                </Select>
              </FormControl>
            </HStack>

            <HStack spacing={4} width="100%">
              <FormControl isRequired>
                <FormLabel>{t('providers.nit')}</FormLabel>
                <Input
                  placeholder={t('providers.nit')}
                  value={formData.nit}
                  onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t('providers.email')}</FormLabel>
                <Input
                  type="email"
                  placeholder={t('providers.email')}
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </FormControl>
            </HStack>

            <HStack spacing={4} width="100%">
              <FormControl isRequired>
                <FormLabel>{t('providers.country')}</FormLabel>
                <Select
                  value={formData.pais}
                  onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                >
                  <option value="colombia">{t('providers.colombia')}</option>
                  <option value="mexico">{t('providers.mexico')}</option>
                  <option value="argentina">{t('providers.argentina')}</option>
                  <option value="chile">{t('providers.chile')}</option>
                  <option value="peru">{t('providers.peru')}</option>
                </Select>
              </FormControl>
              <FormControl>
                <FormLabel>{t('providers.city')}</FormLabel>
                <Input
                  placeholder={t('providers.city')}
                  value={formData.ciudad}
                  onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                />
              </FormControl>
            </HStack>

            <HStack spacing={4} width="100%">
              <FormControl>
                <FormLabel>{t('providers.phone')}</FormLabel>
                <Input
                  placeholder={t('providers.phone')}
                  value={formData.telefono}
                  onChange={(e) =>
                    setFormData({ ...formData, telefono: e.target.value })
                  }
                />
              </FormControl>
              <FormControl>
                <FormLabel>{t('providers.address')}</FormLabel>
                <Input
                  placeholder={t('providers.address')}
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
                {t('common.active')}
              </Checkbox>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={handleClose}>
            {t('common.cancel')}
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isDisabled={!isFormValid()}
            isLoading={createMutation.isPending}
          >
            {t('common.accept')}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProviderCreateModal;
