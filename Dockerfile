FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm@10.15.0
RUN pnpm config set store-dir /pnpm/store

COPY package.json ./

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install

COPY . .

RUN pnpm run migration:generate

EXPOSE 3001

CMD ["pnpm", "run", "start:dev"]