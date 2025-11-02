# Etapa de construcción
FROM node:18-alpine AS builder

# Argumento de build para la URL de la API
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Establecer directorio de trabajo
WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias (incluyendo dev dependencies para el build)
RUN npm ci

# Copiar código fuente
COPY . .

# Construir la aplicación
RUN npm run build

# Crear archivos faltantes para evitar 404s
RUN cp /app/public/logo.png /app/dist/favicon.ico
RUN cp /app/public/logo.png /app/dist/apple-touch-icon-precomposed.png

# Etapa de producción
FROM nginx:alpine

# Copiar archivos construidos desde la etapa anterior
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de nginx (opcional)
COPY nginx.conf /etc/nginx/nginx.conf

# Exponer puerto 80
EXPOSE 80

# Comando para iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
