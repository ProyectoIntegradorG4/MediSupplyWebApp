# Configuración de GitHub Pages

Este proyecto está configurado para desplegarse automáticamente a GitHub Pages mediante GitHub Actions.

## Despliegue

- **Despliegue automático**: Los pushes a la rama `main` activan el despliegue automático
- **Despliegue manual**: Usa el flujo de trabajo "Despliegue Manual" para despliegues de staging/producción
- **Dominio personalizado**: Agrega tu dominio al campo `cname` en el flujo de trabajo CI/CD

## Flujos de Trabajo

### 1. Pipeline CI/CD (`.github/workflows/ci-cd.yml`)
- Se ejecuta en pushes a las ramas `main` y `develop`
- Se ejecuta en pull requests a `main`
- Incluye verificación de tipos, construcción y despliegue a GitHub Pages

### 2. Calidad de Código (`.github/workflows/code-quality.yml`)
- Se ejecuta en pushes y pull requests
- Realiza verificación de tipos y verificación de construcción
- Asegura estándares de calidad de código

### 3. Despliegue Manual (`.github/workflows/manual-deploy.yml`)
- Activado manualmente mediante la interfaz de GitHub Actions
- Permite despliegue a entornos de staging o producción
- Soporta etiquetado de versiones

## Instrucciones de Configuración

1. **Habilitar GitHub Pages**:
   - Ve a Configuración de tu repositorio → Pages
   - Establece la Fuente como "GitHub Actions"

2. **Configurar Dominio Personalizado** (opcional):
   - Agrega tu dominio al campo `cname` en el flujo de trabajo CI/CD
   - Crea un archivo `CNAME` en la raíz de tu repositorio con tu dominio

3. **Variables de Entorno** (si es necesario):
   - Agrega cualquier secreto requerido en Configuración → Secrets and variables → Actions

## Proceso de Construcción

El pipeline CI/CD realiza los siguientes pasos:
1. Checkout del código
2. Configuración de Node.js 18
3. Instalación de dependencias con `npm ci`
4. Verificación de tipos con TypeScript
5. Construcción de la aplicación
6. Despliegue a GitHub Pages (solo rama main)

## Desarrollo Local

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Verificación de tipos
npm run type-check

# Construir para producción
npm run build

# Vista previa de construcción de producción
npm run preview
```
