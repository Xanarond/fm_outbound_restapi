const psqlDB = require("./psql.routes");

module.exports = app => {
  app.get("/api/getPackingShifts", psqlDB.getPackingShifts);
  app.get("/api/getPivotRefreshDayShift", psqlDB.clientPivotRefreshDayShift);
  app.get("/api/getPivotRefreshNightShift", psqlDB.clientPivotRefreshNightShift);
  app.get("/api/getProgressMonitor", psqlDB.clientProgressMonitoring);
  app.get("/api/getInbound", psqlDB.clientInboundDashboard);
  app.get("/api/getPivotNotPicked", psqlDB.clientPivotNotPicked);
  app.get("/api/getPivotPickTask", psqlDB.ClientPivotPickTask);
};
