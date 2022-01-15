FROM node:16.13.2-alpine3.14

ENV NODE_ENV=production

WORKDIR /usr/src
COPY package*.json ./
RUN npm install --production

COPY . .
