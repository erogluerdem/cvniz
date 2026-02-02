FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_API_URL=/api
ENV VITE_API_URL=$VITE_API_URL
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh && apk add --no-cache curl
EXPOSE 80
HEALTHCHECK --interval=30s --timeout=10s --start-period=3s --retries=3 \
    CMD curl -f http://localhost/ || exit 1
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
