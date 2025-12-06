# Deploying æthera

This guide covers deploying æthera to a VPS and connecting your Squarespace domain (aetherawi.red).

## Quick Overview

1. **Get a VPS** (DigitalOcean, Hetzner, Vultr, etc.)
2. **Deploy with Docker** (easiest) or direct Python
3. **Set up Caddy** for HTTPS and reverse proxy
4. **Point Squarespace domain** to your VPS

---

## Option A: Docker Deployment (Recommended)

### 1. Server Setup

SSH into your new VPS:

```bash
ssh root@your-server-ip
```

Install Docker:

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com | sh

# Start Docker
systemctl enable docker
systemctl start docker
```

### 2. Clone and Build

```bash
# Clone the repo (replace with your actual repo URL)
git clone https://github.com/YOUR_USERNAME/aethera.git /opt/aethera
cd /opt/aethera

# Create data directory for persistent storage
mkdir -p /opt/aethera/data

# Build the Docker image
docker build -t aethera:latest .
```

### 3. Run the Container

```bash
# Generate secure salts
TRIPCODE_SALT=$(openssl rand -hex 32)
SECRET_KEY=$(openssl rand -hex 32)

# Run the container
docker run -d \
  --name aethera \
  --restart unless-stopped \
  -p 127.0.0.1:8000:8000 \
  -e AETHERA_TRIPCODE_SALT="$TRIPCODE_SALT" \
  -e AETHERA_SECRET_KEY="$SECRET_KEY" \
  -v /opt/aethera/data:/app/data \
  aethera:latest

# Check it's running
docker logs aethera
```

### 4. Install Caddy (Reverse Proxy + HTTPS)

Caddy automatically handles SSL certificates via Let's Encrypt:

```bash
# Install Caddy
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install caddy
```

Create Caddyfile:

```bash
cat > /etc/caddy/Caddyfile << 'EOF'
aetherawi.red {
    reverse_proxy localhost:8000
    encode gzip
    
    # Security headers
    header {
        X-Content-Type-Options nosniff
        X-Frame-Options DENY
        Referrer-Policy strict-origin-when-cross-origin
    }
}

# Redirect www to apex
www.aetherawi.red {
    redir https://aetherawi.red{uri} permanent
}
EOF
```

Start Caddy:

```bash
systemctl enable caddy
systemctl restart caddy
```

---

## Option B: Direct Python Deployment

### 1. Server Setup

```bash
ssh root@your-server-ip

# Create a non-root user
adduser aethera
usermod -aG sudo aethera
su - aethera
```

### 2. Install Dependencies

```bash
# Install Python and uv
sudo apt update
sudo apt install -y python3.11 python3.11-venv git

# Install uv
curl -LsSf https://astral.sh/uv/install.sh | sh
source ~/.bashrc
```

### 3. Clone and Setup

```bash
cd ~
git clone https://github.com/YOUR_USERNAME/aethera.git
cd aethera

# Create environment file
cat > .env << 'EOF'
DATABASE_URL=sqlite:///./data/blog.sqlite
AETHERA_TRIPCODE_SALT=your-random-salt-here
AETHERA_SECRET_KEY=your-random-secret-here
EOF

# Generate random values
sed -i "s/your-random-salt-here/$(openssl rand -hex 32)/" .env
sed -i "s/your-random-secret-here/$(openssl rand -hex 32)/" .env

# Create data directory
mkdir -p data

# Install dependencies and run migrations
uv sync
uv run alembic upgrade head
```

### 4. Create Systemd Service

```bash
sudo tee /etc/systemd/system/aethera.service << EOF
[Unit]
Description=æthera Blog
After=network.target

[Service]
Type=simple
User=aethera
WorkingDirectory=/home/aethera/aethera
EnvironmentFile=/home/aethera/aethera/.env
ExecStart=/home/aethera/.local/bin/uv run uvicorn aethera.main:app --host 127.0.0.1 --port 8000
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable aethera
sudo systemctl start aethera

# Check status
sudo systemctl status aethera
```

### 5. Install Caddy (same as Docker option)

Follow the Caddy installation steps from Option A.

---

## Connecting Squarespace Domain

Since you own `aetherawi.red` through Squarespace, you need to point it to your VPS.

### Step 1: Get Your VPS IP Address

```bash
# On your VPS
curl -4 ifconfig.me
```

### Step 2: Configure DNS in Squarespace

1. Log into Squarespace
2. Go to **Settings** → **Domains** → **aetherawi.red**
3. Click **DNS Settings** or **Advanced Settings**
4. **Delete any existing A records** for the root domain
5. Add new records:

| Type | Host | Value | TTL |
|------|------|-------|-----|
| A | @ | YOUR_VPS_IP | 1 hour |
| A | www | YOUR_VPS_IP | 1 hour |

(Replace `YOUR_VPS_IP` with your actual server IP)

### Step 3: Wait for Propagation

DNS changes can take 5 minutes to 48 hours to propagate worldwide.

Check propagation status:
- https://dnschecker.org/#A/aetherawi.red
- Or run: `dig aetherawi.red +short`

### Step 4: Verify HTTPS

Once DNS is pointing to your server, Caddy will automatically:
1. Detect the incoming requests
2. Obtain SSL certificates from Let's Encrypt
3. Enable HTTPS

Test your site: `https://aetherawi.red`

---

## Post-Deployment Tasks

### Import Your First Post

On your VPS:

```bash
cd /opt/aethera  # or ~/aethera for direct install

# Create a new post file
cat > my-first-post.md << 'EOF'
---
title: Hello World
author: æthera
tags: intro, meta
published: true
---

# Hello from the aether

This is my first post on æthera. Welcome to my corner of the internet.
EOF

# Import it
docker exec -it aethera python import_post.py my-first-post.md
# OR for direct install:
uv run python import_post.py my-first-post.md
```

### Backup Strategy

```bash
# Create backup script
cat > /opt/backup-aethera.sh << 'EOF'
#!/bin/bash
BACKUP_DIR=/opt/backups/aethera
mkdir -p $BACKUP_DIR
DATE=$(date +%Y%m%d_%H%M%S)

# Copy SQLite database
cp /opt/aethera/data/blog.sqlite $BACKUP_DIR/blog_$DATE.sqlite

# Keep only last 30 backups
ls -t $BACKUP_DIR/blog_*.sqlite | tail -n +31 | xargs -r rm

echo "Backup completed: blog_$DATE.sqlite"
EOF

chmod +x /opt/backup-aethera.sh

# Add to crontab (daily at 3am)
(crontab -l 2>/dev/null; echo "0 3 * * * /opt/backup-aethera.sh") | crontab -
```

### Updating æthera

```bash
cd /opt/aethera
git pull

# Docker method:
docker build -t aethera:latest .
docker stop aethera
docker rm aethera
# Re-run the docker run command from step 3

# Direct method:
sudo systemctl restart aethera
```

---

## VPS Recommendations

For a personal blog, you don't need much:

| Provider | Plan | Price | Good For |
|----------|------|-------|----------|
| **Hetzner** | CX22 | ~$4/mo | Best value in EU |
| **DigitalOcean** | Basic $6 | $6/mo | Simple, great docs |
| **Vultr** | Cloud $6 | $6/mo | Many locations |
| **Oracle Cloud** | Free tier | $0 | Free forever (limited) |
| **Linode** | Nanode | $5/mo | Solid performance |

For æthera (SQLite + small app):
- **1 vCPU, 1GB RAM** is plenty
- **20GB SSD** is more than enough
- Pick a region close to your audience

---

## Troubleshooting

### Site not loading?

```bash
# Check if app is running
docker ps  # or: systemctl status aethera

# Check logs
docker logs aethera  # or: journalctl -u aethera -f

# Check Caddy
systemctl status caddy
journalctl -u caddy -f
```

### DNS not resolving?

```bash
# Check if DNS points to your IP
dig aetherawi.red +short

# Check if Caddy can reach the domain
caddy validate --config /etc/caddy/Caddyfile
```

### HTTPS certificate issues?

```bash
# Force certificate refresh
caddy reload --config /etc/caddy/Caddyfile

# Check certificate status
curl -vI https://aetherawi.red 2>&1 | grep -i "subject\|issuer"
```

---

## Security Checklist

- [ ] SSH key authentication (disable password login)
- [ ] Firewall: Only allow ports 22, 80, 443
- [ ] Keep system updated: `apt update && apt upgrade`
- [ ] Set strong values for `AETHERA_TRIPCODE_SALT` and `AETHERA_SECRET_KEY`
- [ ] Regular backups of the SQLite database
- [ ] Monitor disk space for uploads

```bash
# Quick firewall setup
ufw allow OpenSSH
ufw allow 80
ufw allow 443
ufw enable
```

---

That's it! Your blog should now be live at `https://aetherawi.red` 🎉

