FROM node:18 as base

WORKDIR /play-helper-nest

COPY package.json .

RUN npm i 

COPY . .

EXPOSE 3000

RUN npm run build


FROM base as development

ENV NODE_ENV=development

CMD ["npm", "run", "start:dev"]

FROM base as production

ENV NODE_ENV=production

CMD ["npm", "run", "start:prod"]
