const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const fs = require("fs");
const httpPort = 8081;

const cors = require("cors");
const http = require("http");
const corsOptions = {
  origin: "http://localhost:8080",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// force: true will drop the table if it already exists

require("./app/routes/customer.route")(app);
http
  .createServer((req, res) => {
    fs.readFile("index.html", "utf-8", (err, content) => {
      if (err) {
        console.log('Невозможно открыть файл "index.html".');
      }
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
      });
      res.end(content);
    });
  })
  .listen(httpPort, () => {
    console.log("Сервер запущен на: http://localhost:%s", httpPort);
  });
