# Production VPS Deployment Guide — Digital Station (`digitalstation.bf`)

This guide provides complete, step-by-step instructions to deploy Digital Station on a Linux VPS (Ubuntu 22.04 / 24.04 LTS or Debian 12).

---

## Architecture Overview

- **Framework:** Next.js 16 (App Router with `standalone` output)
- **Runtime:** Node.js 22.x LTS
- **Reverse Proxy:** Nginx (HTTP/2, TLS 1.3, SSL Stapling, Gzip, Rate Limiting)
- **SSL / TLS:** Let's Encrypt (Certbot with automated renewal)
- **Process Options:** Docker Compose (Recommended) OR PM2 Cluster OR systemd service

---

## 1. Initial VPS Server Hardening

Connect to your VPS as root or sudo user:

```bash
ssh root@YOUR_VPS_IP
```

### A. Update & Install Prerequisites
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git ufw fail2ban certbot python3-certbot-nginx
```

### B. Configure Firewall (UFW)
```bash
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## 2. DNS Configuration

Configure the following DNS records at your domain registrar (for `digitalstation.bf`):

| Type | Host | Value | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `YOUR_VPS_IP` | 3600 |
| **CNAME** | `www` | `digitalstation.bf.` | 3600 |

### Email DNS Records (for Resend lead intake delivery)
Add the SPF and DKIM TXT records provided in your [Resend Dashboard](https://resend.com/domains) for `digitalstation.bf`.

---

## 3. Clone Repository & Setup Environment

```bash
sudo mkdir -p /var/www
cd /var/www
sudo git clone https://github.com/Digital-station/site-web-digital-station-.bf.git digitalstation.bf
cd digitalstation.bf
```

### Configure Environment Variables
```bash
cp .env.example .env
nano .env
```

Ensure the following variables are set:
```env
# Required for contact form & booking lead delivery
RESEND_API_KEY=re_your_live_api_key_here
CONTACT_EMAIL=infos@digitalstation.bf
LEADS_FROM="Digital Station <contact@digitalstation.bf>"

# Optional
NEXT_PUBLIC_ANALYTICS_PROVIDER=
NEXT_PUBLIC_ANALYTICS_SITE_ID=
GOOGLE_SITE_VERIFICATION=
```

---

## 4. Deployment Option A: Docker Compose (Recommended)

### Install Docker & Docker Compose Plugin
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
```

### Build & Start Container
```bash
cd /var/www/digitalstation.bf
docker compose build --pull web
docker compose up -d web
```

Verify container status:
```bash
docker compose ps
docker compose logs -f web
```

---

## 5. Deployment Option B: Native Node.js + PM2 (Alternative)

### Install Node.js 22 LTS
```bash
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
sudo apt install -y nodejs
```

### Install Dependencies & Build
```bash
cd /var/www/digitalstation.bf
npm ci
npm run build
```

### Start with PM2
```bash
sudo npm install -g pm2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

---

## 6. Nginx Reverse Proxy & Let's Encrypt SSL

### A. Copy Nginx Configuration
```bash
sudo cp deploy/nginx/digitalstation.bf.conf /etc/nginx/sites-available/digitalstation.bf
sudo ln -sf /etc/nginx/sites-available/digitalstation.bf /etc/nginx/sites-enabled/
```

### B. Obtain Free SSL Certificate via Certbot
```bash
sudo certbot --nginx -d digitalstation.bf -d www.digitalstation.bf
```

### C. Test & Reload Nginx
```bash
sudo nginx -t
sudo systemctl reload nginx
```

Certbot automatically configures auto-renewal via systemd timers. Test renewal with:
```bash
sudo certbot renew --dry-run
```

---

## 7. Zero-Downtime Deployment Script

Whenever you push updates to GitHub, deploy them to your VPS with a single command:

```bash
cd /var/www/digitalstation.bf

# For Docker deployment:
./deploy/deploy.sh docker

# For PM2 deployment:
./deploy/deploy.sh pm2
```

The script automatically pulls latest changes, performs build checks, updates the standalone assets, reloads the process, and verifies a live HTTP 200 health check probe.

---

## 8. Monitoring & Maintenance Commands

### Check Live Status
```bash
# Docker:
docker compose ps
docker compose logs --tail=100 -f web

# PM2:
pm2 status
pm2 logs digitalstation-web

# Nginx Logs:
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```
