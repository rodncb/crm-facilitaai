#!/bin/bash

# Update system
apt-get update && apt-get upgrade -y

# Install Node.js (v20)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Install MongoDB
apt-get install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | \
   gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg \
   --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | \
   tee /etc/apt/sources.list.d/mongodb-org-7.0.list
apt-get update
apt-get install -y mongodb-org

# Start MongoDB
systemctl start mongod
systemctl enable mongod

# Install PM2
npm install -g pm2

# Install Nginx
apt-get install -y nginx

# Setup Firewall
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw enable

echo "✅ VPS Provisioning Complete!"
