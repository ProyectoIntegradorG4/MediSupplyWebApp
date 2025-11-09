/// <reference types="cypress" />

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
/// <reference types="cypress" />

// Custom command for login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/login');
  cy.get('input[type="text"]').type(email);
  cy.get('input[type="password"]').type(password);
  cy.get('button[type="submit"]').click();
});

// Custom command to navigate to providers
Cypress.Commands.add('navigateToProviders', () => {
  cy.visit('/providers');
  cy.url().should('include', '/providers');
});

// Custom command to wait for providers table
Cypress.Commands.add('waitForProvidersTable', () => {
  cy.get('tbody tr', { timeout: 15000 }).should('have.length.greaterThan', 0);
});

// Custom command to filter providers by name
Cypress.Commands.add('filterProvidersByName', (searchTerm: string) => {
  cy.get('input[placeholder="Nombre"]').clear();
  cy.get('input[placeholder="Nombre"]').type(searchTerm);
  cy.wait(1000);
});

// Custom command to verify provider exists in list
Cypress.Commands.add('verifyProviderInList', (providerName: string) => {
  cy.get('tbody tr', { timeout: 10000 }).should('have.length.greaterThan', 0);
  cy.get('tbody tr').first().find('td').eq(1).invoke('text').then((foundName) => {
    expect(foundName.trim()).to.include(providerName);
  });
});

// Custom command to open provider creation modal
Cypress.Commands.add('openProviderModal', () => {
  cy.contains('button', 'AGREGAR PROVEEDOR').click();
  cy.contains('Creación de Proveedor', { timeout: 5000 }).should('be.visible');
});

// Custom command to fill provider form
Cypress.Commands.add('fillProviderForm', (data: {
  razonSocial: string;
  nit: string;
  email: string;
  tipoproveedor: string;
  pais: string;
  ciudad: string;
  telefono: string;
  direccion: string;
}) => {
  cy.contains('label', 'Razón Social').parent().find('input').type(data.razonSocial);
  cy.contains('label', 'NIT').parent().find('input').type(data.nit);
  cy.contains('label', 'Email').parent().find('input').type(data.email);
  cy.contains('label', 'Tipo de Proveedor').parent().find('select').select(data.tipoproveedor);
  cy.contains('label', 'País').parent().find('select').select(data.pais);
  cy.contains('label', 'Ciudad').parent().find('input').type(data.ciudad);
  cy.contains('label', 'Teléfono').parent().find('input').type(data.telefono);
  cy.contains('label', 'Dirección').parent().find('input').type(data.direccion);
});

// Custom command to submit provider form
Cypress.Commands.add('submitProviderForm', () => {
  cy.contains('button', 'ACEPTAR').click();
  cy.contains('Creación de Proveedor', { timeout: 10000 }).should('not.exist');
});

// Custom command to open seller creation modal
Cypress.Commands.add('openSellerModal', () => {
  cy.contains('button', 'AGREGAR VENDEDOR').click();
  cy.contains('Agregar Nuevo Vendedor', { timeout: 5000 }).should('be.visible');
});

// Custom command to fill seller form
Cypress.Commands.add('fillSellerForm', (data: {
  nombres: string;
  apellidos: string;
  numeroDocumento: string;
  email: string;
  telefono: string;
  pais: string;
  territorioId: string;
}) => {
  cy.contains('label', 'Nombres').parent().find('input').type(data.nombres);
  cy.contains('label', 'Apellidos').parent().find('input').type(data.apellidos);
  cy.get('input[name="numeroDocumento"]').type(data.numeroDocumento);
  cy.get('input[name="email"]').type(data.email);
  cy.get('input[name="telefono"]').type(data.telefono);
  cy.get('input[name="pais"]').clear().type(data.pais);
  cy.get('input[name="territorioId"]').clear().type(data.territorioId);
});

// Custom command to submit seller form
Cypress.Commands.add('submitSellerForm', () => {
  cy.contains('button', 'Crear Vendedor').click();
  cy.contains('Agregar Nuevo Vendedor', { timeout: 10000 }).should('not.exist');
});


// Extend the Cypress namespace to include custom commands
declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      navigateToProviders(): Chainable<void>;
      waitForProvidersTable(): Chainable<void>;
      filterProvidersByName(searchTerm: string): Chainable<void>;
      verifyProviderInList(providerName: string): Chainable<void>;
      openProviderModal(): Chainable<void>;
      fillProviderForm(data: {
        razonSocial: string;
        nit: string;
        email: string;
        tipoproveedor: string;
        pais: string;
        ciudad: string;
        telefono: string;
        direccion: string;
      }): Chainable<void>;
      submitProviderForm(): Chainable<void>;
      openSellerModal(): Chainable<void>;
      fillSellerForm(data: {
        nombres: string;
        apellidos: string;
        numeroDocumento: string;
        email: string;
        telefono: string;
        pais: string;
        territorioId: string;
      }): Chainable<void>;
      submitSellerForm(): Chainable<void>;
    }
  }
}


export {};
