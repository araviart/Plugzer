FROM node:22-bookworm-slim AS client-builder
WORKDIR /app/client
COPY client/package*.json ./
RUN npm ci
COPY client/ ./
RUN npm run build

FROM node:22-bookworm-slim
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .
COPY --from=client-builder /app/client/dist ./client/dist
ENV NODE_ENV=production
ENV PORT=3065
EXPOSE 3065
CMD ["./node_modules/.bin/tsx", "server.ts"]
