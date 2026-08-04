#!/bin/bash
set -e

# Optimize TensorFlow & CPU memory footprint for 512MB RAM cloud instances (prevents OOM Exit 137)
export TF_CPP_MIN_LOG_LEVEL=2
export OMP_NUM_THREADS=1
export OPENBLAS_NUM_THREADS=1
export MKL_NUM_THREADS=1
export VECLIB_MAXIMUM_THREADS=1
export NUMEXPR_NUM_THREADS=1

PORT_TO_USE=${PORT:-5005}
CORS_TO_USE=${CORS_ORIGIN:-"*"}

# 1. Start Rasa Action Server PRIVATELY on 127.0.0.1:5055 (SANIC_HOST ensures Render scanner ignores port 5055)
echo "[Rasa Docker] Starting Rasa Action Server internally on 127.0.0.1:5055..."
SANIC_HOST=127.0.0.1 rasa run actions --port 5055 &

# Wait for action server to initialize
sleep 3

# 2. Start Rasa API Server PUBLICLY on 0.0.0.0:$PORT_TO_USE so Render binds external domain to main Rasa API
echo "[Rasa Docker] Starting Rasa API Server publicly on 0.0.0.0:$PORT_TO_USE (CORS: $CORS_TO_USE)..."
exec rasa run --enable-api --cors "$CORS_TO_USE" --port "$PORT_TO_USE"
