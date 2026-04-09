FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm
RUN pnpm config set store-dir /pnpm/store

COPY package.json ./

RUN --mount=type=cache,id=pnpm-store,target=/pnpm/store \
    pnpm install

COPY . .

RUN pnpm prisma generate

EXPOSE 3001

CMD ["pnpm", "run", "start:dev"]