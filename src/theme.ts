import { extendTheme } from '@chakra-ui/react'

const colors = {
  medisupply: {
    50: '#EBF9FF', 
    100: '#47C8FF',
    200: '#009EE3',
    300: '#004766',
    400: '#000E14',
  }
}

const fonts = {
  heading: `'Open Sans', sans-serif`,
  body: `'Open Sans', sans-serif`,
}

const theme = extendTheme({
  colors,
  fonts,
  styles: {
    global: {
      body: {
        bg: 'medisupply.50',
        color: 'medisupply.400',
        fontFamily: `'Open Sans', sans-serif`
      }
    }
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'medisupply'
      }
    }
  }
})

export default theme