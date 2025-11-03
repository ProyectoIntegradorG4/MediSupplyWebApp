import {
  Box,
  VStack,
  HStack,
  Text,
  Icon,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome,
  FaBoxes,
  FaTruck,
  FaUsers,
  FaWarehouse,
  FaChartBar,
} from 'react-icons/fa';

interface NavItem {
  name: string;
  path: string;
  icon: typeof FaHome;
}

const navItems: NavItem[] = [
  { name: 'Home', path: '/dashboard', icon: FaHome },
  { name: 'Inventory', path: '/products', icon: FaBoxes },
  { name: 'Delivery', path: '/delivery', icon: FaTruck },
  { name: 'People', path: '/people', icon: FaUsers },
  { name: 'Supplies', path: '/providers', icon: FaWarehouse },
  { name: 'Reports', path: '/reports', icon: FaChartBar },
];

interface SidebarContentProps {
  onClose?: () => void;
}

const SidebarContent = ({ onClose }: SidebarContentProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <VStack spacing={0} align="stretch" height="100%">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <HStack
            key={item.path}
            px={6}
            py={4}
            cursor="pointer"
            bg={isActive ? 'gray.100' : 'transparent'}
            _hover={{ bg: 'gray.50' }}
            onClick={() => handleNavigation(item.path)}
            transition="background 0.2s"
          >
            <Icon as={item.icon} boxSize={6} color="gray.700" />
            <Text fontSize="lg" fontWeight={isActive ? 'semibold' : 'normal'}>
              {item.name}
            </Text>
          </HStack>
        );
      })}
    </VStack>
  );
};

const Sidebar = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Mobile Menu Button */}
      <IconButton
        aria-label="Open menu"
        icon={<HamburgerIcon />}
        onClick={onOpen}
        display={{ base: 'flex', md: 'none' }}
        position="fixed"
        top={4}
        left={4}
        zIndex={20}
        colorScheme="blue"
      />

      {/* Desktop Sidebar */}
      <Box
        display={{ base: 'none', md: 'block' }}
        width="240px"
        height="100vh"
        bg="white"
        borderRight="1px solid"
        borderColor="gray.200"
        position="fixed"
        left={0}
        top={0}
        overflowY="auto"
      >
        <SidebarContent />
      </Box>

      {/* Mobile Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerBody p={0} mt={10}>
            <SidebarContent onClose={onClose} />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Sidebar;
