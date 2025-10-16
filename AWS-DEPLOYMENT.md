# 🚀 Guía de Despliegue en AWS con Docker

## 📋 Resumen

Este proyecto está configurado para construir automáticamente una imagen Docker cuando se hace merge a `main` y desplegarla en AWS ECS usando GitHub Actions.

## 🏗️ Arquitectura

```
GitHub Push → GitHub Actions → Docker Build → ECR → ECS → AWS Load Balancer
```

## 📁 Archivos Creados

### Docker
- `Dockerfile` - Configuración multi-etapa para React + Nginx
- `nginx.conf` - Configuración optimizada de Nginx
- `.dockerignore` - Archivos excluidos del build

### GitHub Actions
- `.github/workflows/docker-deploy.yml` - Pipeline completo de CI/CD

### AWS
- `ecs-task-definition.json` - Definición de tarea ECS (plantilla)

## 🔧 Configuración Requerida

### 1. AWS Resources

#### ECR Repository
```bash
aws ecr create-repository --repository-name medisupply-webapp --region us-east-1
```

#### ECS Cluster
```bash
aws ecs create-cluster --cluster-name medisupply-cluster --region us-east-1
```

#### ECS Service
```bash
aws ecs create-service \
  --cluster medisupply-cluster \
  --service-name medisupply-service \
  --task-definition medisupply-task-definition \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}"
```

#### CloudWatch Log Group
```bash
aws logs create-log-group --log-group-name /ecs/medisupply-webapp --region us-east-1
```

### 2. GitHub Secrets

Configurar en GitHub Repository Settings → Secrets and variables → Actions:

```
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
```

### 3. IAM Permissions

El usuario/rol de AWS necesita estos permisos:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:DescribeRepositories",
        "ecr:DescribeImages",
        "ecr:BatchDeleteImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecs:DescribeServices",
        "ecs:DescribeTaskDefinition",
        "ecs:DescribeTasks",
        "ecs:ListTasks",
        "ecs:RegisterTaskDefinition",
        "ecs:UpdateService",
        "ecs:RunTask",
        "ecs:StopTask"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": "arn:aws:iam::*:role/ecsTaskExecutionRole"
    }
  ]
}
```

## 🚀 Flujo de Despliegue

### Automático (Recomendado)
1. Hacer push a `main`
2. GitHub Actions ejecuta automáticamente:
   - Tests y build
   - Construcción de imagen Docker
   - Push a ECR
   - Despliegue en ECS

### Manual
```bash
# Construir imagen localmente
docker build -t medisupply-webapp .

# Tag para ECR
docker tag medisupply-webapp:latest YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/medisupply-webapp:latest

# Login a ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Push a ECR
docker push YOUR_ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/medisupply-webapp:latest

# Actualizar servicio ECS
aws ecs update-service --cluster medisupply-cluster --service medisupply-service --force-new-deployment
```

## 🔍 Monitoreo

### Logs
```bash
aws logs tail /ecs/medisupply-webapp --follow --region us-east-1
```

### Estado del Servicio
```bash
aws ecs describe-services --cluster medisupply-cluster --services medisupply-service
```

### Tareas Ejecutándose
```bash
aws ecs list-tasks --cluster medisupply-cluster --service-name medisupply-service
```

## 🛠️ Personalización

### Variables de Entorno
Editar `ecs-task-definition.json` para agregar variables de entorno:

```json
"environment": [
  {
    "name": "API_URL",
    "value": "https://api.medisupply.com"
  },
  {
    "name": "NODE_ENV",
    "value": "production"
  }
]
```

### Recursos
Ajustar CPU y memoria en `ecs-task-definition.json`:

```json
"cpu": "512",    // 0.5 vCPU
"memory": "1024" // 1 GB RAM
```

### Región AWS
Cambiar `AWS_REGION` en `.github/workflows/docker-deploy.yml` si usas otra región.

## 🚨 Troubleshooting

### Error: Repository no existe
```bash
aws ecr create-repository --repository-name medisupply-webapp --region us-east-1
```

### Error: Permisos insuficientes
Verificar que el usuario tenga los permisos IAM necesarios.

### Error: Cluster no existe
```bash
aws ecs create-cluster --cluster-name medisupply-cluster --region us-east-1
```

### Error: Service no existe
Crear el servicio usando la consola de AWS ECS o AWS CLI.

## 📊 Costos Estimados

- **ECR**: ~$0.10/GB/mes
- **ECS Fargate**: ~$0.04/vCPU/hora + ~$0.004/GB/hora
- **Application Load Balancer**: ~$16/mes
- **CloudWatch Logs**: ~$0.50/GB

**Total estimado**: ~$20-30/mes para una aplicación pequeña.

## ✅ Checklist de Despliegue

- [ ] ECR repository creado
- [ ] ECS cluster creado
- [ ] ECS service creado
- [ ] CloudWatch log group creado
- [ ] GitHub secrets configurados
- [ ] IAM permissions configurados
- [ ] Push a main branch
- [ ] Verificar despliegue en AWS Console
- [ ] Probar aplicación desplegada

## 🎯 Próximos Pasos

1. **Configurar dominio personalizado** con Route 53
2. **Agregar SSL/TLS** con AWS Certificate Manager
3. **Configurar CDN** con CloudFront
4. **Implementar blue-green deployment**
5. **Agregar monitoreo** con CloudWatch alarms

