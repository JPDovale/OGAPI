FROM node:latest

WORKDIR /user/api

COPY package.json ./

RUN npm install
RUN npm build:tsup

COPY . .

EXPOSE 3030

CMD ["npm", "run", "aplication"]