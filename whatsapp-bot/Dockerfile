FROM node:20

RUN apt-get update && apt-get install -y \
chromium \
libnss3 \
libatk-bridge2.0-0 \
libgtk-3-0 \
libgbm-dev

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

CMD ["npm","start"]