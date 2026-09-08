FROM node:22-slim

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY server ./server

ENV HOST=0.0.0.0
ENV NODE_ENV=production
EXPOSE 4000

CMD ["node", "--experimental-sqlite", "server/index.js"]
