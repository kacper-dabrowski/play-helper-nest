FROM node:18 as builder

WORKDIR /play-helper-nest

COPY package.json .

RUN npm i 

COPY . .

EXPOSE 3000

RUN npm run prisma:generate

RUN npm run build

FROM builder as development

CMD [ "npm", "run", "start:dev" ]


FROM builder as production

CMD [ "npm", "run", "start:prod" ]

