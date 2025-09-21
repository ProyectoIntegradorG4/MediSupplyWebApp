import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      blue: '#0078D4',
      teal: '#00B5B5',
    },
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'blue',
      },
      variants: {
        solid: {
          bg: '#0078D4',
          color: 'white',
          _hover: {
            bg: '#006CBD',
          },
        },
      },
    },
    Input: {
      variants: {
        outline: {
          field: {
            borderColor: 'gray.300',
            _focus: {
              borderColor: 'brand.blue',
              boxShadow: '0 0 0 1px #0078D4',
            },
          },
        },
      },
    },
  },
});

export default theme;