FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:16-alpine AS production
ENV NODE_ENV=production
WORKDIR /app
COPY package*.json ./
# Флаг --omit=dev означает "не ставить dev-зависимости"
RUN npm ci --omit=dev && npm i -g pm2
COPY . .
# Копируем результат сборки из build-стадии
COPY --from=build /app/dist ./dist
COPY ./ecosystem.config.js .
EXPOSE 4000
# Команда для запуска
CMD ["pm2-runtime", "start", "ecosystem.config.js"]