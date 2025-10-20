import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Select,
  useToast,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState } from 'react';
import { Product } from '../types/api';
import { productsApi } from '../services/api';

interface ProductCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductCreated?: (product: Product) => void;
}

interface FormData {
  name: string;
  sku: string;
  location: string;
  ubicacion: string;
  stock: string;
}

const ProductCreateModal = ({ isOpen, onClose, onProductCreated }: ProductCreateModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: 'Producto 1',
    sku: '',
    location: 'Bodega 1',
    ubicacion: '',
    stock: '',
  });
  
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const toast = useToast();

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    if (!formData.sku.trim()) {
      newErrors.sku = 'El SKU es requerido';
    }
    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es requerida';
    }
    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = 'La ubicación es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Create product object
      const newProduct = {
        sku: formData.sku,
        name: formData.name,
        stock: parseInt(formData.stock) || 0,
        location: formData.ubicacion,
        category: 'General', // Default category
      };

      // Call the actual API
      const createdProduct = await productsApi.createProduct(newProduct);

      toast({
        title: 'Éxito',
        description: 'Producto creado correctamente',
        status: 'success',
        duration: 3000,
      });

      if (onProductCreated) {
        onProductCreated(createdProduct);
      }

      // Reset form and close modal
      setFormData({
        name: 'Producto 1',
        sku: '',
        location: 'Bodega 1',
        ubicacion: '',
        stock: '',
      });
      setErrors({});
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al crear el producto',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: 'Producto 1',
      sku: '',
      location: 'Bodega 1',
      ubicacion: '',
      stock: '',
    });
    setErrors({});
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg" isCentered>
      <ModalOverlay />
      <ModalContent maxW="600px" borderRadius="lg" boxShadow="xl">
        <ModalHeader 
          fontSize="lg" 
          fontWeight="semibold" 
          color="gray.700"
          borderBottom="1px"
          borderColor="gray.200"
          pb={4}
        >
          Carga Individual de Productos
        </ModalHeader>
        <ModalBody py={6}>
          <VStack spacing={6}>
            <HStack spacing={8} w="100%" align="start">
              {/* Left Column */}
              <VStack spacing={5} flex={1} align="stretch">
                <FormControl isInvalid={!!errors.name}>
                  <FormLabel 
                    fontSize="sm" 
                    fontWeight="medium" 
                    color="gray.700"
                    mb={2}
                  >
                    Nombre *
                  </FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Nombre del producto"
                    size="md"
                    borderRadius="md"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: 'blue.500',
                      boxShadow: '0 0 0 1px #0078D4',
                    }}
                  />
                  <FormErrorMessage fontSize="xs">{errors.name}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.location}>
                  <FormLabel 
                    fontSize="sm" 
                    fontWeight="medium" 
                    color="gray.700"
                    mb={2}
                  >
                    Location *
                  </FormLabel>
                  <Select
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    size="md"
                    borderRadius="md"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: 'blue.500',
                      boxShadow: '0 0 0 1px #0078D4',
                    }}
                  >
                    <option value="Bodega 1">Bodega 1</option>
                    <option value="Bodega 2">Bodega 2</option>
                    <option value="Bodega 3">Bodega 3</option>
                    <option value="Almacén Central">Almacén Central</option>
                  </Select>
                  <FormErrorMessage fontSize="xs">{errors.location}</FormErrorMessage>
                </FormControl>

                <FormControl>
                  <FormLabel 
                    fontSize="sm" 
                    fontWeight="medium" 
                    color="gray.700"
                    mb={2}
                  >
                    Stock
                  </FormLabel>
                  <Input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    placeholder="Cantidad en stock"
                    size="md"
                    borderRadius="md"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: 'blue.500',
                      boxShadow: '0 0 0 1px #0078D4',
                    }}
                  />
                </FormControl>
              </VStack>

              {/* Right Column */}
              <VStack spacing={5} flex={1} align="stretch">
                <FormControl isInvalid={!!errors.sku}>
                  <FormLabel 
                    fontSize="sm" 
                    fontWeight="medium" 
                    color="gray.700"
                    mb={2}
                  >
                    SKU *
                  </FormLabel>
                  <Input
                    value={formData.sku}
                    onChange={(e) => handleInputChange('sku', e.target.value)}
                    placeholder="Código SKU"
                    size="md"
                    borderRadius="md"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: 'blue.500',
                      boxShadow: '0 0 0 1px #0078D4',
                    }}
                  />
                  <FormErrorMessage fontSize="xs">{errors.sku}</FormErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!errors.ubicacion}>
                  <FormLabel 
                    fontSize="sm" 
                    fontWeight="medium" 
                    color="gray.700"
                    mb={2}
                  >
                    Ubicación *
                  </FormLabel>
                  <Input
                    value={formData.ubicacion}
                    onChange={(e) => handleInputChange('ubicacion', e.target.value)}
                    placeholder="Ubicación específica"
                    size="md"
                    borderRadius="md"
                    borderColor="gray.300"
                    _focus={{
                      borderColor: 'blue.500',
                      boxShadow: '0 0 0 1px #0078D4',
                    }}
                  />
                  <FormErrorMessage fontSize="xs">{errors.ubicacion}</FormErrorMessage>
                </FormControl>
              </VStack>
            </HStack>
          </VStack>
        </ModalBody>

        <ModalFooter 
          gap={3} 
          pt={4}
          borderTop="1px"
          borderColor="gray.200"
        >
          <Button 
            variant="outline" 
            onClick={handleClose}
            size="md"
            fontWeight="medium"
            borderColor="gray.300"
            color="gray.700"
            _hover={{
              bg: 'gray.50',
              borderColor: 'gray.400',
            }}
          >
            CANCELAR
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={isSubmitting}
            size="md"
            fontWeight="medium"
            bg="#0078D4"
            _hover={{
              bg: '#006CBD',
            }}
          >
            ACEPTAR
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ProductCreateModal;
