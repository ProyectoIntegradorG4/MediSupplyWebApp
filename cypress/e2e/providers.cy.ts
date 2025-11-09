/// <reference types="cypress" />

describe('Pruebas de Proveedores - Listado', () => {
  const email = 'correo1@uniandes.edu.co';
  const password = '1234';
  
  // Login una sola vez para el test de listado
  before(() => {
    cy.login(email, password);
    cy.url().should('include', '/products', { timeout: 10000 });
  });

  it('Debe navegar a la página de proveedores, mostrar datos y filtrar por nombre', () => {
    // Navegar a la página de proveedores
    cy.navigateToProviders();
    
    // Verificar que el título de la página está presente
    cy.contains('Proveedores y Productos').should('be.visible');
    cy.contains('PROVEEDORES').should('be.visible');
    
    // Verificar que la tabla está presente
    cy.get('table').should('be.visible');
    cy.get('thead').should('be.visible');
    cy.get('thead th').should('have.length', 5);
    
    // Esperar a que se carguen los datos
    cy.waitForProvidersTable();
    cy.log('✅ Tabla cargada con datos');
    
    // Verificar que la primera fila tiene 5 celdas
    cy.get('tbody tr').first().find('td').should('have.length', 5);
    
    // Obtener el nombre del primer proveedor para buscarlo
    cy.get('tbody tr').first().find('td').eq(1).invoke('text').then((providerName) => {
      const searchTerm = providerName.trim().substring(0, 5);
      cy.log(`Buscando por: ${searchTerm}`);
      
      // Filtrar por el nombre
      cy.filterProvidersByName(searchTerm);
      
      // Verificar que aparece en la lista
      cy.verifyProviderInList(searchTerm);
      cy.log(`✅ Filtrado completado - Proveedor encontrado: ${providerName.trim()}`);
    });
  });
});

describe('Pruebas de Proveedores - Creación', () => {
  const email = 'correo1@uniandes.edu.co';
  const password = '1234';
  
  // Login antes de crear el proveedor
  before(() => {
    cy.login(email, password);
    cy.url().should('include', '/products', { timeout: 10000 });
  });

  it('Debe crear un proveedor y verificar que aparece en la lista', () => {
    // Navegar a la página de proveedores
    cy.navigateToProviders();
    
    // Generar datos aleatorios para el proveedor
    const randomNum = Math.floor(Math.random() * 1000) + 1;
    const randomPhone = Math.floor(Math.random() * 900000) + 100000;
    const razonSocial = `Universidad ${randomNum}`;
    
    cy.log(`Creando proveedor: ${razonSocial}`);
    
    // Abrir el modal de creación
    cy.openProviderModal();
    cy.log('✅ Modal abierto');
    
    // Llenar el formulario
    cy.fillProviderForm({
      razonSocial: razonSocial,
      nit: '80002000',
      email: 'test@uniandes.edu.co',
      tipoproveedor: 'Distribuidor',
      pais: 'Colombia',
      ciudad: 'Test',
      telefono: randomPhone.toString(),
      direccion: 'Cr 10 10 -10'
    });
    
    cy.log('✅ Formulario llenado');
    
    // Enviar el formulario
    cy.submitProviderForm();
    cy.log('✅ Formulario enviado');
    
    // Esperar un momento para que se actualice la tabla
    cy.wait(2000);
    
    // Buscar el proveedor creado filtrando por parte del nombre
    const searchTerm = razonSocial.substring(0, 10);
    cy.filterProvidersByName(searchTerm);
    
    // Verificar que aparece en la lista
    cy.verifyProviderInList(searchTerm);
    cy.log(`✅ Proveedor encontrado en la lista`);
  });
});

