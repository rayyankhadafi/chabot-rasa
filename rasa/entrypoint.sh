#!/bin/bash
set -e

# Performance flags for Hugging Face 2 vCPU / 16GB RAM instance
export TF_CPP_MIN_LOG_LEVEL=2
export OMP_NUM_THREADS=2
export OPENBLAS_NUM_THREADS=2

PORT_TO_USE=${PORT:-7860}
CORS_TO_USE=${CORS_ORIGIN:-"*"}

# 1. Start Rasa Action Server internally on 5055
echo "[Rasa HF] Starting Rasa Action Server on 127.0.0.1:5055..."
SANIC_HOST=127.0.0.1 rasa run actions --port 5055 &

sleep 2

# 2. Start Rasa API Server publicly on 0.0.0.0:7860 (Hugging Face default port)
echo "[Rasa HF] Starting Rasa API Server on 0.0.0.0:$PORT_TO_USE (CORS: $CORS_TO_USE)..."
exec rasa run --enable-api -i 0.0.0.0 --cors "$CORS_TO_USE" --port "$PORT_TO_USE" --credentials credentials.yml --endpoints endpoints.yml
