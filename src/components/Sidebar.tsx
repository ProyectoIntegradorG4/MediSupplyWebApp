import {
  Box,
  VStack,
  Icon,
  Text,
  Drawer,
  DrawerBody,
  DrawerOverlay,
  DrawerContent,
} from '@chakra-ui/react';
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
    <VStack spacing={0} align="stretch" height="100%" pt={4}>
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Box
            key={item.path}
            py={5}
            px={6}
            cursor="pointer"
            bg={isActive ? 'gray.100' : 'transparent'}
            _hover={{ bg: 'gray.50' }}
            onClick={() => handleNavigation(item.path)}
            transition="background 0.2s"
            display="flex"
            flexDirection="row"
            alignItems="center"
            gap={6}
          >
            <Icon
              as={item.icon}
              boxSize={6}
              color={isActive ? 'black' : 'gray.600'}
            />
            <Text
              fontSize="sm"
              fontWeight={isActive ? 'semibold' : 'normal'}
              color={isActive ? 'black' : 'gray.600'}
            >
              {item.name}
            </Text>
          </Box>
        );
      })}
    </VStack>
  );
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <Drawer isOpen={isOpen} placement="left" onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent maxW="200px">
        <DrawerBody p={0}>
          <SidebarContent onClose={onClose} />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default Sidebar;
