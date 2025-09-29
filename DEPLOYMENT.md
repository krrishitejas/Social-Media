# Deployment Guide

This guide covers deploying the Social Media App to various environments.

## Prerequisites

- Docker and Docker Compose
- Kubernetes cluster (for K8s deployment)
- AWS CLI configured (for cloud deployment)
- Terraform (for infrastructure as code)

## Local Development

### Using Docker Compose

1. **Start all services:**
   ```bash
   docker-compose up -d
   ```

2. **Run database migrations:**
   ```bash
   docker-compose exec backend npm run migrate
   ```

3. **Seed the database:**
   ```bash
   docker-compose exec backend npm run seed
   ```

4. **Access the application:**
   - Backend API: http://localhost:3000
   - GraphQL: http://localhost:3000/graphql
   - Health check: http://localhost:3000/health

### Using React Native CLI

1. **Install dependencies:**
   ```bash
   npm install
   cd backend && npm install
   ```

2. **Start Metro bundler:**
   ```bash
   npm start
   ```

3. **Run on iOS:**
   ```bash
   npm run ios
   ```

4. **Run on Android:**
   ```bash
   npm run android
   ```

## Kubernetes Deployment

### Prerequisites

- Kubernetes cluster (minikube, EKS, GKE, etc.)
- kubectl configured

### Deploy to Kubernetes

1. **Create namespace:**
   ```bash
   kubectl apply -f k8s/namespace.yaml
   ```

2. **Deploy PostgreSQL:**
   ```bash
   kubectl apply -f k8s/postgres.yaml
   ```

3. **Deploy Redis:**
   ```bash
   kubectl apply -f k8s/redis.yaml
   ```

4. **Deploy Backend:**
   ```bash
   kubectl apply -f k8s/backend.yaml
   ```

5. **Deploy Nginx:**
   ```bash
   kubectl apply -f k8s/nginx.yaml
   ```

6. **Check deployment status:**
   ```bash
   kubectl get pods -n social-media
   kubectl get services -n social-media
   ```

### Access the Application

```bash
# Get the external IP of the nginx service
kubectl get service nginx-service -n social-media

# Access the application
curl http://<EXTERNAL-IP>/health
```

## AWS Cloud Deployment

### Prerequisites

- AWS CLI configured
- Terraform installed
- Domain name (optional)

### Deploy Infrastructure

1. **Initialize Terraform:**
   ```bash
   cd terraform
   terraform init
   ```

2. **Create terraform.tfvars:**
   ```hcl
   aws_region = "us-east-1"
   project_name = "social-media"
   environment = "production"
   db_password = "your-secure-password"
   domain_name = "your-domain.com"
   ```

3. **Plan the deployment:**
   ```bash
   terraform plan
   ```

4. **Apply the configuration:**
   ```bash
   terraform apply
   ```

5. **Get outputs:**
   ```bash
   terraform output
   ```

### Deploy Application

1. **Build and push Docker images:**
   ```bash
   # Build backend image
   docker build -t your-registry/social-media-backend:latest ./backend
   docker push your-registry/social-media-backend:latest
   ```

2. **Update Kubernetes manifests with your image:**
   ```bash
   # Edit k8s/backend.yaml to use your image
   sed -i 's|social-media-backend:latest|your-registry/social-media-backend:latest|g' k8s/backend.yaml
   ```

3. **Deploy to EKS:**
   ```bash
   kubectl apply -f k8s/
   ```

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the backend directory:

```env
# Database
DATABASE_URL=postgresql://username:password@localhost:5432/social_media_db
DB_HOST=localhost
DB_PORT=5432
DB_NAME=social_media_db
DB_USER=username
DB_PASSWORD=password

# Redis
REDIS_URL=redis://localhost:6379
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=production
CLIENT_URL=https://your-domain.com

# AWS S3
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### Frontend Environment Variables

Create a `.env` file in the root directory:

```env
# API Configuration
API_BASE_URL=https://your-api-domain.com
GRAPHQL_URL=https://your-api-domain.com/graphql
WEBSOCKET_URL=wss://your-api-domain.com

# Social Login
GOOGLE_CLIENT_ID=your-google-client-id
FACEBOOK_APP_ID=your-facebook-app-id
APPLE_CLIENT_ID=your-apple-client-id

# Analytics
SENTRY_DSN=your-sentry-dsn
ANALYTICS_ID=your-analytics-id
```

## Database Setup

### Run Migrations

```bash
# Local development
cd backend
npm run migrate

# Docker
docker-compose exec backend npm run migrate

# Kubernetes
kubectl exec -it deployment/backend -n social-media -- npm run migrate
```

### Seed Database

```bash
# Local development
cd backend
npm run seed

# Docker
docker-compose exec backend npm run seed

# Kubernetes
kubectl exec -it deployment/backend -n social-media -- npm run seed
```

## Monitoring and Logs

### View Logs

```bash
# Docker Compose
docker-compose logs -f backend
docker-compose logs -f postgres
docker-compose logs -f redis

# Kubernetes
kubectl logs -f deployment/backend -n social-media
kubectl logs -f deployment/postgres -n social-media
kubectl logs -f deployment/redis -n social-media
```

### Health Checks

```bash
# Backend health
curl http://localhost:3000/health

# Database health
docker-compose exec postgres pg_isready

# Redis health
docker-compose exec redis redis-cli ping
```

## Scaling

### Horizontal Pod Autoscaling

```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: social-media
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Database Scaling

- **Read Replicas**: Configure RDS read replicas for read-heavy workloads
- **Connection Pooling**: Use PgBouncer for connection pooling
- **Caching**: Implement Redis caching for frequently accessed data

## Security

### SSL/TLS Configuration

1. **Obtain SSL certificate:**
   ```bash
   # Using Let's Encrypt
   certbot certonly --standalone -d your-domain.com
   ```

2. **Update nginx configuration:**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name your-domain.com;
       
       ssl_certificate /etc/nginx/ssl/cert.pem;
       ssl_certificate_key /etc/nginx/ssl/key.pem;
       
       # SSL configuration
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
       ssl_prefer_server_ciphers off;
   }
   ```

### Security Headers

The nginx configuration includes security headers:
- X-Frame-Options
- X-Content-Type-Options
- X-XSS-Protection
- Referrer-Policy
- Content-Security-Policy

## Backup and Recovery

### Database Backup

```bash
# Create backup
pg_dump -h localhost -U postgres social_media_db > backup.sql

# Restore backup
psql -h localhost -U postgres social_media_db < backup.sql
```

### Automated Backups

```yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: db-backup
  namespace: social-media
spec:
  schedule: "0 2 * * *"
  jobTemplate:
    spec:
      template:
        spec:
          containers:
          - name: backup
            image: postgres:15-alpine
            command:
            - /bin/sh
            - -c
            - pg_dump -h postgres-service -U postgres social_media_db > /backup/backup-$(date +%Y%m%d).sql
            volumeMounts:
            - name: backup-storage
              mountPath: /backup
          volumes:
          - name: backup-storage
            persistentVolumeClaim:
              claimName: backup-pvc
```

## Troubleshooting

### Common Issues

1. **Database connection failed:**
   - Check database credentials
   - Verify network connectivity
   - Check database service status

2. **Redis connection failed:**
   - Check Redis service status
   - Verify Redis configuration
   - Check network connectivity

3. **Application not starting:**
   - Check environment variables
   - Verify dependencies
   - Check logs for errors

### Debug Commands

```bash
# Check pod status
kubectl get pods -n social-media

# Check service endpoints
kubectl get endpoints -n social-media

# Check logs
kubectl logs -f deployment/backend -n social-media

# Execute commands in pod
kubectl exec -it deployment/backend -n social-media -- /bin/sh

# Port forward for local access
kubectl port-forward service/backend-service 3000:3000 -n social-media
```

## Performance Optimization

### Database Optimization

- Enable connection pooling
- Configure appropriate indexes
- Monitor query performance
- Use read replicas for read-heavy workloads

### Application Optimization

- Implement caching strategies
- Use CDN for static assets
- Optimize images and videos
- Implement lazy loading

### Infrastructure Optimization

- Use appropriate instance types
- Configure auto-scaling
- Implement load balancing
- Monitor resource usage
