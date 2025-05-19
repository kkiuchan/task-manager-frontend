# === Build Stage ===
FROM node:18 AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# === Production Stage ===
FROM node:18 AS runner
WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package*.json ./

# 本番依存のみインストール（node_modulesはコピーしない）
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]