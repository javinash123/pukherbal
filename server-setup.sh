#!/bin/bash
# =============================================================
#  Pukhraj Herbals — One-Command Server Setup
#  Run this on your VPS as root (or with sudo):
#    bash server-setup.sh
# =============================================================

set -e  # stop on any error

echo ""
echo "======================================"
echo "  Pukhraj Herbals — Server Setup"
echo "======================================"
echo ""

# ---------- collect info from the user ----------
read -p "Enter your MongoDB connection string (MONGODB_URI): " MONGODB_URI
if [ -z "$MONGODB_URI" ]; then
  echo "ERROR: MongoDB URI cannot be empty"; exit 1
fi

read -p "Enter your domain (e.g. pukhrajherbals.com): " DOMAIN
if [ -z "$DOMAIN" ]; then
  echo "ERROR: Domain cannot be empty"; exit 1
fi

read -p "Enter a secret key for sessions (any random string): " SESSION_SECRET
if [ -z "$SESSION_SECRET" ]; then
  SESSION_SECRET=$(head /dev/urandom | tr -dc A-Za-z0-9 | head -c 32)
  echo "Generated: $SESSION_SECRET"
fi

echo ""
echo "--------------------------------------"
echo "  Installing required software..."
echo "--------------------------------------"

# Update & install nginx, nodejs, npm, certbot
apt-get update -y
apt-get install -y nginx nodejs npm certbot python3-certbot-nginx

# Install PM2 (keeps the backend running)
npm install -g pm2

echo ""
echo "--------------------------------------"
echo "  Setting up backend..."
echo "--------------------------------------"

mkdir -p /opt/pukhrajherbals
cd /opt/pukhrajherbals

# Extract backend
tar -xzf ~/dist-deploy.tar.gz -C /opt/pukhrajherbals/

# Write .env file
cat > /opt/pukhrajherbals/.env <<EOF
MONGODB_URI=${MONGODB_URI}
SESSION_SECRET=${SESSION_SECRET}
PORT=6396
BASE_PATH=/pukhrajherbals
NODE_ENV=production
EOF

echo ""
echo "--------------------------------------"
echo "  Setting up frontend..."
echo "--------------------------------------"

mkdir -p /var/www/pukhrajherbals/public
tar -xzf ~/frontend-deploy.tar.gz -C /var/www/pukhrajherbals/public/

echo ""
echo "--------------------------------------"
echo "  Configuring nginx..."
echo "--------------------------------------"

cat > /etc/nginx/sites-available/pukhrajherbals.conf <<NGINX
server {
    listen 80;
    server_name ${DOMAIN} www.${DOMAIN};

    root /var/www/pukhrajherbals/public;
    index index.html;

    location /assets/ {
        expires 1y;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /pukhrajherbals/api/ {
        proxy_pass         http://127.0.0.1:6396;
        proxy_http_version 1.1;
        proxy_set_header   Host              \$host;
        proxy_set_header   X-Real-IP         \$remote_addr;
        proxy_set_header   X-Forwarded-For   \$proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto \$scheme;
        client_max_body_size 20M;
    }

    location / {
        try_files \$uri \$uri/ /index.html;
    }
}
NGINX

ln -sf /etc/nginx/sites-available/pukhrajherbals.conf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx

echo ""
echo "--------------------------------------"
echo "  Starting backend with PM2..."
echo "--------------------------------------"

cd /opt/pukhrajherbals
pm2 start index.cjs --name pukhrajherbals --env production
pm2 save
pm2 startup | tail -1 | bash   # auto-start on reboot

echo ""
echo "--------------------------------------"
echo "  Setting up HTTPS (SSL)..."
echo "--------------------------------------"

certbot --nginx -d ${DOMAIN} -d www.${DOMAIN} --non-interactive --agree-tos --email admin@${DOMAIN} --redirect

echo ""
echo "======================================"
echo "  Setup complete!"
echo "  Your website is live at:"
echo "  https://${DOMAIN}/"
echo "======================================"
