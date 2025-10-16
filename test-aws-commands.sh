#!/bin/bash

# Test AWS Commands for MediSupply Web App
# Run this after configuring AWS CLI

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🧪 Testing AWS commands for MediSupply Web App...${NC}"

# 1. Verify AWS access
echo -e "${YELLOW}1️⃣ Verifying AWS access...${NC}"
aws sts get-caller-identity
echo -e "${GREEN}✅ AWS access verified${NC}"

# 2. Get Account ID
echo -e "${YELLOW}2️⃣ Getting AWS Account ID...${NC}"
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✅ Account ID: $ACCOUNT_ID${NC}"

# 3. Create ECR Repository
echo -e "${YELLOW}3️⃣ Creating ECR repository...${NC}"
aws ecr create-repository \
  --repository-name medisupply-webapp \
  --region us-east-1 \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256 || echo "Repository might already exist"
echo -e "${GREEN}✅ ECR repository ready${NC}"

# 4. Create ECS Cluster
echo -e "${YELLOW}4️⃣ Creating ECS cluster...${NC}"
aws ecs create-cluster \
  --cluster-name medisupply-cluster \
  --region us-east-1 || echo "Cluster might already exist"
echo -e "${GREEN}✅ ECS cluster ready${NC}"

# 5. Create CloudWatch Log Group
echo -e "${YELLOW}5️⃣ Creating CloudWatch log group...${NC}"
aws logs create-log-group \
  --log-group-name /ecs/medisupply-webapp \
  --region us-east-1 || echo "Log group might already exist"
echo -e "${GREEN}✅ CloudWatch log group ready${NC}"

# 6. Update task definition with actual account ID
echo -e "${YELLOW}6️⃣ Updating task definition...${NC}"
sed "s/YOUR_ACCOUNT_ID/$ACCOUNT_ID/g" ecs-task-definition.json > ecs-task-definition-updated.json
echo -e "${GREEN}✅ Task definition updated${NC}"

# 7. Register task definition
echo -e "${YELLOW}7️⃣ Registering task definition...${NC}"
aws ecs register-task-definition \
  --cli-input-json file://ecs-task-definition-updated.json \
  --region us-east-1
echo -e "${GREEN}✅ Task definition registered${NC}"

# 8. Test ECR login
echo -e "${YELLOW}8️⃣ Testing ECR login...${NC}"
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com
echo -e "${GREEN}✅ ECR login successful${NC}"

# 9. Build and push test image
echo -e "${YELLOW}9️⃣ Building and pushing test image...${NC}"
docker build -t medisupply-webapp:test .
docker tag medisupply-webapp:test $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/medisupply-webapp:test
docker push $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/medisupply-webapp:test
echo -e "${GREEN}✅ Image pushed to ECR${NC}"

echo -e "${GREEN}🎉 All AWS commands tested successfully!${NC}"
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Create IAM user for GitHub Actions:"
echo "   aws iam create-user --user-name github-actions-medisupply"
echo "   aws iam put-user-policy --user-name github-actions-medisupply --policy-name GitHubActionsMediSupplyPolicy --policy-document file://github-actions-iam-policy.json"
echo "   aws iam create-access-key --user-name github-actions-medisupply"
echo ""
echo "2. Add GitHub secrets with the access keys from above"
echo ""
echo "3. Push to main branch to trigger deployment!"
echo ""
echo -e "${GREEN}🎯 ECR Repository URI: $ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/medisupply-webapp${NC}"
