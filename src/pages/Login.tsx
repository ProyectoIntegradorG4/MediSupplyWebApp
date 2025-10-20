import { Box, Button, Container, FormControl, FormLabel, Input, VStack, Image, useColorModeValue, FormErrorMessage, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({ username: '', password: '' });
  const navigate = useNavigate();
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {
      username: username.trim() === '' ? 'Username is required' : '',
      password: password.trim() === '' ? 'Password is required' : ''
    };
    setErrors(newErrors);
    return !newErrors.username && !newErrors.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Only navigate to products if login is successful
      // For now, we'll simulate a successful login
      navigate('/products');
      
      toast({
        title: 'Success',
        description: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Login failed. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box
      minH="100vh"
      bg={useColorModeValue('gray.50', 'gray.800')}
      py={{ base: '12', md: '24' }}
      px={{ base: '4', md: '8' }}
    >
      <Container maxW="lg" py={{ base: '12', md: '8' }} px={{ base: '0', sm: '8' }}>
        <VStack spacing="8">
          <Image
            src="/logo.png"
            alt="MediSupply Logo"
            maxW="300px"
            mb="8"
          />
          <Box
            py={{ base: '0', sm: '8' }}
            px={{ base: '4', sm: '10' }}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={{ base: 'none', sm: 'md' }}
            borderRadius={{ base: 'none', sm: 'xl' }}
            w="100%"
          >
            <form onSubmit={handleSubmit}>
              <VStack spacing="6">
                <FormControl id="username" isInvalid={!!errors.username}>
                  <FormLabel>Label</FormLabel>
                  <Input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Value"
                  />
                  <FormErrorMessage>{errors.username}</FormErrorMessage>
                </FormControl>
                <FormControl id="password" isInvalid={!!errors.password}>
                  <FormLabel>Password</FormLabel>
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                  />
                  <FormErrorMessage>{errors.password}</FormErrorMessage>
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  size="lg"
                  fontSize="md"
                  w="100%"
                  isLoading={isSubmitting}
                >
                  LOG IN
                </Button>
              </VStack>
            </form>
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

export default Login;
