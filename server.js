const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());

const cors = require("cors");
const corsOptions = {
  origin: "http://localhost:8080",
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// force: true will drop the table if it already exists

require("./app/routes/customer.route")(app);

// Create a Server
const server = app.listen(8081, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log("App listening at http://%s:%s", host, port);
});
