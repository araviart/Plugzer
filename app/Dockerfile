FROM node:22-bookworm-slim
WORKDIR /app
ENV NODE_ENV=production
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY . .
ENV PORT=3065
EXPOSE 3065
CMD ["./node_modules/.bin/tsx","server.ts"]
