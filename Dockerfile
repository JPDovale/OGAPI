FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./
COPY .env ./

RUN npm ci

COPY ./ ./

EXPOSE 3030
CMD ["npm", "run", "dev"]