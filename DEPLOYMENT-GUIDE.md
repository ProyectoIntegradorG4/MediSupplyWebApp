# 🚀 Guía de Despliegue AWS para MediSupply Web App

## 📋 Inicio Rápido

### 1. Ejecutar el Script de Configuración
```bash
./setup-aws.sh
```

### 2. Configurar Secretos de GitHub
Ve a tu repositorio de GitHub → Settings → Secrets and variables → Actions, y agrega:
- `AWS_ACCESS_KEY_ID`: Tu clave de acceso de AWS
- `AWS_SECRET_ACCESS_KEY`: Tu clave secreta de AWS

### 3. Crear Usuario IAM
```bash
# Crear usuario IAM
aws iam create-user --user-name github-actions-medisupply

# Adjuntar la política
aws iam put-user-policy \
  --user-name github-actions-medisupply \
  --policy-name GitHubActionsMediSupplyPolicy \
  --policy-document file://github-actions-iam-policy.json

# Crear claves de acceso
aws iam create-access-key --user-name github-actions-medisupply
```

### 4. Crear Release y Desplegar
```bash
# IMPORTANTE: Actualiza la versión en package.json antes de hacer push
# Ejemplo: cambiar "version": "1.0.0" a "version": "1.0.1"

git add .
git commit -m "Bump version to 1.0.1"
git push origin main
```

**Nota**: El push a `main` ahora:
- ✅ Crea automáticamente un tag y release
- ❌ NO desplegará automáticamente (requiere acción manual)

**Importante**: La validación de versión ocurre en los **Pull Requests**, no en el merge a main.

### 5. Despliegue Manual
Para desplegar una versión específica:

1. Ve a **Actions** en tu repositorio de GitHub
2. Selecciona **"Despliegue Manual a AWS"**
3. Haz clic en **"Run workflow"**
4. Completa los campos:
   - **Tag**: Usa el tag generado automáticamente (ej: `1.0.0-abc1234`)
   - **Ambiente**: Selecciona `production` o `staging`
   - **Confirmar despliegue**: ✅ Marca esta casilla
5. Haz clic en **"Run workflow"**

## 🔧 Configuración Manual (Alternativa)

Si prefieres configurar manualmente:

### Recursos AWS
```bash
# 1. Repositorio ECR
aws ecr create-repository --repository-name medisupply-webapp --region us-east-1

# 2. Cluster ECS
aws ecs create-cluster --cluster-name medisupply-cluster --region us-east-1

# 3. Grupo de Logs CloudWatch
aws logs create-log-group --log-group-name /ecs/medisupply-webapp --region us-east-1

# 4. Obtener ID de Cuenta
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "Account ID: $ACCOUNT_ID"
```

### Creación del Servicio ECS
Necesitarás crear el servicio ECS manualmente a través de la Consola AWS o CLI. El servicio necesita:
- Cluster: `medisupply-cluster`
- Definición de Tarea: `medisupply-task-definition`
- Conteo Deseado: 1
- Tipo de Lanzamiento: FARGATE
- Configuración de Red: VPC con subredes públicas

## 🔄 Flujo de Trabajo Actualizado

### Nuevo Flujo de CI/CD

1. **Pull Request a `main`** → Valida versión, ejecuta pruebas y construye aplicación
2. **Push a `main`** → Construye imagen Docker y crea tag/release
3. **Despliegue Manual** → Usa el workflow manual para desplegar versiones específicas

### Ventajas del Nuevo Flujo

- ✅ **Control total**: Decides cuándo desplegar
- ✅ **Rollback fácil**: Puedes desplegar cualquier versión anterior
- ✅ **Testing**: Las imágenes se construyen y prueban antes del despliegue
- ✅ **Trazabilidad**: Cada release tiene un tag único con fecha y commit
- ✅ **Validación de versión**: El pipeline valida que la versión fue actualizada

### 📋 Gestión de Versiones

El pipeline ahora **requiere** que actualices la versión en `package.json` antes de crear un Pull Request a `main`:

```bash
# Ejemplo de versionado semántico
# Patch (correcciones de bugs): 1.0.0 → 1.0.1
# Minor (nuevas características): 1.0.0 → 1.1.0  
# Major (cambios incompatibles): 1.0.0 → 2.0.0

# 1. Actualizar versión en package.json
# 2. Crear branch y commit
git checkout -b feature/new-feature
git add package.json
git commit -m "Bump version to 1.0.1"
git push origin feature/new-feature

# 3. Crear Pull Request a main
# La validación ocurrirá automáticamente en el PR
```

**Si no actualizas la versión**, el PR fallará con un error claro explicando qué hacer.

## 🔍 Monitoreo y Solución de Problemas

### Verificar Estado del Despliegue
```bash
# Ver estado del servicio ECS
aws ecs describe-services \
  --cluster medisupply-cluster \
  --services medisupply-service

# Ver tareas en ejecución
aws ecs list-tasks \
  --cluster medisupply-cluster \
  --service-name medisupply-service

# Ver logs
aws logs tail /ecs/medisupply-webapp --follow --region us-east-1
```

### Problemas Comunes

1. **Tag No Encontrado**
   - Verificar que el tag existe: `git tag -l`
   - Usar el tag exacto generado por el workflow automático

2. **Imagen Docker No Encontrada en ECR**
   - Verificar que la imagen existe: `aws ecr describe-images --repository-name medisupply-webapp --image-ids imageTag=TAG_NAME`
   - Asegurarse de que el workflow de construcción se ejecutó correctamente

3. **Definición de Tarea No Encontrada**
   - Ejecutar: `aws ecs register-task-definition --cli-input-json file://ecs-task-definition-updated.json`

4. **Repositorio ECR No Encontrado**
   - Ejecutar: `aws ecr create-repository --repository-name medisupply-webapp --region us-east-1`

5. **Permiso Denegado**
   - Verificar que el usuario IAM tenga los permisos correctos
   - Verificar que los secretos de GitHub estén configurados correctamente

6. **Servicio No Encontrado**
   - Crear servicio ECS a través de la Consola AWS o CLI

### Comandos Útiles para Debugging

```bash
# Listar todos los tags disponibles
git tag -l

# Ver releases en GitHub
gh release list

# Verificar imágenes en ECR
aws ecr list-images --repository-name medisupply-webapp --region us-east-1

# Ver logs del workflow manual
# Ve a Actions → "Despliegue Manual a AWS" → Selecciona la ejecución
```

## 📊 Estimación de Costos

- **ECR**: ~$0.10/GB/mes
- **ECS Fargate**: ~$0.04/vCPU/hora + ~$0.004/GB/hora
- **CloudWatch Logs**: ~$0.50/GB
- **Total**: ~$20-30/mes para aplicación pequeña

## 🎯 Próximos Pasos

1. **Dominio Personalizado**: Configurar Route 53 y CloudFront
2. **Certificado SSL**: Usar AWS Certificate Manager
3. **Monitoreo**: Agregar alarmas de CloudWatch
4. **Escalado**: Configurar políticas de auto-escalado
5. **CI/CD**: Agregar entorno de staging

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs de GitHub Actions
2. Verificar que los recursos AWS existan
3. Verificar permisos IAM
4. Revisar logs de CloudWatch
