FROM node:14-alpine as prod
#RUN mkdir ./app/server
COPY . /app/server
WORKDIR /app/server
RUN npm i yarn
RUN yarn
RUN npm i nodemon -g
EXPOSE 8081
CMD ["nodemon", "server.js"]

