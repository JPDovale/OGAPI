FROM node:latest

WORKDIR /user/api

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3030

CMD ["npm", "run", "dev"]