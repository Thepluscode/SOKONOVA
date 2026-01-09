#!/bin/bash

# Kill any existing processes on ports 3000, 3001, 4001
echo "Cleaning up ports..."
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
lsof -ti:4001 | xargs kill -9 2>/dev/null

echo "Starting SokoNova Backend..."
cd backend
npm run start:dev > ../backend.log 2>&1 &
BACKEND_PID=$!
echo "Backend started (PID: $BACKEND_PID). Logs in backend.log"

echo "Waiting for Backend to initialize..."
sleep 10

echo "Starting SokoNova Frontend..."
cd ../sokonova-frontend
npm run dev
