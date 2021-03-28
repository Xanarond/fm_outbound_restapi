const clientDB = require("./db.route");

module.exports = function (app) {
    app.get('/api/refreshDB', clientDB.clientDBRefresh);
}