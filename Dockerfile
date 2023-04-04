FROM node:latest

WORKDIR /usr/api

COPY package.json ./

RUN npm install

COPY . .

RUN npm run build:tsup

EXPOSE 3030

CMD ["npm", "run", "application"]