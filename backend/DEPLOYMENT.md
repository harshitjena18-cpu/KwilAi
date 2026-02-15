# Kwil AI Backend - Deployment Guide

## 🚀 Production Deployment

This guide covers deploying the Kwil AI backend to various platforms.

---

## 📋 Pre-Deployment Checklist

- [ ] MongoDB Atlas database created and configured
- [ ] Environment variables configured
- [ ] JWT secret generated (strong random key)
- [ ] CORS origins set for production domain
- [ ] API rate limits configured
- [ ] Error logging enabled
- [ ] All dependencies installed
- [ ] Code tested locally
- [ ] .env file NOT committed to Git

---

## 🌐 Deployment Options

### **Option 1: Railway (Recommended - Easiest)**

**Pros:** Auto-deploy, free tier, easy setup, built-in MongoDB
**Best for:** Quick deployment, MVP, hobby projects

#### **Steps:**

1. **Install Railway CLI**
```bash
npm i -g @railway/cli
```

2. **Login to Railway**
```bash
railway login
```

3. **Initialize Project**
```bash
cd backend
railway init
```

4. **Set Environment Variables**
```bash
railway variables set MONGODB_URI="mongodb+srv://..."
railway variables set JWT_SECRET="your-secret-key"
railway variables set NODE_ENV="production"
railway variables set PORT="5000"
railway variables set CLIENT_URL="https://your-frontend.com"
```

5. **Deploy**
```bash
railway up
```

6. **Get URL**
```bash
railway domain
```

Your API will be live at: `https://your-app.up.railway.app`

---

### **Option 2: Render**

**Pros:** Free tier, auto-deploy from GitHub, easy SSL
**Best for:** Small to medium apps, continuous deployment

#### **Steps:**

1. **Push Code to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/kwil-backend.git
git push -u origin main
```

2. **Create New Web Service on Render**
- Go to [render.com](https://render.com)
- Click "New +" → "Web Service"
- Connect your GitHub repository
- Select the `backend` directory

3. **Configure Service**
```
Name: kwil-ai-backend
Environment: Node
Build Command: npm install
Start Command: npm start
```

4. **Add Environment Variables**
In Render dashboard → Environment:
```
MONGODB_URI = mongodb+srv://...
JWT_SECRET = your-secret-key
NODE_ENV = production
CLIENT_URL = https://your-frontend.com
ALLOWED_ORIGINS = https://your-frontend.com
```

5. **Deploy**
- Click "Create Web Service"
- Auto-deploys on every push to `main` branch

**Your API:** `https://kwil-ai-backend.onrender.com`

---

### **Option 3: AWS EC2**

**Pros:** Full control, scalable, professional
**Best for:** Production apps, enterprise

#### **Prerequisites:**
- AWS account
- EC2 instance (Ubuntu 22.04 LTS)
- SSH key pair

#### **Steps:**

1. **SSH into EC2 Instance**
```bash
ssh -i your-key.pem ubuntu@ec2-xx-xx-xx-xx.compute.amazonaws.com
```

2. **Install Node.js**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

3. **Install PM2 (Process Manager)**
```bash
sudo npm install -g pm2
```

4. **Clone Your Repository**
```bash
cd /var/www
sudo git clone https://github.com/yourusername/kwil-backend.git
cd kwil-backend/backend
```

5. **Install Dependencies**
```bash
sudo npm install --production
```

6. **Create Environment File**
```bash
sudo nano .env
```

Paste your production environment variables:
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
CLIENT_URL=https://your-frontend.com
```

7. **Start with PM2**
```bash
sudo pm2 start server.js --name kwil-api
sudo pm2 save
sudo pm2 startup
```

8. **Configure Nginx (Reverse Proxy)**
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/kwil-api
```

Nginx config:
```nginx
server {
    listen 80;
    server_name api.kwilai.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/kwil-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

9. **Set Up SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d api.kwilai.com
```

10. **Set Up Firewall**
```bash
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

**Your API:** `https://api.kwilai.com`

---

### **Option 4: Heroku**

**Pros:** Simple deployment, add-ons ecosystem
**Note:** No longer has free tier

#### **Steps:**

1. **Install Heroku CLI**
```bash
npm install -g heroku
```

2. **Login**
```bash
heroku login
```

3. **Create App**
```bash
cd backend
heroku create kwil-ai-backend
```

4. **Add MongoDB Add-on**
```bash
heroku addons:create mongolab:sandbox
```

5. **Set Environment Variables**
```bash
heroku config:set JWT_SECRET="your-secret-key"
heroku config:set NODE_ENV="production"
heroku config:set CLIENT_URL="https://your-frontend.com"
```

6. **Create Procfile**
```bash
echo "web: node server.js" > Procfile
```

7. **Deploy**
```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

**Your API:** `https://kwil-ai-backend.herokuapp.com`

---

### **Option 5: DigitalOcean App Platform**

**Pros:** Simple, managed, good for Node.js
**Best for:** Mid-size production apps

#### **Steps:**

1. Push code to GitHub
2. Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
3. Create new app from GitHub repo
4. Select `backend` directory
5. Add environment variables in dashboard
6. Deploy

---

## 🔐 Security Hardening for Production

### **1. Environment Variables**
```env
NODE_ENV=production
JWT_SECRET=<64-char-random-string>
MONGODB_URI=<connection-string-with-auth>
RATE_LIMIT_MAX_REQUESTS=50
RATE_LIMIT_WINDOW_MS=900000
```

### **2. Generate Strong JWT Secret**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### **3. MongoDB Atlas Security**
- Enable IP whitelist (or 0.0.0.0/0 for cloud platforms)
- Use strong password
- Enable encryption at rest
- Set up database backups

### **4. Enable HTTPS**
- Use SSL certificates (Let's Encrypt for free)
- Force HTTPS redirects
- Set secure cookie flags

### **5. Additional Security Headers**
Already implemented via Helmet.js:
- X-XSS-Protection
- X-Content-Type-Options
- X-Frame-Options
- Strict-Transport-Security

---

## 📊 Monitoring & Logging

### **PM2 Monitoring (EC2/VPS)**
```bash
# View logs
pm2 logs kwil-api

# Monitor resources
pm2 monit

# View status
pm2 status

# Restart app
pm2 restart kwil-api

# Stop app
pm2 stop kwil-api
```

### **Application Logs**
```bash
# View logs on Railway
railway logs

# View logs on Render
(Available in dashboard)

# View logs on EC2
pm2 logs kwil-api --lines 100
```

### **Error Tracking (Optional)**
Integrate error tracking services:
- **Sentry:** `npm install @sentry/node`
- **LogRocket:** For frontend errors
- **DataDog:** Full observability

---

## 🔄 CI/CD Setup

### **GitHub Actions (Automated Deployment)**

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: |
          cd backend
          npm ci
      
      - name: Run tests
        run: npm test
      
      - name: Deploy to Railway
        run: |
          npm install -g @railway/cli
          railway up
        env:
          RAILWAY_TOKEN: ${{ secrets.RAILWAY_TOKEN }}
```

---

## 🧪 Testing Production API

### **Health Check**
```bash
curl https://your-api-domain.com/health
```

**Expected:**
```json
{
  "success": true,
  "message": "Kwil AI API is running",
  "environment": "production"
}
```

### **Test Authentication**
```bash
# Register
curl -X POST https://your-api-domain.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test1234"
  }'
```

---

## 📈 Scaling Strategies

### **Horizontal Scaling**
- Deploy multiple instances behind load balancer
- Use Redis for session management
- Database read replicas for MongoDB

### **Vertical Scaling**
- Increase server resources (CPU, RAM)
- Optimize database queries
- Implement caching (Redis)

### **Performance Optimization**
- Enable compression (already implemented)
- Implement API response caching
- Use CDN for static assets
- Database indexing
- Connection pooling

---

## 🚨 Rollback Strategy

### **Railway**
```bash
railway rollback
```

### **Render**
- Go to dashboard → Deployments
- Click "Redeploy" on previous version

### **PM2 (EC2)**
```bash
# Revert Git commit
git revert HEAD
git push

# Pull on server
cd /var/www/kwil-backend
sudo git pull
sudo pm2 restart kwil-api
```

---

## 📞 Post-Deployment Checklist

- [ ] Health check endpoint returns 200
- [ ] Registration endpoint works
- [ ] Login endpoint works
- [ ] JWT authentication works on protected routes
- [ ] CORS allows your frontend domain
- [ ] Rate limiting is active
- [ ] Logs are accessible
- [ ] MongoDB connection is stable
- [ ] SSL certificate is valid (HTTPS)
- [ ] Environment variables are set correctly
- [ ] Error handling works (test with invalid data)

---

## 🐛 Troubleshooting

### **MongoDB Connection Timeout**
```
Error: connect ETIMEDOUT
```
**Solution:** Whitelist server IP in MongoDB Atlas Network Access

### **CORS Error**
```
Access to fetch at '...' has been blocked by CORS policy
```
**Solution:** Add frontend domain to `ALLOWED_ORIGINS` in .env

### **JWT Error**
```
JsonWebTokenError: invalid token
```
**Solution:** Ensure JWT_SECRET matches between environments

### **Port Already in Use**
```
Error: listen EADDRINUSE
```
**Solution:** Change PORT in .env or kill process:
```bash
pm2 stop kwil-api
# or
killall node
```

---

## 📦 Backup Strategy

### **MongoDB Backups**
- Enable automated backups in MongoDB Atlas
- Download manual backups weekly
- Test restore process

### **Code Backups**
- Git version control (GitHub/GitLab)
- Tag releases: `git tag -a v1.0.0 -m "Production release"`

---

## 🎯 Production Environment Variables

```env
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://prod-user:secure-password@cluster.mongodb.net/kwil-prod

# Security
JWT_SECRET=<64-char-random-hex>
JWT_EXPIRE=7d

# CORS
CLIENT_URL=https://kwilai.com
ALLOWED_ORIGINS=https://kwilai.com,https://www.kwilai.com

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=50

# External APIs (to be added later)
GOOGLE_GEMINI_API_KEY=your-key
SPOONACULAR_API_KEY=your-key
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

---

**Deployment Status:** ✅ Ready for Production

**Recommended Platform for Beginners:** Railway  
**Recommended Platform for Production:** AWS EC2 + RDS

---

**Good luck with deployment! 🚀**
