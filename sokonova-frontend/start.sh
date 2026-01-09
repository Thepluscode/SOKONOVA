#!/bin/sh
set -e

echo "Starting nginx..."
export PORT="${PORT:-3000}"
echo "Listening on port $PORT"

echo "Substituting environment variables in nginx.conf..."
envsubst '${PORT}' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

echo "Files in /usr/share/nginx/html:"
ls -la /usr/share/nginx/html

echo "Testing nginx configuration..."
nginx -t

echo "Starting nginx in foreground..."
exec nginx -g 'daemon off;'
