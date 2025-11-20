# 🚀 Deployment Guide - AI Vision Platform

## Deployment Options

### Option 1: Vercel (Recommended) ⭐

**Vercel is the easiest and fastest way to deploy Next.js applications.**

#### Step-by-Step Instructions:

1. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: AI Vision Platform"
   git branch -M main
   git remote add origin https://github.com/yourusername/ai-vision-platform.git
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Visit [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will auto-detect Next.js

3. **Configure Environment Variables**
   In Vercel dashboard → Settings → Environment Variables:
   ```
   JWT_SECRET=your-generated-secret-key
   GOOGLE_GEMINI_API_KEY=your-gemini-api-key
   HUGGINGFACE_API_KEY=your-huggingface-token
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your app is live! 🎉

**URL Format**: `https://ai-vision-platform.vercel.app`

#### Vercel Features:
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Automatic deployments on git push
- ✅ Preview deployments for PRs
- ✅ 100GB bandwidth/month (Free tier)
- ✅ Built-in analytics

---

### Option 2: Netlify

#### Deployment Steps:

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Deploy to Netlify**
   - Visit [netlify.com](https://netlify.com)
   - Drag and drop the `.next` folder
   - Or connect your GitHub repo

3. **Environment Variables**
   Site settings → Build & deploy → Environment → Add variables

4. **Configure Build Settings**
   ```
   Build command: npm run build
   Publish directory: .next
   ```

---

### Option 3: AWS (EC2 or Lambda)

#### EC2 Deployment:

1. **Launch EC2 Instance**
   - Ubuntu 22.04 LTS
   - t2.micro (Free tier)
   - Security group: Allow HTTP (80), HTTPS (443), SSH (22)

2. **Connect and Setup**
   ```bash
   ssh -i your-key.pem ubuntu@your-ec2-ip
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Clone repository
   git clone https://github.com/yourusername/ai-vision-platform.git
   cd ai-vision-platform
   
   # Install dependencies
   npm install
   
   # Create .env.local
   nano .env.local
   # Paste your environment variables
   
   # Build
   npm run build
   
   # Start with PM2
   pm2 start npm --name "ai-vision-platform" -- start
   pm2 save
   pm2 startup
   ```

3. **Configure Nginx (Optional)**
   ```bash
   sudo apt install nginx
   sudo nano /etc/nginx/sites-available/ai-vision-platform
   ```
   
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```
   
   ```bash
   sudo ln -s /etc/nginx/sites-available/ai-vision-platform /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

4. **SSL with Let's Encrypt**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d your-domain.com
   ```

---

### Option 4: Docker

#### Dockerfile:

Create `Dockerfile` in project root:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment variables for build
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

#### docker-compose.yml:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - GOOGLE_GEMINI_API_KEY=${GOOGLE_GEMINI_API_KEY}
      - HUGGINGFACE_API_KEY=${HUGGINGFACE_API_KEY}
    restart: unless-stopped
```

#### Deploy with Docker:

```bash
# Build image
docker build -t ai-vision-platform .

# Run container
docker run -p 3000:3000 \
  -e JWT_SECRET="your-secret" \
  -e GOOGLE_GEMINI_API_KEY="your-key" \
  -e HUGGINGFACE_API_KEY="your-token" \
  ai-vision-platform

# Or use docker-compose
docker-compose up -d
```

---

### Option 5: Railway

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and Deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Add Environment Variables**
   ```bash
   railway variables set JWT_SECRET="your-secret"
   railway variables set GOOGLE_GEMINI_API_KEY="your-key"
   railway variables set HUGGINGFACE_API_KEY="your-token"
   ```

---

## Post-Deployment Checklist

### ✅ Essential Checks

1. **Environment Variables**
   - [ ] JWT_SECRET is set and secure
   - [ ] GOOGLE_GEMINI_API_KEY is valid
   - [ ] HUGGINGFACE_API_KEY is valid

2. **Application Testing**
   - [ ] Homepage loads correctly
   - [ ] Can create new account
   - [ ] Can login with existing account
   - [ ] Can upload image
   - [ ] Object detection works
   - [ ] Q&A system responds
   - [ ] Logout works

3. **Performance**
   - [ ] Page load times are acceptable
   - [ ] Images load quickly
   - [ ] API responses are fast
   - [ ] No console errors

4. **Security**
   - [ ] HTTPS is enabled
   - [ ] No API keys in client-side code
   - [ ] JWT tokens are secure
   - [ ] CORS is configured properly

5. **Mobile Testing**
   - [ ] Responsive on mobile devices
   - [ ] Touch interactions work
   - [ ] Upload works on mobile
   - [ ] Chat interface is usable

---

## Monitoring & Maintenance

### Error Monitoring

**Recommended Services:**
- **Sentry**: Error tracking and monitoring
- **LogRocket**: Session replay and debugging
- **Datadog**: Full-stack monitoring

**Setup Sentry:**
```bash
npm install @sentry/nextjs

npx @sentry/wizard -i nextjs
```

### Analytics

**Recommended Services:**
- **Vercel Analytics**: Built-in with Vercel
- **Google Analytics**: Free website analytics
- **Plausible**: Privacy-friendly analytics

### Performance Monitoring

**Tools:**
- Lighthouse (Chrome DevTools)
- Web Vitals
- GTmetrix
- Pingdom

---

## Scaling Considerations

### Database

**Replace in-memory storage with:**
- **PostgreSQL** (Vercel Postgres, Supabase)
- **MongoDB** (MongoDB Atlas)
- **Firebase** (Google)

### File Storage

**Store uploaded images in:**
- **AWS S3**: Scalable object storage
- **Cloudinary**: Image optimization CDN
- **Vercel Blob**: Built-in blob storage

### Caching

**Implement caching for:**
- Detection results (Redis)
- API responses (Next.js ISR)
- Static assets (CDN)

### Rate Limiting

**Protect API endpoints:**
```typescript
// Example with Upstash Rate Limit
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "10 s"),
});
```

---

## Cost Estimation

### Free Tier Limits

**Vercel Free:**
- 100GB bandwidth/month
- Unlimited deployments
- Automatic SSL
- **Cost**: $0/month

**API Costs:**
- Google Gemini: Free tier (60 requests/minute)
- Hugging Face: Free tier (1000 requests/month)
- **Cost**: $0-10/month (depending on usage)

### Paid Tiers (Optional)

**Vercel Pro** ($20/month):
- 1TB bandwidth
- Team collaboration
- Advanced analytics

**Database** (if added):
- PostgreSQL: $5-15/month
- MongoDB Atlas: $0-9/month

**Total Estimated Cost**: $0-50/month

---

## Rollback Plan

### Quick Rollback on Vercel

1. Go to Deployments tab
2. Find previous working deployment
3. Click "..." → "Promote to Production"
4. Instant rollback! ✅

### Git Rollback

```bash
git log  # Find commit hash
git revert <commit-hash>
git push origin main
```

---

## Troubleshooting Deployment Issues

### Issue: Build fails

**Check:**
- TypeScript errors: `npm run build` locally
- Missing dependencies: `npm install`
- Environment variables are set

### Issue: 500 Internal Server Error

**Check:**
- API routes are correct
- Environment variables in production
- Server logs for details

### Issue: API keys not working

**Check:**
- Keys are correctly set in deployment platform
- No extra spaces in keys
- Keys have proper permissions

### Issue: Slow performance

**Solutions:**
- Enable image optimization
- Implement caching
- Use CDN for static assets
- Optimize bundle size

---

## Security Best Practices

1. **Never commit .env.local**
   - Always in .gitignore
   - Use deployment platform's env vars

2. **Rotate API keys regularly**
   - Google Gemini: Monthly
   - Hugging Face: Quarterly
   - JWT Secret: On breach only

3. **Enable HTTPS**
   - Free with Let's Encrypt
   - Automatic on Vercel

4. **Rate limit API endpoints**
   - Prevent abuse
   - Protect costs

5. **Monitor for errors**
   - Set up alerts
   - Check logs daily

---

## Support & Resources

**Vercel Documentation**: https://vercel.com/docs
**Next.js Deployment**: https://nextjs.org/docs/deployment
**Docker Documentation**: https://docs.docker.com
**AWS Documentation**: https://docs.aws.amazon.com

---

**Deployment Ready!** 🚀

Choose your preferred deployment method and follow the steps above. For most cases, **Vercel** is the recommended option for its simplicity and Next.js optimization.

