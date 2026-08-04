FROM node:20-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm ci --only=production

# Copy backend source code
COPY . .

# Expose default port (Render automatically overrides PORT env var)
EXPOSE 8000

CMD ["node", "server.js"]
