// Configuración para tests de Cypress
export const testConfig = {
  // Credenciales de prueba
  credentials: {
    email: 'correo1@uniandes.edu.co',
    password: '1234',
  },
  
  // URLs
  baseUrl: 'http://medisupply-alb-656658498.us-east-1.elb.amazonaws.com',
  
  // Timeouts
  timeouts: {
    login: 10000,
    loadData: 15000,
    default: 5000,
  },
  
  // Selectores comunes
  selectors: {
    loginForm: {
      emailInput: 'input[type="text"]',
      passwordInput: 'input[type="password"]',
      submitButton: 'button[type="submit"]',
    },
    providers: {
      table: 'table',
      tableHeader: 'thead',
      tableBody: 'tbody',
      headerCells: 'thead th',
      bodyRows: 'tbody tr',
      bodyCells: 'tbody td',
      searchInput: 'input[placeholder="Nombre"]',
      addButton: 'button:contains("AGREGAR PROVEEDOR")',
      rowsPerPageSelect: 'select',
    },
  },
  
  // Datos esperados
  expectedHeaders: ['NIT', 'RAZÓN SOCIAL', 'CIUDAD', 'TIPO', 'ESTADO'],
  
  // Validaciones
  validations: {
    nitPattern: /^[0-9\-]+$/,
    estadoPattern: /activo|inactivo/i,
  },
};

export default testConfig;
