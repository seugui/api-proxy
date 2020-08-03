FROM node:12-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY . .

RUN npm install

COPY --chown=node:node . .

EXPOSE 3000

ENTRYPOINT ["npm", "run", "start"]