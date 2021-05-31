const clientDB = require("./db.route");
const psqlDB = require("./psql.routes");

module.exports = app => {
  app.get("/api/refreshDB", clientDB.clientDBRefresh);
  app.get("/api/refreshPivotDay", clientDB.clientPivotRefreshDay);
  app.get("/api/refreshPivotNight", clientDB.clientPivotRefreshNight);
  app.get("/api/refreshProgress", clientDB.clientProgressMonitoring);
  app.get("/api/getPackingShifts", psqlDB.getPackingShifts);
};
