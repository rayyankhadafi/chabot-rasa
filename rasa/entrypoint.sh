#!/bin/bash
set -e

echo "[Rasa Docker] Starting Rasa Action Server on 127.0.0.1:5055..."
rasa run actions --port 5055 -H 127.0.0.1 &

# Wait for action server to initialize
sleep 4

PORT_TO_USE=${PORT:-5005}
CORS_TO_USE=${CORS_ORIGIN:-"*"}

echo "[Rasa Docker] Starting Rasa API Server on 0.0.0.0:$PORT_TO_USE (CORS: $CORS_TO_USE)..."
exec rasa run --enable-api --cors "$CORS_TO_USE" --port "$PORT_TO_USE"
