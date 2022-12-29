FROM node:18

WORKDIR /play-helper-nest

COPY package.json .

RUN npm i 

COPY . .

EXPOSE 3000

RUN npm run build
