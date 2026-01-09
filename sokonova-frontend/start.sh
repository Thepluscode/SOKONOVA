#!/bin/sh
set -e

echo "Starting nginx..."
echo "Files in /usr/share/nginx/html:"
ls -la /usr/share/nginx/html

echo "Testing nginx configuration..."
nginx -t

echo "Starting nginx in foreground..."
exec nginx -g 'daemon off;'
