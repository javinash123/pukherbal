=== Pukhraj Herbals - Deployment Package ===

This single folder contains EVERYTHING you need - frontend + backend.

CONTENTS:
  index.cjs       - The complete server (frontend + backend in one file)
  public/         - Frontend static assets (auto-served by index.cjs)
  .env            - Configuration (EDIT THIS - put your MongoDB URI here)
  package.json    - npm metadata
  README.txt      - This file

=== HOW TO RUN ON YOUR EC2 ===

1. Install Node.js 18 or newer (one-time):
     curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
     sudo yum install -y nodejs

2. Upload this entire 'pukhrajherbals' folder to your EC2 (e.g. via SCP or SFTP).

3. SSH into your EC2 and go into the folder:
     cd ~/pukhrajherbals

4. Edit .env and put your real MongoDB connection string in MONGODB_URI:
     nano .env

5. Start the server:
     node index.cjs

   Your site is now live at:
     http://YOUR_SERVER_IP:6396/pukhrajherbals/

   The admin panel is at:
     http://YOUR_SERVER_IP:6396/pukhrajherbals/admin/login

=== KEEP IT RUNNING (RECOMMENDED) ===

To keep the server running 24/7 even after you log out, install PM2:

     sudo npm install -g pm2
     pm2 start index.cjs --name pukhrajherbals
     pm2 save
     pm2 startup     # follow the printed command to auto-start on reboot

To check logs:        pm2 logs pukhrajherbals
To restart:           pm2 restart pukhrajherbals
To stop:              pm2 stop pukhrajherbals

=== NOTES ===

- Port 6396 must be open in your EC2 security group (inbound rule).
- The .env file is read automatically when the server starts - no extra setup.
- The site lives at /pukhrajherbals/ (not at the root). Visiting just / will
  redirect to /pukhrajherbals/.
- Both the API and the frontend are served from the same server on the same
  port, so there's nothing else to configure.
