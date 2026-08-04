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

# 1. Start Rasa API Server publicly on 0.0.0.0:$PORT_TO_USE FIRST so Render binds public domain here
echo "[Rasa Docker] Starting Rasa API Server publicly on 0.0.0.0:$PORT_TO_USE (CORS: $CORS_TO_USE)..."
rasa run --enable-api -i 0.0.0.0 --cors "$CORS_TO_USE" --port "$PORT_TO_USE" --credentials credentials.yml --endpoints endpoints.yml &
API_PID=$!

# Give API server headstart to bind public port
sleep 2

# 2. Start Rasa Action Server PRIVATELY on 127.0.0.1:5055 (SANIC_HOST ensures Render scanner ignores port 5055)
echo "[Rasa Docker] Starting Rasa Action Server internally on 127.0.0.1:5055..."
SANIC_HOST=127.0.0.1 rasa run actions --port 5055 &

# Wait for main Rasa API process
wait $API_PID
