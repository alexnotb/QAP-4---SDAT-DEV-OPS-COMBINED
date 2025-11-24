# AWS RDS Configuration Guide

This file contains instructions for connecting to AWS RDS PostgreSQL database.

## Steps to Create AWS RDS PostgreSQL Instance

1. **Log in to AWS Console**
   - Navigate to RDS service

2. **Create Database**
   - Click "Create database"
   - Choose "Standard create"
   - Engine: PostgreSQL
   - Version: PostgreSQL 15.x (or latest)
   - Templates: Free tier (for testing) or Production

3. **Settings**
   - DB instance identifier: golf-club-db
   - Master username: postgres (or your preferred username)
   - Master password: Set a strong password

4. **Instance Configuration**
   - DB instance class: db.t3.micro (free tier eligible)
   - Storage: 20 GB SSD

5. **Connectivity**
   - VPC: Default VPC
   - Public access: Yes (for external access)
   - VPC security group: Create new
   - Availability Zone: No preference

6. **Additional Configuration**
   - Initial database name: golf_club_db
   - Backup retention: 7 days
   - Enable automated backups

7. **Security Group Configuration**
   - After creation, edit the security group
   - Add inbound rule:
     - Type: PostgreSQL
     - Port: 5432
     - Source: Your IP (or 0.0.0.0/0 for testing - NOT recommended for production)

## Environment Variables for RDS

Once your RDS instance is created, update your `.env` file:

```env
DB_HOST=your-rds-endpoint.region.rds.amazonaws.com
DB_PORT=5432
DB_NAME=golf_club_db
DB_USER=postgres
DB_PASSWORD=your-rds-password
NODE_ENV=production
PORT=3000
```

## Testing Connection

You can test the connection using psql:

```bash
psql -h your-rds-endpoint.region.rds.amazonaws.com -U postgres -d golf_club_db
```

## Deploying API to AWS

### Option 1: AWS EC2

1. Launch an EC2 instance (Amazon Linux 2 or Ubuntu)
2. Install Node.js and npm
3. Clone your repository
4. Install dependencies: `npm install`
5. Set environment variables
6. Run the application: `npm start`
7. Configure security group to allow port 3000

### Option 2: AWS Elastic Beanstalk

1. Install AWS EB CLI
2. Initialize: `eb init`
3. Create environment: `eb create golf-club-api`
4. Set environment variables in EB console
5. Deploy: `eb deploy`

### Option 3: AWS ECS (Docker)

1. Push Docker image to ECR
2. Create ECS cluster
3. Create task definition
4. Create service with load balancer

## Common Issues

### Connection Timeout
- Check security group rules
- Verify VPC settings
- Ensure public accessibility is enabled

### Authentication Failed
- Verify username and password
- Check IAM database authentication settings

### Cannot Resolve Host
- Verify RDS endpoint is correct
- Check DNS settings
- Ensure RDS instance is available
