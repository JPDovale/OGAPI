FROM node:latest
EXPOSE 3030

WORKDIR /usr/app

COPY package*.json ./

RUN npm install

COPY ./ ./

RUN npm run build:tsup


# CMD ["npm", "run", "application"]