FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine AS backend
WORKDIR /app
COPY package*.json ./
# Флаг --omit=dev означает "не ставить dev-зависимости"
RUN npm ci --omit=dev && npm i -g pm2
# Копируем результат сборки из build-стадии
COPY --from=builder /app/dist ./dist
COPY ./ecosystem.config.js .
EXPOSE 4000
# Команда для запуска
CMD ["pm2-runtime", "start", "ecosystem.config.js"]