#!/bin/bash

# Setup Load Balancer and Make Website Accessible Online
# This script creates an Application Load Balancer and configures ECS service

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🌐 Setting up load balancer to make website accessible online...${NC}"

# Get Account ID
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
REGION="us-east-1"

echo -e "${YELLOW}📋 Account ID: $ACCOUNT_ID${NC}"

# 1. Get default VPC and subnets
echo -e "${YELLOW}1️⃣ Getting VPC and subnet information...${NC}"
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=is-default,Values=true" --query 'Vpcs[0].VpcId' --output text --region $REGION)
echo -e "${GREEN}✅ VPC ID: $VPC_ID${NC}"

# Get public subnets
SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[0:2].SubnetId' --output text --region $REGION)
SUBNET1=$(echo $SUBNET_IDS | cut -d' ' -f1)
SUBNET2=$(echo $SUBNET_IDS | cut -d' ' -f2)
echo -e "${GREEN}✅ Subnets: $SUBNET1, $SUBNET2${NC}"

# 2. Create security group for load balancer
echo -e "${YELLOW}2️⃣ Creating security group for load balancer...${NC}"
ALB_SG_ID=$(aws ec2 create-security-group \
  --group-name medisupply-alb-sg \
  --description "Security group for MediSupply ALB" \
  --vpc-id $VPC_ID \
  --region $REGION \
  --query 'GroupId' \
  --output text || echo "Security group might already exist")

# Add HTTP and HTTPS rules
aws ec2 authorize-security-group-ingress \
  --group-id $ALB_SG_ID \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0 \
  --region $REGION || echo "Rule might already exist"

aws ec2 authorize-security-group-ingress \
  --group-id $ALB_SG_ID \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0 \
  --region $REGION || echo "Rule might already exist"

echo -e "${GREEN}✅ Load balancer security group: $ALB_SG_ID${NC}"

# 3. Create security group for ECS tasks
echo -e "${YELLOW}3️⃣ Creating security group for ECS tasks...${NC}"
ECS_SG_ID=$(aws ec2 create-security-group \
  --group-name medisupply-ecs-sg \
  --description "Security group for MediSupply ECS tasks" \
  --vpc-id $VPC_ID \
  --region $REGION \
  --query 'GroupId' \
  --output text || echo "Security group might already exist")

# Allow traffic from ALB
aws ec2 authorize-security-group-ingress \
  --group-id $ECS_SG_ID \
  --protocol tcp \
  --port 80 \
  --source-group $ALB_SG_ID \
  --region $REGION || echo "Rule might already exist"

echo -e "${GREEN}✅ ECS security group: $ECS_SG_ID${NC}"

# 4. Create Application Load Balancer
echo -e "${YELLOW}4️⃣ Creating Application Load Balancer...${NC}"
ALB_ARN=$(aws elbv2 create-load-balancer \
  --name medisupply-alb \
  --subnets $SUBNET1 $SUBNET2 \
  --security-groups $ALB_SG_ID \
  --region $REGION \
  --query 'LoadBalancers[0].LoadBalancerArn' \
  --output text || echo "Load balancer might already exist")

echo -e "${GREEN}✅ Load balancer ARN: $ALB_ARN${NC}"

# 5. Create target group
echo -e "${YELLOW}5️⃣ Creating target group...${NC}"
TARGET_GROUP_ARN=$(aws elbv2 create-target-group \
  --name medisupply-targets \
  --protocol HTTP \
  --port 80 \
  --vpc-id $VPC_ID \
  --target-type ip \
  --health-check-path /health \
  --health-check-interval-seconds 30 \
  --health-check-timeout-seconds 5 \
  --healthy-threshold-count 2 \
  --unhealthy-threshold-count 3 \
  --region $REGION \
  --query 'TargetGroups[0].TargetGroupArn' \
  --output text || echo "Target group might already exist")

echo -e "${GREEN}✅ Target group ARN: $TARGET_GROUP_ARN${NC}"

# 6. Create listener
echo -e "${YELLOW}6️⃣ Creating load balancer listener...${NC}"
aws elbv2 create-listener \
  --load-balancer-arn $ALB_ARN \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=$TARGET_GROUP_ARN \
  --region $REGION || echo "Listener might already exist"

echo -e "${GREEN}✅ Listener created${NC}"

# 7. Update ECS service with load balancer configuration
echo -e "${YELLOW}7️⃣ Updating ECS service with load balancer...${NC}"

# First, get the current task definition
CURRENT_TASK_DEF=$(aws ecs describe-task-definition \
  --task-definition medisupply-task-definition \
  --region $REGION \
  --query 'taskDefinition' \
  --output json)

# Update task definition with security groups
echo $CURRENT_TASK_DEF | jq --arg SG_ID "$ECS_SG_ID" \
  '.containerDefinitions[0].portMappings[0].hostPort = 80 |
   .networkConfiguration.awsvpcConfiguration.securityGroups = [$SG_ID] |
   .networkConfiguration.awsvpcConfiguration.subnets = ["'$SUBNET1'", "'$SUBNET2'"] |
   .networkConfiguration.awsvpcConfiguration.assignPublicIp = "ENABLED"' \
  > task-definition-with-network.json

# Register updated task definition
aws ecs register-task-definition \
  --cli-input-json file://task-definition-with-network.json \
  --region $REGION

# Update ECS service
aws ecs update-service \
  --cluster medisupply-cluster \
  --service medisupply-service \
  --task-definition medisupply-task-definition \
  --load-balancers targetGroupArn=$TARGET_GROUP_ARN,containerName=medisupply-webapp,containerPort=80 \
  --network-configuration "awsvpcConfiguration={subnets=[$SUBNET1,$SUBNET2],securityGroups=[$ECS_SG_ID],assignPublicIp=ENABLED}" \
  --region $REGION || echo "Service might already be updated"

echo -e "${GREEN}✅ ECS service updated with load balancer${NC}"

# 8. Get load balancer DNS name
echo -e "${YELLOW}8️⃣ Getting load balancer DNS name...${NC}"
ALB_DNS=$(aws elbv2 describe-load-balancers \
  --load-balancer-arns $ALB_ARN \
  --region $REGION \
  --query 'LoadBalancers[0].DNSName' \
  --output text)

echo -e "${GREEN}🎉 Website is now accessible online!${NC}"
echo -e "${YELLOW}🌐 Your website URL: http://$ALB_DNS${NC}"
echo -e "${YELLOW}🏥 Health check URL: http://$ALB_DNS/health${NC}"
echo ""
echo -e "${YELLOW}📋 Next steps:${NC}"
echo "1. Wait 2-3 minutes for the service to stabilize"
echo "2. Test your website: http://$ALB_DNS"
echo "3. Check health: http://$ALB_DNS/health"
echo ""
echo -e "${YELLOW}🔍 Monitor deployment:${NC}"
echo "aws ecs describe-services --cluster medisupply-cluster --services medisupply-service --region $REGION"
echo ""
echo -e "${YELLOW}📊 View logs:${NC}"
echo "aws logs tail /ecs/medisupply-webapp --follow --region $REGION"
