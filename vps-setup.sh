#!/bin/bash
# =============================================================
#  VPS setup using Apache (httpd) — already running on port 80
#  Creates https://api.pukhrajherbals.com → backend :6396
#
#  Run on your VPS:  bash vps-setup.sh
# =============================================================
set -e

echo ""
echo "======================================"
echo "  VPS — API subdomain setup (Apache)"
echo "======================================"
echo ""

# ---------- 1. Install certbot for Apache ----------
echo "1. Installing certbot..."
if command -v dnf &>/dev/null; then
  dnf install -y epel-release 2>/dev/null || true
  dnf install -y certbot python3-certbot-apache
elif command -v yum &>/dev/null; then
  yum install -y epel-release 2>/dev/null || true
  yum install -y certbot python3-certbot-apache
else
  apt-get update -y
  apt-get install -y certbot python3-certbot-apache
fi

# ---------- 2. Enable Apache proxy modules ----------
echo ""
echo "2. Enabling Apache proxy modules..."
# On CentOS/Amazon Linux these are usually already compiled in
# but we load them explicitly to be safe
cat >> /etc/httpd/conf.modules.d/00-proxy.conf 2>/dev/null <<'MODULES' || true
LoadModule proxy_module modules/mod_proxy.so
LoadModule proxy_http_module modules/mod_proxy_http.so
MODULES

# ---------- 3. Create VirtualHost for api.pukhrajherbals.com ----------
echo ""
echo "3. Creating Apache VirtualHost for api.pukhrajherbals.com..."

cat > /etc/httpd/conf.d/api.pukhrajherbals.com.conf <<'APACHE'
<VirtualHost *:80>
    ServerName api.pukhrajherbals.com

    ProxyPreserveHost On
    ProxyPass        / http://127.0.0.1:6396/
    ProxyPassReverse / http://127.0.0.1:6396/

    # Allow large uploads (image upload endpoint)
    LimitRequestBody 20971520
</VirtualHost>
APACHE

# ---------- 4. Test & reload Apache ----------
echo ""
echo "4. Reloading Apache..."
httpd -t && systemctl reload httpd

# ---------- 5. Get free SSL certificate ----------
echo ""
echo "5. Getting SSL certificate for api.pukhrajherbals.com..."
echo "   (Ensure DNS A record for api.pukhrajherbals.com points to this server first)"
echo ""
certbot --apache -d api.pukhrajherbals.com --non-interactive --agree-tos \
  --email admin@pukhrajherbals.com --redirect

echo ""
echo "======================================"
echo "  Done!"
echo "  Your API is now live at:"
echo "  https://api.pukhrajherbals.com/pukhrajherbals/api"
echo "  (Apache handles SSL + proxy, nginx not needed)"
echo "======================================"
