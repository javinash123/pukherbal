#!/bin/bash
# Pukhraj Herbals - API Server Startup Script
# Run this on your EC2 instance

export PORT=8080
export NODE_ENV=production
export MONGODB_URI="YOUR_MONGODB_URI_HERE"

node dist/index.mjs
