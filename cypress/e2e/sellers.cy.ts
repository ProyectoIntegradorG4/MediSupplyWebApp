/// <reference types="cypress" />

describe('Pruebas de Vendedores - Listado', () => {
  const email = 'correo1@uniandes.edu.co';
  const password = '1234';
  
  // Login una sola vez para el test de listado
  before(() => {
    cy.login(email, password);
    cy.url().should('include', '/products', { timeout: 10000 });
  });

  it('Debe navegar a la página de vendedores, mostrar datos y filtrar por nombre', () => {
    // Navegar a la página de vendedores
    cy.visit('/people');
    cy.url().should('include', '/people');
    
    // Hacer clic en el tab de VENDEDORES si existe
    cy.contains('VENDEDORES').click();
    
    // Verificar que el título de la página está presente
    cy.contains('Información de Vendedores').should('be.visible');
    
    // Verificar que la tabla está presente
    cy.get('table').should('be.visible');
    cy.get('thead').should('be.visible');
    
    // Esperar a que se carguen los datos
    cy.get('tbody tr', { timeout: 15000 }).should('have.length.greaterThan', 0);
    cy.log('✅ Tabla de vendedores cargada con datos');
    
    // Verificar que la primera fila tiene datos
    cy.get('tbody tr').first().find('td').should('have.length.greaterThan', 0);
    
    // Obtener el nombre del primer vendedor para buscarlo
    cy.get('tbody tr').first().find('td').eq(1).invoke('text').then((sellerName) => {
      const searchTerm = sellerName.trim().substring(0, 5);
      cy.log(`Buscando por: ${searchTerm}`);
      
      // Filtrar por el nombre
      cy.get('input[placeholder="Nombre"]').clear();
      cy.get('input[placeholder="Nombre"]').type(searchTerm);
      
      // Esperar a que se complete el filtrado
      cy.wait(1000);
      
      // Verificar que aparece en la lista
      cy.get('tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
      
      cy.get('tbody tr').first().find('td').eq(1).invoke('text').then((filteredName) => {
        expect(filteredName.trim()).to.include(searchTerm);
        cy.log(`✅ Filtrado completado - Vendedor encontrado: ${filteredName.trim()}`);
      });
    });
  });
});

describe('Pruebas de Vendedores - Creación', () => {
  const email = 'correo1@uniandes.edu.co';
  const password = '1234';
  
  // Login antes de crear el vendedor
  before(() => {
    cy.login(email, password);
    cy.url().should('include', '/products', { timeout: 10000 });
  });

  it('Debe crear un vendedor y verificar que aparece en la lista', () => {
    // Navegar a la página de vendedores
    cy.visit('/people');
    cy.url().should('include', '/people');
    
    // Hacer clic en el tab de VENDEDORES
    cy.contains('VENDEDORES').click();
    
    // Generar datos aleatorios para el vendedor
    const randomDoc = Math.floor(Math.random() * 900000) + 100000;
    const randomEmail = Math.floor(Math.random() * 99) + 10;
    const randomPhone = Math.floor(Math.random() * 900000) + 100000;
    const nombres = 'NombreTest';
    const apellidos = 'Test';
    const numeroDocumento = randomDoc.toString();
    const emailVendedor = `correo${randomEmail}@uniandes.edu.co`;
    const telefono = randomPhone.toString();
    const pais = 'Colombia';
    const territorioId = 'Bogota-centro';
    
    cy.log(`Creando vendedor: ${nombres} ${apellidos}`);
    
    // Abrir el modal de creación
    cy.openSellerModal();
    cy.log('✅ Modal abierto');
    
    // Llenar el formulario
    cy.fillSellerForm({
      nombres: nombres,
      apellidos: apellidos,
      numeroDocumento: numeroDocumento,
      email: emailVendedor,
      telefono: telefono,
      pais: pais,
      territorioId: territorioId
    });
    
    cy.log('✅ Formulario llenado');
    
    // Enviar el formulario
    cy.submitSellerForm();
    cy.log('✅ Formulario enviado');
    
    // Esperar un momento para que se actualice la tabla
    cy.wait(2000);
    
    // Buscar el vendedor creado filtrando por nombre
    const searchTerm = nombres.substring(0, 8);
    cy.get('input[placeholder="Nombre"]').clear();
    cy.get('input[placeholder="Nombre"]').type(searchTerm);
    
    // Esperar a que se complete el filtrado
    cy.wait(1000);
    
    // Verificar que el vendedor aparece en la lista
    cy.get('tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
    cy.log('✅ Búsqueda completada');
    
    // Verificar que existe al menos un elemento que coincida con el término de búsqueda
    cy.get('tbody tr').first().find('td').eq(1).invoke('text').then((foundName) => {
      expect(foundName.trim()).to.include(searchTerm);
      cy.log(`✅ Vendedor encontrado en la lista: ${foundName.trim()}`);
    });
  });
});
