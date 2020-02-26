FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN npm install

EXPOSE 4000

ENTRYPOINT ["node", "app.js"]