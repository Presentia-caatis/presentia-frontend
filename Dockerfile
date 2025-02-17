FROM node:18-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile

COPY . .

COPY .env.production .env

ENV NODE_ENV=production

RUN npm run build

FROM node:18-alpine

WORKDIR /app

RUN npm i -g serve

COPY --from=build /app/dist /app/dist

EXPOSE 3000

CMD ["serve", "-s", "dist"]
