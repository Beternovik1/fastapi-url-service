#!/bin/sh
# backend/container_hardening.sh

echo "[Container] Starting Application Hardening..."

# 1. File Permissions (A prueba de fallos)
# El "|| echo..." significa: Si fallas, NO mates el servidor, solo imprime un aviso.
echo "   -> Setting permissions on /app/app..."
chmod -R 755 /app/app 2>/dev/null || echo "WARNING: Could not chmod /app/app (Likely due to Docker Volumes). Skipping."

# 2. Lock down .env (A prueba de fallos)
if [ -f "/app/.env" ]; then
    echo "   -> Locking .env file..."
    chmod 400 /app/.env 2>/dev/null || echo "WARNING: Could not lock .env (Volume mounted?). Skipping."
fi

# 3. Check for Root (Esto sí debe fallar si es inseguro)
if [ "$(id -u)" -eq 0 ]; then
    echo "ERROR: Container is running as ROOT! Aborting."
    exit 1
fi

echo "Container Hardening Complete. Launching App..."

# 4. Launch Python
exec "$@"