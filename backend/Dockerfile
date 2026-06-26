# ===== Étape 1 : compilation =====
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY prisma ./prisma
RUN npx prisma generate
COPY . .
RUN npm run build

# ===== Étape 2 : image finale (légère) =====
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY prisma ./prisma
RUN npx prisma generate
COPY --from=build /app/dist ./dist
EXPOSE 3000
# Au démarrage : on applique les migrations puis on lance l'API.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
