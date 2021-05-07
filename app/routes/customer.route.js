const clientDB = require("./db.route");

module.exports = function (app) {
    app.get('/api/refreshDB', clientDB.clientDBRefresh);
    app.get('/api/refreshPivotDay', clientDB.clientPivotRefreshDay)
    app.get('/api/refreshPivotNight', clientDB.clientPivotRefreshNight)
    app.get('/api/refreshProgress', clientDB.clientProgressMonitoring)
}