#!/bin/sh
# backend/container_hardening.sh

echo "[Container] Starting Application Hardening..."

# 1. File Permissions (The Principle of Least Privilege)
# We make sure the code is Read-Only. 
# If a hacker breaks in, they can't edit your code to add a backdoor.
chmod -R 555 /app/app

# 2. Lock down the .env file (if it exists inside)
if [ -f "/app/.env" ]; then
    chmod 400 /app/.env
    echo ".env file locked."
fi

# 3. Network Hardening (Optional but cool)
# We can't use UFW, but we can verify we aren't running as root
if [ "$(id -u)" -eq 0 ]; then
    echo "ERROR: Container is running as ROOT! Aborting."
    exit 1
fi

echo "Container Hardening Complete. Launching App..."

# 4. Pass control to the CMD (Launch Python)
# This 'exec' is important: it replaces the shell with Python, 
# so Python becomes PID 1 (handles signals correctly).
exec "$@"