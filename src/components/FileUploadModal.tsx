import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  Box,
  Input,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useState, useRef } from 'react';
import { productsApi } from '../services/api';

interface FileUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess?: () => void;
}

const FileUploadModal = ({ isOpen, onClose, onUploadSuccess }: FileUploadModalProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) { // 3MB limit
        toast({
          title: 'Error',
          description: 'El archivo no debe superar los 3MB',
          status: 'error',
          duration: 3000,
        });
        return;
      }
      if (!file.name.endsWith('.csv')) {
        toast({
          title: 'Error',
          description: 'Solo se permiten archivos CSV',
          status: 'error',
          duration: 3000,
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await productsApi.uploadProductsCsv(selectedFile, 'user123'); // TODO: Replace with actual user

      toast({
        title: 'Éxito',
        description: 'Archivo cargado correctamente',
        status: 'success',
        duration: 3000,
      });

      if (onUploadSuccess) {
        onUploadSuccess();
      }

      setSelectedFile(null);
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Error al cargar el archivo',
        status: 'error',
        duration: 3000,
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 3 * 1024 * 1024) {
        toast({
          title: 'Error',
          description: 'El archivo no debe superar los 3MB',
          status: 'error',
          duration: 3000,
        });
        return;
      }
      if (!file.name.endsWith('.csv')) {
        toast({
          title: 'Error',
          description: 'Solo se permiten archivos CSV',
          status: 'error',
          duration: 3000,
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Carga de Archivos</ModalHeader>
        <ModalBody>
          <VStack spacing={4}>
            <Text>
              Por favor seleccione el archivo para la carga másiva en formato .csv y con un tamaño no mayor
              a 3MB.
            </Text>
            <Box
              border="2px dashed"
              borderColor="blue.300"
              borderRadius="lg"
              p={10}
              w="100%"
              textAlign="center"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              cursor="pointer"
              onClick={() => fileInputRef.current?.click()}
              _hover={{ bg: 'gray.50' }}
            >
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                display="none"
                ref={fileInputRef}
              />
              <Text color="blue.500" mb={2}>
                {selectedFile ? selectedFile.name : 'Link or drag and drop'}
              </Text>
              <Text color="gray.500">CSV (max. 3MB)</Text>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter gap={3}>
          <Button variant="outline" onClick={onClose}>
            CANCELAR
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleUpload}
            isLoading={isUploading}
            isDisabled={!selectedFile}
          >
            ACEPTAR
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default FileUploadModal;
