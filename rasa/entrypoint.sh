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

# 1. Start Rasa Action Server in background
echo "[Rasa Docker] Starting Rasa Action Server on port 5055..."
rasa run actions --port 5055 &

# Wait briefly for action server initialization
sleep 2

# 2. Start Rasa API Server bound explicitly to 0.0.0.0:$PORT_TO_USE
echo "[Rasa Docker] Starting Rasa API Server on 0.0.0.0:$PORT_TO_USE (CORS: $CORS_TO_USE)..."
exec rasa run --enable-api -i 0.0.0.0 --cors "$CORS_TO_USE" --port "$PORT_TO_USE"
