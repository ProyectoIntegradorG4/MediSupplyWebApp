import { Box, Flex, Heading, Spacer, IconButton } from '@chakra-ui/react'
import { HamburgerIcon } from '@chakra-ui/icons'

interface NavbarProps {
  onMenuClick: () => void
}

function Navbar({ onMenuClick }: NavbarProps) {
  return (
    <Box bg="blue.500" px={6} py={4} boxShadow="sm">
      <Flex alignItems="center">
        <IconButton
          aria-label="Open menu"
          icon={<HamburgerIcon />}
          onClick={onMenuClick}
          variant="ghost"
          color="white"
          _hover={{ bg: 'blue.600' }}
          mr={4}
        />
        <Heading size="md" color="white">MediSupply</Heading>
        <Spacer />
      </Flex>
    </Box>
  )
}

export default Navbar