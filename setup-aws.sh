#!/bin/bash
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Setting up AWS resources for MediSupply Web App...${NC}"

echo -e "${YELLOW}📋 Getting AWS Account ID...${NC}"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✅ Account ID: $ACCOUNT_ID${NC}"

REGION="us-east-1"

echo -e "${YELLOW}📦 Creating ECR repository...${NC}"
aws ecr create-repository \
  --repository-name medisupply-webapp \
  --region $REGION \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256 || echo "Repository might already exist"

echo -e "${YELLOW}🏗️ Creating ECS cluster...${NC}"
aws ecs create-cluster \
  --cluster-name medisupply-cluster \
  --region $REGION || echo "Cluster might already exist"

echo -e "${YELLOW}📊 Creating CloudWatch log group...${NC}"
aws logs create-log-group \
  --log-group-name /ecs/medisupply-webapp \
  --region $REGION || echo "Log group might already exist"

echo -e "${YELLOW}📝 Updating task definition...${NC}"
sed "s/YOUR_ACCOUNT_ID/$ACCOUNT_ID/g" ecs-task-definition.json > ecs-task-definition-updated.json

echo -e "${YELLOW}📋 Registering task definition...${NC}"
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition-updated.json \
  --region $REGION

echo -e "${YELLOW}⚖️ Creating Application Load Balancer...${NC}"
cat > create-alb.sh << EOF
#!/bin/bash

aws elbv2 create-load-balancer \
  --name medisupply-alb \
  --subnets subnet-12345678 subnet-87654321 \
  --security-groups sg-12345678 \
  --region $REGION


aws elbv2 create-target-group \
  --name medisupply-targets \
  --protocol HTTP \
  --port 80 \
  --vpc-id vpc-12345678 \
  --target-type ip \
  --health-check-path /health \
  --region $REGION
EOF

chmod +x create-alb.sh

echo -e "${GREEN}✅ AWS resources setup completed!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Configure GitHub repository secrets:"
echo "   - AWS_ACCESS_KEY_ID"
echo "   - AWS_SECRET_ACCESS_KEY"
echo ""
echo "2. Create IAM user with these permissions:"
echo "   - ECR: GetAuthorizationToken, BatchCheckLayerAvailability, GetDownloadUrlForLayer, BatchGetImage, DescribeRepositories, DescribeImages, BatchDeleteImage, InitiateLayerUpload, UploadLayerPart, CompleteLayerUpload, PutImage"
echo "   - ECS: DescribeServices, DescribeTaskDefinition, DescribeTasks, ListTasks, RegisterTaskDefinition, UpdateService, RunTask, StopTask"
echo "   - IAM: PassRole (for ecsTaskExecutionRole)"
echo ""
echo "3. If you want a load balancer, customize and run: ./create-alb.sh"
echo ""
echo "4. Push to main branch to trigger deployment!"
echo ""
echo -e "${GREEN}🎯 ECR Repository URI: $ACCOUNT_ID.dkr.ecr.$REGION.amazonaws.com/medisupply-webapp${NC}"
