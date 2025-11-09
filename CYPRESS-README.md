# Tests E2E de Cypress - MediSupply

## Descripción

Este proyecto incluye tests end-to-end (E2E) usando Cypress para probar las funcionalidades de la aplicación MediSupply, específicamente el login y la gestión de proveedores.

## Estructura de Archivos

```
cypress/
├── e2e/
│   └── providers.cy.ts       # Tests para proveedores (login, listado, búsqueda)
├── support/
│   ├── commands.ts           # Comandos personalizados (como cy.login())
│   └── e2e.ts               # Archivo de configuración de soporte
└── tsconfig.json            # Configuración TypeScript para Cypress

cypress.config.ts            # Configuración principal de Cypress
```

## Configuración

Los tests están configurados para ejecutarse contra el servidor desplegado:
- **URL Base**: `http://medisupply-alb-656658498.us-east-1.elb.amazonaws.com`
- **Credenciales de prueba**:
  - Email: `correo1@uniandes.edu.co`
  - Password: `1234`

## Tests Implementados

### Suite: "Pruebas de Proveedores - Login y Listado"

1. **Debe cargar la página de login correctamente**
   - Verifica que la página de login se carga
   - Valida la presencia de campos de email, password y botón de login

2. **Debe hacer login exitosamente con credenciales válidas**
   - Realiza el login con las credenciales proporcionadas
   - Verifica la redirección a la página de productos

3. **Debe navegar a la página de proveedores y mostrar datos**
   - Hace login
   - Navega a la página de proveedores
   - Verifica que se muestra la tabla con proveedores
   - Valida los headers de la tabla (ID, Nombre, País, Rating, Activo)

4. **Debe permitir buscar proveedores por nombre**
   - Navega a proveedores
   - Usa el campo de búsqueda
   - Verifica que los resultados se filtran

5. **Debe mostrar el botón de agregar proveedor**
   - Verifica la presencia del botón "AGREGAR PROVEEDOR"

6. **Debe permitir cambiar el número de filas por página**
   - Valida el selector de "Rows per page"
   - Cambia la cantidad de filas mostradas

7. **Debe navegar entre tabs de Proveedores y Productos**
   - Verifica la navegación entre los tabs

### Suite: "Pruebas de Creación de Proveedores"

1. **Debe hacer clic en el botón de agregar proveedor**
   - Verifica que el botón es clickeable

## Comandos Disponibles

### Abrir Cypress en modo interactivo
```bash
npm run cypress:open
# o
npm run test:e2e:open
```

Este comando abre la interfaz gráfica de Cypress donde puedes:
- Ver todos los tests disponibles
- Ejecutar tests individualmente
- Ver la ejecución en tiempo real
- Debuggear los tests

### Ejecutar tests en modo headless (CI/CD)
```bash
npm run cypress:run
# o
npm run test:e2e
```

Este comando ejecuta todos los tests en modo headless (sin interfaz gráfica), ideal para:
- Integración continua
- Ejecución automática de tests
- Generación de reportes

## Ejecutar los Tests

### Opción 1: Modo Interactivo (Recomendado para desarrollo)

1. Abrir Cypress:
   ```bash
   npm run cypress:open
   ```

2. Seleccionar "E2E Testing"

3. Elegir el navegador (Chrome, Firefox, Edge, etc.)

4. Hacer clic en `providers.cy.ts` para ejecutar los tests

### Opción 2: Modo Headless (Para CI/CD o ejecución rápida)

```bash
npm run cypress:run
```

## Características de los Tests

- ✅ **Comando personalizado**: `cy.login(email, password)` para simplificar el login en múltiples tests
- ✅ **Timeouts configurados**: Timeouts de 10-15 segundos para operaciones que requieren llamadas a API
- ✅ **Verificaciones completas**: Valida URLs, elementos visibles, contenido de tablas, etc.
- ✅ **Esperas inteligentes**: Espera a que los datos se carguen antes de hacer aserciones
- ✅ **Búsqueda y filtrado**: Tests para la funcionalidad de búsqueda de proveedores

## Configuración de Cypress

La configuración se encuentra en `cypress.config.ts`:

```typescript
{
  e2e: {
    baseUrl: 'http://medisupply-alb-656658498.us-east-1.elb.amazonaws.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000
  }
}
```

## Resultados

Después de ejecutar los tests, Cypress genera:

- **Videos**: Grabaciones de la ejecución de tests (en `cypress/videos/`)
- **Screenshots**: Capturas de pantalla en caso de fallos (en `cypress/screenshots/`)
- **Reportes**: Resumen en la consola de tests pasados/fallidos

## Notas Importantes

1. Los tests están diseñados para ejecutarse contra el servidor desplegado en AWS
2. Si el servidor no está disponible, los tests fallarán
3. Los datos de proveedores deben existir en el backend para que algunos tests pasen
4. El botón "AGREGAR PROVEEDOR" actualmente solo verifica que es clickeable (la funcionalidad de creación debe ser implementada)

## Troubleshooting

### Los tests fallan con timeout
- Verificar que el servidor está en ejecución y accesible
- Aumentar los timeouts en `cypress.config.ts` si es necesario

### No se encuentran elementos
- Verificar que la estructura HTML no ha cambiado
- Revisar los selectores en los tests

### Error de TypeScript
- Ejecutar `npm install` para asegurar que todas las dependencias están instaladas
- Verificar que `cypress/tsconfig.json` está correctamente configurado

## Próximos Pasos

Para extender los tests, considera agregar:

- Tests para la creación de proveedores (cuando el modal/formulario esté implementado)
- Tests para edición de proveedores
- Tests para eliminación de proveedores
- Tests para validación de formularios
- Tests para manejo de errores
- Tests para diferentes roles de usuario
