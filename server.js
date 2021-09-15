const express = require("express");
const fs = require("fs");
const https = require("https");

const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

const cors = require("cors");

const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

require("./app/routes/customer.route")(app);

const httpsOptions = {
  key: fs.readFileSync("./ssl/server.key"), // путь к ключу
  cert: fs.readFileSync("./ssl/server.crt"), // путь к сертификату
};

const ssl_server = https.createServer(httpsOptions, app).listen(8443, () => {
  const { port } = ssl_server.address();
  console.log("App listening the", port);
});

// Create a Server
const server = app.listen(8081, () => {
  const { address: host } = server.address();
  const { port } = server.address();

  console.log("App listening at http://%s:%s", host, port);
});
