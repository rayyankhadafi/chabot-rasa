FROM python:3.9-slim

# Install system dependencies required for C++ extensions and build
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    git \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements definition and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy source code and pre-trained models
COPY . .

# Ensure entrypoint script is executable
RUN chmod +x /app/entrypoint.sh

# Inform Docker/Render that Port 5005 is the main exposed port
EXPOSE 5005

ENTRYPOINT ["/app/entrypoint.sh"]
