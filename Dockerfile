FROM node:18

WORKDIR /play-helper-nest

COPY ./package.json .

RUN npm i

COPY . .

RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]
