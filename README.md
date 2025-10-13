# MediSupply Web App

Sistema de Gestión de Inventario de Suministros Médicos construido con React, TypeScript y Vite.

## Características

- Aplicación React moderna con TypeScript
- Chakra UI para componentes hermosos
- React Query para gestión de datos
- React Router para navegación
- Diseño responsivo

## Desarrollo

### Prerrequisitos

- Node.js 18 o superior
- npm

### Comenzar

1. Clona el repositorio
2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre [http://localhost:5173](http://localhost:5173) en tu navegador

### Scripts Disponibles

- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run preview` - Vista previa de la construcción de producción
- `npm run type-check` - Ejecutar verificación de tipos de TypeScript
- `npm run build:check` - Verificación de tipos y construcción
- `npm run clean` - Limpiar artefactos de construcción

## CI/CD

Este proyecto incluye pipelines automatizados de CI/CD usando GitHub Actions:

### Flujos de Trabajo

1. **Pipeline CI/CD** - Pruebas automáticas, construcción, verificación de calidad y despliegue
2. **Despliegue Manual** - Despliegue bajo demanda a diferentes entornos

### Despliegue

- **Automático**: Los pushes a la rama `main` se despliegan a GitHub Pages
- **Manual**: Usa la interfaz de GitHub Actions para activar despliegues manuales

Para información detallada de despliegue, ver [.github/DEPLOYMENT.md](.github/DEPLOYMENT.md)

## Estructura del Proyecto

```
src/
├── components/     # Componentes UI reutilizables
├── pages/         # Componentes de página
├── services/      # Servicios API
├── types/         # Definiciones de tipos TypeScript
└── theme.ts       # Configuración del tema Chakra UI
```

## Tecnologías

- **React 18** - Framework UI
- **TypeScript** - Seguridad de tipos
- **Vite** - Herramienta de construcción y servidor de desarrollo
- **Chakra UI** - Biblioteca de componentes
- **React Query** - Obtención y caché de datos
- **React Router** - Enrutamiento del lado del cliente
- **Axios** - Cliente HTTP

## Contribuir

1. Haz fork del repositorio
2. Crea una rama de característica
3. Realiza tus cambios
4. Asegúrate de que todas las verificaciones de CI pasen
5. Envía una solicitud de pull

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.
