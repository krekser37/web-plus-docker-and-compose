FROM node:16-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build 

FROM nginx:latest AS frontend
# Копируем результат сборки из build-стадии
COPY --from=builder /app/build /usr/share/nginx/html
COPY nginx/conf.d/default.conf /etc/nginx/conf.d
EXPOSE 8081
# Команда для запуска
CMD ["nginx", "-g", "daemon off;"]