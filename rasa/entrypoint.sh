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

# 1. Start Rasa API Server FIRST so Render binds public domain to $PORT_TO_USE (e.g. 10000)
echo "[Rasa Docker] Starting Rasa API Server on port $PORT_TO_USE (CORS: $CORS_TO_USE)..."
rasa run --enable-api --cors "$CORS_TO_USE" --port "$PORT_TO_USE" &
API_PID=$!

# 2. Start Rasa Action Server in background for internal custom action calls
echo "[Rasa Docker] Starting Rasa Action Server on port 5055..."
rasa run actions --port 5055 &

# Keep script running and wait for main API process
wait $API_PID
