# Configuración de Variables de Entorno

Este proyecto utiliza variables de entorno para gestionar diferentes URLs de API para diferentes ambientes.

## Variables de Entorno

- `VITE_API_URL`: La URL base para el backend de la API

## Desarrollo Local

Para desarrollo local, crea un archivo `.env.local` en la raíz del proyecto:

```bash
# .env.local
VITE_API_URL=http://localhost:8080
```

## Secretos de GitHub

Para configurar la URL de la API para despliegues de producción, necesitas configurar un secreto de GitHub:

### Configuración de Secretos de GitHub

1. Ve a tu repositorio de GitHub
2. Navega a **Configuración** → **Secretos y variables** → **Acciones**
3. Haz clic en **Nuevo secreto de repositorio**
4. Agrega el siguiente secreto:
   - **Nombre**: `API_URL`
   - **Valor**: Tu URL de API de producción (ej: `https://api.tudominio.com`)

### Secretos Disponibles

| Nombre del Secreto | Descripción | Valor de Ejemplo |
|-------------------|-------------|------------------|
| `API_URL` | URL base de la API de producción | `https://api.medisupply.com` |

## Prioridad de Archivos de Entorno

Vite carga las variables de entorno en el siguiente orden (mayor prioridad sobrescribe menor):

1. `.env.local` (siempre ignorado por git)
2. `.env.production` (cargado cuando `NODE_ENV=production`)
3. `.env.development` (cargado cuando `NODE_ENV=development`)
4. `.env` (menor prioridad)

## Uso en el Código

La URL de la API se accede en el código usando:

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
```

## Despliegue

- **Desarrollo**: Usa `.env.development` o `.env.local`
- **Producción**: Usa el secreto de GitHub `API_URL` configurado en el workflow
- **CI/CD**: Usa el secreto de GitHub `API_URL` con fallback a localhost para pruebas

## Notas de Seguridad

- Nunca commits archivos `.env.local` al control de versiones
- Usa secretos de GitHub para valores sensibles de producción
- El prefijo `VITE_` es requerido para que Vite exponga las variables al código del cliente
