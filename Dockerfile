###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:22-alpine AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .
