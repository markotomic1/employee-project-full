FROM node:20-alpine3.16

WORKDIR /usr/app

COPY package*.json .


RUN npm install --production
RUN npm install pm2 -g

COPY /src /usr/app/src


EXPOSE 3000

CMD ["pm2-runtime","src/index.js"]