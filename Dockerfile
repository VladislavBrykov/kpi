FROM node:17-alpine

WORKDIR /usr/src/app

COPY package.json ./

COPY tsconfig.json ./

RUN npm install

RUN npm install pm2 -g

#RUN npm run build

COPY ./dist .

EXPOSE 8000

CMD ["pm2-runtime","index.js"]
