FROM node:current-alpine AS base
WORKDIR /base
COPY package.json ./
COPY yarn.lock ./
RUN yarn install
COPY . .
ENV NODE_ENV=production
CMD yarn build && yarn start
