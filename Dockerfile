FROM node:latest
EXPOSE 3030

WORKDIR /usr/app

COPY package*.json ./
COPY tsup.config.js ./

RUN npm install

COPY ./ ./

RUN npm run build:tsup


# CMD ["npm", "run", "application"]