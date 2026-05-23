=== Pukhraj Herbals - Deployment Guide ===

FILES:
  pukhrajherbals-frontend.tar.gz  -- React app static files
  pukhrajherbals-backend.tar.gz   -- Node.js API server
  nginx-pukhraj.conf               -- Nginx config snippet
  start-backend.sh                 -- Backend startup script

=== STEP 1: Install Node.js (if not already installed) ===
  curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
  sudo yum install -y nodejs
  node --version   # should be v20+

=== STEP 2: Install PM2 (process manager) ===
  sudo npm install -g pm2

=== STEP 3: Deploy Frontend ===
  sudo mkdir -p /var/www/html/pukhrajherbals
  cd /var/www/html/pukhrajherbals
  sudo tar -xzf /path/to/pukhrajherbals-frontend.tar.gz
  # Ownership fix:
  sudo chown -R nginx:nginx /var/www/html/pukhrajherbals

=== STEP 4: Deploy Backend ===
  mkdir -p ~/pukhraj-api && cd ~/pukhraj-api
  tar -xzf /path/to/pukhrajherbals-backend.tar.gz
  # Edit start-backend.sh and replace YOUR_MONGODB_URI_HERE with your real URI
  nano start-backend.sh

=== STEP 5: Start Backend with PM2 ===
  cd ~/pukhraj-api
  PORT=8080 NODE_ENV=production MONGODB_URI="your_mongodb_uri" \
    pm2 start dist/index.mjs --name pukhraj-api
  pm2 save
  pm2 startup   # follow the printed command to auto-start on reboot

=== STEP 6: Update Nginx Config ===
  # Add the contents of nginx-pukhraj.conf into your server {} block
  sudo nano /etc/nginx/nginx.conf   # or /etc/nginx/conf.d/default.conf
  sudo nginx -t        # test config
  sudo systemctl reload nginx

=== VERIFY ===
  # Frontend: http://3.208.52.220/pukhrajherbals/
  # API health: http://3.208.52.220/api/products
  # Admin panel: http://3.208.52.220/pukhrajherbals/admin/login

=== NOTES ===
  - Admin login credentials are stored in your MongoDB (admin users collection)
  - Your MONGODB_URI is the same one configured in this project
  - The backend runs on port 8080 by default (change PORT= if needed)
