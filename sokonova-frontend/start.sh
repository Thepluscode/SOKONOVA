#!/bin/sh
set -e

echo "Starting nginx wrapper..."
export PORT="${PORT:-3000}"
echo "Target Port: $PORT"

if ! command -v envsubst >/dev/null 2>&1; then
    echo "Error: envsubst not found. Installing..."
    apk add --no-cache gettext
fi

echo "Detailed Files listing:"
ls -la /usr/share/nginx/html

echo "Generating nginx.conf from template..."
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Generated Config Content (First 20 lines):"
head -n 20 /etc/nginx/conf.d/default.conf

echo "Testing nginx configuration..."
nginx -t || { echo "Nginx config failed!"; exit 1; }

echo "Starting nginx in foreground..."
exec nginx -g 'daemon off;'
