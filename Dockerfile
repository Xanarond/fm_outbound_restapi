FROM node:14-alpine as prod
#RUN mkdir ./app/server
COPY . /app/server
WORKDIR /app/server
RUN npm i yarn
RUN yarn
RUN yarn add nodemon
EXPOSE 8081
EXPOSE 5432
CMD ["node", "server.js"]

