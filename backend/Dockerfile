FROM node:22-bookworm-slim AS base

WORKDIR /app

RUN apt-get update \
  && apt-get install -y --no-install-recommends python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

# Desarrollo (npm run dev / --watch)
FROM base AS dev

COPY package.json package-lock.json ./
RUN npm ci

COPY src ./src
RUN mkdir -p data

ENV PORT=3000
EXPOSE 3000

CMD ["npm", "run", "dev"]

# Producción
FROM base AS production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY src ./src
RUN mkdir -p data

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "src/index.js"]
