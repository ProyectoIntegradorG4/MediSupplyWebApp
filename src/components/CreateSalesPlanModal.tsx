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
} from '@chakra-ui/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';

interface Meta {
  productoId: string;
  territorioId: string;
  vendedorId: string;
  objetivo_cantidad: number;
  objetivo_valor: number;
  nota: string;
}

interface CreateSalesPlanFormData {
  nombre: string;
  periodo: {
    desde: string;
    hasta: string;
  };
  territorios: string[];
  metas: Meta[];
}

interface CreateSalesPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSalesPlanFormData) => void;
  isLoading?: boolean;
}

const CreateSalesPlanModal = ({ isOpen, onClose, onSubmit, isLoading }: CreateSalesPlanModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<CreateSalesPlanFormData>({
    nombre: '',
    periodo: {
      desde: '',
      hasta: '',
    },
    territorios: [''],
    metas: [{
      productoId: '',
      territorioId: '',
      vendedorId: '',
      objetivo_cantidad: 0,
      objetivo_valor: 0,
      nota: '',
    }],
  });

  const handleInputChange = (field: string, value: any) => {
    if (field.startsWith('periodo.')) {
      const periodoField = field.split('.')[1];
      setFormData(prev => ({
        ...prev,
        periodo: {
          ...prev.periodo,
          [periodoField]: value,
        },
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleTerritorioChange = (index: number, value: string) => {
    const newTerritorios = [...formData.territorios];
    newTerritorios[index] = value;
    setFormData(prev => ({ ...prev, territorios: newTerritorios }));
  };

  const addTerritorio = () => {
    setFormData(prev => ({
      ...prev,
      territorios: [...prev.territorios, ''],
    }));
  };

  const removeTerritorio = (index: number) => {
    if (formData.territorios.length > 1) {
      setFormData(prev => ({
        ...prev,
        territorios: prev.territorios.filter((_, i) => i !== index),
      }));
    }
  };

  const handleMetaChange = (index: number, field: keyof Meta, value: any) => {
    const newMetas = [...formData.metas];
    newMetas[index] = { ...newMetas[index], [field]: value };
    setFormData(prev => ({ ...prev, metas: newMetas }));
  };

  const addMeta = () => {
    setFormData(prev => ({
      ...prev,
      metas: [...prev.metas, {
        productoId: '',
        territorioId: '',
        vendedorId: '',
        objetivo_cantidad: 0,
        objetivo_valor: 0,
        nota: '',
      }],
    }));
  };

  const removeMeta = (index: number) => {
    if (formData.metas.length > 1) {
      setFormData(prev => ({
        ...prev,
        metas: prev.metas.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      periodo: { desde: '', hasta: '' },
      territorios: [''],
      metas: [{
        productoId: '',
        territorioId: '',
        vendedorId: '',
        objetivo_cantidad: 0,
        objetivo_valor: 0,
        nota: '',
      }],
    });
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{t('salesPlan.createSalesPlan')}</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* Basic Info */}
              <FormControl isRequired>
                <FormLabel>{t('salesPlan.name')}</FormLabel>
                <Input
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  placeholder={t('salesPlan.namePlaceholder')}
                />
              </FormControl>

              {/* Period */}
              <Box>
                <FormLabel>{t('salesPlan.period')}</FormLabel>
                <HStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">{t('salesPlan.startDate')}</FormLabel>
                    <Input
                      type="date"
                      value={formData.periodo.desde}
                      onChange={(e) => handleInputChange('periodo.desde', e.target.value)}
                    />
                  </FormControl>
                  <FormControl isRequired>
                    <FormLabel fontSize="sm">{t('salesPlan.endDate')}</FormLabel>
                    <Input
                      type="date"
                      value={formData.periodo.hasta}
                      onChange={(e) => handleInputChange('periodo.hasta', e.target.value)}
                    />
                  </FormControl>
                </HStack>
              </Box>

              {/* Territorios */}
              <Box>
                <HStack justify="space-between" mb={2}>
                  <FormLabel mb={0}>{t('salesPlan.territories')}</FormLabel>
                  <Button size="sm" leftIcon={<AddIcon />} onClick={addTerritorio}>
                    {t('salesPlan.addTerritory')}
                  </Button>
                </HStack>
                <VStack spacing={2} align="stretch">
                  {formData.territorios.map((territorio, index) => (
                    <HStack key={index}>
                      <Input
                        value={territorio}
                        onChange={(e) => handleTerritorioChange(index, e.target.value)}
                        placeholder={t('salesPlan.territoryPlaceholder')}
                      />
                      <IconButton
                        aria-label="Remove territory"
                        icon={<DeleteIcon />}
                        onClick={() => removeTerritorio(index)}
                        isDisabled={formData.territorios.length === 1}
                      />
                    </HStack>
                  ))}
                </VStack>
              </Box>

              {/* Metas */}
              <Box>
                <HStack justify="space-between" mb={2}>
                  <FormLabel mb={0}>{t('salesPlan.goals')}</FormLabel>
                  <Button size="sm" leftIcon={<AddIcon />} onClick={addMeta}>
                    {t('salesPlan.addGoal')}
                  </Button>
                </HStack>
                <VStack spacing={4} align="stretch">
                  {formData.metas.map((meta, index) => (
                    <Box key={index} p={4} borderWidth="1px" borderRadius="md" position="relative">
                      <HStack justify="space-between" mb={3}>
                        <Text fontWeight="semibold">{t('salesPlan.goal')} {index + 1}</Text>
                        <IconButton
                          aria-label="Remove goal"
                          icon={<DeleteIcon />}
                          size="sm"
                          onClick={() => removeMeta(index)}
                          isDisabled={formData.metas.length === 1}
                        />
                      </HStack>
                      <VStack spacing={3}>
                        <HStack spacing={3} w="100%">
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('salesPlan.productId')}</FormLabel>
                            <Input
                              value={meta.productoId}
                              onChange={(e) => handleMetaChange(index, 'productoId', e.target.value)}
                              placeholder="P001"
                            />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('salesPlan.territoryId')}</FormLabel>
                            <Input
                              value={meta.territorioId}
                              onChange={(e) => handleMetaChange(index, 'territorioId', e.target.value)}
                              placeholder="TERR-ANTIOQUIA"
                            />
                          </FormControl>
                        </HStack>
                        <HStack spacing={3} w="100%">
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('salesPlan.sellerId')}</FormLabel>
                            <Input
                              value={meta.vendedorId}
                              onChange={(e) => handleMetaChange(index, 'vendedorId', e.target.value)}
                              placeholder="1"
                            />
                          </FormControl>
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('salesPlan.targetQuantity')}</FormLabel>
                            <Input
                              type="number"
                              value={meta.objetivo_cantidad}
                              onChange={(e) => handleMetaChange(index, 'objetivo_cantidad', Number(e.target.value))}
                              placeholder="100"
                            />
                          </FormControl>
                        </HStack>
                        <HStack spacing={3} w="100%">
                          <FormControl isRequired>
                            <FormLabel fontSize="sm">{t('salesPlan.targetValue')}</FormLabel>
                            <Input
                              type="number"
                              value={meta.objetivo_valor}
                              onChange={(e) => handleMetaChange(index, 'objetivo_valor', Number(e.target.value))}
                              placeholder="50000"
                            />
                          </FormControl>
                          <FormControl>
                            <FormLabel fontSize="sm">{t('salesPlan.note')}</FormLabel>
                            <Input
                              value={meta.nota}
                              onChange={(e) => handleMetaChange(index, 'nota', e.target.value)}
                              placeholder={t('salesPlan.notePlaceholder')}
                            />
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
              {t('salesPlan.create')}
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
};

export default CreateSalesPlanModal;
