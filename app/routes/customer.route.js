const clientDB = require("./db.route");
const psqlDB = require("./psql.routes");

module.exports = app => {
  app.get("/api/refreshDB", clientDB.clientDBRefresh);
  app.get("/api/refreshPivotDay", clientDB.clientPivotRefreshDay);
  app.get("/api/refreshPivotNight", clientDB.clientPivotRefreshNight);
  app.get("/api/refreshProgress", clientDB.clientProgressMonitoring);
  // app.get("/api/getPackingShifts", psqlDB.getPackingShifts);
  app.get("/api/getPivotRefreshDayShift", psqlDB.clientPivotRefreshDayShift);
  app.get("/api/getPivotRefreshNightShift", psqlDB.clientPivotRefreshNightShift);
  app.get("/api/getStockRefresh", psqlDB.clientStockRefresh);
  app.get("/api/getStockPercent", psqlDB.clientStockPercent);
  // app.get("/api/getProgressMonitor", psqlDB.clientProgressMonitoring);
  // app.get("/api/getMLStatus", psqlDB.clientMLStatus);
  // app.get("/api/getPivotNotPicked", psqlDB.clientPivotNotPicked);
  // app.get("/api/getPivotPickTask", psqlDB.ClientPivotPickTask);
};
