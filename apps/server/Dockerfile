FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm i -g pnpm && pnpm install --frozen-lockfile || pnpm install
COPY . .
RUN pnpm build

FROM node:20-alpine
WORKDIR /app
COPY --from=deps /app/dist dist
COPY --from=deps /app/package.json ./
COPY --from=deps /app/node_modules node_modules
EXPOSE 4000
CMD ["node", "dist/index.js"]
