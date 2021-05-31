const { Client } = require("pg");
const env = require("../config/psql_config");

/**
 * @param req date
 * @param res array of data for the period
 */
exports.getPackingShifts = (req, res) => {
  const conn = `postgres://${env.username}:${env.password}@${env.host}/${env.database}`;
  let result = {};
  const total = [];
  const p1 = new Promise((resolve, reject) => {
    try {
      const st_arr = req.query.period.split("-");
      const result_per = `${st_arr[2]}.${st_arr[1]}.${st_arr[0]}`; // formatting date to required format

      console.log(result_per);

      const client = new Client({ connectionString: conn }); // instance of connection PostgreSQL
      client.connect();

      const sql_req = `SELECT Distinct * from "public".packing_shifts WHERE pack_date ='${result_per}'`;
      // eslint-disable-next-line max-len
      client.query(sql_req, (err, result) => (err ? console.log(err.stack) : total.push(result.rows)));

      setTimeout(() => resolve(total), 1000); // add timeout for load data
      setTimeout(() => reject(new Error("Something went wrong!")), 1000);
    } catch (e) {
      console.log(e);
    }
  });
  p1.then((values) => {
    result = values;
    console.log(result);
    res.send(result);
  }).catch((e) => {
    console.log(e, "No response from the server");
  });
};
