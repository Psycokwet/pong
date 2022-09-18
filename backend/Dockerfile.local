FROM node:slim 

WORKDIR /svr/app

RUN npm i -g @nestjs/cli --silent

COPY . .

RUN npm i --silent

CMD ["npm", "run", "start:debug"]