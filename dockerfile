FROM node:18.20.3-alpine AS production

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install 

COPY . .

EXPOSE 8082

CMD ["node", "./api/server.js"]