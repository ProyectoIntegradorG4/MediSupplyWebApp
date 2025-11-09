// Utilidades para tests de Cypress
import testConfig from './testConfig';

export const testUtils = {
  /**
   * Verifica que una columna de la tabla tenga el header esperado
   */
  verifyTableHeader: (columnIndex: number, expectedText: string) => {
    cy.get(testConfig.selectors.providers.headerCells)
      .eq(columnIndex)
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.equal(expectedText);
      });
  },

  /**
   * Obtiene el texto de una celda en la primera fila
   */
  getFirstRowCellText: (columnIndex: number) => {
    return cy.get(testConfig.selectors.providers.bodyRows)
      .first()
      .find('td')
      .eq(columnIndex)
      .invoke('text')
      .then((text) => text.trim());
  },

  /**
   * Verifica que todas las headers de la tabla sean las esperadas
   */
  verifyAllHeaders: (expectedHeaders: string[]) => {
    cy.get(testConfig.selectors.providers.headerCells).then(($headers) => {
      expect($headers.length).to.equal(expectedHeaders.length);
      
      expectedHeaders.forEach((expectedText, index) => {
        cy.wrap($headers.eq(index))
          .invoke('text')
          .then((text) => {
            expect(text.trim()).to.equal(expectedText);
          });
      });
    });
  },

  /**
   * Espera a que la tabla tenga datos
   */
  waitForTableData: (minRows: number = 1) => {
    cy.get(testConfig.selectors.providers.bodyRows, { 
      timeout: testConfig.timeouts.loadData 
    }).should('have.length.greaterThan', minRows - 1);
  },

  /**
   * Obtiene el número de filas en la tabla
   */
  getRowCount: () => {
    return cy.get(testConfig.selectors.providers.bodyRows).then(($rows) => {
      return $rows.length;
    });
  },

  /**
   * Verifica que una celda tenga contenido no vacío
   */
  verifyCellNotEmpty: (rowIndex: number, columnIndex: number) => {
    cy.get(testConfig.selectors.providers.bodyRows)
      .eq(rowIndex)
      .find('td')
      .eq(columnIndex)
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.not.be.empty;
      });
  },

  /**
   * Verifica que una celda coincida con un patrón regex
   */
  verifyCellMatchesPattern: (rowIndex: number, columnIndex: number, pattern: RegExp) => {
    cy.get(testConfig.selectors.providers.bodyRows)
      .eq(rowIndex)
      .find('td')
      .eq(columnIndex)
      .invoke('text')
      .then((text) => {
        expect(text.trim()).to.match(pattern);
      });
  },

  /**
   * Busca proveedores por nombre
   */
  searchProviders: (searchTerm: string) => {
    cy.get(testConfig.selectors.providers.searchInput).type(searchTerm);
  },

  /**
   * Limpia el campo de búsqueda
   */
  clearSearch: () => {
    cy.get(testConfig.selectors.providers.searchInput).clear();
  },

  /**
   * Cambia el número de filas por página
   */
  changeRowsPerPage: (rowsPerPage: string) => {
    cy.get(testConfig.selectors.providers.rowsPerPageSelect).select(rowsPerPage);
  },

  /**
   * Hace clic en el botón de agregar proveedor
   */
  clickAddProviderButton: () => {
    cy.contains('button', 'AGREGAR PROVEEDOR').click();
  },

  /**
   * Verifica que la tabla esté visible
   */
  verifyTableVisible: () => {
    cy.get(testConfig.selectors.providers.table).should('be.visible');
    cy.get(testConfig.selectors.providers.tableHeader).should('be.visible');
  },

  /**
   * Genera un número aleatorio entre min y max
   */
  generateRandomNumber: (min: number, max: number): number => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },

  /**
   * Genera un nombre de proveedor aleatorio
   */
  generateRandomProviderName: (): string => {
    const randomNum = testUtils.generateRandomNumber(1, 1000);
    return `Universidad ${randomNum}`;
  },

  /**
   * Genera un número de teléfono aleatorio de 6 dígitos
   */
  generateRandomPhoneNumber: (): string => {
    return testUtils.generateRandomNumber(100000, 999999).toString();
  },

  /**
   * Llena el formulario de crear proveedor con datos específicos
   */
  fillProviderForm: (data: {
    razonSocial?: string;
    nit?: string;
    email?: string;
    tipoproveedor?: string;
    pais?: string;
    ciudad?: string;
    telefono?: string;
    direccion?: string;
  }) => {
    if (data.razonSocial) {
      cy.get('[placeholder="Razón social"]').type(data.razonSocial);
    }
    if (data.nit) {
      cy.get('[placeholder="NIT"]').type(data.nit);
    }
    if (data.email) {
      cy.get('[placeholder="email@example.com"]').type(data.email);
    }
    if (data.tipoproveedor) {
      cy.contains('label', 'Tipo de Proveedor').parent().find('select').select(data.tipoproveedor);
    }
    if (data.pais) {
      cy.contains('label', 'País').parent().find('select').select(data.pais);
    }
    if (data.ciudad) {
      cy.get('[placeholder="Ciudad"]').type(data.ciudad);
    }
    if (data.telefono) {
      cy.get('[placeholder="Teléfono"]').type(data.telefono);
    }
    if (data.direccion) {
      cy.get('[placeholder="Dirección"]').type(data.direccion);
    }
  },

  /**
   * Hace clic en el botón de enviar del formulario de proveedor
   */
  submitProviderForm: () => {
    cy.contains('button', 'ACEPTAR').click();
  },

  /**
   * Hace clic en el botón de cancelar del formulario de proveedor
   */
  cancelProviderForm: () => {
    cy.contains('button', 'CANCELAR').click();
  },
};

export default testUtils;
