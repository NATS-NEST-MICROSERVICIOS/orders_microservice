FROM node:21-alpine

WORKDIR /usr/src/app

COPY package.json ./

#COPY package-lock.json ./

RUN npm install -g pnpm

RUN pnpm install

COPY . .

#RUN npx prisma generate

EXPOSE 4001


