#!/bin/sh
set -e

# Check if backend is available (optional timeout)
echo "Checking backend availability..."
if command -v curl > /dev/null 2>&1; then
    timeout 2 curl -f http://backend:3001/health 2>/dev/null || {
        echo "WARNING: Backend not available, frontend will operate without API proxy"
    }
fi

# Start Nginx
exec nginx -g "daemon off;"
