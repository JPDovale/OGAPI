FROM node:alpine

WORKDIR /usr/app

COPY package*.json ./
COPY .env ./

RUN npm install

COPY ./ ./

EXPOSE 3030
CMD ["npm", "run", "application"]