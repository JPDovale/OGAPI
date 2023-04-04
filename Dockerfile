FROM node:latest

WORKDIR /user/api

COPY package.json ./

RUN npm install

COPY . .

RUN npm build:tsup

EXPOSE 3030

CMD ["npm", "run", "aplication"]