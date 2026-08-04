#!/bin/bash
set -e

echo "[Rasa Docker] Starting Rasa Action Server on port 5055..."
rasa run actions --port 5055 &

# Wait for action server to initialize
sleep 4

PORT_TO_USE=${PORT:-5005}

echo "[Rasa Docker] Starting Rasa API Server on port $PORT_TO_USE..."
exec rasa run --enable-api --cors "*" --port "$PORT_TO_USE"
